from browser import document

MOVE_FROM_DIR = {
    "U": [0, -1],
    "R": [1, 0],
    "D": [0, 1],
    "L": [-1, 0],
}

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
        self.magician_x = 7
        self.magician_y = 4
        self.tiles[self.magician_y][self.magician_x].append('M')

    def get_tile(self, x, y):
        return self.tiles[y][x]

    def send_game_action(self, action_type):
        print("send_game_action", action_type)
        # TODO : Tout ça, c'est que du code spécifique au jeu.
        must_move = False
        move_coord = MOVE_FROM_DIR.get(action_type)
        if move_coord is not None:
            new_magician_x = self.magician_x + move_coord[0]
            new_magician_y = self.magician_y + move_coord[1]
            if 0 <= new_magician_x < self.w and 0 <= new_magician_y < self.h:
                must_move = True
        if must_move:
            self.tiles[self.magician_y][self.magician_x].remove('M')
            self.magician_x = new_magician_x
            self.magician_y = new_magician_y
            self.tiles[self.magician_y][self.magician_x].append('M')


board_model = BoardModel()
print("board_model", board_model)
# TODO : C'est moche. faudra packager tout ça dans un seul objet.
# Et de toutes façons c'est le code extérieur qui doit créer la classe.
# Sinon on peut pas lui indiquer la taille du board.
document.BoardModelGetTile = board_model.get_tile
document.BoardModelSendGameAction = board_model.send_game_action
print("importation faite")
