// https://stackoverflow.com/questions/47597384/best-way-to-define-common-constants-in-vue-js

// TODO : faudra stocker ça autrement quand on aura plusieurs exemples de jeu.
// Dans un fichier .py qui se colore-syntax correctement, et lors du build du projet,
// on le met dans une string comme ça à l'arrache.

// TODO : dans le game_code, si j'utilise une variable qui n'existe pas. Par exemple : print(zut)
// Ça fait un vilain message d'erreur console, qui ne cite même pas la variable inexistante.
// Ça va être très embarrassant si on peut pas avoir des messages d'erreur plus clairs. À voir...
// On doit pouvoir s'en sortir avec des gros try-except qui encapsulent chaque appel du game-code.

// TODO : l'utilisateur devra coder toute la classe BoardModel dans son game_code.
// Il faut décider si on lui en fait une de base, pour qu'il la surcharge.

// TODO : expliquer dans la doc qu'il y a la fonction externe "export_tile".
// Elle est appelée automatiquement par le système.
// Elle pourra, dans le futur, renvoyer plein de trucs.
// (Même si pour l'instant elle ne renvoie qu'une liste de string).
// Et il y a la fonction interne get_tile_gamobjs, qui renvoie la liste d'objets.
// Cette fonction permet de manipuler la liste, ajouter/enlever des éléments, ...

// TODO : des petites fonctions pour construire les json à renvoyer,
// avec dedans les "delayed_actions", "player_locks", etc.

export default Object.freeze({
  // TODO : la taille du sprite du magicien est plus grande que 16x16, et faudrait le décaler.
  // Pour l'instant on laisse comme ça, même si c'est moche.
  // C'est le sprite "M".
  MAGICIAN_JSON_CONF: `
  {
    "tile_size": 16,
    "tile_coords": {
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
    "     701     70001  ",
    "     682     68882  ",
    "     543     54443  ",
    "     VVV     WDdVV  ",
    "     vvv     543vv  ",
    "             yyy    ",
    "    7001            ",
    " 70068821           ",
    " 588544381          ",
    " y68WsDW8801        ",
    " 78888888882    71  ",
    " 54888888843    53  ",
    " yy5444443yy    yy  ",
    "   yyyyyyy          ",
]

DATA_TILES_2 = [
    "                    ",
    "       [-----]      ",
    "      (             ",
    "      |             ",
    "      |             ",
    "      |             ",
    "      )             ",
    "                    ",
    "                    ",
    "                    ",
    "           [----]   ",
    "       N            ",
    "                    ",
    "                    ",
]

PASSABLE_TILOBJS = list("0123456789-|s")

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

        print("Le tileset de ce jeu a été créé par Buch :")
        print("https://opengameart.org/content/dungeon-tileset")
        print()

    def get_size(self):
        return self.w, self.h

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
            mov_x, mov_y = board_model.MOVE_FROM_DIR[fire_dir]
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

    def toggle_door(self):
        action_target_y = self.magician_y - 1
        if action_target_y > 0:
            target_tile_objs = self.get_tile_gamobjs(self.magician_x, action_target_y)
            if "d" in target_tile_objs:
                target_tile_objs.remove("d")
                target_tile_objs.append("D")
            elif "D" in target_tile_objs:
                target_tile_objs.remove("D")
                target_tile_objs.append("d")

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
            return self.toggle_door()

        if event_name == "action_2":
            return self.start_fire()

        must_move = False
        move_offset = board_model.MOVE_FROM_DIR.get(event_name)
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

  `,

  H2O_JSON_CONF: `
  {
    "tile_size": 32,
    "tile_coords": {
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
}
  `,
  H2O_GAME_CODE: `

LEVELS = (
    (
        "XXXXXXXXXXXXXXXXXXXX",
        "X...-...XXX...=....X",
        "X..XXX..XXX..XXX...X",
        "S...E....H....-....X",
        "X..XXX..XXX..XXX.X.X",
        "X...=...X.X...E..X.X",
        "XXXXXXXXX.XXXXXXXX.X",
        "XXXXXXXXX.XXXXXXXXCX",
        "X.H.H...X.X...E..X.X",
        "X..CCC..XXX..XXX.XCX",
        "X.HCO.........=....X",
        "X..CCC..XXX..XXX.XXX",
        "X.H.H...XXX...-..XXX",
        "XXXXXXXXXXXXXXXXXXXX",
    ),
    (
        "X.H.XXX.C.XXX.H.XXXX",
        "S...-.E...=.E.....XX",
        "X.C.XXX.H.XXX.C.X|XX",
        "XXXXXXXXXXXXXXXXX.XX",
        "X.H.XXX.C.XXX.H.XIXX",
        "XC..=.H...-.C.....XX",
        "X...XXX.H.XXX.C.XXXX",
        "XX.XX.XXXXX.XXXXX...",
        "XXCX.X.X...XXXXXXX..",
        "XXHXXXXX..XX.....X..",
        "XXEX.H.XXXXX..O..X..",
        "XX......HCE......X..",
        "XXXX.C.XXXXXH...CX..",
        "XXXXXXXXXXXXXXXXXX..",
    ),
    (
        "XXXXXXXXXXXXXXXXXXXX",
        "XXXXXXXX.....XXXXXXX",
        "XXXXXXXX.XXXHXXXXXXX",
        "XXXXXXXX.XXXHXXXXXXX",
        "X.H.XXXX.XXXCXXXXXXX",
        "S....E-..CCHE.....XX",
        "X.C.XXXX.XXXCXXX..XX",
        "XXXXX..X.XXXHX.....X",
        "X.--.||X.XXXCX.XXX.X",
        "X|XX..|X.....X..CH.X",
        "X|X.--.XXXXXXXXXHCXX",
        "X|XOXXXXXXX.----CHXX",
        "X.---------.XXXXXXXX",
        "XXXXXXXXXXXXXXXXXXXX",
    ),
    (
        "EIEXIIIXIIIXIIIIIIII",
        "ECE=...=...=...===O=",
        "EEE=.=.=.=.=.=.===I=",
        "X=.=.=.=.=.=.=.=...=",
        "X=...=...=...=...=.=",
        "XXIIIXIIIXIIIXIII=H=",
        "XXXXXXXXXXXXXXXXXEHE",
        "XEHEEEEEEEEEEEEEEXIX",
        "XE......EE.....EEEEE",
        "XEEEEEE....EEE.....E",
        "XEEEEEEEEEEEEEEEEE.E",
        "XE...E...E...E...E.E",
        "S..E...E...E...E...E",
        "XEEEEEEEEEEEEE-CEEEE",
    ),
    (
        "XXXXXXXXXXXXXXXXXXXX",
        "X.HHHH..H..H..H..H.X",
        "X.H.....H..HH.H..H.X",
        "X.HH....H..H.HH..H.X",
        "X.H.....H..H..H....X",
        "X.H.....H..H..H..H.X",
        "S..................X",
        "X.....CC.....CC....X",
        "X.....CC.....CC....X",
        "X..................X",
        "X...C...........C..X",
        "X....C.........C...X",
        "X.....CCCCCCCCC....X",
        "XXXXXXXXXXXXXXXXXXXX",
    ),
)

class BoardModel():

    def __init__(self, width=20, height=14):
        self.w = width
        self.h = height
        self.current_level_idx = 0
        self.init_level()
        print("Ce jeu est inspiré de \\"H2O\\", sur la mini-console Storio.")
        print("https://www.vtechda.com/Store/ITMax/ContentDetail/FR_fre_1838_58-126805-000-289_False.html")
        print()

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
                    # Si le tuyau d'arrivée est tout à droite, ça fera planter le jeu.
                    # Faut juste pas faire des niveaux avec le tuyau d'arrivée tout à droite.
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

    def get_tile_gamobjs(self, x, y):
        return self.tiles[y][x]

    def export_tile(self, x, y):
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

    def on_game_event(self, event_name):

        if not self.hero_alive:
            self.init_level()
            return

        if event_name.startswith("action") and self.current_level_idx == 0:
            print("Les boutons d'actions ne servent à rien dans ce jeu.")

        must_move = False
        move_coord = board_model.MOVE_FROM_DIR.get(event_name)

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

        if "O" in tile_data_new_pos:
            if self.hero_state == "water":
                self.hero_alive = False
                tile_data_new_pos.remove("O")
                tile_data_new_pos.append("wet_grid")
                self.current_level_idx += 1
                print("Bravo, vous passez au niveau %s" % (self.current_level_idx + 1))
            elif self.current_level_idx == 0:
                print("Il faut être en état liquide.")

        if ("=" in tile_data_new_pos or "I" in tile_data_new_pos) and self.hero_state == "gas":
            self.hero_alive = False
            tile_data_new_pos.append("gas_dead")
            print("Blarg ! Appuyez sur un bouton pour ressusciter")

        if "E" in tile_data_new_pos and self.hero_state == "water":
            self.hero_alive = False
            tile_data_new_pos.remove("E")
            tile_data_new_pos.append("wet_sponge")
            print("Blarg ! Appuyez sur un bouton pour ressusciter")

  `,

});
