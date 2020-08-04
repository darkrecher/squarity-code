// https://stackoverflow.com/questions/47597384/best-way-to-define-common-constants-in-vue-js

// TODO : faudra stocker ça autrement quand on aura plusieurs exemples de jeu.
// Dans un fichier .py qui se colore-syntax correctement, et lors du build du projet,
// on le met dans une string comme ça à l'arrache.
export default Object.freeze({
  // TODO : la taille du sprite du magicien est plus grande que 16x16, et faudrait le décaler.
  // Pour l'instant on laisse comme ça, même si c'est moche.
  // C'est le sprite "M".
  GAME_MAGICIAN_COORDS_TILESET: `
  {
    "tilesize": 16,
    "0": [48, 32],
    "1": [96, 32],
    "2": [96, 48],
    "3": [96, 96],
    "4": [48, 96],
    "5": [32, 96],
    "6": [32, 48],
    "7": [32, 32],
    "8": [48, 48],
    "W": [88, 208],
    "|": [165, 132],
    "-": [142, 132],
    "V": [32, 336],
    "v": [32, 352],
    "y": [32, 143],
    "s": [216, 64],
    "D": [156, 212],
    "M": [197, 161],
    "[": [169, 83],
    "]": [185, 83],
    "(": [215, 99],
    ")": [215, 115]
  }
  `,
  GAME_MAGICIAN_USER_CODE: `

DATA_TILES_1 = [
    '     701     70001  ',
    '     682     68882  ',
    '     543     54443  ',
    '     VVV     WDDVV  ',
    '     vvv     543vv  ',
    '             yyy    ',
    '    7001            ',
    ' 70068821           ',
    ' 588544381          ',
    ' y68WsWW8801        ',
    ' 78888888882    71  ',
    ' 54888888843    53  ',
    ' yy5444443yy    yy  ',
    '   yyyyyyy          ',
]

DATA_TILES_2 = [
    '                    ',
    '       [-----]      ',
    '      (             ',
    '      |             ',
    '      |             ',
    '      |             ',
    '      )             ',
    '                    ',
    '                    ',
    '                    ',
    '           [----]   ',
    '                    ',
    '                    ',
    '                    ',
]

PASSABLE_TILOBJS = list("0123456789-|s")

# TODO : l'utilisateur devra coder toute la classe BoardModel.
# (Évidemment, on pourra l'aider. On lui en fait une de base, et il la surcharge).
class BoardModel():

    def __init__(self, width=20, height=14):
        self.w = width
        self.h = height
        self.tiles = [
            [
                [] for x in range(self.w)
            ]
            for y in range(self.h)
        ]
        for y in range(self.h):
            for x in range(self.w):
                tile_data = []
                tile_data_add = DATA_TILES_1[y][x]
                if tile_data_add != ' ':
                    tile_data.append(tile_data_add)
                tile_data_add = DATA_TILES_2[y][x]
                if tile_data_add != ' ':
                    tile_data.append(tile_data_add)
                self.tiles[y][x] = tile_data

        self.magician_x = 6
        self.magician_y = 5
        self.tiles[self.magician_y][self.magician_x].append('M')

    def get_size(self):
        return self.w, self.h

    def get_tile(self, x, y):
        return self.tiles[y][x]

    def send_game_action(self, action_type):
        print("send_game_action", action_type)
        # TODO : si j'utilise une variable qui n'existe pas. Par exemple : print(zut)
        # Ça fait un horrible message d'erreur dans la console, qui ne cite même pas la variable inexistante.
        # Ça va être très embarrassant si on peut pas avoir des messages d'erreur plus clairs. À voir...
        must_move = False
        move_coord = board_model.MOVE_FROM_DIR.get(action_type)

        if move_coord is not None:
            new_magician_x = self.magician_x + move_coord[0]
            new_magician_y = self.magician_y + move_coord[1]
            if 0 <= new_magician_x < self.w and 0 <= new_magician_y < self.h:
                target_tile_objs = self.get_tile(new_magician_x, new_magician_y)
                for tile_obj in target_tile_objs:
                    if tile_obj in PASSABLE_TILOBJS:
                        must_move = True

                if not must_move and action_type in ("R", "L") and new_magician_x < self.w:
                    if not target_tile_objs:
                        target_tile_objs.append('-')

                if not must_move and action_type in ("U", "D") and new_magician_y < self.h:
                    if not target_tile_objs:
                        target_tile_objs.append('|')


        if must_move:
            self.tiles[self.magician_y][self.magician_x].remove('M')
            self.magician_x = new_magician_x
            self.magician_y = new_magician_y
            self.tiles[self.magician_y][self.magician_x].append('M')
        print(board_model.juste_pour_tester)
  `,

  GAME_H2O_COORDS_TILESET: `
  {
    "tilesize": 32,
    "X": [0, 0],
    ".": [32, 0],
    "H": [64, 0],
    "C": [96, 0],
    "water_right": [0, 32],
    "water_down": [32, 32],
    "water_left": [64, 32],
    "water_up": [96, 32],
    "ice_right": [0, 64],
    "ice_down": [32, 64],
    "ice_left": [64, 64],
    "ice_up": [96, 64],
    "gas_right": [0, 96],
    "gas_down": [32, 96],
    "gas_left": [64, 96],
    "gas_up": [96, 96],
    "E": [0, 128],
    "wet_sponge": [32, 128],
    "-": [64, 128],
    "|": [96, 128],
    "=": [0, 160],
    "I": [32, 160],
    "gas_dead": [64, 160],
    "water_right_pipe": [0, 192],
    "water_down_pipe": [32, 192],
    "water_left_pipe": [64, 192],
    "water_up_pipe": [96, 192],
    "gas_right_pipe": [0, 224],
    "gas_down_pipe": [32, 224],
    "gas_left_pipe": [64, 224],
    "gas_up_pipe": [96,224],
    "O": [0, 256],
    "wet_grid": [32, 256],
    "S": [64, 256]
}
  `,
  GAME_H2O_USER_CODE: `

LEVELS = (
    (
        'XXXXXXXXXXXXXXXXXXXX',
        'X...-...XXX...=....X',
        'X..XXX..XXX..XXX...X',
        'S...E....H....-....X',
        'X..XXX..XXX..XXX.X.X',
        'X...=...X.X...E..X.X',
        'XXXXXXXXX.XXXXXXXX.X',
        'XXXXXXXXX.XXXXXXXXCX',
        'X.H.H...X.X...E..X.X',
        'X..CCC..XXX..XXX.XCX',
        'X.HCO.........=....X',
        'X..CCC..XXX..XXX.XXX',
        'X.H.H...XXX...-..XXX',
        'XXXXXXXXXXXXXXXXXXXX',
    ),
    (
        'X.H.XXX.C.XXX.H.XXXX',
        'S...-.E...=.E.....XX',
        'X.C.XXX.H.XXX.C.X|XX',
        'XXXXXXXXXXXXXXXXX.XX',
        'X.H.XXX.C.XXX.H.XIXX',
        'XC..=.H...-.C.....XX',
        'X...XXX.H.XXX.C.XXXX',
        'XX.XX.XXXXX.XXXXX...',
        'XXCX.X.X...XXXXXXX..',
        'XXHXXXXX..XX.....X..',
        'XXEX.H.XXXXX..O..X..',
        'XX......HCE......X..',
        'XXXX.C.XXXXXH...CX..',
        'XXXXXXXXXXXXXXXXXX..',
    ),
    (
        'XXXXXXXXXXXXXXXXXXXX',
        'XXXXXXXX.....XXXXXXX',
        'XXXXXXXX.XXXHXXXXXXX',
        'XXXXXXXX.XXXHXXXXXXX',
        'X.H.XXXX.XXXCXXXXXXX',
        'S....E-..CCHE.....XX',
        'X.C.XXXX.XXXCXXX..XX',
        'XXXXX..X.XXXHX.....X',
        'X.--.||X.XXXCX.XXX.X',
        'X|XX..|X.....X..CH.X',
        'X|X.--.XXXXXXXXXHCXX',
        'X|XOXXXXXXX.----CHXX',
        'X.---------.XXXXXXXX',
        'XXXXXXXXXXXXXXXXXXXX',
    ),
    (
        'EIEXIIIXIIIXIIIIIIII',
        'ECE=...=...=...===O=',
        'EEE=.=.=.=.=.=.===I=',
        'X=.=.=.=.=.=.=.=...=',
        'X=...=...=...=...=.=',
        'XXIIIXIIIXIIIXIII=H=',
        'XXXXXXXXXXXXXXXXXEHE',
        'XEHEEEEEEEEEEEEEEXIX',
        'XE......EE.....EEEEE',
        'XEEEEEE....EEE.....E',
        'XEEEEEEEEEEEEEEEEE.E',
        'XE...E...E...E...E.E',
        'S..E...E...E...E...E',
        'XEEEEEEEEEEEEE-CEEEE',
    ),
    (
        'XXXXXXXXXXXXXXXXXXXX',
        'X.HHHH..H..H..H..H.X',
        'X.H.....H..HH.H..H.X',
        'X.HH....H..H.HH..H.X',
        'X.H.....H..H..H....X',
        'X.H.....H..H..H..H.X',
        'S..................X',
        'X.....CC.....CC....X',
        'X.....CC.....CC....X',
        'X..................X',
        'X...C...........C..X',
        'X....C.........C...X',
        'X.....CCCCCCCCC....X',
        'XXXXXXXXXXXXXXXXXXXX',
    ),
)

class BoardModel():

    def __init__(self, width=20, height=14):
        self.w = width
        self.h = height
        self.current_level_idx = 0
        self.init_level()

    def init_level(self):
        self.hero_alive = False
        self.tiles = [
            [
                [] for x in range(self.w)
            ]
            for y in range(self.h)
        ]
        cur_level = LEVELS[self.current_level_idx]

        for y in range(self.h):
            for x in range(self.w):
                tile_data = []
                tile_data_add = cur_level[y][x]
                if tile_data_add == "S":
                    # Si le tuyau d'arrivée est tout à droite, ça pète.
                    # Not my problem.
                    self.hero_x = x + 1
                    self.hero_y = y
                    self.hero_alive = True
                    self.hero_dir = "D"
                    self.hero_state = "water"
                if tile_data_add != " ":
                    tile_data.append(tile_data_add)
                self.tiles[y][x] = tile_data


    def get_size(self):
        return self.w, self.h

    def get_tile(self, x, y):
        tile_gamobjs = self.tiles[y][x]
        hero_dir_names = {
            "U": "up",
            "D": "down",
            "L": "left",
            "R": "right",
        }
        if self.hero_alive and x == self.hero_x and y == self.hero_y:
            hero_gamobj = "%s_%s" % (self.hero_state, hero_dir_names[self.hero_dir])
            if "-" in tile_gamobjs or "|" in tile_gamobjs:
                hero_gamobj += "_pipe"
            hero_gamobj = [hero_gamobj]
        else:
            hero_gamobj = []
        return tile_gamobjs + hero_gamobj


    def can_move(self, start_tile_objs, dest_tile_objs, move_dir):
        if "X" in dest_tile_objs or "S" in dest_tile_objs:
            return False
        if {"-", "="}.intersection(set(start_tile_objs + dest_tile_objs)) and move_dir in ("U", "D"):
            return False
        if {"|", "I"}.intersection(set(start_tile_objs + dest_tile_objs)) and move_dir in ("L", "R"):
            return False
        if self.hero_state == "ice" and ("-" in dest_tile_objs or "|" in dest_tile_objs):
            return False
        return True

    def send_game_action(self, action_type):

        if not self.hero_alive:
            self.init_level()
            return

        must_move = False
        move_coord = board_model.MOVE_FROM_DIR.get(action_type)

        if move_coord is not None:
            new_hero_x = self.hero_x + move_coord[0]
            new_hero_y = self.hero_y + move_coord[1]
            if 0 <= new_hero_x < self.w and 0 <= new_hero_y < self.h:
                target_tile_objs = self.get_tile(new_hero_x, new_hero_y)
                must_move = self.can_move(
                    self.get_tile(self.hero_x, self.hero_y),
                    target_tile_objs,
                    action_type
                )

        if must_move:
            self.hero_dir = action_type
            self.hero_x = new_hero_x
            self.hero_y = new_hero_y

        tile_data_new_pos = self.tiles[self.hero_y][self.hero_x]
        if must_move and "C" in tile_data_new_pos:
            to_cold = {
                "ice": "ice",
                "water": "ice",
                "gas": "water",
            }
            self.hero_state = to_cold[self.hero_state]
        if must_move and "H" in tile_data_new_pos:
            to_hot = {
                "ice": "water",
                "water": "gas",
                "gas": "gas",
            }
            self.hero_state = to_hot[self.hero_state]
        if "E" in tile_data_new_pos and self.hero_state == "water":
            self.hero_alive = False
            tile_data_new_pos.remove("E")
            tile_data_new_pos.append("wet_sponge")
        if "O" in tile_data_new_pos and self.hero_state == "water":
            self.hero_alive = False
            tile_data_new_pos.remove("O")
            tile_data_new_pos.append("wet_grid")
            self.current_level_idx += 1
        if ("=" in tile_data_new_pos or "I" in tile_data_new_pos) and self.hero_state == "gas":
            self.hero_alive = False
            tile_data_new_pos.append("gas_dead")
  `,

});
