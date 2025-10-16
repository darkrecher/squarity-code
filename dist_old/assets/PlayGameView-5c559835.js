import{_ as M,o as f,c as _,b as l,d as le,e as de,F as E,f as G,t as ne,r as j,a as v,w as A,n as R,g as $,v as W}from"./index-86c22afc.js";function ce(o){return new Promise(function(e,t){let s=!1,n=document.querySelector('script[src="'+o+'"]');if(!n)n=document.createElement("script"),n.type="text/javascript",n.async=!0,n.src=o,s=!0;else if(n.hasAttribute("data-loaded")){e(n);return}n.addEventListener("error",t),n.addEventListener("abort",t),n.addEventListener("load",function(){n.setAttribute("data-loaded",!0),e(n)}),s&&document.head.appendChild(n)})}const he={name:"MainTitle"},fe={class:"main-title"};function _e(o,e,t,s,n,i){return f(),_("div",fe,[...e[0]||(e[0]=[l("a",{href:"/"},[l("h1",null,"Squarity")],-1),l("div",null,"un moteur de jeux 2D, en python",-1)])])}const me=M(he,[["render",_e],["__scopeId","data-v-739da468"]]),H=Object.freeze({URL_PATTERN_PASTEBIN:"https://cors-anywhere.herokuapp.com/http://pastebin.com/raw/{externalId}",URL_PATTERN_GITHUBGIST:"https://gist.githubusercontent.com/{externalId}",URL_PATTERN_EXAMPLES:"/gamedata/examples/{externalId}.txt",URL_PATTERN_TUTORIALS:"/gamedata/tutorials/{externalId}.txt",urlGameSpecFromLocHash(o){const e=o.split("_");if(e.length!==3||e[0]!=="#fetchez")return null;let t="";const s=e[2];if(e[1]==="pastebin"){if(t=this.URL_PATTERN_PASTEBIN,!s.match(/^[0-9a-zA-Z]+$/))return null}else if(e[1]==="githubgist"){if(t=this.URL_PATTERN_GITHUBGIST,!s.match(/^[0-9a-zA-Z/\\._-]+$/))return null}else if(e[1]==="example"){if(t=this.URL_PATTERN_EXAMPLES,!s.match(/^[0-9a-zA-Z/\\._-]+$/))return null}else if(e[1]==="tutorial"&&(t=this.URL_PATTERN_TUTORIALS,!s.match(/^[0-9a-zA-Z/\\._-]+$/)))return null;return t?t.replace("{externalId}",s):null},async fetchGameSpec(o){let e="";try{e=await fetch(o)}catch{return null}const t=await e.text(),s=t.split(`
`,3);if(s.length<2)return null;const n=s[0],i=s[1],a=t.split(`
${i}
`,3);if(a.length!==3)return null;const r=a[1],d=a[2];return{urlTileset:n,jsonConf:r,gameCode:d}},getDefaultGameSpecUrl(){return this.URL_PATTERN_EXAMPLES.replace("{externalId}","magician")}});const ue={name:"DevZone",props:{},mounted(){this.$refs.devZone.addEventListener("keydown",this.onKeyDown)},unmounted(){const o=this.$refs.devZone;o&&o.removeEventListener("keydown",this.onKeyDown)},methods:{activateCurrentGameSpec(){this.$emit("updateGameSpec",this.$refs.urlTileset.value,this.$refs.jsonConf.value,this.$refs.gameCode.value)},sendGameSpec(){this.activateCurrentGameSpec()},async fetchGameSpecFromLocHash(){const o=window.location.hash;let e;if(o?e=H.urlGameSpecFromLocHash(o):e=H.getDefaultGameSpecUrl(),e===null)console.log("Le hash de l'url ne correspond pas à un lien vers une définition de jeu.");else{const t=await H.fetchGameSpec(e);t===null?console.log("Le texte récupéré ne correspond pas à une définition de jeu."):(this.$refs.urlTileset.value=t.urlTileset,this.$refs.jsonConf.value=t.jsonConf,this.$refs.gameCode.value=t.gameCode,this.activateCurrentGameSpec())}},onKeyDown(o){o.ctrlKey&&o.key==="Enter"&&(this.activateCurrentGameSpec(),o.preventDefault())}}},ge={ref:"devZone",class:"dev-zone"},pe={class:"dev-field-url"},ye={ref:"urlTileset",type:"text"},be={class:"dev-field-json"},Te={ref:"jsonConf",spellcheck:"false"},ve={class:"dev-field-python"},ke={ref:"gameCode",spellcheck:"false"};function we(o,e,t,s,n,i){return f(),_("div",ge,[l("div",pe,[e[1]||(e[1]=le(" Url de l'image :  ",-1)),l("input",ye,null,512),l("button",{onClick:e[0]||(e[0]=(...a)=>i.sendGameSpec&&i.sendGameSpec(...a))}," Exécuter ▶ ")]),e[2]||(e[2]=l("div",{class:"dev-field-label"}," Config du jeu (en JSON) : ",-1)),l("div",be,[l("textarea",Te,null,512)]),e[3]||(e[3]=l("div",{class:"dev-field-label"}," Le code du jeu (en python) : ",-1)),l("div",ve,[l("textarea",ke,null,512)])],512)}const Ce=M(ue,[["render",we],["__scopeId","data-v-533c27ae"]]);const xe={name:"ProgressIndicator",props:{},data(){return{nbMainTasks:3,nbMainTasksDone:0,message:"Initialisation de l'initialiseur.",showSubTask:!1,nbSubTaskStep:0}},mounted(){},methods:{setNbMainTasks(o){this.nbMainTasks=o},advanceToNextMainTask(o,e){this.nbMainTasksDone<this.nbMainTasks&&(this.nbMainTasksDone+=1),this.message=o,this.nbSubTaskStep=0,this.showSubTask=e===!0},setSubTaskProgress(o){const e=Math.floor(o/2);this.nbSubTaskStep!=e&&(this.nbSubTaskStep=e)},clearProgress(){this.nbMainTasksDone=0,this.message=""}}},Se={class:"progress-indicator"},Ie={class:"main-progress"},je={key:0,class:"subtask-container"},Pe={key:1,class:"subtask-disabled"};function Ne(o,e,t,s,n,i){return f(),_("div",Se,[l("div",null,[e[2]||(e[2]=de('<div class="sk-cube-grid" data-v-b6245370><div class="sk-cube sk-cube1" data-v-b6245370></div><div class="sk-cube sk-cube2" data-v-b6245370></div><div class="sk-cube sk-cube3" data-v-b6245370></div><div class="sk-cube sk-cube4" data-v-b6245370></div><div class="sk-cube sk-cube5" data-v-b6245370></div><div class="sk-cube sk-cube6" data-v-b6245370></div><div class="sk-cube sk-cube7" data-v-b6245370></div><div class="sk-cube sk-cube8" data-v-b6245370></div><div class="sk-cube sk-cube9" data-v-b6245370></div></div> Please wait / Veuillez patienter... ',2)),l("div",Ie,[e[0]||(e[0]=l("span",null,"[",-1)),(f(!0),_(E,null,G(n.nbMainTasksDone,a=>(f(),_("span",{key:a}," * "))),128)),(f(!0),_(E,null,G(n.nbMainTasks-n.nbMainTasksDone,a=>(f(),_("span",{key:a}," . "))),128)),e[1]||(e[1]=l("span",null,"]",-1))]),l("div",null,ne(n.message),1),n.showSubTask?(f(),_("div",je,[(f(!0),_(E,null,G(n.nbSubTaskStep,a=>(f(),_("span",{key:a,class:"subtask-step"}))),128))])):(f(),_("div",Pe))])])}const Ee=M(xe,[["render",Ne],["__scopeId","data-v-b6245370"]]);class Oe{constructor(e,t){this.timeStepImposting=500,this.progressIndicator=e,this.isTaskImposted=!1,this.isImposting=!1,this.intervalId=null,this.imposterRatio=2,this.subTaskStartDate=null,this.stepSize=1,this.impostedCurrent=0,this.impostedTotal=1,this.progressIndicator.setNbMainTasks(t)}advanceToNextMainTask(e,t,s){this.progressIndicator.advanceToNextMainTask(e,t),this.isTaskImposted=s,console.log("Progress task",e,performance.now()),this.isTaskImposted?this.subTaskStartDate=performance.now():this.subTaskStartDate=null,this.impostedCurrent=0,this.impostedTotal=1,this.isImposting=!1,this.intervalId!==null&&(clearInterval(this.intervalId),this.intervalId=null)}onSubTaskProgress(e,t){if(this.impostedCurrent=e,this.impostedTotal=t,this.isTaskImposted&&(this.impostedTotal=t*this.imposterRatio,e>0&&e==t)){const n=performance.now()+1,i=e/(n-this.subTaskStartDate);this.stepSize=Math.floor(this.timeStepImposting*i),this.stepSize==0&&(this.stepSize=1),console.log("stepSize.",this.stepSize),this.isImposting=!0,this.intervalId=setInterval(()=>{this.impostedSubTaskProgress()},this.timeStepImposting)}const s=Math.floor(this.impostedCurrent/this.impostedTotal*100);this.progressIndicator.setSubTaskProgress(s)}impostedSubTaskProgress(){this.impostedCurrent+=this.stepSize,this.impostedCurrent>=this.impostedTotal&&(this.impostedCurrent=this.impostedTotal,this.isImposting=!1,this.intervalId!==null&&(clearInterval(this.intervalId),this.intervalId=null));const e=Math.floor(this.impostedCurrent/this.impostedTotal*100);this.progressIndicator.setSubTaskProgress(e)}clearProgress(){this.progressIndicator.clearProgress(),this.isTaskImposted=!1,this.impostedCurrent=0,this.impostedTotal=1,this.isImposting=!1,this.intervalId!==null&&(clearInterval(this.intervalId),this.intervalId=null)}}const Fe=`import js
import sys

# Technique pour rediriger les prints. Emprunté à Brython, mais ça marche aussi avec pyodide.
# https://stackoverflow.com/questions/61348313/how-can-i-redirect-all-brython-output-to-a-textarea-element
class MyOutput:
    def __init__(self):
        # https://pyodide.readthedocs.io/en/latest/using_pyodide_from_javascript.html
        self.python_console = js.document.getElementById("pythonConsole")

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
`,De=`import js
import sys


# Technique pour rediriger les prints. Emprunté à Brython, mais ça marche aussi avec pyodide.
# https://stackoverflow.com/questions/61348313/how-can-i-redirect-all-brython-output-to-a-textarea-element
class MyOutput:
    def __init__(self):
        # https://pyodide.readthedocs.io/en/latest/using_pyodide_from_javascript.html
        self.python_console = js.document.getElementById("pythonConsole")

    def write(self, text):
        self.python_console.textContent += text
        self.python_console.scrollTop = self.python_console.scrollHeight

sys.stdout = MyOutput()


class Direction():
    def __init__(self, int_dir, str_dir, vector):
        self.int_dir = int_dir
        self.str_dir = str_dir
        self.vector = vector
        self.turned_cw = [None] * 8
        self.turned_ccw = [None] * 8

    def set_turned(self, turned_cw):
        # Cette fonction est censée être appelée uniquement par la classe Directions.
        self.turned_cw = turned_cw
        self.turned_ccw = [self.turned_cw[0]] + self.turned_cw[:0:-1]
        self.opposite = self.turned_cw[4]

    def turn_cw(self, n=2):
        return self.turned_cw[n % 8]

    def turn_ccw(self, n=2):
        return self.turned_ccw[n % 8]

    def __eq__(self, other):
        return self.int_dir == other.int_dir

    def __int__(self):
        return self.int_dir

    def __repr__(self):
        return self.str_dir


class Directions():
    def __init__(self):
        self.Up = Direction(0, "up", (0, -1))
        self.UpRight = Direction(1, "up_right", (+1, -1))
        self.Right = Direction(2, "right", (+1, 0))
        self.DownRight = Direction(3, "down_right", (+1, +1))
        self.Down = Direction(4, "down", (0, +1))
        self.DownLeft = Direction(5, "down_left", (-1, +1))
        self.Left = Direction(6, "left", (-1, 0))
        self.UpLeft = Direction(7, "up_left", (-1, -1))
        self.as_list = [
            self.Up, self.UpRight, self.Right, self.DownRight,
            self.Down, self.DownLeft, self.Left, self.UpLeft,
        ]
        turns = list(self.as_list)
        for direc in self.as_list:
            direc.set_turned(turns)
            turns = turns[1:] + turns[:1]

dirs = Directions()


class Coord:

    def __init__(self, x=None, y=None, coord=None):
        if coord is not None:
            self.x = coord.x
            self.y = coord.y
        else:
            self.x = x
            self.y = y
        if self.x is None or self.y is None:
            raise ValueError("Coord must be initialized with x and y or coord.")

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))

    def __repr__(self):
        return f"<Coord {self.x}, {self.y} >"

    def clone(self):
        return Coord(coord=self)

    def move_dir(self, direction, dist=1):
        mov_x, mov_y = direction.vector
        self.x += mov_x * dist
        self.y += mov_y * dist
        # C'est étrange de renvoyer self, mais ça permet de chaîner les actions.
        # Par exemple: my_coord.clone().move_dir(...)
        return self

    def move_by_vect(self, vector=None, x=None, y=None):
        if vector is not None:
            self.x += vector.x
            self.y += vector.y
        if x is not None:
            self.x += x
        if y is not None:
            self.y += y
        return self


class Rect:

    def __init__(self, x, y, w, h):
        self.x = x
        self.y = y
        self.w = w
        self.h = h

    def in_bounds(self, coord):
        if not (self.x <= coord.x < self.x+self.w):
            return False
        if not (self.y <= coord.y < self.y+self.h):
            return False
        return True

    def on_border(self, coord):
        if not self.in_bounds(coord):
            return False
        if coord.x == self.x:return True
        if coord.y == self.y:return True
        if coord.x == self.x + self.w - 1:return True
        if coord.y == self.y + self.h - 1:return True
        return False

    def __repr__(self):
        return f"<Rect {self.x}, {self.y}, {self.w}, {self.h} >"


class TransitionSteps():
    """
    La variable field_name peut être "coord" ou "sprite_name"
    Ensuite, on indique une liste de tuples (delay, valeur).
    Pour indiquer une callback, il faut mettre un objet squarity.Callback
    """
    def __init__(self, field_name, steps):
        self.field_name = field_name
        self.steps = steps


class PlayerLockTransi():
    NO_LOCK = 0
    INVISIBLE = 1
    LOCK = 2


class GameObjectBase():
    def __init__(self):
        self._go_id = id(self)


class GameObject(GameObjectBase):

    def __init__(
            self,
            coord,
            sprite_name,
            layer_owner=None,
            image_modifier=None,
            back_caller=None,
        ):
        """
        Les deux composants image_modifier et back_caller doivent être ajoutés dès le départ.
        Si on les crée après le __init__, ce n'est pas pris en compte par le moteur du jeu.
        C'est pour optimiser les vérifs et les traitements.
        Si vous voulez un game object avec un image_modifier alors qu'il n'en n'a pas au départ,
        il n'y a pas d'autres solutions que de détruire-recréer ce game object. C'est comme ça.
        """
        super().__init__()
        self._coord = Coord(coord=coord)
        self.sprite_name = sprite_name
        self.layer_owner = layer_owner
        self.image_modifier = image_modifier
        self.back_caller = back_caller
        self.plock_transi = PlayerLockTransi.NO_LOCK

        # FUTURE: pour plus tard.
        # self.visible = True
        # FUTURE: on gérera les autres transfo plus tard (rotation, opacity, ...).
        # self.angle = 0.0
        # self.opacity = 1.0
        # Not sure if we will implement the color_factor.
        # self.color_factor = (1.0, 1.0, 1.0)

        self._transitioner = None
        self._transitions_to_record = []
        self._must_clear_transitions = False
        self._transition_delay = None
        self._callback_end_transi = None
        self._one_shot_transition_delay = None
        self._one_shot_callback = None

    def get_coord(self):
        return Coord(coord=self._coord)

    def __str__(self):
        return f"<Gobj ({self._coord.x},{self._coord.y}) {self.sprite_name}>"

    # FUTURE : gérer une valeur de speed. transition = speed * distance à parcourir.
    # FUTURE: message d'erreur plus explicite quand on déplace un objet en dehors du jeu.
    # ou pas, car ça nécessite des vérifs qui vont faire ralentir...

    def move_to_xy(self, x, y, transition_delay=None, callback=None):
        if self.layer_owner is not None:
            self.layer_owner.move_game_object_xy(self, self._coord.x, self._coord.y, x, y)
        self._coord.x = x
        self._coord.y = y
        self._one_shot_transition_delay = transition_delay
        self._one_shot_callback = callback

    def move_to(self, dest_coord, transition_delay=None, callback=None):
        # Code dupliqué avec le code de move_to_xy.
        # Je ne factorise pas, car ces deux fonctions vont être beaucoup utilisées.
        # (y compris par le javascript). Ça permet d'optimiser un peu
        # les performances, en évitant d'avoir une fonction qui appelle l'autre.
        if self.layer_owner is not None:
            self.layer_owner.move_game_object(self, self._coord, dest_coord)
        self._coord.x = dest_coord.x
        self._coord.y = dest_coord.y
        self._one_shot_transition_delay = transition_delay
        self._one_shot_callback = callback

    def move(self, vector, transition_delay=None, callback=None):
        dest_x = self._coord.x + vector.x
        dest_y = self._coord.y + vector.y
        self.move_to_xy(dest_x, dest_y, transition_delay, callback)

    def move_dir(self, direction, distance=1, transition_delay=None, callback=None):
        unary_vect_x, unary_vect_y = direction.vector
        dest_x = self._coord.x + unary_vect_x * distance
        dest_y = self._coord.y + unary_vect_y * distance
        self.move_to_xy(dest_x, dest_y, transition_delay, callback)

    def add_transition(self, transition):
        """
        Le paramètre transition peut être une instance de Callback,
        ou une instance de TransitionSteps.
        """
        # Au fur et à mesure qu'on applique ces transitions, il faut modifier les valeurs dans le jeu.
        # Ça veut dire que c'est le javascript qui appelle la fonction move_to_xy du game_object,
        # qui change le sprite_name, et éventuellement d'autres trucs.
        # (On applique les valeurs d'une transition lorsqu'on la démarre)
        self._transitions_to_record.append(transition)

    def clear_transitions_to_record(self):
        self._transitions_to_record[:] = []

    def clear_all_transitions(self):
        self._must_clear_transitions = True

    def ack_cleared_all_transitions(self):
        # Cette fonction est appelée par le moteur Squarity.
        self._must_clear_transitions = False

    def get_nb_undone_transitions(self):
        if self._transitioner is None:
            return 0
        else:
            return self._transitioner.getNbUndoneTransitions()

    def set_callback_end_transi(self, callback_end_transi):
        self._callback_end_transi = callback_end_transi

    def set_transition_delay(self, transition_delay):
        self._transition_delay = transition_delay

    def reset_one_shot_transition_delay(self):
        # Cette fonction est appelée par le moteur Squarity.
        self._one_shot_transition_delay = None

    def reset_one_shot_callback(self):
        # Cette fonction est appelée par le moteur Squarity.
        self._one_shot_callback = None


class ComponentImageModifier():

    default_tile_size = 32

    def set_default_tile_size(tile_size):
        ComponentImageModifier.default_tile_size = tile_size

    def __init__(
        self,
        img_offset_x=0, img_offset_y=0,
        img_size_x=None, img_size_y=None,
        area_offset_x=0.0, area_offset_y=0.0,
        area_scale_x=1.0, area_scale_y=1.0,
    ):
        self.img_offset_x = img_offset_x
        self.img_offset_y = img_offset_y
        if img_size_x is None:
            self.img_size_x = ComponentImageModifier.default_tile_size
        else:
            self.img_size_x = img_size_x
        if img_size_y is None:
            self.img_size_y = ComponentImageModifier.default_tile_size
        else:
            self.img_size_y = img_size_y
        self.area_offset_x = area_offset_x
        self.area_offset_y = area_offset_y
        self.area_scale_x = area_scale_x
        self.area_scale_y = area_scale_y
        self._transitions_to_record = []

    def add_transition(self, transition):
        """
        Le paramètre transition doit être une instance de TransitionSteps.
        """
        self._transitions_to_record.append(transition)

    def clear_transitions_to_record(self):
        self._transitions_to_record[:] = []


class ComponentBackCaller():

    def __init__(self):
        # Liste d'objets DelayedCallback
        self._callbacks_to_record = []

    def add_callback(self, delayed_callback):
        self._callbacks_to_record.append(delayed_callback)

    def clear_callbacks_to_record(self):
        self._callbacks_to_record[:] = []


class Tile():

    def __init__(self, layer_owner, coord):
        self.layer_owner = layer_owner
        self._coord = coord
        self.game_objects = []
        # Cette variable contiendra un tuple de 8 éléments, qui sera les tiles adjacentes,
        # diagonales comprises, ordonnées de la même manière que Direction.
        # (en partant du haut et dans le sens des aiguilles d'une montre).
        self.adjacencies = None

    def get_coord(self):
        return Coord(coord=self._coord)


class LayerBase():

    def __init__(self, game_owner):
        self.game_owner = game_owner
        self._l_id = id(self)
        self.visible = True

    def get_game_objects(self, coord):
        raise NotImplementedError

    def iter_all_game_objects(self):
        """
        The order is not guaranteed.
        """
        raise NotImplementedError

    def add_game_object(self, gobj):
        raise NotImplementedError

    def remove_game_object(self, gobj):
        raise NotImplementedError

    def remove_at_coord(self, coord):
        raise NotImplementedError

    def move_game_object(self, gobj, src_coord, dest_coord):
        """
        You should not directly call this function.
        Just call gobj.move_to, gobj.move_to_xy, gobj.move or gobj.move_dir.
        """
        raise NotImplementedError

    def move_game_object_xy(self, gobj, src_x, src_y, dest_x, dest_y):
        """
        You should not directly call this function.
        Just call gobj.move_to, gobj.move_to_xy, gobj.move or gobj.move_dir.
        """
        raise NotImplementedError


class Layer(LayerBase):

    def __init__(self, game_owner, w, h, show_transitions=True):
        super().__init__(game_owner)
        self.w = w
        self.h = h
        self.show_transitions = show_transitions
        self.tiles = [
            [
                Tile(self, Coord(x, y)) for x in range(w)
            ]
            for y in range(h)
        ]
        for y in range(h):
            for x in range(w):
                self.tiles[y][x].adjacencies = self._make_adjacencies(x, y)

    def _make_adjacencies(self, x, y):
        """
        Returns a tuple of 8 elements containing the adjacent tiles.
        Some of the elements can be None, if the x and y are at a border.
        """
        adjacencies = (
            self.tiles[y - 1][x] if 0 <= y - 1 else None,
            self.tiles[y - 1][x + 1] if 0 <= y - 1 and x + 1 < self.w else None,
            self.tiles[y][x + 1] if x + 1 < self.w else None,
            self.tiles[y + 1][x + 1] if y + 1 < self.h and x + 1 < self.w else None,
            self.tiles[y + 1][x] if y + 1 < self.h else None,
            self.tiles[y + 1][x - 1] if y + 1 < self.h and 0 <= x - 1 else None,
            self.tiles[y][x - 1] if 0 <= x - 1 else None,
            self.tiles[y - 1][x - 1] if 0 <= y - 1 and 0 <= x - 1 else None,
        )
        return adjacencies

    def get_game_objects(self, coord):
        return self.get_tile(coord).game_objects

    def iter_all_game_objects(self):
        for line in self.tiles:
            for tile in line:
                for gobj in tile.game_objects:
                    yield gobj

    def get_tile(self, coord):
        return self.tiles[coord.y][coord.x]

    def get_tile_xy(self, x, y):
        return self.tiles[y][x]

    def add_game_object(self, gobj):
        gobj.layer_owner = self
        tile = self.get_tile(gobj._coord)
        tile.game_objects.append(gobj)

    def remove_game_object(self, gobj):
        gobj.layer_owner = None
        tile = self.get_tile(gobj._coord)
        tile.game_objects.remove(gobj)

    def remove_at_coord(self, coord):
        tile = self.get_tile(coord)
        for gobj in tile.game_objects:
            gobj.layer_owner = None
        tile.game_objects = []

    def move_game_object(self, gobj, src_coord, dest_coord):
        # Cette fonction est appelée par les Game Objects.
        # Il ne faut pas l'appeler directement.
        self.get_tile(src_coord).game_objects.remove(gobj)
        self.get_tile(dest_coord).game_objects.append(gobj)

    def move_game_object_xy(self, gobj, src_x, src_y, dest_x, dest_y):
        # Cette fonction est appelée par les Game Objects.
        # Il ne faut pas l'appeler directement.
        self.get_tile_xy(src_x, src_y).game_objects.remove(gobj)
        self.get_tile_xy(dest_x, dest_y).game_objects.append(gobj)


class LayerSparse(LayerBase):

    def __init__(self, game_owner, w, h, show_transitions=True):
        super().__init__(game_owner)
        self.w = w
        self.h = h
        self.show_transitions = show_transitions
        self.game_objects = []

    def get_game_objects(self, coord):
        return [
            gobj for gobj
            in self.game_objects
            if gobj._coord == coord
        ]

    def iter_all_game_objects(self):
        for gobj in self.game_objects:
            yield gobj

    def add_game_object(self, gobj):
        gobj.layer_owner = self
        self.game_objects.append(gobj)

    def remove_game_object(self, gobj):
        gobj.layer_owner = None
        self.game_objects.remove(gobj)

    def remove_at_coord(self, coord):
        gobj_to_remove = [
            gobj for gobj
            in self.game_objects
            if gobj._coord == coord
        ]
        for gobj in gobj_to_remove:
            gobj.layer_owner = None
            self.game_objects.remove(gobj)

    def move_game_object(self, gobj, src_coord, dest_coord):
        # Les coordonnées ont déjà été modifiées dans le gameObject.
        # On n'a rien à faire pour le LayerSparse lui-même,
        # car il se contente de stocker une liste de gameObject.
        pass

    def move_game_object_xy(self, gobj, src_x, src_y, dest_x, dest_y):
        # Pareil que move_game_object
        pass

class EventResult():

    def __init__(self):
        self.delayed_callbacks = []
        self.plocks_custom = []
        self.punlocks_custom = []

    def add_delayed_callback(self, delayed_callback):
        if not isinstance(delayed_callback, DelayedCallBack):
            raise Exception(
                "delayed_callback must be an instance of DelayedCallBack"
            )
        self.delayed_callbacks.append(delayed_callback)


class DelayedCallBack():

    def __init__(self, delay, callback):
        self.delay = delay
        self.callback = callback


class SequenceableIterator():

    def set_iter_prec(self, iter_prec):
        self.iter_prec = iter_prec

    def __iter__(self):
        return self

    def __next__(self):
        raise NotImplemented


class RectIterator(SequenceableIterator):
    # FUTURE. Itérateur de coordonnées où on avance de 2 en 2, (ou plus),
    #         Itérateur de droite à gauche, par colonnes et non pas par lignes. etc.

    def __init__(self, rect, instanciate_coord=False):
        self.rect = rect
        self.instanciate_coord = instanciate_coord
        self.current_coord = None

    def __next__(self):
        if self.current_coord is None:
            self.current_coord = Coord(self.rect.x, self.rect.y)
        else:
            self.current_coord.x += 1
            if self.current_coord.x >= self.rect.x + self.rect.w:
                self.current_coord.x = self.rect.x
                self.current_coord.y += 1
                if self.current_coord.y >= self.rect.y + self.rect.h:
                    raise StopIteration
        if self.instanciate_coord:
            return Coord(coord=self.current_coord)
        else:
            return self.current_coord


class GameObjectIterator(SequenceableIterator):

    def __init__(self, layers):
        self.layers = layers
        self.current_game_objects = []

    def __next__(self):
        while not self.current_game_objects:
            coord = next(self.iter_prec)
            for layer in self.layers:
                self.current_game_objects.extend(
                    layer.get_game_objects(coord)
                )
        gobj = self.current_game_objects.pop(0)
        return gobj


class GameObjectIteratorGroupByCoords(SequenceableIterator):

    def __init__(self, layers):
        self.layers = layers

    def __next__(self):
        current_game_objects = []
        coord = next(self.iter_prec)
        for layer in self.layers:
            current_game_objects.extend(
                layer.get_game_objects(coord)
            )
        return current_game_objects


class FilterBySpriteName(SequenceableIterator):

    def __init__(self, sprite_names, skip_empty_lists=False):
        self.sprite_names = sprite_names
        self.skip_empty_lists = skip_empty_lists

    def set_iter_prec(self, iter_prec):
        self.iter_prec = iter_prec
        # Un peu bof ce "isinstance". Ça passe...
        self.receive_gobj_lists = isinstance(
            self.iter_prec, GameObjectIteratorGroupByCoords
        )

    def __next__(self):
        if self.receive_gobj_lists:
            while True:
                game_objects = next(self.iter_prec)
                game_objects = [
                    gobj for gobj
                    in game_objects
                    if gobj.sprite_name in self.sprite_names
                ]
                if game_objects or not self.skip_empty_lists:
                    return game_objects
        else:
            while True:
                gobj = next(self.iter_prec)
                if gobj.sprite_name in self.sprite_names:
                    return gobj


class Sequencer():

    def iter_on_rect(rect, instanciate_coord=False):
        return RectIterator(rect, instanciate_coord)

    def gobj_on_layers(layers):
        return GameObjectIterator(layers)

    def gobj_on_layers_by_coords(layers):
        return GameObjectIteratorGroupByCoords(layers)

    def filter_sprites(sprite_names, skip_empty_lists=False):
        return FilterBySpriteName(sprite_names, skip_empty_lists)

    def seq_iter(*sequenceable_iterators):
        for seq_iter_prec, seq_iter in zip(sequenceable_iterators, sequenceable_iterators[1:]):
            seq_iter.set_iter_prec(seq_iter_prec)
        last_seq = sequenceable_iterators[-1]
        for elem in last_seq:
            yield elem

    def seq_first(*sequenceable_iterators):
        for seq_iter_prec, seq_iter in zip(sequenceable_iterators, sequenceable_iterators[1:]):
            seq_iter.set_iter_prec(seq_iter_prec)
        last_seq = sequenceable_iterators[-1]
        for elem in last_seq:
            return elem
        return None

# autres use cases:
# group by coords ? ou alors c'est un paramètre du GameObjectIterator.
# group by coords, mais on envoie aussi les coords ou c'est vide, avec une liste vide dedans.
# différents ordre de parcours pour les coordonnées (par colonnes, de bas en haut, de droite à gauche, ...)
# les cases deux par deux, genre les cases noires d'un échiquier.

# Par exemple, pour la gravité.
# Pour chaque colonne (itération normale avec un range)
# on fait deux itérateurs de coords décalés, avec un zip. Le premier (case de destination) itère sur les coords,
# le second (case de source) itère sur les objets par groupe.
# À chaque itération, on déplace les objets. On breake quand on rencontre un truc qui arrête la gravité, genre un mur non déplaçable.
# Ou alors, on itère sur toute la colonne, et on garde un petit booléen pour dire si ça tombe ou pas.
# Selon qu'on trouve une case vide, une case avec un objet tombable, ou une case avec un mur, on change le booléen.

# Est-ce qu'on peut faire un flood fill, basé sur certaines conditions de propagation ?
# C'est plus compliqué. Le flood fill, on peut pas le faire avec des enchaînements d'itérateurs.
# C'est un itérateur en entier avec tout dedans.


class GameModelBase():

    def __init__(self, w, h, tile_size, str_game_conf_json):
        self.w = w
        self.h = h
        self.str_game_conf_json = str_game_conf_json
        self.rect = Rect(0, 0, self.w, self.h)
        self.layers = []
        self.layer_main = Layer(self, w, h)
        self.layers.append(self.layer_main)
        ComponentImageModifier.set_default_tile_size(tile_size)
        # Par défaut: 200 ms de transition lorsqu'on déplace un objet.
        self.transition_delay = 200

    def get_first_gobj(self, coord=None, sprite_names=None, layer=None):
        if coord is None:
            coord_iterator = Sequencer.iter_on_rect(self.rect)
        elif isinstance(coord, Coord):
            coord_iterator = iter([coord])
        elif isinstance(coord, Rect):
            coord_iterator = Sequencer.iter_on_rect(coord)
        else:
            coord_iterator = coord

        if layer is None:
            layers = self.layers
        else:
            layers = [layer]

        iterators = [coord_iterator, Sequencer.gobj_on_layers(layers)]
        if sprite_names is not None:
            iterators.append(Sequencer.filter_sprites(sprite_names))
        return Sequencer.seq_first(*iterators)

    def on_start(self):
        pass

    def on_click(self, coord):
        pass

    def on_button_direction(self, direction):
        """
        Utilisez direction.vector pour avoir le tuple (dx, dy) du bouton de direction.
        """
        pass

    def on_button_action(self, action_name):
        pass

`,g={Up:0,UpRight:1,Right:2,DownRight:3,Down:4,DownLeft:5,Left:6,UpLeft:7},y={NoLock:0,Invisible:1,Lock:2};function T(o){return typeof o>"u"}const Le=["U","R","D","L","action_1","action_2"],J=32,Z=20,K=14;class Ae{constructor(e,t,s,n,i,a){this.version="1.0.0",this.python_console=e,this.pyodide=t,this.onAfterGameEvent=s,this.game_canvas=n,this.canvas_buffer=i,this.ctx_canvas=this.game_canvas.getContext("2d"),this.ctx_canvas_buffer=this.canvas_buffer.getContext("2d"),this.ctx_canvas_buffer.fillStyle="#000000",this.ctx_canvas_buffer.imageSmoothingEnabled=!1,this.eventNameFromJsDir=new Map,this.eventNameFromJsDir.set(g.Up,"U"),this.eventNameFromJsDir.set(g.Right,"R"),this.eventNameFromJsDir.set(g.Down,"D"),this.eventNameFromJsDir.set(g.Left,"L"),this.delayed_actions=[],this.has_click_handling=!1,this.configGameSizes(J,Z,K),this.runPython(a,"Interprétation de la lib python squarity")}isPlayerLocked(){return this.player_locks.length!==0}getPlock(){return this.isPlayerLocked()?y.Lock:y.NoLock}getRatioFromWidthToHeight(){return this.ratioFromWidthToHeight}updateGameSpec(e,t,s){let n=J,i=Z,a=K;if("tile_size"in t&&(n=t.tile_size),"game_area"in t){const r=t.game_area;"nb_tile_width"in r&&(i=r.nb_tile_width),"w"in r&&(i=r.w),"nb_tile_height"in r&&(a=r.nb_tile_height),"h"in r&&(a=r.h)}this.configGameSizes(n,i,a),this.img_coords=t.img_coords,this.tile_atlas=e;for(let r of this.delayed_actions)clearTimeout(r);this.player_locks=[],this.delayed_actions=[],this.runPython(s,"Interprétation du gameCode."),this.runPython("game_model = GameModel()","Instanciation du GameModel"),this.has_click_handling=this.runPython('hasattr(game_model, "on_click")',"Vérification de la présence de on_click")}execStartCode(){this.updateFromPythonData(!0)}onButtonDirection(e){if(this.isPlayerLocked())return;const t=this.eventNameFromJsDir.get(e);this.sendGameEvent(t)}onButtonAction(e){this.isPlayerLocked()||this.sendGameEvent(e)}sendGameEvent(e){if(this.isPlayerLocked()&&Le.includes(e))return;const t=this.runPython(`game_model.on_game_event("${e}")`,`Exécution d'un événement ${e}`);let s=!0;T(t)||(s=this.processGameEventResult(t)),this.updateFromPythonData(s),this.onAfterGameEvent()}onGameClick(e){if(!this.has_click_handling||this.isPlayerLocked())return;const t=this.game_canvas.getBoundingClientRect(),s=Math.floor(e.offsetX*this.nb_tile_width/t.width),n=Math.floor(e.offsetY*this.nb_tile_height/t.height);if(!(s>=0&&s<this.nb_tile_width&&n>=0&&n<this.nb_tile_height))return;const i=this.runPython(`game_model.on_click(${s}, ${n})`,`Exécution de on_click sur (${s}, ${s})`);let a=!0;T(i)||(a=this.processGameEventResult(i)),this.updateFromPythonData(a),this.onAfterGameEvent()}updateFromPythonData(e){if(!e)return;this.ctx_canvas_buffer.fillRect(0,0,this.game_canvas.width,this.game_canvas.height);let t=0,s=0;const n=this.runPython("game_model.export_all_tiles()","Récupération des tiles pour les dessiner");for(let i=0;i<this.nb_tile_height;i+=1){for(let a=0;a<this.nb_tile_width;a+=1){const r=n[i][a];for(let d=0;d<r.length;d+=1){const h=r[d],[m,b]=this.img_coords[h];this.ctx_canvas_buffer.drawImage(this.tile_atlas,m,b,this.tile_img_width,this.tile_img_height,t,s,this.tile_canvas_width,this.tile_canvas_height)}t+=this.tile_canvas_width}t=0,s+=this.tile_canvas_height}this.ctx_canvas.drawImage(this.canvas_buffer,0,0)}runPython(e,t){let s=null;try{s=this.pyodide.runPython(e)}catch(n){const i=n.message;throw this.printGameConsole(`Erreur python durant l'action : 
${t}
${i}`),n}return s}configGameSizes(e,t,s){this.tile_canvas_width=e,this.tile_canvas_height=e,this.tile_img_width=e,this.tile_img_height=e,this.nb_tile_width=t,this.nb_tile_height=s;const n=this.nb_tile_width*this.tile_canvas_width,i=this.nb_tile_height*this.tile_canvas_height;this.ratioFromWidthToHeight=i/n,this.game_canvas.width=n,this.game_canvas.height=i,this.canvas_buffer.width=n,this.canvas_buffer.height=i}printGameConsole(e){const t=this.python_console;t.textContent+=e,t.scrollTop=t.scrollHeight}processDelayedAction(e,t){this.delayed_actions=this.delayed_actions.filter(s=>s!==e),this.sendGameEvent(t)}processGameEventResult(e){let t=!0;const s=JSON.parse(e);if("delayed_actions"in s)for(let n of s.delayed_actions){let i=500;if("delay_ms"in n&&(i=n.delay_ms),"name"in n){const a=setTimeout(()=>{this.processDelayedAction(a,n.name)},i);this.delayed_actions.push(a)}}if("player_locks"in s)for(let n of s.player_locks)this.player_locks.includes(n)||this.player_locks.push(n);if("player_unlocks"in s)for(let n of s.player_unlocks)n==="*"?this.player_locks=[]:this.player_locks=this.player_locks.filter(i=>i!==n);return"redraw"in s&&(t=s.redraw!==0),t}}class C{constructor(){this.hasAnyTransition=!1,this.addedTransitions=!1,this.PlockTransi=y.NoLock,this.callbackInsideTransi=[],this.callbackEndTransi=[]}merge(e){this.hasAnyTransition|=e.hasAnyTransition,this.addedTransitions|=e.addedTransitions,this.PlockTransi<e.PlockTransi&&(this.PlockTransi=e.PlockTransi),this.callbackInsideTransi.push.apply(this.callbackInsideTransi,e.callbackInsideTransi),this.callbackEndTransi.push.apply(this.callbackEndTransi,e.callbackEndTransi)}}class ie{constructor(e,t){this.timeStart=e,this.isAppliedInGame=t,this.linkedTransition=null}setLinkedTransition(e){this.linkedTransition=e}getCurrentVal(e){}getFinalVal(){}isTimeEnded(){}getTimeEnd(){}}class Q extends ie{constructor(e,t,s,n,i){super(e,i),this.timeEnd=t,this.valStart=s,this.valEnd=n,this.valRange=n-s,this.timeRange=t-e}isTimeEnded(e){return e>=this.timeEnd}getCurrentVal(e){return e<this.timeStart?this.valStart:e>=this.timeEnd?this.valEnd:this.valStart+this.valRange*(e-this.timeStart)/this.timeRange}getFinalVal(){return this.valEnd}getTimeEnd(){return this.timeEnd}}class Y extends ie{constructor(e,t,s){super(e,s),this.val=t}isTimeEnded(e){return e>=this.timeStart}getCurrentVal(e){return this.val}getFinalVal(){return this.val}getTimeEnd(){return this.timeStart}}const u={NO_TRANSITIONS:0,JUST_ENDED_ALL_TRANSITIONS:1,HAS_TRANSITIONS:2};function O(o,e){return o==u.HAS_TRANSITIONS||e==u.HAS_TRANSITIONS?u.HAS_TRANSITIONS:o==u.JUST_ENDED_ALL_TRANSITIONS||e==u.JUST_ENDED_ALL_TRANSITIONS?u.JUST_ENDED_ALL_TRANSITIONS:u.NO_TRANSITIONS}class p{constructor(e,t,s,n){this.pythonFieldName=e,this.getValFromPython=t,this.setValToPython=s,this.useTransitionProgressive=n,this.fieldValue=this.getValFromPython(),this.fieldValueNext=this.fieldValue,this.fieldValueFinal=this.fieldValue,this.stateTransitioners=[],this.doingATransition=!1}addTransitionFromNewState(e,t){const s=this.getValFromPython();if(this.fieldValueFinal!=s&&this.fieldValueNext!=s){let n=null;return this.useTransitionProgressive?n=new Q(t,t+e,this.fieldValueFinal,s,!0):n=new Y(t+e,s,!0),this.fieldValueFinal=s,this.stateTransitioners.push(n),this.stateTransitioners.sort((i,a)=>i.timeStart-a.timeStart),!0}else return!1}addTransitionsFromRecords(e,t){let s=e;for(let n of t){let[i,a]=n,r=null;this.useTransitionProgressive?r=new Q(s,s+i,this.fieldValueFinal,a,!1):r=new Y(s+i,a,!1),this.stateTransitioners.push(r),this.fieldValueFinal=a,s+=i}return this.stateTransitioners.sort((n,i)=>n.timeStart-i.timeStart),s}updateState(e){if(this.stateTransitioners.length){const t=this.stateTransitioners[0];this.fieldValue=t.getCurrentVal(e)}}updateTransitions(e){let t=u.NO_TRANSITIONS;if(this.stateTransitioners.length){t=u.HAS_TRANSITIONS;const s=this.stateTransitioners[0];!this.doingATransition&&e>=s.timeStart&&(this.fieldValueNext=s.getFinalVal(),this.doingATransition=!0,s.isAppliedInGame||(this.setValToPython(this.fieldValueNext),s.isAppliedInGame=!0)),s.isTimeEnded(e)&&(this.fieldValue=this.fieldValueNext,this.stateTransitioners.shift(),this.stateTransitioners.length||(t=u.JUST_ENDED_ALL_TRANSITIONS),this.doingATransition=!1)}return t}getTimeEnd(){return this.stateTransitioners.slice(-1)[0].getTimeEnd()}clearAllTransitions(){this.stateTransitioners=[],this.doingATransition=!1,this.fieldValue=this.getValFromPython(),this.fieldValueFinal=this.fieldValue}}class Re{constructor(e,t){this.gameObject=e,this.timeEndTransitions=t,this.pythonComponent=this.gameObject.image_modifier,this.transiFields=new Map;const s=this.getValFromPythonAOX.bind(this),n=this.setValToPythonAOX.bind(this);this.areaOffsetX=new p("area_offset_x",s,n,!0);const i=this.getValFromPythonAOY.bind(this),a=this.setValToPythonAOY.bind(this);this.areaOffsetY=new p("area_offset_y",i,a,!0);const r=this.getValFromPythonASX.bind(this),d=this.setValToPythonASX.bind(this);this.areaScaleX=new p("area_scale_x",r,d,!0);const h=this.getValFromPythonASY.bind(this),m=this.setValToPythonASY.bind(this);this.areaScaleY=new p("area_scale_y",h,m,!0),this.transiFields.set("area_offset_x",this.areaOffsetX),this.transiFields.set("area_offset_y",this.areaOffsetY),this.transiFields.set("area_scale_x",this.areaScaleX),this.transiFields.set("area_scale_y",this.areaScaleY);const b=this.getValFromPythonIOX.bind(this),c=this.setValToPythonIOX.bind(this);this.imgOffsetX=new p("img_offset_x",b,c,!0);const x=this.getValFromPythonIOY.bind(this),P=this.setValToPythonIOY.bind(this);this.imgOffsetY=new p("img_offset_y",x,P,!0);const N=this.getValFromPythonISX.bind(this),S=this.setValToPythonISX.bind(this);this.imgSizeX=new p("img_size_x",N,S,!0);const I=this.getValFromPythonISY.bind(this),B=this.setValToPythonISY.bind(this);this.imgSizeY=new p("img_size_y",I,B,!0),this.transiFields.set("img_offset_x",this.imgOffsetX),this.transiFields.set("img_offset_y",this.imgOffsetY),this.transiFields.set("img_size_x",this.imgSizeX),this.transiFields.set("img_size_y",this.imgSizeY)}addTransitionsFromNewState(e,t){let s=!1;for(let n of this.transiFields.values())n.addTransitionFromNewState(e,t)&&(s=!0);return s&&(this.timeEndTransitions=t+e),s}addTransitionsFromRecords(e){if(!this.pythonComponent._transitions_to_record.length)return!1;for(let t of this.pythonComponent._transitions_to_record){const n=this.transiFields.get(t.field_name).addTransitionsFromRecords(e,t.steps);this.timeEndTransitions<n&&(this.timeEndTransitions=n)}return this.pythonComponent.clear_transitions_to_record(),!0}updateState(e){for(let t of this.transiFields.values())t.updateState(e)}updateTransitions(e){let t=u.NO_TRANSITIONS;for(let s of this.transiFields.values()){const n=s.updateTransitions(e);t=O(t,n)}return t}clearAllTransitions(e){for(let t of this.transiFields.values())t.clearAllTransitions();this.timeEndTransitions=e}getNbUndoneTransitions(){let e=0;for(let t of this.transiFields.values())e+=t.stateTransitioners.length;return e}getValFromPythonAOX(){return this.pythonComponent.area_offset_x}setValToPythonAOX(e){Reflect.set(this.pythonComponent,"area_offset_x",e)}getValFromPythonAOY(){return this.pythonComponent.area_offset_y}setValToPythonAOY(e){Reflect.set(this.pythonComponent,"area_offset_y",e)}getValFromPythonASX(){return this.pythonComponent.area_scale_x}setValToPythonASX(e){Reflect.set(this.pythonComponent,"area_scale_x",e)}getValFromPythonASY(){return this.pythonComponent.area_scale_y}setValToPythonASY(e){Reflect.set(this.pythonComponent,"area_scale_y",e)}getValFromPythonIOX(){return this.pythonComponent.img_offset_x}setValToPythonIOX(e){Reflect.set(this.pythonComponent,"img_offset_x",e)}getValFromPythonIOY(){return this.pythonComponent.img_offset_y}setValToPythonIOY(e){Reflect.set(this.pythonComponent,"img_offset_y",e)}getValFromPythonISX(){return this.pythonComponent.img_size_x}setValToPythonISX(e){Reflect.set(this.pythonComponent,"img_size_x",e)}getValFromPythonISY(){return this.pythonComponent.img_size_y}setValToPythonISY(e){Reflect.set(this.pythonComponent,"img_size_y",e)}}class Ge{constructor(e,t){this.gameObject=e,this.timeEndTransitions=t;const s=this.getValFromPythonCoordX.bind(this),n=this.setValToPythonCoordX.bind(this);this.coordX=new p("coord.x",s,n,!0);const i=this.getValFromPythonCoordY.bind(this),a=this.setValToPythonCoordY.bind(this);this.coordY=new p("coord.y",i,a,!0);const r=this.getValFromPythonSpriteName.bind(this),d=this.setValToPythonSpriteName.bind(this);this.spriteName=new p("sprite_name",r,d,!1),this.pythonCoordXToSet=null}addTransitionsFromNewState(e,t){const s=this.coordX.addTransitionFromNewState(e,t),n=this.coordY.addTransitionFromNewState(e,t),i=this.spriteName.addTransitionFromNewState(0,t),a=s||n||i;return a&&(this.timeEndTransitions=t+e),a}addTransitionsFromRecords(e){if(!this.gameObject._transitions_to_record)return!1;for(let t of this.gameObject._transitions_to_record)if(t.field_name==="coord"){let s=[],n=[];for(let a of t.steps){let[r,d]=a;s.push([r,d.x]),n.push([r,d.y])}let i=this.coordX.addTransitionsFromRecords(e,s);this.timeEndTransitions<i&&(this.timeEndTransitions=i),i=this.coordY.addTransitionsFromRecords(e,n),this.timeEndTransitions<i&&(this.timeEndTransitions=i)}else if(t.field_name==="sprite_name"){let s=this.spriteName.addTransitionsFromRecords(e,t.steps);this.timeEndTransitions<s&&(this.timeEndTransitions=s)}return this.gameObject.clear_transitions_to_record(),!0}updateState(e){this.coordX.updateState(e),this.coordY.updateState(e),this.spriteName.updateState(e)}updateTransitions(e){let t=u.NO_TRANSITIONS,s=this.coordX.updateTransitions(e);return t=O(t,s),s=this.coordY.updateTransitions(e),t=O(t,s),s=this.spriteName.updateTransitions(e),t=O(t,s),t}clearAllTransitions(e){this.coordX.clearAllTransitions(),this.coordY.clearAllTransitions(),this.spriteName.clearAllTransitions(),this.timeEndTransitions=e}getNbUndoneTransitions(){return this.coordX.stateTransitioners.length+this.coordY.stateTransitioners.length+this.spriteName.stateTransitioners.length}getValFromPythonCoordX(){return this.gameObject._coord.x}setValToPythonCoordX(e){this.pythonCoordXToSet=e}getValFromPythonCoordY(){return this.gameObject._coord.y}setValToPythonCoordY(e){let t;this.pythonCoordXToSet!==null?(t=this.pythonCoordXToSet,this.pythonCoordXToSet=null):t=this.gameObject._coord.x,this.gameObject.move_to_xy(t,e)}getValFromPythonSpriteName(){return this.gameObject.sprite_name}setValToPythonSpriteName(e){Reflect.set(this.gameObject,"sprite_name",e)}}class Ve{constructor(e,t){this.gameObject=e,this.timeEndTransitions=t,this.plannedCallbacks=[],this.pythonBackCaller=this.gameObject.back_caller,this.hasPythonBackCaller=!T(this.pythonBackCaller)}addTransitionsFromRecords(e){if(!this.hasPythonBackCaller||!this.gameObject.back_caller._callbacks_to_record.length)return!1;for(let n of this.gameObject.back_caller._callbacks_to_record){const i=new Y(e+n.delay,n.callback,!1);this.plannedCallbacks.push(i)}this.plannedCallbacks.sort((n,i)=>n.timeStart-i.timeStart),this.gameObject.back_caller.clear_callbacks_to_record();const s=this.plannedCallbacks.slice(-1)[0].getTimeEnd();return this.timeEndTransitions=s,!0}updateTransitions(e){if(!this.plannedCallbacks.length)return null;const t=this.plannedCallbacks[0];return t.isTimeEnded(e)?(this.plannedCallbacks.shift(),t.getFinalVal()):null}clearAllTransitions(e){this.plannedCallbacks=[],this.timeEndTransitions=e}getNbUndoneTransitions(){return this.plannedCallbacks.length}}class Me{constructor(e,t,s){this.gameModel=e,this.gameObject=t,this.timeEndTransitions=s,this.compGobjBase=new Ge(this.gameObject,s),T(this.gameObject.image_modifier)?this.compImageModifier=null:this.compImageModifier=new Re(this.gameObject,s),this.compBackCaller=new Ve(this.gameObject,s)}clearAllTransitions(e){this.compGobjBase.clearAllTransitions(e),this.compImageModifier!==null&&this.compImageModifier.clearAllTransitions(e),this.compBackCaller.clearAllTransitions(e),this.gameObject.ack_cleared_all_transitions()}addTransitionsFromNewState(e){let t=!1,s=Math.max(e,this.timeEndTransitions);const n=this.getCurrentTransitionDelay();return this.compGobjBase.addTransitionsFromNewState(n,s)&&(this.timeEndTransitions<this.compGobjBase.timeEndTransitions&&(this.timeEndTransitions=this.compGobjBase.timeEndTransitions),t=!0),this.compImageModifier!==null&&this.compImageModifier.addTransitionsFromNewState(n,s)&&(this.timeEndTransitions<this.compImageModifier.timeEndTransitions&&(this.timeEndTransitions=this.compImageModifier.timeEndTransitions),t=!0),t}addTransitionsFromRecords(e){let t=!1,s=Math.max(e,this.timeEndTransitions);return this.compGobjBase.addTransitionsFromRecords(s)&&(this.timeEndTransitions<this.compGobjBase.timeEndTransitions&&(this.timeEndTransitions=this.compGobjBase.timeEndTransitions),t=!0),this.compImageModifier!==null&&this.compImageModifier.addTransitionsFromRecords(s)&&(this.timeEndTransitions<this.compImageModifier.timeEndTransitions&&(this.timeEndTransitions=this.compImageModifier.timeEndTransitions),t=!0),this.compBackCaller.addTransitionsFromRecords(s)&&(this.timeEndTransitions<this.compBackCaller.timeEndTransitions&&(this.timeEndTransitions=this.compBackCaller.timeEndTransitions),t=!0),t}updateTransitions(e){let t=null,s=this.compGobjBase.updateTransitions(e);if(this.compImageModifier!==null){const i=this.compImageModifier.updateTransitions(e);s=O(s,i)}if(s==u.HAS_TRANSITIONS&&(t===null&&(t=new C),t.hasAnyTransition=!0,t.PlockTransi=this.gameObject.plock_transi),s==u.JUST_ENDED_ALL_TRANSITIONS){let i=this.gameObject._one_shot_callback;T(i)?i=this.gameObject._callback_end_transi:this.gameObject.reset_one_shot_callback(),T(i)||(t===null&&(t=new C),t.callbackEndTransi.push(i),t.PlockTransi=this.gameObject.plock_transi)}const n=this.compBackCaller.updateTransitions(e);return n!==null&&(t===null&&(t=new C),t.callbackInsideTransi.push(n)),this.compBackCaller.getNbUndoneTransitions()&&(t===null&&(t=new C),t.hasAnyTransition=!0),t}updateState(e){this.compGobjBase.updateState(e),this.compImageModifier!==null&&this.compImageModifier.updateState(e)}getCurrentTransitionDelay(){let e=this.gameObject._one_shot_transition_delay;return T(e)?(e=this.gameObject._transition_delay,T(e)?this.gameModel.transition_delay:e):(this.gameObject.reset_one_shot_transition_delay(),e)}getNbUndoneTransitions(){let e=this.compGobjBase.getNbUndoneTransitions();return this.compImageModifier!==null&&(e+=this.compImageModifier.getNbUndoneTransitions()),e+=this.compBackCaller.getNbUndoneTransitions(),e}}class oe{constructor(e,t,s){this.x=e,this.y=t,this.gameObj=s}}class ae{constructor(e){this.pythonLayer=e}*iterOnGameObjects(){}}class Be extends ae{constructor(e){super(e)}*iterOnGameObjects(){let e=0,t=0;for(let s of this.pythonLayer.tiles){for(let n of s){for(let i of n.game_objects)yield new oe(e,t,i);e+=1}e=0,t+=1}}}class qe extends ae{constructor(e){super(e)}*iterOnGameObjects(){for(let e of this.pythonLayer.game_objects)yield new oe(e._coord.x,e._coord.y,e)}}const V={CORNER_UPLEFT:0,CENTER:1};class re{constructor(e,t){this.pythonLayer=e,this.gameModel=t,this.pythonLayer.__class__.toString().includes("LayerSparse")?(this.isLayerSparse=!0,this.gameObjectIterator=new qe(this.pythonLayer)):(this.isLayerSparse=!1,this.gameObjectIterator=new Be(this.pythonLayer))}drawOneGameObject(e,t,s,n,i,a,r,d,h){let m,b,c,x;if(i!==null)m=i.x,b=i.y,c=i.gameObj.sprite_name,x=!T(i.gameObj.image_modifier);else{const k=n.compGobjBase;m=k.coordX.fieldValue,b=k.coordY.fieldValue,c=k.spriteName.fieldValue,x=n.compImageModifier!==null}let[P,N,S,I,B,F,D]=s.get(c);if(!x)e.drawImage(t,P,N,S,I,m*d,b*h,d*F,h*D);else{let k,L,q,U;if(i!==null)k=i.gameObj.image_modifier.area_scale_x,L=i.gameObj.image_modifier.area_scale_y,q=i.gameObj.image_modifier.area_offset_x,U=i.gameObj.image_modifier.area_offset_y;else{const w=n.compImageModifier;k=w.areaScaleX.fieldValue,L=w.areaScaleY.fieldValue,q=w.areaOffsetX.fieldValue,U=w.areaOffsetY.fieldValue,P+=w.imgOffsetX.fieldValue,N+=w.imgOffsetY.fieldValue,S=w.imgSizeX.fieldValue,F=S/a,I=w.imgSizeY.fieldValue,D=I/r}let z,X;B==V.CENTER?(z=(1-k*F)/2,X=(1-L*D)/2):(z=0,X=0),e.drawImage(t,P,N,S,I,(m+q+z)*d,(b+U+X)*h,d*k*F,h*L*D)}}updateWithGameSituation(e){}updateTransitions(e){}draw(e){}}class Ue extends re{constructor(e,t,s,n,i,a,r,d,h){super(e,t),this.atlasDefinitions=s,this.ctxCanvasBuffer=n,this.tileAtlas=i,this.tileImgWidth=a,this.tileImgHeight=r,this.tileCanvasWidth=d,this.tileCanvasHeight=h,this.layerMemory=new Map}updateWithGameSituation(e){let t=!1,s=new Set,n=new C;for(let i of this.gameObjectIterator.iterOnGameObjects()){const a=i.gameObj,r=a._go_id;s.add(r);let d,h=!1;this.layerMemory.has(r)?(d=this.layerMemory.get(r),a._must_clear_transitions&&d.clearAllTransitions(e),h=d.addTransitionsFromNewState(e)):(d=new Me(this.gameModel,a,e),this.layerMemory.set(r,d),a._transitioner=d,t=!0),d.addTransitionsFromRecords(e)&&(h=!0),h&&(n.addedTransitions=!0,n.PlockTransi<a.plock_transi&&(n.PlockTransi=a.plock_transi))}if(t||s.size!==this.layerMemory.size){const i=this.layerMemory.keys();for(let a of i)s.has(a)||this.layerMemory.delete(a)}return n}updateTransitions(e){const t=new C;for(let s of this.layerMemory.values()){const n=s.updateTransitions(e);n!==null&&t.merge(n)}return t}draw(e){for(let t of this.layerMemory.values())t.updateState(e),this.drawOneGameObject(this.ctxCanvasBuffer,this.tileAtlas,this.atlasDefinitions,t,null,this.tileImgWidth,this.tileImgHeight,this.tileCanvasWidth,this.tileCanvasHeight)}}class ze extends re{constructor(e,t,s,n,i,a,r,d,h){super(e,t),this.atlasDefinitions=s,this.ctxCanvasBuffer=n,this.tileAtlas=i,this.tileImgWidth=a,this.tileImgHeight=r,this.tileCanvasWidth=d,this.tileCanvasHeight=h}updateWithGameSituation(e){return null}updateTransitions(e){return null}draw(e){for(let t of this.gameObjectIterator.iterOnGameObjects())this.drawOneGameObject(this.ctxCanvasBuffer,this.tileAtlas,this.atlasDefinitions,null,t,this.tileImgWidth,this.tileImgHeight,this.tileCanvasWidth,this.tileCanvasHeight)}}const ee=32,te=20,se=14;class Xe{constructor(e,t,s,n,i,a){this.version="2.1.0",this.pythonConsole=e,this.pyodide=t,this.refreshPlock=s,this.gameCanvas=n,this.canvasBuffer=i,this.ctxCanvas=this.gameCanvas.getContext("2d"),this.ctxCanvasBuffer=this.canvasBuffer.getContext("2d"),this.ctxCanvasBuffer.fillStyle="#000000",this.layers=null,this.mapLayers=new Map,this.orderedLayers=[],this.delayedCallbacks=[],this.hasClickHandling=!1,this.showingTransition=!1,this.plocksCustom=[],this.currentPlock=y.NoLock,this.configGameSizes(ee,te,se),this.pythonDirFromJsDir=new Map,this.pythonDirFromJsDir.set(g.Up,"squarity.dirs.Up"),this.pythonDirFromJsDir.set(g.Right,"squarity.dirs.Right"),this.pythonDirFromJsDir.set(g.Down,"squarity.dirs.Down"),this.pythonDirFromJsDir.set(g.Left,"squarity.dirs.Left"),document.lib_squarity_code=a,this.runPython(`import js
with open("squarity.py", "w", encoding="utf-8") as f:
    f.write(js.document.lib_squarity_code)
import sys
sys.path.append(".")
`,"Création du fichier contenant la lib squarity"),this.gameModel=null,this.ctxCanvas.imageSmoothingEnabled=!1,this.ctxCanvasBuffer.imageSmoothingEnabled=!1}hasPlockChanged(e){let t=y.NoLock;return e==y.Invisible?t=y.Invisible:(this.plocksCustom.length!==0||e===y.Lock)&&(t=y.Lock),this.currentPlock!==t?(this.currentPlock=t,!0):!1}getPlock(){return this.currentPlock}getRatioFromWidthToHeight(){return this.ratioFromWidthToHeight}updateGameSpec(e,t,s){let n=ee,i=te,a=se;if("tile_size"in t&&(n=t.tile_size),"game_area"in t){const r=t.game_area;"nb_tile_width"in r&&(i=r.nb_tile_width),"w"in r&&(i=r.w),"nb_tile_height"in r&&(a=r.nb_tile_height),"h"in r&&(a=r.h)}this.configGameSizes(n,i,a),this.atlasDefinitions=this.computeAtlasDefinitions(t.img_coords,n),this.tileAtlas=e;for(let r of this.delayedCallbacks)clearTimeout(r);this.plocksCustom=[],this.currentPlock=y.NoLock,this.delayedCallbacks=[],this.runPython(s,"Interprétation du gameCode."),document.json_conf=JSON.stringify(t),this.runPython(`game_model = GameModel(${i}, ${a}, ${n}, js.document.json_conf)`,"Instanciation du GameModel"),this.gameModel=this.runPython("game_model","Récupération du game_model"),this.hasClickHandling=this.runPython('hasattr(game_model, "on_click")',"Vérification de la présence de on_click")}computeAtlasDefinitions(e,t){const s=new Map;for(const n of Object.keys(e)){let i=e[n];if(i.length<3&&i.push(t),i.length<4&&i.push(t),i.length<5)i.push(V.CORNER_UPLEFT);else{let m;i[4]=="center"?m=V.CENTER:m=V.CORNER_UPLEFT,i.pop(),i.push(m)}const r=i[2]/this.tileImgWidth;i.push(r);const h=i[3]/this.tileImgHeight;i.push(h),s.set(n,i)}return s}execStartCode(){let e;try{e=this.gameModel.on_start()}catch(t){const s=t.message;this.printGameConsole(`Erreur python durant l'exécution de game_model.on_start
${s}`)}this.afterGameEvent(e)}onButtonDirection(e){if(this.currentPlock)return;const t=this.pythonDirFromJsDir.get(e),s=this.runPython(`game_model.on_button_direction(${t})`,`Événement de bouton de direction ${t}`);this.afterGameEvent(s)}onButtonAction(e){if(this.currentPlock)return;let t;try{t=this.gameModel.on_button_action(e)}catch(s){const n=s.message;throw this.printGameConsole(`Erreur python durant l'exécution de '${e}'.
${n}`),s}this.afterGameEvent(t)}execGameCallback(e){let t;try{t=e()}catch(s){const n=s.message;throw this.printGameConsole(`Erreur python durant l'exécution d'une callback
${n}`),s}this.afterGameEvent(t)}onGameClick(e){if(!this.hasClickHandling||this.currentPlock)return;const t=this.gameCanvas.getBoundingClientRect(),s=Math.floor(e.offsetX*this.nbTileWidth/t.width),n=Math.floor(e.offsetY*this.nbTileHeight/t.height);if(!(s>=0&&s<this.nbTileWidth&&n>=0&&n<this.nbTileHeight))return;const i=this.runPython(`game_model.on_click(squarity.Coord(${s}, ${n}))`,`Exécution de on_click sur (${s}, ${s})`);this.afterGameEvent(i)}updateFromPythonData(e){const t=performance.now();this.orderedLayers=[];for(let n of this.gameModel.layers){const i=n._l_id;if(!this.mapLayers.has(i)){let r;this.ctxCanvasBuffer.imageSmoothingEnabled=!1,n.show_transitions?r=new Ue(n,this.gameModel,this.atlasDefinitions,this.ctxCanvasBuffer,this.tileAtlas,this.tileImgWidth,this.tileImgHeight,this.tileCanvasWidth,this.tileCanvasHeight):r=new ze(n,this.gameModel,this.atlasDefinitions,this.ctxCanvasBuffer,this.tileAtlas,this.tileImgWidth,this.tileImgHeight,this.tileCanvasWidth,this.tileCanvasHeight),this.mapLayers.set(i,r)}const a=this.mapLayers.get(i);this.orderedLayers.push(a)}const s=new C;for(let n of this.orderedLayers){const i=n.updateWithGameSituation(t);i!=null&&s.merge(i)}e&&this.drawCurrentGameBoardState(t),s.addedTransitions&&(this.showingTransition||(window.requestAnimationFrame(()=>{this.updateAndDrawGameBoard()}),this.showingTransition=!0)),this.hasPlockChanged(s.PlockTransi)&&this.refreshPlock()}drawCurrentGameBoardState(e){this.ctxCanvasBuffer.fillRect(0,0,this.gameCanvas.width,this.gameCanvas.height);for(let t of this.orderedLayers)t.draw(e);this.ctxCanvas.drawImage(this.canvasBuffer,0,0)}updateAndDrawGameBoard(){const e=performance.now(),t=new C;for(let s of this.orderedLayers){const n=s.updateTransitions(e);n!==null&&t.merge(n)}this.drawCurrentGameBoardState(e),t.hasAnyTransition?window.requestAnimationFrame(()=>{this.updateAndDrawGameBoard()}):this.showingTransition=!1;for(let s of t.callbackInsideTransi)this.execGameCallback(s);for(let s of t.callbackEndTransi)this.execGameCallback(s);this.hasPlockChanged(t.PlockTransi)&&this.refreshPlock()}runPython(e,t){let s=null;try{s=this.pyodide.runPython(e)}catch(n){const i=n.message;throw this.printGameConsole(`Erreur python durant : 
${t}
${i}`),n}return s}configGameSizes(e,t,s){this.tileCanvasWidth=e,this.tileCanvasHeight=e,this.tileImgWidth=e,this.tileImgHeight=e,this.nbTileWidth=t,this.nbTileHeight=s;const n=this.nbTileWidth*this.tileCanvasWidth,i=this.nbTileHeight*this.tileCanvasHeight;this.ratioFromWidthToHeight=i/n,this.gameCanvas.width=n,this.gameCanvas.height=i,this.canvasBuffer.width=n,this.canvasBuffer.height=i}printGameConsole(e){const t=this.pythonConsole;t.textContent+=e,t.scrollTop=t.scrollHeight}processDelayedCallback(e,t){this.delayedCallbacks=this.delayedCallbacks.filter(s=>s!==e),this.execGameCallback(t)}afterGameEvent(e){let t=!0;T(e)||(t=this.processGameEventResult(e)),this.updateFromPythonData(t)}processGameEventResult(e){let t=!0;for(let s of e.delayed_callbacks){let n=0;if(s.delay&&(n=s.delay),s.callback){const i=setTimeout(()=>{this.processDelayedCallback(i,s.callback)},n);this.delayedCallbacks.push(i)}}if(e.plocks_custom)for(let s of e.plocks_custom)this.plocksCustom.includes(s)||this.plocksCustom.push(s);if(e.punlocks_custom)for(let s of e.punlocks_custom)s==="*"?this.plocksCustom=[]:this.plocksCustom=this.plocksCustom.filter(n=>n!==s);return"redraw"in e&&e.redraw!==void 0&&(e.redraw||(t=!1)),t}}function He(o){return new Promise((e,t)=>{const s=new Image;s.onload=()=>e(s),s.onerror=t,s.src=o})}const Ye={name:"GameBoard",components:{MainTitle:me,DevZone:Ce,ProgressIndicator:Ee},props:{},data(){return{loadingDone:!1,hideCode:!1,hideGameMenuSmall:!0,isPlayerLocked:!1,dummytab:[{dummyvar:"dummy"}]}},async mounted(){this.canvasBuffer=document.createElement("canvas"),this.currentUrlTileset="",this.tileAtlas=null,this.$refs.progressIndicator.clearProgress(),this.$refs.progressIndicator.setNbMainTasks(6),this.$refs.gameInterface.addEventListener("keydown",this.onKeyDown),window.languagePluginUrl="/pyodide/v0.15.0/",window.pyodideDownloadProgress=this.pyodideDownloadProgress,this.progressImposter=new Oe(this.$refs.progressIndicator,6),this.showProgress("Initialisation de Pyodide."),await ce("../pyodide.js"),this.showProgress("Iodification du python géant.",!0,!0),await window.languagePluginLoader,this.showProgress("Déballage de la cartouche du jeu."),this.$refs.devZone.fetchGameSpecFromLocHash(),window.addEventListener("resize",this.handleResize),this.functionFromButton={ArrowUp:this.goUp,ArrowRight:this.goRight,ArrowDown:this.goDown,ArrowLeft:this.goLeft,Digit1:this.action1,Digit2:this.action2,Numpad1:this.action1,Numpad2:this.action2}},updated(){this.handleResize()},unmounted(){const o=this.$refs.gameInterface;o&&o.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("resize",this.handleResize)},methods:{showProgress(o,e,t){this.loadingDone||(e=e===!0,t=t===!0,this.progressImposter.advanceToNextMainTask(o,e,t))},pyodideDownloadProgress(o,e){this.progressImposter.onSubTaskProgress(o,e)},refreshPlock(){this.gameEngine.getPlock()==y.Lock?this.isPlayerLocked=!0:(this.isPlayerLocked=!1,this.$refs.gameInterface.focus())},handleResize(){const o=this.gameEngine.getRatioFromWidthToHeight(),e=window.innerHeight*(96/100),t=this.$refs.gameFooter.clientHeight,s=this.$refs.titleContainer.clientHeight,n=10;let i=e-t-s-n,a=this.$refs.gameInterface.clientWidth;const r=a*o;let d=0,h=0;r<i?(d=Math.floor(r),h=Math.floor(a)):(d=Math.floor(i),h=Math.floor(i/o)),this.$refs.gameCanvas.style=`width: ${h}px; height: ${d}px;`},onKeyDown(o){if(o.code in this.functionFromButton){const e=this.functionFromButton[o.code];e(),o.preventDefault()}},onGameClick(o){this.gameEngine.onGameClick(o)},goUp(){this.gameEngine.onButtonDirection(g.Up)},goRight(){this.gameEngine.onButtonDirection(g.Right)},goDown(){this.gameEngine.onButtonDirection(g.Down)},goLeft(){this.gameEngine.onButtonDirection(g.Left)},action1(){this.gameEngine.onButtonAction("action_1")},action2(){this.gameEngine.onButtonAction("action_2")},gameMenuSmallClick(){this.hideGameMenuSmall=!this.hideGameMenuSmall,this.dummytab=[{dummyvar:"dummy"}],this.handleResize()},async onUpdateGameSpec(o,e,t){this.loadingDone=!1,this.$refs.pythonConsole.textContent="",e=JSON.parse(e);let s=!0;if("version"in e)if(e.version[0]=="1")s=!1;else if(e.version[0]=="2")s=!0;else{s=!1;const i=`Version du moteur inconnue. (${e.version}). On prend la V1 par défaut.
`;this.$refs.pythonConsole.textContent+=i}else{const i="GameModel()",a="GameModel(squarity.GameModelBase)";let r="";t.includes(i)?(s=!1,r=`Warning: ajoutez: "version": "1.0.0" dans la config json.
`):t.includes(a)?(s=!0,r=`Warning: ajoutez: "version": "2.0.0" dans la config json.
`):(s=!1,r=`Warning: indiquez le numéro de version dans la config json. On prend la V1 par défaut.
`),this.$refs.pythonConsole.textContent+=r}const n=this.$refs.gameCanvas;s?this.gameEngine=new Xe(this.$refs.pythonConsole,window.pyodide,this.refreshPlock,n,this.canvasBuffer,De):this.gameEngine=new Ae(this.$refs.pythonConsole,window.pyodide,this.refreshPlock,n,this.canvasBuffer,Fe),this.showProgress("Gloubiboulgatisation des pixels."),this.currentUrlTileset!==o&&(this.tileAtlas=await He(o),this.currentUrlTileset=o),this.showProgress("Compilation de la compote."),"name"in e?document.title=`Squarity - ${e.name}`:document.title="Squarity",this.gameEngine.updateGameSpec(this.tileAtlas,e,t),this.handleResize(),this.isPlayerLocked=!1,this.gameEngine.execStartCode(),this.$refs.gameInterface.focus(),this.showProgress("C'est parti !"),this.loadingDone=!0,this.$refs.progressIndicator.clearProgress()},toggleDevZoneDisplay(){this.hideCode=!this.hideCode,this.dummytab=[{dummyvar:"dummy"}]}}},$e={class:"game-board"},We={class:"flex-column h-100"},Je={class:"d-none d-sm-none d-md-block"},Ze={class:"flex-grow"},Ke={class:"h-100"},Qe={ref:"gameInterface",class:"game-interface flex-column",tabindex:"0"},et={ref:"titleContainer",class:"d-block d-sm-block d-md-none"},tt={class:"flex-grow"},st={class:"flex-line h-100"},nt={class:"flex-child-center w-100"},it={ref:"gameFooter",class:"game-footer flex-grow-no"},ot={class:"game-footer-inside"},at={class:"flex-grow-2"},rt={id:"pythonConsole",ref:"pythonConsole",readonly:""},lt={class:"flex-grow game-buttons"},dt=["disabled"],ct={class:"flex-column"},ht=["disabled"],ft=["disabled"],_t=["disabled"],mt={class:"flex-column"},ut=["disabled"],gt=["disabled"],pt={class:"flex-column game-menu-normal"},yt={class:"button-wrapper"},bt={class:"button-wrapper"},Tt={class:"game-menu-small"};function vt(o,e,t,s,n,i){const a=j("MainTitle"),r=j("DevZone"),d=j("v-col"),h=j("ProgressIndicator"),m=j("v-row"),b=j("v-container");return f(),_(E,null,[l("div",$e,[v(b,{fluid:""},{default:A(()=>[v(m,{class:"h-100 no-gutters"},{default:A(()=>[v(d,{sm:"12",md:"6",order:"2","order-sm":"2","order-md":"1",class:R({hidden:n.hideCode})},{default:A(()=>[l("div",We,[l("div",Je,[v(a)]),l("div",Ze,[l("div",Ke,[v(r,{ref:"devZone",onUpdateGameSpec:i.onUpdateGameSpec},null,8,["onUpdateGameSpec"])])])])]),_:1},8,["class"]),v(d,{sm:"12",md:n.hideCode?12:6,order:"1","order-sm":"1","order-md":"2",class:"no-padding-you-dumbass"},{default:A(()=>[l("div",Qe,[l("div",et,[l("div",{class:R({hidden:n.hideCode})},[v(a)],2)],512),l("div",tt,[l("div",st,[l("div",nt,[$(l("canvas",{ref:"gameCanvas",onClick:e[0]||(e[0]=(...c)=>i.onGameClick&&i.onGameClick(...c))},null,512),[[W,n.loadingDone]]),$(v(h,{ref:"progressIndicator"},null,512),[[W,!n.loadingDone]])])])]),l("div",it,[l("div",ot,[l("div",at,[l("textarea",rt,null,512)]),l("div",lt,[l("div",null,[e[14]||(e[14]=l("div",{class:"flex-grow"},null,-1)),l("div",null,[l("button",{class:"game-button-for-real",disabled:n.isPlayerLocked,onClick:e[1]||(e[1]=(...c)=>i.goLeft&&i.goLeft(...c))}," ⇦ ",8,dt)]),l("div",ct,[l("button",{class:"game-button-for-real",disabled:n.isPlayerLocked,onClick:e[2]||(e[2]=(...c)=>i.goUp&&i.goUp(...c))}," ⇧ ",8,ht),l("button",{class:"game-button-for-real",disabled:n.isPlayerLocked,onClick:e[3]||(e[3]=(...c)=>i.goDown&&i.goDown(...c))}," ⇩ ",8,ft)]),l("div",null,[l("button",{class:"game-button-for-real",disabled:n.isPlayerLocked,onClick:e[4]||(e[4]=(...c)=>i.goRight&&i.goRight(...c))}," ⇨ ",8,_t)]),e[15]||(e[15]=l("div",{class:"flex-grow-04"},null,-1)),l("div",mt,[l("button",{class:"game-button-for-real",disabled:n.isPlayerLocked,onClick:e[5]||(e[5]=(...c)=>i.action1&&i.action1(...c))}," 1 ",8,ut),l("button",{class:"game-button-for-real",disabled:n.isPlayerLocked,onClick:e[6]||(e[6]=(...c)=>i.action2&&i.action2(...c))}," 2 ",8,gt)]),e[16]||(e[16]=l("div",{class:"flex-grow"},null,-1)),l("div",pt,[l("div",yt,[l("button",{class:"my-button game-menu-button-normal",onClick:e[7]||(e[7]=c=>o.$router.push("/"))},"■"),e[12]||(e[12]=l("span",{class:"tooltip"},"Page d'accueil de Squarity",-1))]),l("div",bt,[l("button",{class:"my-button game-menu-button-normal",onClick:e[8]||(e[8]=(...c)=>i.toggleDevZoneDisplay&&i.toggleDevZoneDisplay(...c))},"( ):"),e[13]||(e[13]=l("span",{class:"tooltip"},"Afficher/masquer le code source",-1))])])])])]),l("div",Tt,[l("div",{class:R([{hidden:n.hideGameMenuSmall},"game-menu-small-content"])},[l("div",{onClick:e[9]||(e[9]=c=>o.$router.push("/"))},[...e[17]||(e[17]=[l("span",{class:"game-menu-icon"},"■",-1),l("span",null,"Page d'accueil de Squarity",-1)])]),l("div",{onClick:e[10]||(e[10]=(...c)=>i.toggleDevZoneDisplay&&i.toggleDevZoneDisplay(...c))},[...e[18]||(e[18]=[l("span",{class:"game-menu-icon"},"( ):",-1),l("span",null,"Afficher/masquer le code source",-1)])])],2),l("div",{class:R([{activated:!n.hideGameMenuSmall},"game-menu-small-toggle"]),onClick:e[11]||(e[11]=(...c)=>i.gameMenuSmallClick&&i.gameMenuSmallClick(...c))},null,2)])],512)],512)]),_:1},8,["md"])]),_:1})]),_:1})]),(f(!0),_(E,null,G(n.dummytab,(c,x)=>(f(),_("div",{key:x,class:"hidden"},ne(c.dummyvar),1))),128))],64)}const kt=M(Ye,[["render",vt],["__scopeId","data-v-39d22555"]]),Ct={__name:"PlayGameView",setup(o){return(e,t)=>(f(),_("main",null,[v(kt)]))}};export{Ct as default};
