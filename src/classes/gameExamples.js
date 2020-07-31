// https://stackoverflow.com/questions/47597384/best-way-to-define-common-constants-in-vue-js

// TODO : faudra stocker ça autrement quand on aura plusieurs exemples de jeu.
// Dans un fichier .py qui se colore-syntax correctement, et lors du build du projet,
// on le met dans une string comme ça à l'arrache.
export default Object.freeze({
  GAME_EXEMPLE_MAGICIAN: `

# TODO : Les variables DATA_TILES sont spécifique au jeu. Faudra les mettre ailleurs.
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
        # TODO : code "à moitié" spécifique au jeu. Désolé pour le propos imprécis.
        for y in range(self.h):
            for x in range(self.w):
                tile_data = []
                tile_data_add = DATA_TILES_1[y][x]
                if tile_data_add != ' ':
                    tile_data += tile_data_add
                tile_data_add = DATA_TILES_2[y][x]
                if tile_data_add != ' ':
                    tile_data += tile_data_add
                self.tiles[y][x] = tile_data

        # TODO : Code spécifique au jeu. Faudra le sortir de là.
        self.magician_x = 6
        self.magician_y = 4
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
        # TODO : Tout ça, c'est que du code spécifique au jeu.
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


        if must_move:
            self.tiles[self.magician_y][self.magician_x].remove('M')
            self.magician_x = new_magician_x
            self.magician_y = new_magician_y
            self.tiles[self.magician_y][self.magician_x].append('M')
        print(board_model.juste_pour_tester)
  `,
});
