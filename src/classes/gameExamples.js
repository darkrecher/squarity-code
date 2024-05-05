// https://stackoverflow.com/questions/47597384/best-way-to-define-common-constants-in-vue-js

export default Object.freeze({
  MAGICIAN_JSON_CONF: `
  {
    "version": "1.0.0",
    "game_area": {
      "nb_tile_width": 22,
      "nb_tile_height": 15
    },
    "tile_size": 16,
    "img_coords": {
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
      "d": [140, 212],
      "M": [197, 161],
      "N": [175, 161],
      "[": [169, 83],
      "]": [185, 83],
      "(": [215, 99],
      ")": [215, 115],
      "fire": [187, 128]
    }
  }
  `,
  MAGICIAN_GAME_CODE: `
DATA_TILES_1 = [
    "7    701     70001    ",
    "     682     68882    ",
    "     543     54443    ",
    "     VVV     WDdVV    ",
    "     vvv     543vv    ",
    "             yyy      ",
    "    7001              ",
    " 70068821             ",
    " 588544381            ",
    " y68WsDW8801          ",
    " 78888888882    71    ",
    " 54888888843    62    ",
    " yy6888882yy    53    ",
    "   5444443      yy    ",
    "   yyyyyyy            ",
]

DATA_TILES_2 = [
    "                    --",
    "       [-----]      --",
    "      (             --",
    "      |             --",
    "      |             --",
    "      |             --",
    "      )             --",
    "                    --",
    "                   ---",
    "                    --",
    "           [----]   --",
    "       N            --",
    "                    --",
    "                    --",
    "                    --",
]

PASSABLE_TILOBJS = list("0123456789-|s")

class GameModel():

    def __init__(self):
        self.w = 22
        self.h = 15
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
                if tile_data_add != " ":
                    tile_data.append(tile_data_add)
                tile_data_add = DATA_TILES_2[y][x]
                if tile_data_add != " ":
                    tile_data.append(tile_data_add)
                self.tiles[y][x] = tile_data

        self.dialogue_texts = [
            "Magicien : Yo frère !",
            "Nain : SAAAAAALUUUUUUUT.",
            "Magicien : Comment ça se fait qu'on voit des nains et jamais de naines dans les jeux vidéo ?",
            "Nain : Il y en a, mais elles ont peu de poitrine et sont barbues.",
            "Magicien : OK...",
            "Nain(·e?) : Vous vouliez parler d'autres choses ?",
            "Magicien : Je ne sais pas trop.",
            "Nain(·e?) : Il suffirait de changer le contenu de la liste 'dialogue_texts', dans le code du jeu.",
            "Magicien : Le code du jeu ?",
            "Nain(·e?) : La zone de texte à droite. Et ensuite, il faut cliquer sur le bouton 'envoyer le jeu' qui est en dessous.",
        ]

        self.magician_x = 6
        self.magician_y = 5
        self.magician_cur_dir = "R"
        self.get_tile_gamobjs(self.magician_x, self.magician_y).append("M")
        self.fires = []
        self.fire_ready = True
        self.clicked_once = False

        print("Le tileset de ce jeu a été créé par Buch :")
        print("https://opengameart.org/content/dungeon-tileset")
        print()

    def export_all_tiles(self):
        return self.tiles

    def export_tile(self, x, y):
        return self.tiles[y][x]

    def get_tile_gamobjs(self, x, y):
        return self.tiles[y][x]

    def start_fire(self):
        if not self.fire_ready:
            return

        already_fire = bool(self.fires)
        fire_infos = [self.magician_x, self.magician_y, self.magician_cur_dir, True]
        self.fires.append(fire_infos)
        self.fire_ready = False
        tile_fire_objs = self.get_tile_gamobjs(self.magician_x, self.magician_y)
        tile_fire_objs.append("fire")
        if already_fire:
            return """{ "delayed_actions": [ {"name": "reload_fire", "delay_ms": 2500} ] }"""
        else:
            return """{ "delayed_actions": [ {"name": "handle_fire", "delay_ms": 500}, {"name": "reload_fire", "delay_ms": 2500} ] }"""

    def handle_fire(self):
        for fire_infos in self.fires:

            fire_x, fire_y, fire_dir, in_game = fire_infos
            self.get_tile_gamobjs(fire_x, fire_y).remove("fire")
            mov_x, mov_y = squarity.MOVE_FROM_DIR[fire_dir]
            fire_x += mov_x
            fire_y += mov_y

            if 0 <= fire_x < self.w and 0 <= fire_y < self.h:
                gamobjs_new_fire_pos = self.get_tile_gamobjs(fire_x, fire_y)
                if "-" in gamobjs_new_fire_pos:
                    gamobjs_new_fire_pos.remove("-")
                if "|" in gamobjs_new_fire_pos:
                    gamobjs_new_fire_pos.remove("|")
                gamobjs_new_fire_pos.append("fire")
            else:
                in_game = False
            fire_infos[:] = [fire_x, fire_y, fire_dir, in_game]

        self.fires = [ fire_infos for fire_infos in self.fires if fire_infos[3] ]
        if self.fires:
            return """{ "delayed_actions": [ {"name": "handle_fire", "delay_ms": 500} ] }"""
        else:
            return None

    def toggle_door(self, x, y):
        #action_target_y = self.magician_y - 1
        #if action_target_y > 0:
        target_tile_objs = self.get_tile_gamobjs(x, y)
        if "d" in target_tile_objs:
            target_tile_objs.remove("d")
            target_tile_objs.append("D")
            return True
        elif "D" in target_tile_objs:
            target_tile_objs.remove("D")
            target_tile_objs.append("d")
            return True
        return False

    def check_teledoortation(self, magi_mov_x, magi_mov_y):
        coord_other_door = None
        for y in range(self.h):
            for x in range(self.w):
                if (x, y) != (magi_mov_x, magi_mov_y) and "d" in self.get_tile_gamobjs(x, y):
                    if coord_other_door is None:
                        coord_other_door = (x, y)
                    else:
                        return None
        return coord_other_door

    def handle_teledoortation(self):
        if self.teledoortation_state == 0:
            self.get_tile_gamobjs(self.magician_x, self.magician_y).remove("M")
            self.magician_y -= 1
            first_door_gamobjs = self.get_tile_gamobjs(self.magician_x, self.magician_y)
            first_door_gamobjs.remove("d")
            first_door_gamobjs.append("M")
            first_door_gamobjs.append("d")

        elif self.teledoortation_state == 1:
            self.get_tile_gamobjs(self.magician_x, self.magician_y).remove("M")

        elif self.teledoortation_state == 2:
            self.magician_x = self.coord_other_door[0]
            self.magician_y = self.coord_other_door[1]
            first_door_gamobjs = self.get_tile_gamobjs(self.magician_x, self.magician_y)
            first_door_gamobjs.remove("d")
            first_door_gamobjs.append("M")
            first_door_gamobjs.append("d")

        elif self.teledoortation_state == 3:
            self.get_tile_gamobjs(self.magician_x, self.magician_y).remove('M')
            self.magician_y += 1
            self.get_tile_gamobjs(self.magician_x, self.magician_y).append('M')

        self.teledoortation_state += 1

        if self.teledoortation_state == 4:
            return """ { "player_unlocks": ["teledoortation"] } """
        else:
            return """ { "delayed_actions": [ {"name": "handle_teledoortation", "delay_ms": 500} ], "player_locks": ["teledoortation"] } """
            self.coord_other_door = None
            self.teledoortation_state = None

    def on_game_event(self, event_name):
        # Décommentez la ligne ci-dessous pour afficher une ligne d'info
        # à chaque fois que le joueur appuie sur une touche.
        # print("on_game_event", event_name)

        if event_name == "handle_fire":
            return self.handle_fire()

        if event_name == "handle_teledoortation":
            return self.handle_teledoortation()

        if event_name == "reload_fire":
            self.fire_ready = True
            return """{ "redraw": 0 }"""

        if event_name == "action_1":
            action_target_y = self.magician_y - 1
            if action_target_y > 0:
                if self.toggle_door(self.magician_x, action_target_y):
                    return None
            return """{ "redraw": 0 }"""

        if event_name == "action_2":
            return self.start_fire()

        must_move = False
        move_offset = squarity.MOVE_FROM_DIR.get(event_name)
        if move_offset is None:
            return

        new_magician_x = self.magician_x + move_offset[0]
        new_magician_y = self.magician_y + move_offset[1]
        self.magician_cur_dir = event_name
        if not (0 <= new_magician_x < self.w and 0 <= new_magician_y < self.h):
            return

        target_tile_objs = self.get_tile_gamobjs(new_magician_x, new_magician_y)

        if "N" in target_tile_objs:
            if self.dialogue_texts:
                text = self.dialogue_texts.pop(0)
                print(text)
                print("---")
            return

        for tile_obj in target_tile_objs:
            if tile_obj in PASSABLE_TILOBJS:
                must_move = True

        if not must_move and event_name in ("R", "L") and new_magician_x < self.w:
            if not target_tile_objs:
                target_tile_objs.append("-")

        if not must_move and event_name in ("U", "D") and new_magician_y < self.h:
            if not target_tile_objs:
                target_tile_objs.append("|")

        if not must_move and event_name == "U" and "d" in target_tile_objs:
            coord_other_door = self.check_teledoortation(new_magician_x, new_magician_y)
            if coord_other_door is not None:
                self.coord_other_door = coord_other_door
                self.teledoortation_state = 0
                return self.handle_teledoortation()

        if must_move:
            self.get_tile_gamobjs(self.magician_x, self.magician_y).remove("M")
            self.magician_x = new_magician_x
            self.magician_y = new_magician_y
            self.get_tile_gamobjs(self.magician_x, self.magician_y).append("M")

    def on_click(self, x, y):
        if self.toggle_door(x, y):
            return None
        else:
            if not self.clicked_once:
                print("Essayez de cliquer sur une porte.")
                self.clicked_once = True
            return """{ "redraw": 0 }"""

  `,

  H2O_JSON_CONF: `
  {
    "name": "H2O",
    "version": "1.0.0",
    "tile_size": 32,
    "img_coords": {

      "water_right": [0, 0],
      "water_down": [32, 0],
      "water_left": [64, 0],
      "water_up": [96, 0],
      "ice_right": [0, 32],
      "ice_down": [32, 32],
      "ice_left": [64, 32],
      "ice_up": [96, 32],
      "gas_right": [0, 64],
      "gas_down": [32, 64],
      "gas_left": [64, 64],
      "gas_up": [96, 64],

      "water_right_pipe": [0, 96],
      "water_down_pipe": [32, 96],
      "water_left_pipe": [64, 96],
      "water_up_pipe": [96, 96],
      "gas_right_pipe": [0, 128],
      "gas_down_pipe": [32, 128],
      "gas_left_pipe": [64, 128],
      "gas_up_pipe": [96,128],

      "E": [64, 160],
      "wet_sponge": [96, 160],

      "O": [64, 192],
      "wet_grid": [96, 192],

      "S": [64, 224],
      "C": [96, 224],

      "=": [32, 256],
      "H": [96, 256],

      "gas_dead": [0, 288],
      ".": [96, 288],

      "X": [160, 64],
      "+": [0, 416],

      "K": [160, 352],

      "pattern_*.*.XX*.*": [128, 0],
      "pattern_*.*XXX*.*": [160, 0],
      "pattern_*.*XX.*.*": [192, 0],
      "pattern_*.*.X.*X*": [224, 0],
      "pattern_*.*.XX*X*": [128, 32],
      "pattern_*.*XXX*X*": [160, 32],
      "pattern_*.*XX.*X*": [192, 32],
      "pattern_*X*.X.*X*": [224, 32],
      "pattern_*X*.XX*X*": [128, 64],
      "pattern_*X*XX.*X*": [192, 64],
      "pattern_*X*.X.*.*": [224, 64],
      "pattern_*X*.XX*.*": [128, 96],
      "pattern_*X*XXX*.*": [160, 96],
      "pattern_*X*XX.*.*": [192, 96],
      "pattern_*.*.X.*.*": [224, 96],
      "pattern_***XXX.XX": [128, 128],
      "pattern_***XXXXX.": [160, 128],
      "pattern_*X*XX..X*": [192, 128],
      "pattern_*X*.XX*X.": [224, 128],
      "pattern_*.*XX..X*": [192, 160],
      "pattern_*.*.XX*X.": [224, 160],
      "pattern_***XXX.X.": [160, 256],

      "pattern_*X*.-X***": [128, 192],
      "pattern_*X*X-.***": [160, 192],
      "pattern_***.-*.X*": [224, 192],
      "pattern_*X*.-*.X*": [128, 224],
      "-": [160, 224],
      "pattern_*X**-.*X.": [192, 224],
      "pattern_****-.*X.": [224, 224],
      "pattern_*X*.-.***": [160, 288],
      "pattern_*X*.-..X.": [192, 288],

      "pattern_*.**|**X*": [128, 256],
      "|": [224, 256],
      "pattern_*X**|**.*": [128, 288],
      "pattern_*.**|**.*": [224, 288],

      "I_wall_up": [0, 224],
      "I": [128, 320],
      "electroball_D": [0, 384],
      "electroball_U": [32, 384],
      "electroball_R": [64, 384],
      "electroball_L": [96, 384],

      "pattern_*X*.X=*.*": [0, 160],
      "pattern_*X*=X.*.*": [32, 160],
      "pattern_***XXX*I*": [0, 192],
      "pattern_*X*.X.*I*": [32, 192],
      "pattern_*X*XX=XX*": [0, 256],
      "pattern_*X*=XX*XX": [64, 256],

      "pattern_*X*.XX*I*": [32, 288],
      "pattern_*X*XX.*I*": [64, 288],

      "pattern_*.*.X=*.*": [0, 320],
      "pattern_*.*=X.*.*": [32, 320],
      "pattern_*.*XX=*.*": [64, 320],
      "pattern_*.*=XX*.*": [96, 320],

      "pattern_*X*.X=*I*": [160, 320],
      "pattern_*X*=X.*I*": [192, 320],
      "pattern_*X*=X=*I*": [224, 320],

      "pattern_*.*XX=XX*": [0, 352],
      "pattern_*.*=XX*XX": [32, 352],
      "pattern_*.*=X=*X*": [64, 352],
      "pattern_*.*=X.*X*": [96, 352],
      "pattern_*.*.X=*X*": [128, 352],

      "pattern_*I*=+.*.*": [192, 384],
      "pattern_*I*.+=*.*": [224, 384],

      "pattern_*I*=+=*.*": [32, 416],
      "pattern_*I*.+=*I*": [64, 416],
      "pattern_*I*=+.*I*": [96, 416],
      "pattern_*.*=+=*I*": [128, 416],
      "pattern_*.*=+.*I*": [160, 416],
      "pattern_*.*.+=*I*": [192, 416]


    }
  }
  `,
  H2O_GAME_CODE: `
LEVELS = (
    (
        "XXXXXXXXXXXXXXXXXXXX",
        "X...-...XXX...E..XXX",
        "X..XXX..XXX..XXX.XXX",
        "S...E....H....I....X",
        "X..XXX..XXX..XXX.X.X",
        "X...I...X.X...-..X.X",
        "X..XXX..X.XXXXXXXXCX",
        "XXXXXXXXX.X..XXX.X.X",
        "X.H.H...X.X...E..XCX",
        "X..CCC..XXX..XXX.X.X",
        "X.HCO.........-....X",
        "X..CCC..XXX..XXX.XXX",
        "X.H.H...XXX...I..XXX",
        "XXXXXXXXXXXXXXXXXXXX",
    ),
    (
        "XXXXXXXXXXXXXXXXXXXX",
        "X.H.XXX.C.XXX.H.XXXX",
        "S....-E...I.E.....XX",
        "X.C.XXX.H.XXX.C.X|XX",
        "XXXXXXXXXXXXXXXXX.XX",
        "X.H.XXX.C.XXX.H.X=XX",
        "XC..I.H....-C.....XX",
        "X...XXX.H.XXX.C.XXXX",
        "XXCX...XXXXXXXXXXXXX",
        "XXHXXXXXXX...X....HX",
        "XXEX.H.XXXXXXX.....X",
        "XX........HCE...O..X",
        "XXXX.C.XXXXXXX....CX",
        "XXXXXXXXXXXXXXXXXXXX",
    ),
    (
        "XXXXXXXXXXXXXXXXXXXX",
        "X.H.XXXX.....XX.I.HX",
        "S...EE-..XXXHXX=+==X",
        "X.C.XXXX.XXXHXX====X",
        "XXXXX..X.XXXCXX.XXXX",
        "X.---.|X.CCHE...-..X",
        "X|XXXX|X.XXXCXXXXXCX",
        "X|.--.|X.XXXHX.....X",
        "X||XX||X.XXXCX.X.X.X",
        "X||XX..X.....X.HCHCX",
        "X|..XXXXXXXXXXXXHCHX",
        "X|X.-.-.-OX.----CHCX",
        "X.---------.XXXXHCHX",
        "XXXXXXXXXXXXXXXXXXXX",
    ),
    (
        "===+===+===+===+++=+",
        "ECEI...I...I...IIIOI",
        "EEEI.I.I.I.I.I.I++=+",
        "XI.I.I.I.I.I.I.I...I",
        "XI...I...I...I...I.I",
        "XX===X===X===X===+HI",
        "XXXXXXXXXXXXXXXXXEHE",
        "XEHEEEEEEEEEEEEEXX=X",
        "XE......EE.....EEEEE",
        "XEEEEEE....EEE.....E",
        "XEEEEEEEEEEEEEEEEE.E",
        "XE...E...E...E...E.E",
        "S..E...E...E...E...E",
        "XEEEEEEEEEEEEE-CEEEE",
    ),
    (
        "XXXXXXXXXXXXXXXXXXXX",
        "X.XIX.X.I.---.-....X",
        "X.X+X.I.X.XXX.-....X",
        "X..+==XX=XX.XXXX|XXX",
        "X.C...--...........X",
        "S....XXXX=X.X=+.|..X",
        "X.H...........I.|..X",
        "X.....--.....++.|..X",
        "X..+..XX.....I.....X",
        "X.....II..X=X+X....X",
        "X==++=++..X=X+X..X=X",
        "X..++.....I.III....X",
        "X..++.....+=+++...OX",
        "XXXXXXXXXXXXXXXXXXXX",
    ),
    (
        "....................",
        "XXXX..X.X...........",
        "S.K...XKX..XXX......",
        "XXXX..XXX..XKX......",
        "...........X.X......",
        "....................",
        "...........XXXXX....",
        "...XXX......KXK.....",
        "....KX....XXXXXXX...",
        "...XXX....-EEEEE-...",
        "...XK...C.-E+=+E-...",
        "...XXX....-EIKIE-...",
        "........H.-E+=+E-...",
        "..........-EEEEE-...",
    ),
)


# Les patterns de suppression des tunnels en diagonale qui sont raccrochés à rien.
PATTERNS_REPLACEMENT_TUNNELS_TOO_FAR = """

    -.*     |.*     *.-     *.|
    .**     .**     **.     **.
    ***     ***     ***     ***
    =>0:.   =>0:.   =>2:.   =>2:.

    ***     ***     ***     ***
    .**     .**     **.     **.
    -.*     |.*     *.-     *.|
    =>6:.   =>6:.   =>8:.   =>8:.
"""

# Les 4 premiers patterns :
# remplacement des lasers "cross" par des lasers lines, sur les 4 tiles adjacentes à la middle tile.
# Comme ça, la stylisation fonctionne aussi bien avec des crosses qu'avec des lines.
# Les 4 patterns suivants :
# remplacement des lasers lines sur les 4 tiles adjacentes, mais qui sont pas dans le bon sens
# et ne sont donc pas accrochés à la middle tile.
# Par exemple : un laser horizontal qui passe au-dessus de la middle tile.
PATTERNS_REPLACEMENT_CROSS_LASERS = """
    *+*     ***     ***     ***
    ***     **+     ***     +**
    ***     ***     *+*     ***
    =>1:I   =>5:=   =>7:I   =>3:=

    *=*     ***     ***     ***
    ***     **I     ***     I**
    ***     ***     *=*     ***
    =>1:.   =>5:.   =>7:.   =>3:.
"""

# Quand il y a un laser au-dessus de la middle tile, on s'en fiche complètement.
# La perpective cache le bas du laser, et on n'a rien à styliser dans ce cas.
PATTERNS_REPLACEMENT_PERSPECTIVE_WALL_LASERS = """
    *I*
    ***
    ***
    =>1:.
"""

# Stylisation des lasers cross.
PATTERNS_CROSS_LASERS = """
    *.*   *I*   *I*   *.*
    =+.   =+.   .+=   .+=
    *I*   *.*   *.*   *I*

    *I*   *I*   *.*   *I*
    =+=   .+=   =+=   =+.
    *.*   *I*   *I*   *I*
"""

# Stylisation des murs comportant un générateur de laser sur une ou plusieurs de ses parois
PATTERNS_WALL_WITH_LASER = """
    ***   *X*   *X*   *X*
    XXX   .X.   XX=   =XX
    *I*   *I*   XX*   *XX

    *X*   *X*   *X*   *X*
    .X=   =X.   .XX   XX.
    *.*   *.*   *I*   *I*

    *.*   *.*   *.*   *.*
    .X=   =X.   XX=   =XX
    *.*   *.*   *.*   *.*

    *X*   *X*   *X*
    .X=   =X.   =X=
    *I*   *I*   *I*

    *.*   *.*
    XX=   =XX
    XX*   *XX

    *.*   *.*   *.*
    =X=   =X.   .X=
    *X*   *X*   *X*
"""

# Stylisation des murs tout simple.
PATTERNS_WALL_SIMPLE = """
    ***   ***   ***
    XXX   XXX   XXX
    .XX   XX.   .X.

    *X*   *X*
    XX.   .XX
    .X*   *X.

    *.*   *.*
    XX.   .XX
    .X*   *X.

    *.*   *X*   *X*   *X*
    XXX   XX.   XXX   .XX
    *X*   *X*   *.*   *X*

    *.*   *X*   *X*   *.*   *.*   *X*
    XXX   .X.   .XX   .XX   XX.   XX.
    *.*   *X*   *.*   *X*   *X*   *.*

    *.*   *X*   *.*   *.*   *.*
    .X.   .X.   .XX   .X.   XX.
    *.*   *.*   *.*   *X*   *.*
"""

# Sylisation des tunnels horizontaux.
# Il y a tout un tas de bazar, pour gérer les bords de tunnels
# qui sont parfois rognés en diagonale, et parfois droit.
PATTERNS_TUNNEL_HORIZ = """

    *X*   *X*   *X*   *X*
    .-.   .-.   .-*   *-.
    .X.   ***   .X*   *X.

    *X*   *X*   ***   ***
    .-X   X-.   .-*   *-.
    ***   ***   .X*   *X.
"""

# Stylisation des tunnels verticaux. Là c'est beaucoup plus simple.
PATTERNS_TUNNEL_VERTIC = """
    *.*   *X*   *.*
    *|*   *|*   *|*
    *X*   *.*   *.*
"""

def iter_line_chunks(str_lines, lines_per_chunk):
    current_chunks = []
    current_nb_lines = 0
    for line in str_lines.split("\\n"):
        if line:
            if not current_chunks:
                current_chunks = [[line_elem] for line_elem in line.split()]
            else:
                for current_chunk, line_elem in zip(current_chunks, line.split()):
                    current_chunk.append(line_elem)
            current_nb_lines += 1
        if current_nb_lines == lines_per_chunk:
            for chunk in current_chunks:
                yield chunk
            current_chunks = []
            current_nb_lines = 0

def compile_match_patterns(str_patterns):
    patterns = [
        "".join(chunk_lines)
        for chunk_lines
        in iter_line_chunks(str_patterns, 3)
    ]
    return tuple(patterns)

def compile_replace_patterns(str_patterns):
    patterns = []
    for chunk in iter_line_chunks(str_patterns, 4):
        pat = "".join(chunk[:3])
        l_rep = chunk[-1]
        l_rep = l_rep[2:]
        l_rep = l_rep.split(",")
        l_rep = tuple([
            (int(index), char_rep)
            for index, semicolon, char_rep in
            l_rep
        ])
        patterns.append((pat, l_rep))
    return tuple(patterns)

def match_with_patterns(main_pattern, test_patterns):
    for test_pattern in test_patterns:
        correct = True
        for char_test, char_main in zip(test_pattern, main_pattern):
            if char_test != "*" and char_test != char_main:
                correct = False
                break
        if correct:
            return test_pattern
    return None

def apply_replacement_patterns(main_pattern, replacement_patterns):
    applied_replacement = False
    for test_pat, repl_actions in replacement_patterns:
        correct = True
        for char_test, char_main in zip(test_pat, main_pattern):
            if char_test != "*" and char_test != char_main:
                correct = False
                break
        if correct:
            if not applied_replacement:
                applied_replacement = True
                main_pattern = list(main_pattern)
            for index, char_rep in repl_actions:
                main_pattern[index] = char_rep

    if applied_replacement:
        return "".join(main_pattern)
    else:
        return main_pattern


class GameModel():

    def __init__(self, width=20, height=14):
        self.w = width
        self.h = height
        self.current_level_idx = 0

        self.patterns_wall_with_laser = compile_match_patterns(PATTERNS_WALL_WITH_LASER)
        self.patterns_wall_simple = compile_match_patterns(PATTERNS_WALL_SIMPLE)
        self.patterns_tunnel_horiz = compile_match_patterns(PATTERNS_TUNNEL_HORIZ)
        self.patterns_tunnel_vertic = compile_match_patterns(PATTERNS_TUNNEL_VERTIC)
        self.patterns_cross_lasers = compile_match_patterns(PATTERNS_CROSS_LASERS)
        self.patterns_replacement_tunnels_too_far = compile_replace_patterns(PATTERNS_REPLACEMENT_TUNNELS_TOO_FAR)
        self.patterns_replacement_cross_lasers = compile_replace_patterns(PATTERNS_REPLACEMENT_CROSS_LASERS)
        self.patterns_replacement_perspective_wall_lasers = compile_replace_patterns(PATTERNS_REPLACEMENT_PERSPECTIVE_WALL_LASERS)

        self.init_level()
        print("Le tileset a été dessiné par Tacheul.")
        print("http://pixeljoint.com/p/121104.htm")
        print()

    def in_bound(self, x, y):
        return (0 <= x < self.w) and (0 <= y < self.h)

    def stylify_tile(self, x, y):
        """
        Stylisation des murs et des tunnels.
        La fonction renvoie None si pas de style possible, ou bien une string.
        La string correspond à un gamobj, à afficher par-dessus le gamobj initial,
        afin d'avoir des niveaux plus joli.
        (Dans tous les cas, on garde le gamobj initial, car toute la logique du jeu se base uniquement
        sur les gamobj de base, ceux que l'on utilise pour créer les niveaux).
        """

        gamobj_mid = self.cur_level[y][x]
        if gamobj_mid not in ("X", "-", "|", "+"):
            return None

        main_pattern = ""
        for y_offset in (-1, 0, 1):
            for x_offset in (-1, 0, 1):
                x_check = x + x_offset
                y_check = y + y_offset
                # Les tiles à l'extérieur de la map sont considérées comme des murs.
                if not self.in_bound(x_check, y_check):
                    main_pattern += "X"
                else:
                    lvl_map_char = self.cur_level[y_check][x_check]
                    if lvl_map_char in ("X", "S"):
                        main_pattern += "X"
                    elif lvl_map_char in ("-", "|", "=", "I", "+"):
                        main_pattern += lvl_map_char
                    else:
                        main_pattern += "."

        # Dans la suite de cette fonction, on fait tout un tas de replace. C'est moche et pas optimisé.
        # Je n'ai pas de meilleure méthode pour le moment. Pouet pouet.

        if gamobj_mid == "X":

            main_pattern = apply_replacement_patterns(main_pattern, self.patterns_replacement_tunnels_too_far)
            main_pattern = main_pattern.replace("-", "X")
            main_pattern = main_pattern.replace("|", "X")
            main_pattern = apply_replacement_patterns(main_pattern, self.patterns_replacement_cross_lasers)
            main_pattern = apply_replacement_patterns(main_pattern, self.patterns_replacement_perspective_wall_lasers)
            matched_pattern = match_with_patterns(main_pattern, self.patterns_wall_with_laser)
            if matched_pattern is not None:
                return "pattern_" + matched_pattern

            main_pattern = main_pattern.replace("I", ".")
            main_pattern = main_pattern.replace("=", ".")
            main_pattern = main_pattern.replace("+", ".")
            # Il faut retenter les patterns de remplacment, car on vient de supprimer les lasers,
            # et ça a peut-être changé des choses.
            main_pattern = apply_replacement_patterns(main_pattern, self.patterns_replacement_tunnels_too_far)
            matched_pattern = match_with_patterns(main_pattern, self.patterns_wall_simple)
            if matched_pattern is not None:
                return "pattern_" + matched_pattern
            return None

        if gamobj_mid == "-":
            main_pattern = main_pattern.replace("I", ".")
            main_pattern = main_pattern.replace("=", ".")
            main_pattern = main_pattern.replace("+", ".")
            main_pattern = apply_replacement_patterns(main_pattern, self.patterns_replacement_tunnels_too_far)
            main_pattern = main_pattern.replace("-", "X")
            main_pattern = main_pattern.replace("|", "X")
            # On remet le gamobj_mid comme il faut.
            main_pattern = main_pattern[:4] + gamobj_mid + main_pattern[5:]
            matched_pattern = match_with_patterns(main_pattern, self.patterns_tunnel_horiz)
            if matched_pattern is not None:
                return "pattern_" + matched_pattern
            return None

        if gamobj_mid == "|":
            main_pattern = main_pattern.replace("I", ".")
            main_pattern = main_pattern.replace("=", ".")
            main_pattern = main_pattern.replace("+", ".")
            # Pas besoin d'appliquer patterns_replacement_tunnels_too_far, car ça ne concerne que des cases
            # sur les diagonales. Or, le tunnel vertical s'en fiche de ce qu'il peut y avoir sur les cases diagonales.
            main_pattern = main_pattern.replace("-", "X")
            main_pattern = main_pattern.replace("|", "X")
            # On remet le gamobj_mid comme il faut.
            main_pattern = main_pattern[:4] + gamobj_mid + main_pattern[5:]
            matched_pattern = match_with_patterns(main_pattern, self.patterns_tunnel_vertic)
            if matched_pattern is not None:
                return "pattern_" + matched_pattern
            return None

        if gamobj_mid == "+":
            main_pattern = main_pattern.replace("-", ".")
            main_pattern = main_pattern.replace("|", ".")
            main_pattern = main_pattern.replace("X", ".")
            main_pattern = apply_replacement_patterns(main_pattern, self.patterns_replacement_cross_lasers)
            matched_pattern = match_with_patterns(main_pattern, self.patterns_cross_lasers)
            if matched_pattern is not None:
                return "pattern_" + matched_pattern
            return None

        return None

    def stylify_laser(self, x, y, lvl_map_char):
        """
        Détermine les endroits où il faut placer les petites boules grises de lasers.
        Modifie l'apparence du laser, dans le cas où c'est un "laser cross",
        et dans le cas où on a pu placer un mur générateur de laser juste au-dessus.
        """
        len_str_prefix = len("pattern_")
        gamobjs_final = []
        electroball_U = electroball_D = lvl_map_char in ("I", "+")
        electroball_R = electroball_L = lvl_map_char in ("=", "+")

        # C'est un peu moche, parce qu'il y a du duplicate code, mais pas complètement.
        # Je préfère pas factoriser un truc comme ça.
        # Ça risque d'ajouter plus de complexité que ce qu'il y a déjà.

        if lvl_map_char in ("I", "+"):

            # up
            gamobjs_up = self.tiles[y-1][x] if self.in_bound(x, y-1) else ["X"]
            for gamobj in gamobjs_up:
                if gamobj in ("I", "+"):
                    electroball_U = False
                elif gamobj.startswith("pattern_"):
                    # Exemple de pattern qui fonctionne : "pattern_***XXX.I."
                    if gamobj[len_str_prefix + 7] == "I":
                        electroball_U = False
                        if lvl_map_char == "I" and gamobj[len_str_prefix + 4] == "X":
                            gamobjs_final.append("I_wall_up")

            # down
            gamobjs_down = self.tiles[y+1][x] if self.in_bound(x, y+1) else ["X"]
            for gamobj in gamobjs_down:
                if gamobj in ("I", "+", "X"):
                    electroball_D = False

            # cross
            if lvl_map_char == "+":
                gamobjs_cur = self.tiles[y][x]
                for gamobj in gamobjs_cur:
                    if gamobj.startswith("pattern_"):
                        if gamobj[len_str_prefix + 7] == ".":
                            electroball_D = False
                        if gamobj[len_str_prefix + 1] == ".":
                            electroball_U = False

        if lvl_map_char in ("=", "+"):

            # left
            gamobjs_adj = self.tiles[y][x-1] if self.in_bound(x-1, y) else ["X"]
            for gamobj in gamobjs_adj:
                if gamobj in ("=", "+"):
                    electroball_L = False
                elif gamobj.startswith("pattern_"):
                    # Exemple de pattern qui fonctionne : "pattern_*X*XX=XX*"
                    if gamobj[len_str_prefix + 5] == "=":
                        electroball_L = False

            # right
            gamobjs_adj = self.tiles[y][x+1] if self.in_bound(x+1, y) else ["X"]
            for gamobj in gamobjs_adj:
                if gamobj in ("=", "+"):
                    electroball_R = False
                elif gamobj.startswith("pattern_"):
                    # Exemple de pattern qui fonctionne : "pattern_*X*=XX*XX"
                    if gamobj[len_str_prefix + 3] == "=":
                        electroball_R = False

            # cross
            if lvl_map_char == "+":
                gamobjs_cur = self.tiles[y][x]
                for gamobj in gamobjs_cur:
                    if gamobj.startswith("pattern_"):
                        if gamobj[len_str_prefix + 1] == ".":
                            electroball_U = False
                        if gamobj[len_str_prefix + 5] == ".":
                            electroball_R = False
                        if gamobj[len_str_prefix + 7] == ".":
                            electroball_D = False
                        if gamobj[len_str_prefix + 3] == ".":
                            electroball_L = False

        electrob_correspondance = (
            (electroball_D, "electroball_D"),
            (electroball_U, "electroball_U"),
            (electroball_R, "electroball_R"),
            (electroball_L, "electroball_L"),
        )
        for has_electrob, gamobj_name in electrob_correspondance:
            if has_electrob:
                gamobjs_final.append(gamobj_name)

        return gamobjs_final

    def init_level(self):

        self.hero_alive = False
        self.tiles = tuple([
            tuple([
                [] for x in range(self.w)
            ])
            for y in range(self.h)
        ])
        self.cur_level = LEVELS[self.current_level_idx]
        self.knowledge_positions = {}
        knowledge_index = 0

        for y in range(self.h):
            for x in range(self.w):
                gamobjs = []
                lvl_map_char = self.cur_level[y][x]
                if lvl_map_char == "S":
                    # Si le tuyau d'arrivée est tout à droite, ça fera planter le jeu.
                    # Faut juste pas faire des niveaux avec le tuyau d'arrivée tout à droite.
                    self.hero_x = x + 1
                    self.hero_y = y
                    self.hero_alive = True
                    self.hero_dir = "D"
                    self.hero_state = "water"
                if lvl_map_char == "K":
                    self.knowledge_positions[(x, y)] = knowledge_index
                    knowledge_index += 1
                if lvl_map_char != " ":
                    gamobjs.append(lvl_map_char)
                styled_wall = self.stylify_tile(x, y)
                if styled_wall is not None:
                    gamobjs.append(styled_wall)
                self.tiles[y][x][:] = gamobjs

        for y in range(self.h):
            for x in range(self.w):
                lvl_map_char = self.cur_level[y][x]
                if lvl_map_char in ("I", "=", "+"):
                    self.tiles[y][x].extend(self.stylify_laser(x, y, lvl_map_char))

    def get_tile_gamobjs(self, x, y):
        return self.tiles[y][x]

    def export_all_tiles(self):
        rendered_tiles = [
            [ list(self.tiles[y][x]) for x in range(self.w) ]
            for y in range(self.h)
        ]
        hero_dir_names = {
            "U": "up",
            "D": "down",
            "L": "left",
            "R": "right",
        }
        if self.hero_alive :
            tile_of_hero = rendered_tiles[self.hero_y][self.hero_x]
            hero_gamobj = "%s_%s" % (self.hero_state, hero_dir_names[self.hero_dir])
            if "-" in tile_of_hero or "|" in tile_of_hero:
                hero_gamobj += "_pipe"
            tile_of_hero.append(hero_gamobj)

        return rendered_tiles

    def can_move(self, start_tile_objs, dest_tile_objs, move_dir):
        # On ne peut pas bouger dans un mur (y compris le mur contenant le tuyau d'arrivée)
        if "X" in dest_tile_objs or "S" in dest_tile_objs:
            return False
        # On ne peut pas traverser horizontalement un tunnel vertical, et vice-versa.
        if "-" in (start_tile_objs + dest_tile_objs) and move_dir in ("U", "D"):
            return False
        if "|" in (start_tile_objs + dest_tile_objs) and move_dir in ("L", "R"):
            return False
        # On ne peut pas du tout aller dans un tunnel si on est en glace.
        if self.hero_state == "ice" and ("-" in dest_tile_objs or "|" in dest_tile_objs):
            return False
        return True

    def on_game_event(self, event_name):

        if not self.hero_alive:
            self.init_level()
            return

        if event_name.startswith("action"):
            if self.current_level_idx == 0:
                print("Les boutons d'actions ne servent à rien dans ce jeu.")
            return

        must_move = False
        move_coord = squarity.MOVE_FROM_DIR.get(event_name)

        if move_coord is not None:
            new_hero_x = self.hero_x + move_coord[0]
            new_hero_y = self.hero_y + move_coord[1]
            if 0 <= new_hero_x < self.w and 0 <= new_hero_y < self.h:
                target_tile_objs = self.get_tile_gamobjs(new_hero_x, new_hero_y)
                must_move = self.can_move(
                    self.get_tile_gamobjs(self.hero_x, self.hero_y),
                    target_tile_objs,
                    event_name
                )

        if must_move:
            self.hero_dir = event_name
            self.hero_x = new_hero_x
            self.hero_y = new_hero_y

        tile_data_new_pos = self.get_tile_gamobjs(self.hero_x, self.hero_y)
        # Refroidissement du héros.
        if must_move and "C" in tile_data_new_pos:
            to_cold = {
                "ice": "ice",
                "water": "ice",
                "gas": "water",
            }
            self.hero_state = to_cold[self.hero_state]
        # Réchauffage du héros.
        if must_move and "H" in tile_data_new_pos:
            to_hot = {
                "ice": "water",
                "water": "gas",
                "gas": "gas",
            }
            self.hero_state = to_hot[self.hero_state]

        # Affichage des connaissances (dans le dernier niveau).
        if "K" in tile_data_new_pos:
            KNOWLEDGE = (
                "Vous mélangez votre eau à celle du bassin de sapience... Essayez les autres bassins pour vous imprégner de tout le savoir de H2O",
                "Pour jouer à la version originale du jeu : http://squarity.fr#fetchez_githubgist_darkrecher/ca7386545255db3244d571ec997e715b/raw/h2o-original",
                "H2O est inspiré du jeu éponyme de la console Storio. https://www.vtechda.com/Store/ITMax/ContentDetail/FR_fre_1838_58-126805-000-289_False.html",
                "DaLk, une personne classe, a commencé un autre tileset : http://squarity.fr#fetchez_githubgist_darkrecher/a0e7f7a5da6dbf1838060290e4e2e157/raw/h2o-daLk",
                "Le niveau précédent ne servait à rien. C'était juste un test pour vérifier l'arrangement des tiles. L'eau li l'eau l' !!",
                "Sous l'écume il y a l'eau claire (Luke).",
                "Pour accéder au dernier bassin de sapience, vous allez devoir tricher.",
                "Bravo, vous avez compris comment modifier les niveaux. Et si vous faisiez les vôtres et que vous les partagiez ? C'est pas la mer à boire !",
            )
            knowledge_index = self.knowledge_positions.get((self.hero_x, self.hero_y))
            if knowledge_index is not None:
                if knowledge_index < len(KNOWLEDGE):
                    print(KNOWLEDGE[knowledge_index])
                else:
                    really = "vraiment " * (knowledge_index-len(KNOWLEDGE))
                    print("Je n'ai " + really + "plus rien à vous dire.")
                print()

        # Passage au niveau suivant si le héros a atteint la grille de fin de niveau.
        if "O" in tile_data_new_pos:
            if self.hero_state == "water":
                self.hero_alive = False
                tile_data_new_pos.remove("O")
                tile_data_new_pos.append("wet_grid")
                self.current_level_idx += 1
                print("Bravo, vous passez au niveau %s" % (self.current_level_idx + 1))
                print()
            elif self.current_level_idx == 0:
                print("Il faut être en état liquide.")

        # Mort du héros si il est en gaz et qu'il va dans des lasers.
        if set("=I+").intersection(set(tile_data_new_pos)) and self.hero_state == "gas":
            self.hero_alive = False
            tile_data_new_pos.append("gas_dead")
            print("Blarg ! Appuyez sur un bouton pour ressusciter")

        # Mort du héros si il est en liquide et qu'il va dans une éponge .
        if "E" in tile_data_new_pos and self.hero_state == "water":
            self.hero_alive = False
            tile_data_new_pos.remove("E")
            tile_data_new_pos.append("wet_sponge")
            print("Blarg ! Appuyez sur un bouton pour ressusciter")
  `,

  TUNNEL_MATCH_JSON_CONF: `
  {
    "version": "2.0.0",
    "game_area": {
      "nb_tile_width": 22,
      "nb_tile_height": 15
    },
    "tile_size": 36,
    "img_coords": {
      "gem_green": [0, 72],
      "gem_violet": [0, 36],
      "rock": [72, 0]
    }
  }
  `,
  TUNNEL_MATCH_GAME_CODE: `"""
  Test et démo des développements en cours, avec le nouveau moteur de jeu,
  une API mieux faite, et la possibilité d'afficher des mouvements de transitions
  quand on déplace un GameObject d'une tile à une autre.
"""
import json
import squarity
Coord = squarity.Coord

class GameModel(squarity.GameModelBase):
      def on_start(self):
          json_conf = json.loads(self.str_game_conf_json)
          for gobj_name in json_conf["img_coords"].keys():
              print(gobj_name)
          # Le layer_rock n'a pas de transition.
          self.layer_rock = squarity.LayerSparse(self, self.w, self.h, False)
          self.layers.append(self.layer_rock)

          self.gamobj_gem_green = self.main_layer.create_game_object(
              Coord(x=4, y=1),
              "gem_green",
          )
          self.gamobj_gem_green.callback_end_transi = self.another_callback

          self.gamobj_gem_violet = self.main_layer.create_game_object(
              Coord(x=5, y=1),
              "gem_violet",
          )

      def on_click(self, coord):
          print("on click", coord.x, coord.y)
          target_tile_main = self.main_layer.get_tile(coord)

          if target_tile_main.game_objects:
              target_tile_main.game_objects[0].sprite_name = "gem_violet"
          else:
              gobj_rocks = self.layer_rock.get_game_objects(coord)
              if not gobj_rocks:
                  self.layer_rock.create_game_object(coord, "rock")
              else:
                  print("suppression du rock")
                  self.layer_rock.remove_game_object(gobj_rocks[0])

          event_result = squarity.EventResult()
          event_result.delayed_actions = []
          my_callback = squarity.CallBack()
          my_callback.delay_ms = 100
          my_callback.callback = self.my_callback
          event_result.delayed_actions.append(my_callback)
          return event_result

      def on_button_direction(self, direction):
          print(direction, int(direction))
          self.gamobj_gem_green.add_transition(
              squarity.TransitionSteps(
                  "coord",
                  (
                      (400, Coord(1, 5)),
                      (600, Coord(7, 3)),
                  )
              )
          )


      def on_button_action(self, action_name):
          # print("on event", action_name)
          offset = +1 if action_name == "action_1" else -1
          self.gamobj_gem_green.move(Coord(x=offset, y=0))
          self.gamobj_gem_violet.move(Coord(x=-offset, y=0))
          #if self.gamobj_gem_violet.transitioner is not None:
          #      print("go !!")
          #      print(self.gamobj_gem_violet.transitioner.currentTransitions)
          #      print(len(self.gamobj_gem_violet.transitioner.currentTransitions))


      def my_callback(self):
          print("my callback")

      def another_callback(self):
          print("another callback", self.gamobj_gem_green.coord)
          self.gamobj_gem_green.move_to(Coord(x=4, y=4))

  `

});
