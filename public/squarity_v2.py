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
    # C'est dans l'ordre du sens des aiguilles d'une montre, en commençant par le haut.
    # Classic
    UP = 0
    UP_RIGHT = 1
    RIGHT = 2
    DOWN_RIGHT = 3
    DOWN = 4
    DOWN_LEFT = 5
    LEFT = 6
    UP_LEFT = 7
    # Classic abbr.
    U = 0
    UR = 1
    R = 2
    DR = 3
    D = 4
    DL = 5
    L = 6
    UL = 7
    # Cardinal
    NORTH = 0
    NORTH_EAST = 1
    EAST = 2
    SOUTH_EAST = 3
    SOUTH = 4
    SOUTH_WEST = 5
    WEST = 6
    NORTH_WEST = 7
    # Cardinal abbr.
    N = 0
    NE = 1
    E = 2
    SE = 3
    S = 4
    SW = 5
    W = 6
    NW = 7
    # Numeric pad.
    PAD_8 = 0
    PAD_9 = 1
    PAD_6 = 2
    PAD_3 = 3
    PAD_2 = 4
    PAD_1 = 5
    PAD_4 = 6
    PAD_7 = 7

    VECTOR_FROM_DIR = {
        UP: (0, -1),
        UP_RIGHT: (+1, -1),
        RIGHT: (+1, 0),
        DOWN_RIGHT: (+1, +1),
        DOWN: (0, +1),
        DOWN_LEFT: (-1, +1),
        LEFT: (-1, 0),
        UP_LEFT: (-1, -1),
    }

    STR_FROM_DIR = {
        UP: "up",
        UP_RIGHT: "up_right",
        RIGHT: "right",
        DOWN_RIGHT: "down_right",
        DOWN: "down",
        DOWN_LEFT: "down_left",
        LEFT: "left",
        UP_LEFT: "up_left",
    }

    @staticmethod
    def opposite(direc):
        return (direc + 4) % 8

    @staticmethod
    def turn_cw(direc, n=2):
        return (direc + n) % 8

    @staticmethod
    def turn_ccw(direc, n=2):
        return (direc - n) % 8

    @staticmethod
    def to_string(direc):
        return STR_FROM_DIR[direc]


# Alias
Dir = Direction


class Coord:

    def __init__(self, x=None, y=None, coord=None):
        self.x = x
        self.y = y
        if coord is not None:
            self.x = coord.x
            self.y = coord.y
        if self.x is None or self.y is None:
            raise ValueError("Coord must be initialized with x and y or coord.")

    def __str__(self):
        return "<Coord {self.x}, {self.y} >"

    def move_dir(self, direction, dist=1):
        mov_x, mov_y = Dir.VECTOR_FROM_DIR[direction]
        self.x += mov_x * dist
        self.y += mov_y * dist

    def move_add(self, x=None, y=None, coord=None):
        if coord is not None:
            self.x += coord.x
            self.y += coord.y
        if x is not None:
            self.x += x
        if y is not None:
            self.y += y

    def __eq__(self, other):
        return (
            isinstance(other, Coord)
            and self.x == other.x
            and self.y == other.y
        )

    def __hash__(self):
        return hash((self.x, self.y))


class GameObjectBase():

    def __init__(self):
        self._go_id = id(self)


class GameObject(GameObjectBase):

    def __init__(self, tile_owner, img):
        super().__init__()
        self.tile_owner = tile_owner
        self.img = img
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

    # TODO: set_coords, move, etc.
    # TODO : move_to(coord, delay_ms, callback)
    # TODO : move(coord_offset, delay_ms, callback)
    # TODO : set_default(move_delay_ms, move_callback)


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

    def get_game_objects(self, x=None, y=None, coord=None):
        raise NotImplementedError


class Layer(LayerBase):

    def __init__(self, game_owner, w, h, show_transitions=True):
        super().__init__(game_owner)
        self.show_transitions = show_transitions
        self.tiles = [
            [
                Tile(self, Coord(x, y)) for x in range(w)
            ]
            for y in range(h)
        ]
        # TODO: adjacencies

    def get_tile(self, x=None, y=None, coord=None):
        if coord is not None:
            x = coord.x
            y = coord.y
        return self.tiles[y][x]

    def get_game_objects(self, x=None, y=None, coord=None):
        tile = self.get_tile(x, y, coord)
        return tile.game_objects


# TODO: LayerSparse

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

    def on_button_direction(self, direction):
        pass

