from browser import document

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

# Ci-dessous, tout le bazar spécifique au code du jeu,
# utilisable par les créateurs de jeu.
# Bon, pour l'instant, y'a pas grand-chose.

MOVE_FROM_DIR = {
    "U": [0, -1],
    "R": [1, 0],
    "D": [0, 1],
    "L": [-1, 0],
}
