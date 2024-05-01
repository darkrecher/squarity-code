import js
import sys

# Technique pour rediriger les prints. Emprunté à Brython, mais ça marche aussi avec pyodide.
# https://stackoverflow.com/questions/61348313/how-can-i-redirect-all-brython-output-to-a-textarea-element
class MyOutput:
    def __init__(self):
        # https://pyodide.readthedocs.io/en/latest/using_pyodide_from_javascript.html
        self.python_console = js.document.getElementById("python_console")

    def write(self, text):
        self.python_console.textContent += text
        self.python_console.scrollTop = self.python_console.scrollHeight

sys.stdout = MyOutput()


# Ci-dessous, tout le bazar spécifique au code du jeu,
# utilisable par les gens qui créent des jeux.


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

    def __str__(self):
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

    def __init__(self, coord=None, x=None, y=None):
        if coord is not None:
            self.x = coord.x
            self.y = coord.y
        else:
            self.x = x
            self.y = y
        if self.x is None or self.y is None:
            raise ValueError("Coord must be initialized with x and y or coord.")

    def __str__(self):
        return "<Coord {self.x}, {self.y} >"

    def move_to_dir(self, direction, dist=1):
        mov_x, mov_y = direction.vector
        self.x += mov_x * dist
        self.y += mov_y * dist

    def move_by_vect(self, vector=None, x=None, y=None):
        if vector is not None:
            self.x += vector.x
            self.y += vector.y
        if x is not None:
            self.x += x
        if y is not None:
            self.y += y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))


class GameObjectBase():

    def __init__(self):
        self._go_id = id(self)


class GameObject(GameObjectBase):

    def __init__(self, layer_owner, coord, sprite_name):
        super().__init__()
        self.layer_owner = layer_owner
        self.coord = Coord(coord)
        self.sprite_name = sprite_name
        # FUTURE: on gérera tout ça plus tard (rotation, scaling, ...).
        # Et si ça se trouve, on mettra tout ça dans un dict.
        self.offset_x = 0.0
        self.offset_y = 0.0
        self.angle = 0.0
        self.scale_x = 1.0
        self.scale_y = 1.0
        self.opacity = 1.0
        self.visible = True
        # Not sure if we will implement this.
        self.color_factor = (1.0, 1.0, 1.0)

    # TODO : move_to(coord, delay_ms, callback)
    # TODO : move(coord_offset, delay_ms, callback)
    # TODO : move_dir(direction, distance, delay_ms, callback)
    # TODO : set_default(move_delay_ms, move_callback)

    def move_to(self, dest_coord):
        self.layer_owner.move_game_object(self, dest_coord)

    # FUTURE: message d'erreur plus explicite quand on déplace un objet en dehors de l'aire de jeu.
    def move(self, coord_offset):
        # J'utilise pas Coord.move_by_vect, parce que cette fonction va être beaucoup utilisée,
        # donc ça peut être bien de l'optimiser en hardcodant un peu.
        self.layer_owner.move_game_object(
            self,
            Coord(None, self.coord.x + coord_offset.x, self.coord.y + coord_offset.y),
        )


class Tile():

    def __init__(self, layer_owner, coord):
        self.layer_owner = layer_owner
        # TODO: on n'est pas censé modifier self.coord après l'initialisation.
        # Alors je nommerais bien cette variable _coord, mais j'en aurais
        # peut-être besoin en lecture seule depuis l'extérieur. On verra bien.
        self.coord = coord
        self.game_objects = []
        # Les 8 adjacences, définies de la même manière que Direction
        # (en partant du haut et dans le sens des aiguilles d'une montre).
        self.adjacencies = [None] * 8


class LayerBase():

    def __init__(self, game_owner):
        self.game_owner = game_owner
        self._l_id = id(self)
        self.visible = True

    def get_game_objects(self, coord=None, x=None, y=None):
        raise NotImplementedError

    def iter_game_objects(self, iter_xs=None, iter_ys=None, by_line=True):
        # FUTURE. On verra plus tard.
        raise NotImplementedError

    def iter_all_game_objects(self):
        """
        The order is not guaranteed.
        """
        raise NotImplementedError

    def add_game_object(self, gobj):
        raise NotImplementedError

    def create_game_object(self, coord, sprite_name):
        raise NotImplementedError

    def remove_game_object(self, gobj):
        raise NotImplementedError

    def move_game_object(self, gobj, dest_coord):
        raise NotImplementedError


class Layer(LayerBase):

    def __init__(self, game_owner, w, h, show_transitions=True):
        super().__init__(game_owner)
        self.show_transitions = show_transitions
        self.tiles = [
            [
                Tile(self, Coord(x=x, y=y)) for x in range(w)
            ]
            for y in range(h)
        ]
        # TODO: adjacencies

    def get_game_objects(self, coord=None, x=None, y=None):
        return self.get_tile(coord, x, y).game_objects

    def iter_all_game_objects(self):
        for line in self.tiles:
            for tile in line:
                for gobj in tile.game_objects:
                    yield gobj

    def get_tile(self, coord=None, x=None, y=None):
        if coord is not None:
            x = coord.x
            y = coord.y
        return self.tiles[y][x]

    def add_game_object(self, gobj):
        tile = self.get_tile(gobj.coord)
        tile.game_objects.append(gobj)

    def create_game_object(self, coord, sprite_name):
        gobj = GameObject(self, Coord(coord), sprite_name)
        tile = self.get_tile(coord)
        tile.game_objects.append(gobj)
        return gobj

    def remove_game_object(self, gobj):
        tile = self.get_tile(gobj.coord)
        tile.remove(gobj)

    def move_game_object(self, gobj, dest_coord):
        tile_src = self.get_tile(gobj.coord)
        tile_src.game_objects.remove(gobj)
        gobj.coord.x = dest_coord.x
        gobj.coord.y = dest_coord.y
        tile_dest = self.get_tile(dest_coord)
        tile_dest.game_objects.append(gobj)


class LayerSparse(LayerBase):

    def __init__(self, game_owner, w, h, show_transitions=True):
        super().__init__(game_owner)
        self.show_transitions = show_transitions
        self.game_objects = []

    def get_game_objects(self, coord=None, x=None, y=None):
        if coord is None:
            coord = Coord(x=x, y=y)
        return [
            gobj for gobj
            in self.game_objects
            if gobj.coord == coord
        ]

    def iter_all_game_objects(self):
        for gobj in self.game_objects:
            yield gobj

    def add_game_object(self, gobj):
        self.game_objects.append(gobj)

    def create_game_object(self, coord, sprite_name):
        gobj = GameObject(self, Coord(coord), sprite_name)
        self.game_objects.append(gobj)
        return gobj

    def remove_game_object(self, gobj):
        self.game_objects.remove(gobj)

    def move_game_object(self, gobj, dest_coord):
        gobj.coord.x = dest_coord.x
        gobj.coord.y = dest_coord.y


# TODO: faut ajouter quelques fonctions là-dedans, pour faciliter leur création.
class EventResult():pass
class CallBack():pass


class GameModelBase():

    def __init__(self, w, h, str_game_conf_json):
        self.w = w
        self.h = h
        self.str_game_conf_json = str_game_conf_json
        self.layers = []
        self.layers.append(Layer(self, w, h))
        self.main_layer = self.layers[0]

    def on_start(self):
        pass

    def on_click(self, coord):
        pass

    # TODO: faut aussi donner le vector. Ça peut aider.
    def on_button_direction(self, direction):
        pass

    def on_button_action(self, action_name):
        pass
