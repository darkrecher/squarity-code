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
  EMERALD_JSON_CONF: `
  {
    "name": "Une émeraude cherche son ami",
    "version": "2.1.0",
    "game_area": {
      "nb_tile_width": 8,
      "nb_tile_height": 9
    },
    "tile_size": 40,
    "img_coords": {
      "gem_yellow": [0, 0, 40, 40, "center"],
      "gem_green": [58, 0, 40, 40, "center"],
      "background": [0, 40, 640, 400]
    }
  }
  `,
  EMERALD_GAME_CODE: `"""

---------------------------
À la recherche de votre ami
---------------------------

Vous êtes une émeraude verte à la recherche
de votre fidèle ami le chrysobéryl jaune.

Il s'agit d'un simple mini-jeu, pour montrer les nouvelles fonctionnalités
de la version 2.1.0 du moteur de Squarity.

Ces fonctionnalités seront documentées très prochainement.

L'image de background plasma-lava a été créée par 'Downdate'.
Elle est disponible ici :
https://opengameart.org/content/centered-around-the-hero
Licence CC-BY-3.0
"""

import random
import squarity

Coord = squarity.Coord
MARGIN_BACKGROUND_X = 1
MARGIN_BACKGROUND_Y = 1
BIG_WORLD_W = 32
BIG_WORLD_H = 20


class GameObjectInBigWorld(squarity.GameObject):

    def more_init(self, coord_big_world, rect_visible):
        self.coord_big_world = coord_big_world
        self.move_to_xy(
            self.coord_big_world.x - rect_visible.x,
            self.coord_big_world.y - rect_visible.y
        )
        self.must_set_visible = rect_visible.in_bounds(self.coord_big_world)
        self.must_hide = False


    def ack_zone_moved(self, zone_move_details):
        zmd = zone_move_details
        is_visible_prev = zmd.rect_visible_prev.in_bounds(self.coord_big_world)
        is_visible_cur = zmd.rect_visible_cur.in_bounds(self.coord_big_world)

        if is_visible_prev and is_visible_cur:
            # L'objet était déjà visible dans la zone affichée, et il l'est toujours.
            # FUTURE : argh. Va falloir un truc pour multiplier les coordonnées,
            # et les les additionner, et les soustraire ?
            scroll_vector = Coord(
                self._coord.x-zmd.coord_vector.x,
                self._coord.y-zmd.coord_vector.y,
            )
            self.add_transition(
                squarity.TransitionSteps(
                    "coord",((zmd.scroll_time, scroll_vector), )
                )
            )

        elif not is_visible_prev and is_visible_cur:
            # L'objet devient visible dans la zone affichée.
            self.move_to_xy(
                self.coord_big_world.x - zmd.rect_visible_cur.x,
                self.coord_big_world.y - zmd.rect_visible_cur.y
            )
            self.image_modifier.area_offset_x = zmd.coord_vector.x
            self.image_modifier.area_offset_y = zmd.coord_vector.y
            if zmd.coord_vector.x:
                self.image_modifier.add_transition(
                    squarity.TransitionSteps(
                        "area_offset_x", ((zmd.scroll_time, 0), )
                    )
                )
            if zmd.coord_vector.y:
                self.image_modifier.add_transition(
                    squarity.TransitionSteps(
                        "area_offset_y", ((zmd.scroll_time, 0), )
                    )
                )
            self.must_set_visible = True

        elif is_visible_prev and not is_visible_cur:
            # L'objet disparaît de la zone affichée.
            if zmd.coord_vector.x:
                self.image_modifier.add_transition(
                    squarity.TransitionSteps(
                        "area_offset_x",
                        ((zmd.scroll_time, -zmd.coord_vector.x), )
                    )
                )
            if zmd.coord_vector.y:
                self.image_modifier.add_transition(
                    squarity.TransitionSteps(
                        "area_offset_y",
                        ((zmd.scroll_time, -zmd.coord_vector.y), )
                    )
                )
            self.must_hide = True

# FUTURE : on devrait pouvoir configurer le "center" des sprites dans le code,
# et pas que dans la config json.


class ZoneMoveDetails():

    def __init__(self, rect_visible_prev, rect_visible_cur):
        self.rect_visible_prev = rect_visible_prev
        self.rect_visible_cur = rect_visible_cur
        self.coord_vector = Coord(
            self.rect_visible_cur.x - self.rect_visible_prev.x,
            self.rect_visible_cur.y - self.rect_visible_prev.y,
        )
        move_dist_manh = (abs(self.coord_vector.x) + abs(self.coord_vector.y))
        self.scroll_time = move_dist_manh * 75


class GameModel(squarity.GameModelBase):

    def on_start(self):
        print("Allez vers la droite pour retrouver votre ami le chrysobéryl jaune.")
        self.transition_delay = 100
        self.rect_big_world = squarity.Rect(0, 0, BIG_WORLD_W, BIG_WORLD_H)
        self.layer_gem = squarity.Layer(self, self.w, self.h)
        self.layers.append(self.layer_gem)
        self.gobj_bg = squarity.GameObject(
            Coord(0, 0),
            "background",
            image_modifier=squarity.ComponentImageModifier(
                area_scale_x=2.0,
                area_scale_y=2.0,
                area_offset_x=MARGIN_BACKGROUND_X,
                area_offset_y=MARGIN_BACKGROUND_Y,
                img_size_x=640,
                img_size_y=400,
            )
        )
        self.gobj_bg.set_callback_end_transi(self.on_move_zone_end)
        self.gobj_bg.plock_transi = squarity.PlayerLockTransi.INVISIBLE
        self.layer_main.add_game_object(self.gobj_bg)
        self.coord_zone = Coord(0, 0)
        self.rect_visible = self.compute_rect_visible()

        self.gem_green = GameObjectInBigWorld(
            Coord(0, 0),
            "gem_green",
            image_modifier=squarity.ComponentImageModifier()
        )
        self.gem_green.plock_transi = squarity.PlayerLockTransi.INVISIBLE
        self.gem_green.more_init(Coord(3, 3), self.rect_visible)
        if self.gem_green.must_set_visible:
            self.layer_gem.add_game_object(self.gem_green)
            self.gem_green.must_set_visible = False

        self.gem_yellow = GameObjectInBigWorld(
            Coord(0, 0),
            "gem_yellow",
            image_modifier=squarity.ComponentImageModifier(),
            back_caller=squarity.ComponentBackCaller(),
        )
        self.gem_yellow.plock_transi = squarity.PlayerLockTransi.INVISIBLE
        self.gem_yellow.more_init(Coord(8, 7), self.rect_visible)
        if self.gem_yellow.must_set_visible:
            self.layer_gem.add_game_object(self.gem_yellow)
            self.gem_yellow.must_set_visible = False
        self.nb_found_yellow = 0


    def compute_rect_visible(self):
        return squarity.Rect(
            self.coord_zone.x * 6 - MARGIN_BACKGROUND_X,
            self.coord_zone.y * 7 - MARGIN_BACKGROUND_Y,
            self.w,
            self.h,
        )


    def on_button_direction(self, direction):
        coord_test = self.gem_green.coord_big_world.clone().move_dir(direction)
        if not self.rect_big_world.in_bounds(coord_test):
            return
        self.gem_green.coord_big_world.move_dir(direction)

        if self.rect_visible.on_border(self.gem_green.coord_big_world):
            self.direction_move_zone = direction
            self.gem_green.move_dir(
                direction,
                callback=self.on_green_move_borders,
            )
        elif coord_test == self.gem_yellow.coord_big_world:
            self.gem_green.move_dir(
                direction,
                callback=self.on_diamond_meets,
            )
        else:
            self.gem_green.move_dir(direction)


    def on_diamond_meets(self):
        TRANSI_SCALE = (
            (150, 0.5), (150, 1.5), (150, 0.5), (150, 1.5),
            (150, 0.5), (150, 1.5), (150, 0.5), (150, 1.5),
            (150, 0.5), (150, 1.5)
        )
        TRANSI_SCALE_YELLOW = ((150, 1.5),) + TRANSI_SCALE + ((225, 0), )
        TRANSI_SCALE_GREEN = TRANSI_SCALE + ((150, 0.5), (75, 1), )

        self.gem_yellow.image_modifier.add_transition(
            squarity.TransitionSteps(
                "area_offset_x",
                ((200, 1), (400, 1), (400, -1), (400, -1), (400, 1), )
            )
        )
        self.gem_yellow.image_modifier.add_transition(
            squarity.TransitionSteps(
                "area_offset_y",
                ((200, -1), (400, 1), (400, 1), (400, -1), (400, -1), )
            )
        )
        self.gem_yellow.image_modifier.add_transition(
            squarity.TransitionSteps("area_scale_x", TRANSI_SCALE_YELLOW)
        )
        self.gem_yellow.image_modifier.add_transition(
            squarity.TransitionSteps("area_scale_y", TRANSI_SCALE_YELLOW)
        )
        # FUTURE : ça fait quand même beaucoup de code boiler plate,
        # juste pour balancer une callback (et y'en a aussi dans l'init).
        self.gem_yellow.back_caller.add_callback(
            squarity.DelayedCallBack(1875, self.on_met_yellow)
        )

        self.gem_green.image_modifier.add_transition(
            squarity.TransitionSteps(
                "area_offset_x",
                ((200, -1), (400, -1), (400, 1), (400, 1), (400, -1), (200, 0))
            )
        )
        self.gem_green.image_modifier.add_transition(
            squarity.TransitionSteps(
                "area_offset_y",
                ((200, 1), (400, -1), (400, -1), (400, 1), (400, 1), (200, 0))
            )
        )
        self.gem_green.image_modifier.add_transition(
            squarity.TransitionSteps("area_scale_x", TRANSI_SCALE_GREEN)
        )
        self.gem_green.image_modifier.add_transition(
            squarity.TransitionSteps("area_scale_y", TRANSI_SCALE_GREEN)
        )


    def on_green_move_borders(self):
        rect_visi_prev = self.rect_visible
        self.coord_zone.move_dir(self.direction_move_zone)
        self.rect_visible = self.compute_rect_visible()
        zone_move_details = ZoneMoveDetails(rect_visi_prev, self.rect_visible)
        self.ack_zone_moved_for_background(zone_move_details)

        for gem in [self.gem_yellow, self.gem_green]:
            gem.ack_zone_moved(zone_move_details)
            if gem.must_set_visible:
                self.layer_gem.add_game_object(gem)
                gem.must_set_visible = False

        if self.gem_green.coord_big_world == self.gem_yellow.coord_big_world:
            event_result = squarity.EventResult()
            event_result.add_delayed_callback(
                squarity.DelayedCallBack(0, self.on_diamond_meets)
            )
            return event_result


    def on_move_zone_end(self):
        for gem in [self.gem_yellow, self.gem_green]:
            if gem.must_hide:
                self.layer_gem.remove_game_object(gem)
                gem.must_hide = False


    def get_random_coord_in_big_world(self):
        return Coord(
            random.randrange(0, BIG_WORLD_W),
            random.randrange(0, BIG_WORLD_H)
        )


    def on_met_yellow(self):
        self.layer_gem.remove_game_object(self.gem_yellow)
        self.gem_yellow.must_hide = False
        # Il faut choisir un nouvel emplacement pour le diamant jaune,
        # mais pas dans le visible rect. (sinon ça fera bizarre)
        nb_tries = 5
        new_yellow_coord = self.get_random_coord_in_big_world()
        while self.rect_visible.in_bounds(new_yellow_coord):
            new_yellow_coord = self.get_random_coord_in_big_world()
            nb_tries -= 1
            if nb_tries == 0:
                # On a essayé des coord random,
                # et on n'arrive pas à être ailleurs que le visible rect.
                # alors on balance un truc par défaut, et osef.
                new_yellow_coord = Coord(0, 0)
            elif nb_tries == -1:
                # Ça marche toujours pas. On rebalance un truc par défaut.
                new_yellow_coord = Coord(BIG_WORLD_W-1, BIG_WORLD_H-1)
            elif nb_tries < -1:
                raise Exception("Not supposed to happen")

        self.gem_yellow.coord_big_world = new_yellow_coord.clone()
        self.gem_yellow.image_modifier.area_scale_x = 1.0
        self.gem_yellow.image_modifier.area_scale_y = 1.0

        self.nb_found_yellow += 1
        if self.nb_found_yellow == 1:
            print(
                "\\nVous avez trouvé votre ami !",
                "Mais il est parti batifoler aux coordonnées :",
                new_yellow_coord.x,
                new_yellow_coord.y
            )
        elif self.nb_found_yellow == 2:
            print(
                "\\nVous avez retrouvé votre ami.",
                "Il est reparti batifoler, à vous de trouver où il est."
            )
        else:
            print(
                "\\nVous avez retrouvé votre ami",
                self.nb_found_yellow,
                "fois."
            )
            if self.nb_found_yellow > 7:
                print("Vous devriez faire autre chose...")


    def ack_zone_moved_for_background(self, zone_move_details):
        zmd = zone_move_details
        if zmd.coord_vector.x:
            self.gobj_bg.image_modifier.add_transition(
                squarity.TransitionSteps(
                    "area_offset_x",
                    ((zmd.scroll_time, -zmd.rect_visible_cur.x), )
                )
            )
        if zmd.coord_vector.y:
            # FUTURE :
            #  - add_transition de area_offset et img_offset où on peut donner des coords.
            #  - add_transition dans le game object,
            #    qui transmet au image_modifier selon le field name.
            #  - directement les paramètres, sans passer par le squarity.TransitionSteps.
            #  - add_transi_step pour ajouter un seul step, (pas de tuple de tuple).
            #  - rassemblement des transi sur un même field.
            self.gobj_bg.image_modifier.add_transition(
                squarity.TransitionSteps(
                    "area_offset_y",
                    ((zmd.scroll_time, -zmd.rect_visible_cur.y), )
                )
            )


    def on_button_action(self, action_name):
        print("Les boutons d'actions ne servent à rien dans ce jeu.")

`
});
