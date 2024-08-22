import js
import sys


# Technique pour rediriger les prints. Emprunté à Brython, mais ça marche aussi avec pyodide.
# https://stackoverflow.com/questions/61348313/how-can-i-redirect-all-brython-output-to-a-textarea-element
class MyOutput:
    def __init__(self):
        # https://pyodide.readthedocs.io/en/latest/using_pyodide_from_javascript.html
        self.python_console = js.document.getElementById("pythonConsole")

    def write(self, text):
        self.python_console.textContent += text
        self.python_console.scrollTop = self.python_console.scrollHeight

sys.stdout = MyOutput()


class Direction():
    def __init__(self, int_dir, str_dir, vector):
        self.int_dir = int_dir
        self.str_dir = str_dir
        self.vector = vector
        self.turned_cw = [None] * 8
        self.turned_ccw = [None] * 8

    def set_turned(self, turned_cw):
        self.turned_cw = turned_cw
        self.turned_ccw = self.turned_cw[::-1]
        self.opposite = self.turned_cw[4]

    def turn_cw(self, n=2):
        return self.turned_cw[n % 8]

    def turn_ccw(self, n=2):
        return self.turned_ccw[n % 8]

    def __eq__(self, other):
        return self.int_dir == other.int_dir

    def __int__(self):
        return self.int_dir

    def __repr__(self):
        return self.str_dir


class Directions():
    def __init__(self):
        self.Up = Direction(0, "up", (0, -1))
        self.UpRight = Direction(1, "up_right", (+1, -1))
        self.Right = Direction(2, "right", (+1, 0))
        self.DownRight = Direction(3, "down_right", (+1, +1))
        self.Down = Direction(4, "down", (0, +1))
        self.DownLeft = Direction(5, "down_left", (-1, +1))
        self.Left = Direction(6, "left", (-1, 0))
        self.UpLeft = Direction(7, "up_left", (-1, -1))
        self.as_list = [
            self.Up, self.UpRight, self.Right, self.DownRight,
            self.Down, self.DownLeft, self.Left, self.UpLeft,
        ]
        turns = list(self.as_list)
        for direc in self.as_list:
            direc.set_turned(turns)
            turns = turns[1:] + turns[:1]

dirs = Directions()


class Coord:

    def __init__(self, x=None, y=None, coord=None):
        if coord is not None:
            self.x = coord.x
            self.y = coord.y
        else:
            self.x = x
            self.y = y
        if self.x is None or self.y is None:
            raise ValueError("Coord must be initialized with x and y or coord.")

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))

    def __repr__(self):
        return f"<Coord {self.x}, {self.y} >"

    def clone(self):
        return Coord(coord=self)

    def move_dir(self, direction, dist=1):
        mov_x, mov_y = direction.vector
        self.x += mov_x * dist
        self.y += mov_y * dist
        # C'est étrange de renvoyer self, mais ça permet de chaîner les actions.
        # Par exemple: my_coord.clone().move_dir(...)
        return self

    def move_by_vect(self, vector=None, x=None, y=None):
        if vector is not None:
            self.x += vector.x
            self.y += vector.y
        if x is not None:
            self.x += x
        if y is not None:
            self.y += y
        return self


class Rect:

    def __init__(self, x, y, w, h):
        self.x = x
        self.y = y
        self.w = w
        self.h = h

    def in_bounds(self, coord):
        if not (self.x <= coord.x < self.x+self.w):
            return False
        if not (self.y <= coord.y < self.y+self.h):
            return False
        return True

    def on_border(self, coord):
        if not self.in_bounds(coord):
            return False
        if coord.x == self.x:return True
        if coord.y == self.y:return True
        if coord.x == self.x + self.w - 1:return True
        if coord.y == self.y + self.h - 1:return True
        return False

    def __repr__(self):
        return f"<Rect {self.x}, {self.y}, {self.w}, {self.h} >"


class TransitionSteps():
    """
    La variable field_name peut être "coord" ou "sprite_name"
    Ensuite, on indique une liste de tuples (delay, valeur).
    Pour indiquer une callback, il faut mettre un objet squarity.Callback
    """
    def __init__(self, field_name, steps):
        self.field_name = field_name
        self.steps = steps


class PlayerLockTransi():
    NO_LOCK = 0
    INVISIBLE = 1
    LOCK = 2


class GameObjectBase():
    def __init__(self):
        self._go_id = id(self)


class GameObject(GameObjectBase):

    def __init__(
            self,
            coord,
            sprite_name,
            layer_owner=None,
            image_modifier=None,
            back_caller=None,
        ):
        """
        Les deux composants image_modifier et back_caller doivent être ajoutés dès le départ.
        Si on les crée après le __init__, ce n'est pas pris en compte par le moteur du jeu.
        C'est pour optimiser les vérifs et les traitements.
        Si vous voulez un game object avec un image_modifier alors qu'il n'en n'a pas au départ,
        il n'y a pas d'autres solutions que de détruire-recréer ce game object. C'est comme ça.
        """
        super().__init__()
        self._coord = Coord(coord=coord)
        self.sprite_name = sprite_name
        self.layer_owner = layer_owner
        self.image_modifier = image_modifier
        self.back_caller = back_caller
        self.plock_transi = PlayerLockTransi.NO_LOCK

        # FUTURE: pour plus tard.
        # self.visible = True
        # FUTURE: on gérera les autres transfo plus tard (rotation, opacity, ...).
        # self.angle = 0.0
        # self.opacity = 1.0
        # Not sure if we will implement the color_factor.
        # self.color_factor = (1.0, 1.0, 1.0)

        self._transitioner = None
        self._transitions_to_record = []
        self._must_clear_transitions = False
        self._transition_delay = None
        self._callback_end_transi = None
        self._one_shot_transition_delay = None
        self._one_shot_callback = None

    def get_coord(self):
        return Coord(coord=self._coord)

    def __str__(self):
        return f"<Gobj ({self._coord.x},{self._coord.y}) {self.sprite_name}>"

    # FUTURE : gérer une valeur de speed. transition = speed * distance à parcourir.
    # FUTURE: message d'erreur plus explicite quand on déplace un objet en dehors du jeu.
    # ou pas, car ça nécessite des vérifs qui vont faire ralentir...

    def move_to_xy(self, x, y, transition_delay=None, callback=None):
        if self.layer_owner is not None:
            self.layer_owner.move_game_object_xy(self, self._coord.x, self._coord.y, x, y)
        self._coord.x = x
        self._coord.y = y
        self._one_shot_transition_delay = transition_delay
        self._one_shot_callback = callback

    def move_to(self, dest_coord, transition_delay=None, callback=None):
        # Code dupliqué avec le code de move_to_xy.
        # Je ne factorise pas, car ces deux fonctions vont être beaucoup utilisées.
        # (y compris par le javascript). Ça permet d'optimiser un peu
        # les performances, en évitant d'avoir une fonction qui appelle l'autre.
        if self.layer_owner is not None:
            self.layer_owner.move_game_object(self, self._coord, dest_coord)
        self._coord.x = dest_coord.x
        self._coord.y = dest_coord.y
        self._one_shot_transition_delay = transition_delay
        self._one_shot_callback = callback

    def move(self, coord_offset, transition_delay=None, callback=None):
        dest_x = self._coord.x + coord_offset.x
        dest_y = self._coord.y + coord_offset.y
        self.move_to_xy(dest_x, dest_y, transition_delay, callback)

    def move_dir(self, direction, distance=1, transition_delay=None, callback=None):
        unary_vect_x, unary_vect_y = direction.vector
        dest_x = self._coord.x + unary_vect_x * distance
        dest_y = self._coord.y + unary_vect_y * distance
        self.move_to_xy(dest_x, dest_y, transition_delay, callback)

    def add_transition(self, transition):
        """
        Le paramètre transition peut être une instance de Callback,
        ou une instance de TransitionSteps.
        """
        # Au fur et à mesure qu'on applique ces transitions, il faut modifier les valeurs dans le jeu.
        # Ça veut dire que c'est le javascript qui appelle la fonction move_to_xy du game_object,
        # qui change le sprite_name, et éventuellement d'autres trucs.
        # (On applique les valeurs d'une transition lorsqu'on la démarre)
        self._transitions_to_record.append(transition)

    def clear_transitions_to_record(self):
        self._transitions_to_record[:] = []

    def clear_all_transitions(self):
        self._must_clear_transitions = True

    def ack_cleared_all_transitions(self):
        self._must_clear_transitions = False

    def get_nb_undone_transitions(self):
        if self._transitioner is None:
            return 0
        else:
            return self._transitioner.getNbUndoneTransitions()

    def set_callback_end_transi(self, callback_end_transi):
        self._callback_end_transi = callback_end_transi

    def set_transition_delay(self, transition_delay):
        self._transition_delay = transition_delay

    def reset_one_shot_transition_delay(self):
        self._one_shot_transition_delay = None

    def reset_one_shot_callback(self):
        self._one_shot_callback = None


class ComponentImageModifier():

    default_tile_size = 32

    def set_default_tile_size(tile_size):
        ComponentImageModifier.default_tile_size = tile_size

    def __init__(
        self,
        img_offset_x=0, img_offset_y=0,
        img_size_x=None, img_size_y=None,
        area_offset_x=0.0, area_offset_y=0.0,
        area_scale_x=1.0, area_scale_y=1.0,
    ):
        self.img_offset_x = img_offset_x
        self.img_offset_y = img_offset_y
        if img_size_x is None:
            self.img_size_x = ComponentImageModifier.default_tile_size
        else:
            self.img_size_x = img_size_x
        if img_size_y is None:
            self.img_size_y = ComponentImageModifier.default_tile_size
        else:
            self.img_size_y = img_size_y
        self.area_offset_x = area_offset_x
        self.area_offset_y = area_offset_y
        self.area_scale_x = area_scale_x
        self.area_scale_y = area_scale_y
        self._transitions_to_record = []

    def add_transition(self, transition):
        """
        Le paramètre transition doit être une instance de TransitionSteps.
        """
        self._transitions_to_record.append(transition)

    def clear_transitions_to_record(self):
        self._transitions_to_record[:] = []


class ComponentBackCaller():

    def __init__(self):
        # Liste d'objets DelayedCallback
        self._callbacks_to_record = []

    def add_callback(self, delayed_callback):
        self._callbacks_to_record.append(delayed_callback)

    def clear_callbacks_to_record(self):
        self._callbacks_to_record[:] = []


class Tile():

    def __init__(self, layer_owner, coord):
        self.layer_owner = layer_owner
        self._coord = coord
        self.game_objects = []
        # Cette variable contiendra un tuple de 8 éléments, qui sera les tiles adjacentes,
        # diagonales comprises, ordonnées de la même manière que Direction.
        # (en partant du haut et dans le sens des aiguilles d'une montre).
        self.adjacencies = None

    def get_coord(self):
        return Coord(coord=self._coord)


class LayerBase():

    def __init__(self, game_owner):
        self.game_owner = game_owner
        self._l_id = id(self)
        self.visible = True

    def get_game_objects(self, coord):
        raise NotImplementedError

    def iter_all_game_objects(self):
        """
        The order is not guaranteed.
        """
        raise NotImplementedError

    def add_game_object(self, gobj):
        raise NotImplementedError

    def remove_game_object(self, gobj):
        raise NotImplementedError

    def remove_at_coord(self, coord):
        raise NotImplementedError

    def move_game_object(self, gobj, src_coord, dest_coord):
        """
        You should not directly call this function.
        Just call gobj.move_to, gobj.move_to_xy, gobj.move or gobj.move_dir.
        """
        raise NotImplementedError

    def move_game_object_xy(self, gobj, src_x, src_y, dest_x, dest_y):
        """
        You should not directly call this function.
        Just call gobj.move_to, gobj.move_to_xy, gobj.move or gobj.move_dir.
        """
        raise NotImplementedError


class Layer(LayerBase):

    def __init__(self, game_owner, w, h, show_transitions=True):
        super().__init__(game_owner)
        self.w = w
        self.h = h
        self.show_transitions = show_transitions
        self.tiles = [
            [
                Tile(self, Coord(x, y)) for x in range(w)
            ]
            for y in range(h)
        ]
        for y in range(h):
            for x in range(w):
                self.tiles[y][x].adjacencies = self._make_adjacencies(x, y)

    def _make_adjacencies(self, x, y):
        """
        Returns a tuple of 8 elements containing the adjacent tiles.
        Some of the elements can be None, if the x and y are at a border.
        """
        adjacencies = (
            self.tiles[y - 1][x] if 0 <= y - 1 else None,
            self.tiles[y - 1][x + 1] if 0 <= y - 1 and x + 1 < self.w else None,
            self.tiles[y][x + 1] if x + 1 < self.w else None,
            self.tiles[y + 1][x + 1] if y + 1 < self.h and x + 1 < self.w else None,
            self.tiles[y + 1][x] if y + 1 < self.h else None,
            self.tiles[y + 1][x - 1] if y + 1 < self.h and 0 <= x - 1 else None,
            self.tiles[y][x - 1] if 0 <= x - 1 else None,
            self.tiles[y - 1][x - 1] if 0 <= y - 1 and 0 <= x - 1 else None,
        )
        return adjacencies

    def get_game_objects(self, coord):
        return self.get_tile(coord).game_objects

    def iter_all_game_objects(self):
        for line in self.tiles:
            for tile in line:
                for gobj in tile.game_objects:
                    yield gobj

    def get_tile(self, coord):
        return self.tiles[coord.y][coord.x]

    def get_tile_xy(self, x, y):
        return self.tiles[y][x]

    def add_game_object(self, gobj):
        gobj.layer_owner = self
        tile = self.get_tile(gobj._coord)
        tile.game_objects.append(gobj)

    def remove_game_object(self, gobj):
        gobj.layer_owner = None
        tile = self.get_tile(gobj._coord)
        tile.game_objects.remove(gobj)

    def remove_at_coord(self, coord):
        tile = self.get_tile(coord)
        for gobj in tile.game_objects:
            gobj.layer_owner = None
        tile.game_objects = []

    def move_game_object(self, gobj, src_coord, dest_coord):
        self.get_tile(src_coord).game_objects.remove(gobj)
        self.get_tile(dest_coord).game_objects.append(gobj)

    def move_game_object_xy(self, gobj, src_x, src_y, dest_x, dest_y):
        self.get_tile_xy(src_x, src_y).game_objects.remove(gobj)
        self.get_tile_xy(dest_x, dest_y).game_objects.append(gobj)


class LayerSparse(LayerBase):

    def __init__(self, game_owner, w, h, show_transitions=True):
        super().__init__(game_owner)
        self.w = w
        self.h = h
        self.show_transitions = show_transitions
        self.game_objects = []

    def get_game_objects(self, coord):
        return [
            gobj for gobj
            in self.game_objects
            if gobj._coord == coord
        ]

    def iter_all_game_objects(self):
        for gobj in self.game_objects:
            yield gobj

    def add_game_object(self, gobj):
        gobj.layer_owner = self
        self.game_objects.append(gobj)

    def remove_game_object(self, gobj):
        gobj.layer_owner = None
        self.game_objects.remove(gobj)

    def remove_at_coord(self, coord):
        gobj_to_remove = [
            gobj for gobj
            in self.game_objects
            if gobj._coord == coord
        ]
        for gobj in gobj_to_remove:
            gobj.layer_owner = None
            self.game_objects.remove(gobj)

    def move_game_object(self, gobj, src_coord, dest_coord):
        # Les coordonnées ont déjà été modifiées dans le gameObject.
        # On n'a rien à faire pour le LayerSparse lui-même,
        # car il se contente de stocker une liste de gameObject.
        pass

    def move_game_object_xy(self, gobj, src_x, src_y, dest_x, dest_y):
        # Pareil que move_game_object
        pass

class EventResult():

    def __init__(self):
        self.delayed_callbacks = []
        self.plocks_custom = []
        self.punlocks_custom = []

    def add_delayed_callback(self, delayed_callback):
        if not isinstance(delayed_callback, DelayedCallBack):
            raise Exception(
                "delayed_callback must be an instance of DelayedCallBack"
            )
        self.delayed_callbacks.append(delayed_callback)


class DelayedCallBack():

    def __init__(self, delay, callback):
        self.delay = delay
        self.callback = callback


class SequenceableIterator():

    def set_iter_prec(self, iter_prec):
        self.iter_prec = iter_prec

    def __iter__(self):
        return self

    def __next__(self):
        raise NotImplemented


class RectIterator(SequenceableIterator):
    # FUTURE. Itérateur de coordonnées où on avance de 2 en 2, (ou plus),
    #         Itérateur de droite à gauche, par colonnes et non pas par lignes. etc.

    def __init__(self, rect, instanciate_coord=False):
        self.rect = rect
        self.instanciate_coord = instanciate_coord
        self.current_coord = None

    def __next__(self):
        if self.current_coord is None:
            self.current_coord = Coord(self.rect.x, self.rect.y)
        else:
            self.current_coord.x += 1
            if self.current_coord.x >= self.rect.x + self.rect.w:
                self.current_coord.x = self.rect.x
                self.current_coord.y += 1
                if self.current_coord.y >= self.rect.y + self.rect.h:
                    raise StopIteration
        if self.instanciate_coord:
            return Coord(coord=self.current_coord)
        else:
            return self.current_coord


class GameObjectIterator(SequenceableIterator):

    def __init__(self, layers):
        self.layers = layers
        self.current_game_objects = []

    def __next__(self):
        while not self.current_game_objects:
            coord = next(self.iter_prec)
            for layer in self.layers:
                self.current_game_objects.extend(
                    layer.get_game_objects(coord)
                )
        gobj = self.current_game_objects.pop(0)
        return gobj


class GameObjectIteratorGroupByCoords(SequenceableIterator):

    def __init__(self, layers):
        self.layers = layers

    def __next__(self):
        current_game_objects = []
        coord = next(self.iter_prec)
        for layer in self.layers:
            current_game_objects.extend(
                layer.get_game_objects(coord)
            )
        return current_game_objects


class FilterBySpriteName(SequenceableIterator):

    def __init__(self, sprite_names, skip_empty_lists=False):
        self.sprite_names = sprite_names
        self.skip_empty_lists = skip_empty_lists

    def set_iter_prec(self, iter_prec):
        self.iter_prec = iter_prec
        # Un peu bof ce "isinstance". Ça passe...
        self.receive_gobj_lists = isinstance(
            self.iter_prec, GameObjectIteratorGroupByCoords
        )

    def __next__(self):
        if self.receive_gobj_lists:
            while True:
                game_objects = next(self.iter_prec)
                game_objects = [
                    gobj for gobj
                    in game_objects
                    if gobj.sprite_name in self.sprite_names
                ]
                if game_objects or not self.skip_empty_lists:
                    return game_objects
        else:
            while True:
                gobj = next(self.iter_prec)
                if gobj.sprite_name in self.sprite_names:
                    return gobj


class Sequencer():

    def iter_on_rect(rect, instanciate_coord=False):
        return RectIterator(rect, instanciate_coord)

    def gobj_on_layers(layers):
        return GameObjectIterator(layers)

    def gobj_on_layers_by_coords(layers):
        return GameObjectIteratorGroupByCoords(layers)

    def filter_sprites(sprite_names, skip_empty_lists=False):
        return FilterBySpriteName(sprite_names, skip_empty_lists)

    def seq_iter(*sequenceable_iterators):
        for seq_iter_prec, seq_iter in zip(sequenceable_iterators, sequenceable_iterators[1:]):
            seq_iter.set_iter_prec(seq_iter_prec)
        last_seq = sequenceable_iterators[-1]
        for elem in last_seq:
            yield elem

    def seq_first(*sequenceable_iterators):
        for seq_iter_prec, seq_iter in zip(sequenceable_iterators, sequenceable_iterators[1:]):
            seq_iter.set_iter_prec(seq_iter_prec)
        last_seq = sequenceable_iterators[-1]
        for elem in last_seq:
            return elem
        return None

# autres use cases:
# group by coords ? ou alors c'est un paramètre du GameObjectIterator.
# group by coords, mais on envoie aussi les coords ou c'est vide, avec une liste vide dedans.
# différents ordre de parcours pour les coordonnées (par colonnes, de bas en haut, de droite à gauche, ...)
# les cases deux par deux, genre les cases noires d'un échiquier.

# Par exemple, pour la gravité.
# Pour chaque colonne (itération normale avec un range)
# on fait deux itérateurs de coords décalés, avec un zip. Le premier (case de destination) itère sur les coords,
# le second (case de source) itère sur les objets par groupe.
# À chaque itération, on déplace les objets. On breake quand on rencontre un truc qui arrête la gravité, genre un mur non déplaçable.
# Ou alors, on itère sur toute la colonne, et on garde un petit booléen pour dire si ça tombe ou pas.
# Selon qu'on trouve une case vide, une case avec un objet tombable, ou une case avec un mur, on change le booléen.

# Est-ce qu'on peut faire un flood fill, basé sur certaines conditions de propagation ?
# C'est plus compliqué. Le flood fill, on peut pas le faire avec des enchaînements d'itérateurs.
# C'est un itérateur en entier avec tout dedans.


class GameModelBase():

    def __init__(self, w, h, tile_size, str_game_conf_json):
        self.w = w
        self.h = h
        self.str_game_conf_json = str_game_conf_json
        self.rect = Rect(0, 0, self.w, self.h)
        self.layers = []
        self.layer_main = Layer(self, w, h)
        self.layers.append(self.layer_main)
        ComponentImageModifier.set_default_tile_size(tile_size)
        # Par défaut: 200 ms de transition lorsqu'on déplace un objet.
        self.transition_delay = 200

    def get_first_gobj(self, coord=None, sprite_names=None, layer=None):
        if coord is None:
            coord_iterator = Sequencer.iter_on_rect(self.rect)
        elif isinstance(coord, Coord):
            coord_iterator = iter([coord])
        elif isinstance(coord, Rect):
            coord_iterator = Sequencer.iter_on_rect(coord)
        else:
            coord_iterator = coord

        if layer is None:
            layers = self.layers
        else:
            layers = [layer]

        iterators = [coord_iterator, Sequencer.gobj_on_layers(layers)]
        if sprite_names is not None:
            iterators.append(Sequencer.filter_sprites(sprite_names))
        return Sequencer.seq_first(*iterators)

    def on_start(self):
        pass

    def on_click(self, coord):
        pass

    def on_button_direction(self, direction):
        """
        Utilisez direction.vector pour avoir le tuple (dx, dy) du bouton de direction.
        """
        pass

    def on_button_action(self, action_name):
        pass

