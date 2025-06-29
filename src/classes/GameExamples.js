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
});
