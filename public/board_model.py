from browser import document
import squarity

# Technique initiale pour rediriger les prints.
# https://stackoverflow.com/questions/61348313/how-can-i-redirect-all-brython-output-to-a-textarea-element

# Sauf que 'import sys' ne marche pas. (On ne sait pas pourquoi).
# Mais en fouillant ici :
# http://www.brython.info/src/Lib/sys.py
# On voit que sys.stdout, c'est pareil que __BRYTHON__.stdout.
# Par exemple : `__BRYTHON__.stdout.write("pouet pouet")`, ça marche.
# La variable __BRYTHON__ est accessible dès le début.
# Mais c'est quand même bizarre.

# TODO : ce serait bien de retester le 'import sys' dans différents contextes.
# Et si on n'arrive pas à le faire fonctionner, de le signaler sur brython.

class MyOutput:
    def __init__(self):
        self.python_console = document["python_console"]

    def write(self, text):
        # TODO : ça marche. Mais je ne comprends pas comment ça se fait qu'on puisse
        # utiliser l'attribut "self.python_console.text".
        # En javascript il faut écrire textContent. Un petit mystère à élucider...
        self.python_console.text += text
        self.python_console.scrollTop = self.python_console.scrollHeight

__BRYTHON__.stdout = MyOutput()
__BRYTHON__.stderr = __BRYTHON__.stdout


def main():
    # TODO : il va falloir expliquer pourquoi on est obligé de faire un truc aussi dégueux,
    # avec une grosse suite de if contenant toutes les fonctions à exécuter,
    # et des variables document.squabr_xxxx de partout.
    squabr_board_model_func = document.squabr_board_model_func
    if squabr_board_model_func == "init":
        decorated_gamecode = "\n".join(
            (
                "from browser import document",
                document.gameCode,
                "document.BoardModel = BoardModel"
            )
        )
        exec(decorated_gamecode)
        document.board_model = document.BoardModel()
    elif squabr_board_model_func == "export_all_tiles":
        document.tiles_data = document.board_model.export_all_tiles()
    elif squabr_board_model_func == "on_game_event":
        document.squabr_event_result = document.board_model.on_game_event(
            document.squabr_game_event
        )
    elif squabr_board_model_func == "get_size":
        width, height = document.board_model.get_size()
        document.squabr_board_width = width
        document.squabr_board_height = height

