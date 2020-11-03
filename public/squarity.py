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
# Bon, pour l'instant, y'a pas grand-chose.

class Squarity():

    MOVE_FROM_DIR = {
        "U": [0, -1],
        "R": [1, 0],
        "D": [0, 1],
        "L": [-1, 0],
    }

squarity = Squarity()