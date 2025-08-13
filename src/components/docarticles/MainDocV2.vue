<template>
    <div class="doc-article">

<h1 id="documentation-de-référence-de-squarity-v2">Documentation de référence de Squarity V2 <a class="header-anchor" href="#documentation-de-référence-de-squarity-v2">&#x1F517;</a></h1>
<p>Squarity est un espace de création et de partage de jeux vidéo jouables dans un navigateur web. Les jeux se déroulent sur une grille en 2D composée de carrés. Le fonctionnement et les règles du jeu sont définis par du code en python.</p>
<p>Ce document décrit les fonctionnalités de la version 2.1.0 du moteur de Squarity. Il suppose que vous avez déjà un minimum de connaissance en python. Si ce n'est pas le cas, vous pouvez les acquérir avec ce tutoriel en français : https://python.doctor/</p>
<p>Un jeu est défini par trois informations :</p>
<ul>
<li>le tileset,</li>
<li>la configuration,</li>
<li>le &quot;game code&quot;.</li>
</ul>
<p>Pour l'instant, Squarity ne gère pas de comptes ni de profil personnel. Vous devez sauvegarder vos jeux par vous-même. Vous pouvez les distribuer en <a href="https://github.com/darkrecher/squarity-doc/blob/master/user_manual/share_your_game.md">les publiant sur un gist github</a>.</p>
<h2 id="le-tileset">Le tileset <a class="header-anchor" href="#le-tileset">&#x1F517;</a></h2>
<p>Le tileset est comme un atlas : c'est une image regroupant toutes les &quot;sous-images&quot; des éléments de votre jeu (décor, personnages, bonus, ...).</p>
<p>Pour que votre tileset soit accessible dans Squarity, il doit être publié sur internet : dans un repository github, sur un site d'hébergement d'images, etc.</p>
<p>Dans l'interface de Squarity, indiquez le lien direct vers votre fichier image dans le champ &quot;Url de l'image&quot;.</p>
<h2 id="configuration-json">Configuration json <a class="header-anchor" href="#configuration-json">&#x1F517;</a></h2>
<p>Exemple :</p>
<pre><code>{
    &quot;name&quot;: &quot;Mon super jeu&quot;,
    &quot;version&quot;: &quot;2.1.0&quot;,
    &quot;tile_size&quot;: 32,
    &quot;game_area&quot;: {
      &quot;nb_tile_width&quot;: 20,
      &quot;nb_tile_height&quot;: 14
    },
    &quot;img_coords&quot;: {
      &quot;my_sprite&quot;: [0, 0],
      &quot;my_other_sprite&quot;: [32, 0]
    }
}
</code></pre>
<p>Dans l'interface, cette configuration doit être écrite dans la zone de texte &quot;Config du jeu&quot;.</p>
<h3 id="informations-générales-de-la-config">Informations générales de la config <a class="header-anchor" href="#informations-générales-de-la-config">&#x1F517;</a></h3>
<p><code>name</code> (chaîne de caractère) : le nom de votre jeu. Il sera écrit dans le titre de la page web, précédé du texte &quot;Squarity - &quot;.</p>
<p><code>version</code> (chaîne de caractère) : version du moteur du jeu, indiquez &quot;2.1.0&quot;. (<a href="#version-du-moteur-squarity">Voir Version&quot;</a>).</p>
<p><code>tile_size</code> (nombre entier) : la taille par défaut, en pixels dans le tileset, des images représentant les éléments de votre jeu.</p>
<p><code>game_area</code> (sous-dictionnaire contenant deux nombres entiers) : largeur et hauteur de l'aire de jeu, en nombre de cases (tiles).</p>
<h3 id="définition-des-images">Définition des images <a class="header-anchor" href="#définition-des-images">&#x1F517;</a></h3>
<p>Il s'agit des images représentant les éléments de votre jeu (les &quot;Game Objects&quot;). Elles sont définies par un sous-dictionnaire, situé dans <code>img_coords</code>.</p>
<p>Chaque clé de ce sous-dictionnaire est une chaîne de caractère que vous pourrez utiliser dans votre code python, pour spécifier l'image d'un Game Object.</p>
<p>Chaque valeur de ce sous-dictionnaire est une liste de 2 entiers, représentant les coordonnées x et y, en pixels dans le tileset, du coin supérieur gauche de l'image.</p>
<p>Il est possible d'ajouter d'autres valeurs après ces deux entiers. <a href="#info-suppl%C3%A9mentaires-pour-les-sprites">Voir &quot;Info supplémentaires pour les sprites&quot;</a>.</p>
<h3 id="version-du-moteur-squarity">Version du moteur Squarity <a class="header-anchor" href="#version-du-moteur-squarity">&#x1F517;</a></h3>
<p>La seule information utile de la clé <code>version</code> est le premier nombre.</p>
<p>Si ce nombre est &quot;1&quot;, la version utilisée sera &quot;1.0.0&quot;.</p>
<p>Si ce nombre est &quot;2&quot;, la version utilisée sera la version 2.x.y la plus récente (actuellement : &quot;2.1.0&quot;). Vous n'avez pas accès aux précédentes versions 2.x.y, mais elles sont censées être rétro-compatibles.</p>
<h2 id="notions-de-base-du-game-code">Notions de base du &quot;game code&quot; <a class="header-anchor" href="#notions-de-base-du-game-code">&#x1F517;</a></h2>
<p>Il s'agit du programme définissant la logique de votre jeu, il est écrit en langage python.</p>
<p>Dans l'interface, placez ce programme dans la zone de texte intitulée &quot;Le code du jeu&quot;.</p>
<p>Ce programme doit contenir une classe intitulée <code>GameModel</code>, qui hérite de la classe <code>squarity.GameModelBase</code>.</p>
<p>Cette classe sera instanciée par le moteur Squarity. Elle contient des fonctions de callback qui seront automatiquement appelées sur certains événements (appui sur un bouton du jeu, clic de souris, etc.)</p>
<p>Votre <code>GameModel</code> contient des objets de type <code>squarity.Layer</code>, ordonnés dans une liste. Chacun de ces layers contient un tableau en 2 dimensions avec des &quot;tiles&quot;. La largeur et la hauteur correspondent à celles de l'aire de jeu (c'est à dire les valeurs <code>nb_tile_width</code> et <code>nb_tile_height</code> indiquées dans la config JSON).</p>
<p>Une tile représente une case de l'aire de jeu. Chaque tile peut contenir plusieurs <code>squarity.GameObject</code>, représentant des objets de votre jeu.</p>
<ul>
<li>Un GameObject est toujours placé sur une seule tile de un seul layer.</li>
<li>Un GameObject possède des coordonnées (x, y) indiquant la tile d'appartenance dans le layer.</li>
<li>Un GameObject possède une variable membre <code>sprite_name</code>, de type chaîne de caractère. Cette variable doit avoir pour valeur l'un des noms définis dans le dictionnaire <code>img_coords</code> de la configuration JSON.</li>
</ul>
<p>La suite de cette documentation contient des exemples de code. Pour les essayer :</p>
<ul>
<li>chargez le jeu de l'émeraude verte (qui fonctionne en version 2.1.0),</li>
<li>copier-collez le code d'exemple dans la fenêtre du code,</li>
<li>cliquez sur le bouton &quot;Exécuter&quot;.</li>
</ul>
<p>Vous devriez voir des informations apparaître dans la fenêtre de texte en bas de l'aire de jeu.</p>
<p>Les exemples de code qui ne commencent pas par la ligne <code>import squarity</code> doivent être <strong>ajoutés</strong> dans le code existant, juste après la ligne <code>import squarity</code> déjà présente.</p>
<p>Les exemples de code commençant par <code>import squarity</code> sont plus complets, ils doivent <strong>remplacer</strong> tout le code existant.</p>
<h2 id="schéma-daffichage-calculs-des-tailles">Schéma d'affichage, calculs des tailles <a class="header-anchor" href="#schéma-daffichage-calculs-des-tailles">&#x1F517;</a></h2>
<p>Vous ne pouvez pas définir la taille en pixel des cases réellement affichées, car cette taille s'adapte automatiquement à la fenêtre du navigateur affichant Squarity.</p>
<p>Le calcul est effectué comme suit :</p>
<ul>
<li>détermination des plus grandes valeurs possibles pour la largeur et la hauteur des tiles (en pixel, à l'écran) :
<ul>
<li><code>largeur_case_temp = largeur_affichage // config.game_area.nb_tile_width</code></li>
<li><code>hauteur_case_temp = hauteur_affichage // config.game_area.nb_tile_height</code></li>
</ul>
</li>
<li>détermination de la taille réelle des tiles, en prenant la plus petite :
<ul>
<li><code>taille_case_affichage = min(largeur_case_temp, hauteur_case_temp)</code></li>
</ul>
</li>
<li>application de cette taille pour la largeur et la hauteur à l'écran :
<ul>
<li><code>largeur_case_affichage = taille_case_affichage</code></li>
<li><code>hauteur_case_affichage = taille_case_affichage</code></li>
</ul>
</li>
</ul>
<p>Ensuite, une mise à l'échelle des images est effectuée. On part de la taille définie par <code>config.tile_size</code> (en pixel de tileset), pour arriver à des images ayant une taille égale à <code>taille_case_affichage</code> (en pixel d'écran).</p>
<p>La mise à l'échelle est effectuée selon l'algorithme &quot;proche voisin&quot;, sans traitement ni anti-aliasing. Vous verrez donc des gros pixels carrés si vos images de tileset sont petites et que vous jouez dans une grande fenêtre.</p>
<p>![<img src="../../assets/doc_img/schema_game_sizes.png" alt="Schéma décrivant les tailles de case et d'aire de jeu" />)</p>
<h2 id="class-direction">class Direction <a class="header-anchor" href="#class-direction">&#x1F517;</a></h2>
<p>Il s'agit d'une classe python dont il n'existe que 8 instances : 4 pour les directions de base (haut, droite, bas, gauche) et 4 pour les diagonales. Ces 8 instances sont stockées dans l'objet <code>squarity.dirs</code>.</p>
<h3 id="liste-des-directions">Liste des directions <a class="header-anchor" href="#liste-des-directions">&#x1F517;</a></h3>
<p>Les instances peuvent être comparées entre elles, par exemple : <code>my_dir == dirs.Up</code>. Elles peuvent être converties en entier et en string. Elles possèdent une variable <code>vector</code> : un tuple de deux éléments indiquant respectivement le déplacement en X et le déplacement en Y.</p>
<p>Tableau récapitulatif des directions et de leurs caractéristiques :</p>
<table>
<thead>
<tr>
<th><code>d = </code></th>
<th><code>int(d)</code></th>
<th><code>str(d)</code></th>
<th><code>d.vector[0]</code></th>
<th><code>d.vector[1]</code></th>
</tr>
</thead>
<tbody>
<tr>
<td><code>dirs.Up</code></td>
<td>0</td>
<td><code>&quot;up&quot;</code></td>
<td>0</td>
<td>-1</td>
</tr>
<tr>
<td><code>dirs.UpRight</code></td>
<td>1</td>
<td><code>&quot;up_right&quot;</code></td>
<td>+1</td>
<td>-1</td>
</tr>
<tr>
<td><code>dirs.Right</code></td>
<td>2</td>
<td><code>&quot;right&quot;</code></td>
<td>+1</td>
<td>0</td>
</tr>
<tr>
<td><code>dirs.DownRight</code></td>
<td>3</td>
<td><code>&quot;down_right&quot;</code></td>
<td>+1</td>
<td>+1</td>
</tr>
<tr>
<td><code>dirs.Down</code></td>
<td>4</td>
<td><code>&quot;down&quot;</code></td>
<td>0</td>
<td>+1</td>
</tr>
<tr>
<td><code>dirs.DownLeft</code></td>
<td>5</td>
<td><code>&quot;down_left&quot;</code></td>
<td>-1</td>
<td>+1</td>
</tr>
<tr>
<td><code>dirs.Left</code></td>
<td>6</td>
<td><code>&quot;left&quot;</code></td>
<td>-1</td>
<td>0</td>
</tr>
<tr>
<td><code>dirs.UpLeft</code></td>
<td>7</td>
<td><code>&quot;up_left&quot;</code></td>
<td>-1</td>
<td>-1</td>
</tr>
</tbody>
</table>
<h3 id="rotations">Rotations <a class="header-anchor" href="#rotations">&#x1F517;</a></h3>
<p>La méthode <code>turn_cw</code> renvoie une direction tournée dans le sens des aiguilles d'une montre. La méthode <code>turn_ccw</code> renvoie une direction tournée dans le sens inverse. L'angle de rotation par défaut est de 90 degrés.</p>
<pre><code>d = squarity.dirs.Right
print(d.turn_cw())
# La valeur 'down' s'affiche dans la console.
</code></pre>
<p>Un paramètre optionnel (nombre entier) permet de préciser l'angle de rotation, en multiple de 45 degrés.</p>
<pre><code>d = squarity.dirs.UpRight
print(d.turn_ccw(3))
# La valeur 'left' s'affiche dans la console.
</code></pre>
<h2 id="class-coord">class Coord <a class="header-anchor" href="#class-coord">&#x1F517;</a></h2>
<p>Cette classe sert à identifier une case dans l'aire de jeu ou dans un layer. Elle possède deux variables membres <code>x</code> et <code>y</code>, de type <code>int</code>.</p>
<h3 id="instanciation">Instanciation <a class="header-anchor" href="#instanciation">&#x1F517;</a></h3>
<p>La classe peut être instanciée en indiquant un X et un Y, ou une autre <code>Coord</code>. Les objets <code>Coord</code> peuvent être comparés entre eux.</p>
<pre><code>coord_1 = squarity.Coord(5, 2)
coord_2 = squarity.Coord(coord=coord_1)
print(coord_1 == coord_2)
# La valeur 'True' s'affiche dans la console
</code></pre>
<h3 id="fonctions-de-base">Fonctions de base <a class="header-anchor" href="#fonctions-de-base">&#x1F517;</a></h3>
<p>Les <code>Coord</code> peuvent être utilisées comme clés dans un dictionnaire. Elles ont une représentation textuelle, ce qui permet de les écrire avec un <code>print</code>. Elles peuvent être dupliquées avec la méthode <code>clone</code>.</p>
<pre><code>coord_1 = squarity.Coord(5, 2)
coord_2 = coord_1.clone()
print(coord_2)
# Le texte &quot;&lt;Coord 5, 2 &gt;&quot; s'affiche dans la console
</code></pre>
<h3 id="fonctions-de-modification">Fonctions de modification <a class="header-anchor" href="#fonctions-de-modification">&#x1F517;</a></h3>
<p>La méthode <code>move_dir</code> permet de se déplacer dans une direction donnée, sur une distance donnée (indiquée par un <code>int</code>). La distance par défaut est 1.</p>
<pre><code>coord_1 = squarity.Coord(5, 2)
coord_1.move_dir(squarity.dirs.Right, 2)
print(coord_1)
# Affichage de &quot;&lt;Coord 7, 2 &gt;&quot;
</code></pre>
<p>La méthode <code>move_by_vect</code> permet d'appliquer un déplacement, spécifié par le paramètre <code>vector</code> (de type <code>Coord</code>), ou spécifié par les paramètres <code>x</code> et <code>y</code>.</p>
<p>Attention, il n'y a pas de blocage sur les bords. Les mouvements peuvent amener une coordonnée en négatif ou en dehors de l'aire de jeu.</p>
<pre><code>coord_1 = squarity.Coord(5, 2)
coord_vect = squarity.Coord(0, -3)
coord_1.move_by_vect(vector=coord_vect)
coord_1.move_by_vect(x=1, y=-3)
print(coord_1)
# Affichage de &quot;&lt;Coord 6, -4 &gt;&quot;
</code></pre>
<h2 id="class-rect">class Rect <a class="header-anchor" href="#class-rect">&#x1F517;</a></h2>
<p>Définit un rectangle à partir de 4 paramètres de type <code>int</code> :</p>
<ul>
<li>X du coin supérieur droit,</li>
<li>Y du coin supérieur droit,</li>
<li>largeur,</li>
<li>hauteur.</li>
</ul>
<p>Les coordonnées dans le rectangle s'étendent de X jusqu'à (X+largeur-1) en abscisse, et de Y jusqu'à (Y+hauteur-1) en ordonnée. C'est le même principe que la fonction python <code>range</code>.</p>
<h3 id="fonction-in_bounds">Fonction in_bounds <a class="header-anchor" href="#fonction-in_bounds">&#x1F517;</a></h3>
<p>Indique si une coordonnée se trouve à l'intérieur du rectangle.</p>
<pre><code>rect = squarity.Rect(5, 2, 3, 5)
print(rect.in_bounds(squarity.Coord(0, 0)))
# La valeur False s'affichera dans la console.
print(rect.in_bounds(squarity.Coord(5, 4)))
# La valeur True s'affichera dans la console.
</code></pre>
<h3 id="fonction-on_borders">Fonction on_borders <a class="header-anchor" href="#fonction-on_borders">&#x1F517;</a></h3>
<p>Indique si une coordonnée se trouve sur un bord du rectangle.</p>
<pre><code>rect = squarity.Rect(5, 2, 3, 5)
for x in range(4, 10):
    coord_1 = squarity.Coord(x, 3)
    border = rect.on_border(coord_1)
    print(coord_1, &quot;est-elle au bord ?&quot;, border)
# Les informations suivantes vont s'afficher:
# &lt;Coord 4, 3 &gt; est-elle au bord ? False
# &lt;Coord 5, 3 &gt; est-elle au bord ? True
# &lt;Coord 6, 3 &gt; est-elle au bord ? False
# &lt;Coord 7, 3 &gt; est-elle au bord ? True
# &lt;Coord 8, 3 &gt; est-elle au bord ? False
# &lt;Coord 9, 3 &gt; est-elle au bord ? False
</code></pre>
<h2 id="class-gameobject">class GameObject <a class="header-anchor" href="#class-gameobject">&#x1F517;</a></h2>
<p>Un &quot;game object&quot; (ou gobj) est un élément qui s'affiche dans l'aire de jeu. Un game object possède des coordonnées et un nom de sprite (<code>sprite_name</code>). Le nom de sprite correspond à un nom référencé dans le dictionnaire <code>img_coords</code> de la config JSON.</p>
<p>Pour que le game object s'affiche, il doit être placé dans un <code>squarity.Layer</code>. Un game object peut être transféré d'un layer à un autre. Il peut également n'appartenir à aucun layer.</p>
<p>Les coordonnées et le nom de sprite doivent être spécifiés dès l'instanciation du game object. L'ajout dans le layer peut être effectué juste après (voir <a href="#class-layer">la classe squarity.Layer</a>).</p>
<pre><code>gobj = squarity.GameObject(squarity.Coord(5, 2), &quot;my_sprite&quot;)
print(gobj)
# Le texte &quot;&lt;Gobj (5,2) my_sprite&gt;&quot; s'affiche dans la console.
</code></pre>
<p>L'instanciation possède d'autres paramètres facultatifs. Ils sont détaillés plus loin dans cette doc.</p>
<h3 id="nom-du-sprite">Nom du sprite <a class="header-anchor" href="#nom-du-sprite">&#x1F517;</a></h3>
<p>L'aspect visuel du game object peut être directement changé en modifiant la variable membre <code>sprite_name</code>. La nouvelle image s'affichera en fonction du tileset et de la config JSON.</p>
<p>Attention, il n'y a pas de vérification sur le nom du sprite. Si vous indiquez un nom qui n'est pas référencé dans <code>config.img_coords</code>, le jeu va planter sans aucun message. (On améliorera ça dans les versions à venir).</p>
<h3 id="coordonnées-accès-et-modification">Coordonnées (accès et modification) <a class="header-anchor" href="#coordonnées-accès-et-modification">&#x1F517;</a></h3>
<p>Le game object possède une variable membre interne appelée <code>_coord</code>. <strong>Vous n'êtes pas censé y accéder directement</strong>, au risque de désordonner l'indexation des game objects dans les layers.</p>
<p>Pour lire les coordonnées, utilisez la méthode <code>coord_clone = gobj.get_coord()</code>. Si vous changez le contenu de la variable <code>coord_clone</code>, vos modifications ne seront pas reportées dans le game object.</p>
<p>Pour déplacer un game object, utilisez les méthodes <code>move_xxx</code> :</p>
<ul>
<li><code>move_to_xy</code> : déplace l'objet sur une case de destination, spécifiée par les paramètres X et Y (<code>int</code>).</li>
<li><code>move_to</code> : déplace l'objet sur une case de destination, spécifiée par le paramètre <code>dest_coord</code> (<code>Coord</code>).</li>
<li><code>move</code> : déplace l'objet de manière relative, selon un vecteur de déplacement spécifié par le paramètre <code>vector</code> (<code>Coord</code>).</li>
<li><code>move_dir</code> : déplace l'objet de manière relative, selon le paramètre <code>direction</code> (<code>Direction</code>) et le paramètre facultatif <code>distance</code> (<code>int</code>).</li>
</ul>
<pre><code>gobj = squarity.GameObject(squarity.Coord(5, 2), &quot;my_sprite&quot;)
gobj.move_to_xy(15, 9)
print(gobj)
# Affichage de &quot;&lt;Gobj (15,9) my_sprite&gt;&quot;.
gobj.move_to(squarity.Coord(7, 4))
print(gobj)
#   ---------&gt;        (7,4)
gobj.move(squarity.Coord(1, -1))
print(gobj)
#   ---------&gt;        (8,3)
gobj.move_dir(squarity.dirs.Right, 4)
print(gobj)
#   ---------&gt;        (12,3)
</code></pre>
<p>Ces 4 fonctions laissent le game object dans le même layer. Voir la documentation de la classe layer pour transférer un game object d'un layer à un autre.</p>
<h3 id="transitions-ajoutées-automatiquement">Transitions ajoutées automatiquement. <a class="header-anchor" href="#transitions-ajoutées-automatiquement">&#x1F517;</a></h3>
<p>Lorsque vous déplacez un game object, une &quot;transition&quot; est automatiquement affichée. Durant 200 millisecondes, le game object se déplace progressivement (pixel par pixel) depuis sa case initiale vers sa case de destination.</p>
<p>Ce déplacement automatique est effectué en une seule ligne droite. Par exemple, si vous déplacez un objet des coordonnées (5, 3) vers les coordonnées (8, 2), la ligne de déplacement sera oblique.</p>
<p>Si vous changez plusieurs fois les coordonnées dans un même tour de jeu, la transition n'utilisera pas les valeurs intermédiaires. Les deux seules valeurs prises en compte sont celles avant et après l'exécution du code.</p>
<p>Vous pouvez déclencher des transitions simultanées sur plusieurs game objects, en modifiant les coordonnées de chacun d'entre eux.</p>
<p>Il est possible de définir des déplacements avec des étapes intermédiaires. Par exemple, un déplacement horizontal de x=5 vers x=8, puis un vertical de y=3 vers y=2. <a href="#transitions">Voir &quot;Transitions&quot;</a>.</p>
<p>Le temps de la transition peut être redéfini individuellement pour chaque game object, avec la fonction <code>gobj.set_transition_delay(transition_delay)</code>. Le paramètre <code>transition_delay</code> est un <code>int</code>, en millisecondes. Toutes les futures transitions dues à un changement de coordonnées utiliseront ce nouveau temps.</p>
<p>Les 4 fonctions <code>move_xxx</code> possèdent un paramètre facultatif <code>transition_delay</code>, permettant de définir un temps spécifique uniquement pour la prochaine transition.</p>
<p>Si transition_delay est défini à 0, l'objet se déplacera instantanément.</p>
<h3 id="callback-de-fin-de-transition">Callback de fin de transition <a class="header-anchor" href="#callback-de-fin-de-transition">&#x1F517;</a></h3>
<p>Il s'agit d'une fonction python que vous définissez et que vous associez à un game object. Elle sera automatiquement exécutée chaque fois que le game object aura fini toutes ses transitions en cours. Pour associer une callback, utilisez la méthode <code>gobj.set_callback_end_transi(callback_end_transi)</code>.</p>
<p>Les callbacks ne peuvent pas avoir de paramètre, mais vous pouvez indiquer une fonction ou une méthode d'un objet spécifique.</p>
<p>Pour enlever une callback, exécutez <code>set_callback_end_transi</code> avec le paramètre <code>None</code>.</p>
<p>Les 4 fonctions <code>move_xxx</code> possèdent un paramètre facultatif <code>callback</code>, permettant de définir une callback différente uniquement pour la prochaine transition.</p>
<pre><code>def my_callback():
    print(&quot;coucou&quot;)

gobj = squarity.GameObject(squarity.Coord(5, 2), &quot;my_sprite&quot;)
gobj.set_callback_end_transi(my_callback)
# (Cette exemple n'affiche rien dans la console, désolé)
</code></pre>
<h2 id="class-layer">class Layer <a class="header-anchor" href="#class-layer">&#x1F517;</a></h2>
<p>Un layer est un tableau en 2 dimensions, contenant des game objects. Votre aire de jeu peut contenir plusieurs layers, affichés dans un ordre déterminé. Vous pouvez donc avoir un layer pour le décor de fond, un pour les personnages et les bonus, un pour les éléments d'interface, etc.</p>
<p>L'ordre d'affichage des objets au sein d'un layer n'est pas déterminé. Pour être sûr de l'ordre, vous devez utiliser plusieurs layers.</p>
<p>Si l'ordre importe peu, vous pouvez placer tous vos objets dans l'unique layer créé par défaut : la variable membre <code>layer_main</code>, dans le <code>GameModel</code>.</p>
<h3 id="ajouter-et-retirer-des-game-objects">Ajouter et retirer des game objects <a class="header-anchor" href="#ajouter-et-retirer-des-game-objects">&#x1F517;</a></h3>
<p>La méthode <code>layer.add_game_object(gobj)</code> permet d'ajouter un game object dans un layer. Les coordonnées du game object doivent être définies.</p>
<p>La méthode <code>layer.remove_game_object(gobj)</code> permet d'enlever un game object d'un layer. Une exception sera levée si vous tentez d'enlever un game object n'appartenant pas au layer.</p>
<p>La méthode <code>layer.remove_at_coord(coord)</code> permet d'enlever tous les game objects situés aux coordonnées indiquées en paramètre.</p>
<p>Après avoir été enlevé, le game object existe toujours. Vous pouvez le réutiliser et le placer dans un autre layer.</p>
<p>Ci-dessous, un exemple de code minimal affichant un seul objet immobile. Pour l'exécuter, sélectionnez le jeu d'exemple de l'émeraude verte, supprimez tout le game code, puis copier-collez ce texte à la place.</p>
<pre><code>import squarity

class GameModel(squarity.GameModelBase):
    def on_start(self):
        self.gobj = squarity.GameObject(squarity.Coord(5, 2), &quot;gem_green&quot;)
        self.layer_main.add_game_object(self.gobj)
</code></pre>
<h3 id="récupérer-des-tiles-et-des-game-objects">Récupérer des tiles et des game objects <a class="header-anchor" href="#récupérer-des-tiles-et-des-game-objects">&#x1F517;</a></h3>
<p>Chaque élément du tableau 2D d'un layer est un objet <code>squarity.Tile</code>, ils sont utiles pour se déplacer dans un layer, grâce à la variable <code>adjacencies</code>. Il s'agit d'une liste de 8 éléments, contenant les tiles adjacentes. Certains de ces éléments peuvent être <code>None</code>, pour les tiles qui sont au bord.</p>
<p>Les game objects d'une tile sont stockés dans la variable membre <code>game_objects</code> (de type <code>list</code>).</p>
<p>Les méthodes <code>layer.get_tile(coord)</code> et <code>layer.get_tile_xy(x, y)</code> permettent de récupérer une tile.</p>
<p>Ajoutez ce code après le code d'exemple précédent pour tester une récupération de game object.</p>
<pre><code>        tile = self.layer_main.get_tile_xy(5, 1)
        tile_down = tile.adjacencies[int(squarity.dirs.Down)]
        print(&quot;Nombre d'objets sur la tile :&quot;, len(tile_down.game_objects))
        print(tile_down.game_objects)
</code></pre>
<p>La méthode <code>layer.get_game_objects(coord)</code> permet de récupérer directement tous les game objects situés sur <code>coord</code>.</p>
<p>La méthode <code>layer.iter_all_game_objects()</code> permet d'itérer sur tous les game objects d'un layer.</p>
<pre><code>        for gobj in self.layer_main.iter_all_game_objects():
            print(gobj)
</code></pre>
<h3 id="créer-des-layers-et-les-ajouter-dans-le-jeu">Créer des layers et les ajouter dans le jeu <a class="header-anchor" href="#créer-des-layers-et-les-ajouter-dans-le-jeu">&#x1F517;</a></h3>
<p>Les layers doivent être placés dans la liste <code>layers</code> du <code>GameModel</code>, cette liste contient initialement le <code>layer_main</code>.</p>
<p>L'ordre dans <code>layers</code> détermine l'ordre d'affichage. Le premier layer de la liste est dessiné en premier et apparaîtra donc en-dessous de tous les autres layers. Le dernier layer de la liste apparaîtra au-dessus de tous les autres.</p>
<p>Vous pouvez ajouter, enlever et réordonner les layers dans la liste à tout moment. Ce sera immédiatement pris en compte dans l'affichage de l'aire de jeu.</p>
<p>Lors de l'instanciation, un layer a besoin d'avoir une référence vers le <code>GameModel</code> dans lequel il est placé. Il faut également spécifier une largeur et une hauteur, en nombre de cases.</p>
<pre><code>class GameModel(squarity.GameModelBase):
    def on_start(self):
        layer_second = Layer(self, self.w, self.h)
        self.layers.append(layer_second)
</code></pre>
<p>Tous les layers que vous placez dans <code>layers</code> doivent avoir les mêmes largeur et hauteur que votre aire de jeu. Ces dimensions sont déjà initialisés dans le <code>GameModel</code>, variables membres <code>game_model.w</code> et <code>game_model.h</code></p>
<p>Pour gérer la logique interne de votre jeu, vous pouvez utiliser des layers de n'importe quelles dimensions, que vous ne placerez pas dans <code>layers</code>. Ils ne seront pas affichés.</p>
<p>La fonction <code>Layer.__init__</code> possède un paramètre facultatif <code>show_transitions</code>, défini à True par défaut. Lorsqu'il est défini à False, le layer ne gère aucune transition, ni pour les déplacements d'objets ni pour les modifications graphiques (scaling, décalage, ...). Lorsque vous changez les coordonnées d'un objet dans un layer sans transition, il sera instantanément déplacé vers sa case de destination.</p>
<p>Les layers sans transition sont gérés de manière optimisée par le moteur Squarity, ils permettent des mouvements massifs et fréquents. Ils peuvent être utiles, par exemple, pour afficher le décor de fond de votre jeu, si ce décor change d'un seul coup d'un niveau à un autre.</p>
<p>Le choix d'avoir ou pas des transitions peut être effectué uniquement à l'instanciation du layer. Si vous modifiez la variable <code>layer.show_transitions</code> après l'avoir créé, ce ne sera pas pris en compte par le moteur.</p>
<h3 id="class-layersparse">class LayerSparse <a class="header-anchor" href="#class-layersparse">&#x1F517;</a></h3>
<p>Il s'agit d'une classe ayant le même fonctionnement que la classe <code>Layer</code> (les deux héritent de <code>LayerBase</code>). Les game objects contenus dans un <code>LayerSparse</code> ne sont pas indexés dans un tableau en deux dimensions, mais placés dans une liste unique.</p>
<p>L'ajout, la suppression et le parcours d'objets sont plus rapides avec un <code>LayerSparse</code>, mais la récupération d'objets à une coordonnée spécifique est plus lent.</p>
<p>Si vous créez des jeux n'ayant pas de gros besoins en performance, vous n'avez pas besoin de vous soucier de ces détails. Vous pouvez utiliser uniquement des classes <code>Layer</code>, avec gestion des transitions.</p>
<p>Liste des méthodes communes aux classes <code>Layer</code> et <code>LayerSparse</code> :</p>
<ul>
<li><code>get_game_objects</code></li>
<li><code>iter_all_game_objects</code></li>
<li><code>add_game_object</code></li>
<li><code>remove_game_object</code></li>
<li><code>remove_at_coord</code></li>
<li><code>move_game_object</code></li>
<li><code>move_game_object_xy</code></li>
</ul>
<p>Les méthodes <code>get_tile</code> et <code>get_tile_xy</code> ne sont pas présentes dans un <code>LayerSparse</code>, puisqu'il n'y a pas de tableau en 2 dimensions contenant des tiles.</p>
<h2 id="class-gamemodel">class GameModel <a class="header-anchor" href="#class-gamemodel">&#x1F517;</a></h2>
<p>Il s'agit de la classe principale définissant la logique de votre jeu. Elle hérite de <code>GameModelBase</code>. Vous devez la définir, mais pas l'instancier, c'est fait automatiquement par le moteur.</p>
<p>Le game model sert à définir des fonctions de callback, qui seront automatiquement appelées sur certains événements dans le jeu.</p>
<h3 id="liste-des-callbacks">Liste des callbacks <a class="header-anchor" href="#liste-des-callbacks">&#x1F517;</a></h3>
<p><code>on_start(self)</code> : cette fonction est appelée une seule fois au début du jeu. Il est conseillé de mettre votre code d'initialisation dans cette fonction plutôt que dans <code>__init__</code>, car <code>on_start</code> permet de renvoyer un objet <code>EventResult</code>. <a href="#class-eventresult">Voir la classe &quot;EventResult&quot;</a></p>
<p><code>on_click(self, coord)</code> : cette fonction est appelée à chaque clic de souris dans l'aire de jeu. Le paramètre <code>coord</code> indique la case où le clic a eu lieu. Vous ne pouvez pas savoir précisément quel Game Object a été cliqué, ni la position exacte du clic au pixel près, car le but de Squarity est de rester simple et de se spécialiser dans les jeux en 2D sur un quadrillage.</p>
<p>Dans l'exemple ci-dessous, un diamant s'ajoute sur chaque case que vous cliquez.</p>
<pre><code>import squarity

class GameModel(squarity.GameModelBase):
    def on_click(self, coord):
        if not self.layer_main.get_game_objects(coord):
            self.gobj = squarity.GameObject(coord, &quot;gem_yellow&quot;)
            self.layer_main.add_game_object(self.gobj)
</code></pre>
<p><code>on_button_direction(self, direction)</code> : cette fonction est appelée lorsque l'un des 4 boutons de direction est cliqué ou que l'une des 4 touches de direction du clavier est appuyée. Le paramètre <code>direction</code> est un objet de type <code>Direction</code>.</p>
<p>Dans l'exemple ci-dessous, l'aire de jeu affiche un diamant qui se déplace en fonction des actions de la personne qui joue.</p>
<pre><code>import squarity

class GameModel(squarity.GameModelBase):

    def on_start(self):
        self.gobj = squarity.GameObject(squarity.Coord(5, 2), &quot;gem_green&quot;)
        self.layer_main.add_game_object(self.gobj)

    def on_button_direction(self, direction):
        coord_dest = self.gobj.get_coord().move_dir(direction)
        if self.rect.in_bounds(coord_dest):
            self.gobj.move_to(coord_dest)
</code></pre>
<p><code>on_button_action(self, action_name)</code> : cette fonction est appelée lorsque la personne qui joue déclenche l'action &quot;1&quot; ou &quot;2&quot;, c'est à dire dans l'un des cas suivants :</p>
<ul>
<li>un des boutons &quot;1&quot; ou &quot;2&quot; à côté des flèches de direction a été cliqué.</li>
<li>l'une des touches du clavier &quot;1&quot; ou &quot;2&quot; au-dessus des lettres a été appuyée.</li>
<li>l'une tes touches &quot;1&quot; ou &quot;2&quot; du pavé numérique a été appuyée.</li>
</ul>
<h3 id="variables-membres-de-gamemodel">Variables membres de GameModel <a class="header-anchor" href="#variables-membres-de-gamemodel">&#x1F517;</a></h3>
<p>Elles sont initialisées dès le départ. Vous pouvez les lire mais vous ne devriez pas les modifier, car elles sont utilisées dans la librairie squarity.</p>
<ul>
<li><code>self.w</code> : largeur de l'aire de jeu, en nombre de case. (Correspond à <code>nb_tile_width</code> dans la config json)</li>
<li><code>self.h</code> : hauteur de l'aire de jeu, en nombre de case. (Correspond à <code>nb_tile_height</code> dans la config json)</li>
<li><code>self.str_game_conf_json</code> : chaîne de caractère contenant la configuration json complète.</li>
<li><code>self.rect</code> : objet <code>Rect</code> ayant les dimensions de l'aire de jeu, c'est à dire <code>Rect(0, 0, self.w, self.h)</code>.</li>
<li><code>self.transition_delay</code> : définit le temps par défaut (en millisecondes) de toutes les transitions effectuées suite à un changement de coordonnées d'un game object. Contrairement aux autres variables, celle-ci peut être modifiée. <a href="#transitions">Voir &quot;Transitions&quot;</a></li>
</ul>
<h3 id="méthode-get_first_gobj">Méthode get_first_gobj <a class="header-anchor" href="#méthode-get_first_gobj">&#x1F517;</a></h3>
<p>La méthode <code>self.get_first_gobj(coord, sprite_names, layer)</code> permet de récupérer le premier game object présent dans l'aire de jeu, selon différents critères cumulables. Les 3 paramètres sont facultatifs. Si aucun objet n'est trouvé, la méthode renvoie None.</p>
<ul>
<li>paramètre <code>coord</code> : par défaut, l'objet est cherché sur toute l'aire de jeu. Sinon, ce paramètre peut être un <code>Rect</code> ou une <code>Coord</code>, indiquant dans quelle zone ou sur quelles coordonnées on cherche l'objet.</li>
<li>paramètre <code>sprite_names</code> : par défaut, pas de filtre sur le nom de sprite. Sinon, ce paramètre doit être une liste de strings, indiquant le ou les noms de sprite recherchés.</li>
<li>paramètre <code>layer</code> : par défaut, l'objet est cherché dans tous les Layers de la liste <code>self.layers</code>. Sinon, ce paramètre doit être un unique <code>Layer</code>.</li>
</ul>
<h2 id="class-eventresult">class EventResult <a class="header-anchor" href="#class-eventresult">&#x1F517;</a></h2>
<p>Cette classe regroupe des informations générales que vous pouvez communiquer au moteur du jeu, après l'exécution de n'importe quelle fonction de callback (provenant du game model, d'un game object ou de n'importe quoi d'autres).</p>
<p>Par défaut, ces fonctions de callback ne renvoient rien (elles n'ont pas d'instruction <code>return</code>). Dans ce cas, la valeur réellement renvoyée est <code>None</code>, mais vous pouvez renvoyer un objet <code>EventResult</code> à la place.</p>
<h3 id="callback-différée">Callback différée <a class="header-anchor" href="#callback-différée">&#x1F517;</a></h3>
<p>Vous pouvez indiquer dans un <code>EventResult</code> que le moteur doit exécuter une de vos fonctions (une autre callback), après un délai spécifié.</p>
<p>Instanciez une classe <code>DelayedCallBack</code>, en indiquant le délai d'exécution en millisecondes et la callback. Vous pouvez indiquer une fonction de votre code, une méthode de votre game model (<code>self.my_callback</code>), une méthode d'un game object spécifique, etc. La callback ne peut pas avoir de paramètres.</p>
<p>Ajoutez ensuite cet objet <code>DelayedCallBack</code> dans votre event result, avec la fonction <code>event_result.add_delayed_callback</code>.</p>
<p>Le code ci-dessous écrit &quot;coucou&quot; dans la console après un temps d'attente de 500 millisecondes.</p>
<pre><code>import squarity

def my_callback():
    print(&quot;coucou&quot;)

class GameModel(squarity.GameModelBase):
    def on_start(self):
        event_result = squarity.EventResult()
        event_result.add_delayed_callback(
            squarity.DelayedCallBack(500, my_callback)
        )
        return event_result
</code></pre>
<p>C'est un peu verbeux, on raccourcira ce code dans une version ultérieure de Squarity.</p>
<p>Vous ne pouvez pas annuler une callback après l'avoir renvoyée via un event result. C'est à vous de le gérer dans votre code.</p>
<p>Il y a un bug : si vous redémarrez votre jeu, ou même si vous lancez un autre jeu, les callbacks du jeu précédent restent en mémoire et sont tout de même exécutées. Ce sera corrigé au plus vite.</p>
<h3 id="player-lock-plock-custom">Player Lock (plock) Custom <a class="header-anchor" href="#player-lock-plock-custom">&#x1F517;</a></h3>
<p>Votre jeu aura peut-être besoin d'afficher des petites animations courtes, durant lesquelles la personne qui joue n'est pas censée agir. Il est possible d'appliquer un &quot;Player Lock&quot;, c'est à dire de bloquer temporairement les boutons et les clics.</p>
<p>Il y a deux types de Player Locks :</p>
<ul>
<li>custom : vous indiquez explicitement, dans votre code, à quel moments se passent les locks et unlocks.</li>
<li>transition : les locks/unlocks sont effectués automatiquement d'après les transitions de certains game objects (<a href="#blocage-de-linterface-player-lock-transi">Voir &quot;Player Lock Transi&quot;</a>).</li>
</ul>
<p>Pour les locks custom, le blocage est toujours montré dans l'interface : les boutons d'actions apparaissent grisé.</p>
<p>Il est possible de locker/delocker avec plusieurs mots-clés (chacun étant considéré comme une raison pour locker). L'interface redevient active lorsqu'il n'y a plus aucun mot-clé de lock en cours.</p>
<p>Pour locker : instanciez un <code>EventResult</code> et ajoutez des strings dans la liste <code>event_result.plocks_custom</code>, représentant les mot-clés de lock. Pour enlever des locks : utilisez la liste <code>event_result.punlocks_custom</code>.</p>
<p>Attention, l'interface est entièrement bloquée dès le premier mot-clé. Il faut donc obligatoirement prévoir les unlocks en renvoyant des fonctions de callbacks en même temps. Si ce n'est pas fait, la personne qui joue restera bloquée. Le bouton &quot;Exécuter le jeu&quot; enlève tous les locks, mais il réinitialise tout le jeu au début.</p>
<p>Il est possible d'enlever tous les mots-clés de lock d'un seul coup, en ajoutant le caractère <code>&quot;*&quot;</code> dans <code>punlocks_custom</code>.</p>
<p>Le code ci-dessous locke l'interface pendant 2 secondes à chaque fois que l'on clique dans l'aire de jeu.</p>
<pre><code>import squarity

def callback_unlock():
    print(&quot;unlock&quot;)
    event_result = squarity.EventResult()
    event_result.punlocks_custom.append(&quot;*&quot;)
    return event_result

class GameModel(squarity.GameModelBase):
    def on_click(self, coord):
        print(&quot;lock&quot;)
        event_result = squarity.EventResult()
        event_result.plocks_custom.append(&quot;lock_a&quot;)
        event_result.plocks_custom.append(&quot;lock_b&quot;)
        event_result.add_delayed_callback(
            squarity.DelayedCallBack(2000, callback_unlock)
        )
        return event_result
</code></pre>
<h3 id="annuler-le-rendu-de-laire-de-jeu">Annuler le rendu de l'aire de jeu <a class="header-anchor" href="#annuler-le-rendu-de-laire-de-jeu">&#x1F517;</a></h3>
<p>Certaines actions de votre jeu (en particulier, les fonctions de callback contenant peu de code) ne modifient pas forcément la disposition ou l'état des game objects. Dans ce cas, vous pouvez indiquer au moteur qu'il n'est pas nécessaire de redessiner l'aire de jeu.</p>
<p>Instancier un <code>EventResult</code>, définissez la variable <code>redraw</code> à False, puis renvoyez-le avec un <code>return</code>.</p>
<pre><code>        event_result = squarity.EventResult()
        event_result.redraw = False
        return event_result
</code></pre>
<p>À noter que s'il y a des transitions en cours, l'aire de jeu est régulièrement redessinée pour les afficher. Le fait de renvoyer un event result annulant le rendu n'empêche pas les autres événements de faire leurs rendus à eux.</p>
<p>Vous pouvez cumuler plusieurs éléments dans le même event result. Par exemple, vous pouvez déclarer plusieurs callbacks, locker l'interface avec 3 mot-clés, enlever 4 autres mot-clés de locks, le tout en annulant le rendu.</p>
<h2 id="transitions">Transitions <a class="header-anchor" href="#transitions">&#x1F517;</a></h2>
<p>Une transition représente la modification progressive d'une variable d'un game object, sur une période de temps définie.</p>
<p>Les coordonnées sont des variables transitionnables. L'objet se déplacera pixel par pixel de sa case de destination vers sa case d'arrivée. Visuellement, les coordonnées de votre game object deviennent des valeurs décimales, afin de le placer entre deux cases. Dans votre code python, les coordonnées restent des nombres entiers et passent directement de la valeur de départ à la valeur d'arrivée.</p>
<p>Les variables permettant de décaler et agrandir l'image d'un game object sont elles aussi transitionnables, <a href="#class-componentimagemodifier">voir la classe ComponentImageModifier</a>.</p>
<p>Le sprite name peut avoir des transitions, mais elles ne sont pas progressives. L'image change d'un seul coup. Il est possible d'enchaîner ces changements : une première image pendant 100 millisecondes, une deuxième pendant les 100 millisecondes suivantes, etc.</p>
<p>Il existe deux moyens pour déclencher une transition : modifier directement une variable transitionnable ou exécuter la fonction <code>game_object.add_transition</code>.</p>
<h3 id="modification-dune-variable-transitionnable">Modification d'une variable transitionnable <a class="header-anchor" href="#modification-dune-variable-transitionnable">&#x1F517;</a></h3>
<h4 id="pour-les-coordonnées">Pour les coordonnées <a class="header-anchor" href="#pour-les-coordonnées">&#x1F517;</a></h4>
<p>Il faut appeler une fonction <code>move_to_xxx</code>. Le temps de la transition sera déterminé automatiquement. Il prend la première valeur définie parmi :</p>
<ul>
<li>le paramètre optionnel <code>transition_delay</code> de la fonction <code>move_to_xxx</code>,</li>
<li>le temps spécifique au game object, défini via la fonction <code>game_object.set_transition_delay(transition_delay)</code>,</li>
<li>la variable membre <code>game_model.transition_delay</code> (initialisée à 200 millisecondes, que vous pouvez modifier).</li>
</ul>
<h4 id="pour-le-sprite-name">Pour le sprite name <a class="header-anchor" href="#pour-le-sprite-name">&#x1F517;</a></h4>
<p>Il suffit de changer directement la valeur dans le game object. La transition sera instantanée.</p>
<h3 id="fonction-add_transition">Fonction add_transition <a class="header-anchor" href="#fonction-add_transition">&#x1F517;</a></h3>
<p>Cette fonction permet d'ajouter une séquence, pouvant contenir plusieurs transitions, elle nécessite deux paramètres :</p>
<ul>
<li>une chaîne désignant une variable membre (<code>&quot;coord&quot;</code> ou <code>&quot;sprite_name&quot;</code>),</li>
<li>une liste contenant des tuples de délais et de valeurs.</li>
</ul>
<p>Avec <code>&quot;coord&quot;</code>, les valeurs doivent être des <code>Coord</code>. Le Game Object se déplacera vers ces coordonnées, les unes après les autres.</p>
<p>Dans l'exemple ci-dessous, après un clic dans l'aire de jeu, le diamant vert se déplace à vitesse normale vers la coordonnée (3, 1), puis très rapidement vers (7, 1), puis lentement vers (5, 2).</p>
<pre><code>import squarity

class GameModel(squarity.GameModelBase):

    def on_start(self):
        self.gobj = squarity.GameObject(squarity.Coord(5, 2), &quot;gem_green&quot;)
        self.layer_main.add_game_object(self.gobj)

    def on_click(self, coord):
        self.gobj.add_transition(
            squarity.TransitionSteps(
                &quot;coord&quot;,
                (
                    (500, squarity.Coord(3, 1)),
                    (200, squarity.Coord(7, 1)),
                    (900, squarity.Coord(5, 2)),
                )
            )
        )
</code></pre>
<p>Vous ne pouvez définir que le temps de déplacement, et non pas une vitesse générique. Par exemple, si vous souhaitez que votre game object se déplace toujours à la même vitesse quel que soit la distance à parcourir, vous allez devoir coder vous-même le calcul des temps de déplacement. (On fera mieux à la prochaine version de Squarity).</p>
<p>Lorsque le premier paramètre de <code>TransitionSteps</code> est <code>&quot;sprite_name&quot;</code>, les valeurs doivent être des strings correspondant à des noms de sprites. Le game object changera successivement d'apparence.</p>
<p>Une transition est affichée progressivement, mais elle est appliquée dans le jeu dès qu'elle est démarrée. Pour les coordonnées, c'est simple à comprendre. Pour un sprite name, l'image change dès le début de la transition et reste telle quelle durant le temps indiqué. Donc pour une transition de sprite name, le dernier temps n'est pas très utile et peut être zéro.</p>
<p>Dans le futur, on changera l'ordre des paramètres. D'abord le sprite name, puis le temps. Ce sera plus logique à comprendre.</p>
<p>Si votre game object a une callback de fin de transition, définie à l'aide de la fonction <code>game_object.set_callback_end_transi</code>, cellec-ci sera déclenchée à la fin de la liste des transitions.</p>
<h3 id="enchaînement-des-transitions">Enchaînement des transitions <a class="header-anchor" href="#enchaînement-des-transitions">&#x1F517;</a></h3>
<p>Même si des transitions sont en cours, vous pouvez en ajouter d'autres via la méthode <code>add_transition</code>. Elles vont s'ajouter après les transitions existantes.</p>
<p>La prise en compte des transitions par le moteur est effectuée à la fin de l'exécution du code en cours (<code>on_click</code>, <code>on_button_xxx</code>, une callback, ...). Si vous ajoutez plusieurs transitions dans le même code, elles seront déclenchées au même moment et seront exécutées en même temps. Cela permet d'avoir un objet qui se déplace tout en changeant de sprite.</p>
<p>Dans votre game object, les variables membres <code>coord</code> et <code>sprite_name</code> changent automatiquement, au fur et à mesure de l'enchaînement des transitions. Ce changement n'est pas progressif, il est appliqué au début de chaque transition. Cela permet de garder des nombres entiers dans les coordonnées, même si visuellement l'objet s'affiche entre les deux.</p>
<p>Le moteur essaye, autant que faire se peut, d'avoir le même type de gestion pour les transitions ajoutées suite à une modification de variable et les transitions ajoutées avec <code>add_transition</code> :</p>
<ul>
<li>Durant une transition provenant d'une modification de variable, la variable contient la valeur finale. C'est normal, c'est vous même qui l'avez définie avec votre code python.</li>
<li>Si vous remodifiez la variable pendant une transition, celle-ci va s'enchaîner après les transitions existantes. Le moteur utilise toujours la valeur finale de l'enchaînement de transitions pour ajouter la prochaine.</li>
<li>Durant les transitions provenant de <code>add_transition</code>, c'est le moteur du jeu qui modifie automatiquement la variable transitionnée. Cette modification se fait au début de chaque transition, comme si c'était votre code qui le changeait manuellement, à chaque fois que la transition précédente se termine.</li>
</ul>
<p><strong>Attention</strong> : il est fortement déconseillé d'avoir, sur un même game object et à un même instant, des transitions provenant de modifications de variable et des transitions provenant de <code>add_transition</code>. C'est une situation ambigüe, dans laquelle on ne pourrait pas déterminer les valeurs des variables. Le moteur essaiera de le gérer comme il peut, c'est à dire pas très bien. Avant d'ajouter de nouvelles transitions, vous devez donc vous assurer des transitions en cours et de leurs origines.</p>
<p>Si vous avez des doutes, le plus simple est de s'assurer qu'il n'y a aucune transition en cours sur un game object avant d'effectuer des actions qui en ajouteraient. La méthode <code>game_object.get_nb_undone_transitions()</code> renvoie le nombre de transitions restant à effectuer. Si cette fonction renvoie 0, vous pouvez ajouter des transitions en toute sécurité sur ce game object.</p>
<p>Dans l'exemple ci-dessous, lorsque vous appuyez sur un bouton de direction, le diamant se déplace tout en clignotant (jaune-vert-jaune-vert). Lorsque vous cliquez, la console affiche son état actuel : coordonnées, nom du sprite et nombres de transitions restantes. Appuyez plusieurs fois sur un bouton, puis cliquez à fond dans le jeu pour avoir une démonstration de la manière dont les transitions peuvent s'accumuler.</p>
<pre><code>import squarity

class GameModel(squarity.GameModelBase):

    def on_start(self):
        self.gobj = squarity.GameObject(squarity.Coord(5, 2), &quot;gem_green&quot;)
        self.layer_main.add_game_object(self.gobj)

    def on_button_direction(self, direction):
        self.gobj.add_transition(
            squarity.TransitionSteps(
                &quot;coord&quot;,
                (
                    (500, squarity.Coord(3, 1)),
                    (200, squarity.Coord(7, 1)),
                    (900, squarity.Coord(5, 2)),
                )
            )
        )
        self.gobj.add_transition(
            squarity.TransitionSteps(
                &quot;sprite_name&quot;,
                (
                    (400, &quot;gem_yellow&quot;),
                    (400, &quot;gem_green&quot;),
                    (400, &quot;gem_yellow&quot;),
                    (0, &quot;gem_green&quot;),
                )
            )
        )

    def on_click(self, coord):
        print(&quot;Coordonnées:&quot;, self.gobj.get_coord())
        print(&quot;Nom du sprite:&quot;, self.gobj.sprite_name)
        print(&quot;Transitions restantes:&quot;, self.gobj.get_nb_undone_transitions())
</code></pre>
<h3 id="blocage-de-linterface-player-lock-transi">Blocage de l'interface (Player Lock Transi) <a class="header-anchor" href="#blocage-de-linterface-player-lock-transi">&#x1F517;</a></h3>
<p>Si une touche d'action ou de direction reste appuyée, la fonction de callback correspondante sera exécutée plusieurs fois très vite, ce qui peut poser problème.</p>
<p>Il est possible de bloquer automatiquement toute l'interface du jeu (clics et boutons) tant qu'un game object spécifique a au moins une transition en cours. C'est utile si votre jeu comporte un objet principal dirigé par la personne qui joue. Si un bouton est appuyé durant le mouvement de cet objet, ce ne sera pas pris en compte.</p>
<p>Modifiez la variable membre <code>plock_transi</code> de votre game object principal. Celle-ci peut prendre 3 valeurs:</p>
<ul>
<li><code>PlayerLockTransi.NO_LOCK</code> : pas de blocage (valeur par défaut).</li>
<li><code>PlayerLockTransi.INVISIBLE</code> : blocage invisible. Les boutons ne changent pas d'apparence, mais rien ne se passe si on clique dessus.</li>
<li><code>PlayerLockTransi.LOCK</code> : blockage visible. Les boutons s'affichent en grisé.</li>
</ul>
<pre><code>self.gobj = squarity.GameObject(squarity.Coord(5, 2), &quot;gem_green&quot;)
self.gobj.plock_transi = squarity.PlayerLockTransi.INVISIBLE
</code></pre>
<p>Avec le blocage visible, les boutons d'interface s'affichent en grisé pendant une fraction de seconde, à chaque mouvement de l'objet principal, ce qui peut être déroutant. C'est pourquoi il vaut mieux utiliser un blocage invisible. Les blocages visibles sont utiles pour les animations narratives (les &quot;cut-scenes&quot;), ils permettent d'indiquer explicitement que ce n'est pas le moment de jouer.</p>
<p>Les deux types de blocages ont exactement le même effet, la différence est seulement visuelle.</p>
<p>Les blocages &quot;Player Lock Transi&quot; sont appliqués durant tous les types de transitions, aussi bien celles provenant d'une modification de variable que celles ajoutées avec <code>add_transition</code>.</p>
<p>Vous pouvez avoir plusieurs game objects bloquant l'interface. Dans ce cas, l'interface est utilisable lorsqu'aucun de ces objets n'a de transition en cours.</p>
<p>Vous pouvez ajouter des transitions à un objet bloquant même s'il a déjà des transitions en cours.</p>
<h3 id="annuler-les-transitions-en-cours">Annuler les transitions en cours <a class="header-anchor" href="#annuler-les-transitions-en-cours">&#x1F517;</a></h3>
<p>La méthode <code>game_object.clear_transitions_to_record()</code> permet de supprimer les transitions que vous auriez ajoutées via des méthodes <code>add_transition</code>, <strong>avant</strong> qu'elles aient été prises en compte par le moteur du jeu.</p>
<p>La méthode <code>game_object.clear_all_transitions()</code> permet d'annuler toutes les transitions prises en compte par le moteur. Dans le code, vous pouvez exécuter cette fonction, puis exécuter des <code>add_transition</code>. Dans ce cas, les transitions précédentes seront toutes annulées, celles que vous avez ajoutées seront prises en compte.</p>
<p>Attention, si vous avez ajouté un enchaînement de transition et que vous l'annulez, la transition actuellement en cours est immédiatement terminée (l'objet se déplace instantanément à la destination de la transition). Les transitions qui n'étaient pas commencées sont entièrement annulées.</p>
<p>Pour essayer, remettez le code du chapitre &quot;Gestion des transitions&quot;, puis ajoutez ce code à la fin:</p>
<pre><code>    def on_button_action(self, action_name):
        self.gobj.clear_all_transitions()
</code></pre>
<p>Cliquez sur un bouton de direction, immédiatement après, cliquez sur un bouton d'action (le &quot;1&quot; ou le &quot;2&quot;).</p>
<p>Selon le moment où vous avez cliqué, le diamant s'arrêtera à un endroit différent, il sera jaune ou vert.</p>
<h2 id="info-supplémentaires-pour-les-sprites">Info supplémentaires pour les sprites <a class="header-anchor" href="#info-supplémentaires-pour-les-sprites">&#x1F517;</a></h2>
<p>Chaque valeur du dictionnaire <code>config.img_coords</code> (dans la config JSON) définit un sprite. Elle est constituée d'une liste. Les deux premiers éléments sont obligatoires, les 3 suivants optionnels. Il s'agit des éléments suivants :</p>
<ul>
<li>
<p>Un nombre entier. Coordonnée x du coin supérieur gauche de l'image, dans le tileset. L'unité est le pixel de tileset.</p>
</li>
<li>
<p>Coordonnée y du coin supérieur gauche de l'image.</p>
</li>
<li>
<p>Un nombre entier, par défaut : <code>config.tile_size</code>. Largeur de l'image prise dans le tileset. L'unité est le pixel de tileset. La largeur et la hauteur ont une influence sur la taille de l'image affichée dans l'aire de jeu. Par exemple, si on indique une largeur qui vaut un tiers de <code>config.tile_size</code>, l'image affichée fera un tiers de case dans l'aire de jeu.</p>
</li>
<li>
<p>Un nombre entier, par défaut : <code>config.tile_size</code>. Hauteur de l'image prise dans le tileset.</p>
</li>
<li>
<p>Une chaine de caractères qui vaut &quot;center&quot; ou &quot;corner_upleft&quot;, par défaut : &quot;corner_upleft&quot;. Indique où ancrer l'image par rapport à la case de l'aire de jeu.</p>
<ul>
<li>&quot;corner_upleft&quot; : le coin haut gauche de l'image reste fixé sur le coin haut gauche de la case. Si on agrandit l'image, elle va dépasser vers le bas et vers la droite.</li>
<li>&quot;center&quot; : le centre de l'image reste fixé sur le centre de la case. Si on agrandit l'image, elle va dépasser par les 4 côtés.</li>
</ul>
</li>
</ul>
<p>Voir schéma dans le chapitre suivant (class <code>ComponentImageModifier</code>).</p>
<h2 id="class-componentimagemodifier">class ComponentImageModifier <a class="header-anchor" href="#class-componentimagemodifier">&#x1F517;</a></h2>
<h3 id="initialisation">Initialisation <a class="header-anchor" href="#initialisation">&#x1F517;</a></h3>
<p>Cette classe doit être placée dans un game object au moment de sa création. Elle permet de modifier son affichage dans l'aire de jeu.</p>
<p>Si le <code>ComponentImageModifier</code> est ajouté après la création du game object, il ne sera pas pris en compte. Il faut donc instancier votre game object comme ceci :</p>
<pre><code>gobj = squarity.GameObject(
    Coord(0, 0),
    &quot;gem_green&quot;,
    image_modifier=squarity.ComponentImageModifier()
)
</code></pre>
<h3 id="variables-membres">Variables membres <a class="header-anchor" href="#variables-membres">&#x1F517;</a></h3>
<p>Toutes les variables commençant par <code>img_</code> représentent un nombre de pixels dans l'image de tileset. Ce sont des nombres entiers, positifs ou négatifs.</p>
<p>Toutes les variables commençant par <code>area_</code> représentent un nombre de cases dans l'aire de jeu. Ces nombres peuvent être négatifs, pour indiquer un sens inverse (vers le haut ou vers la gauche). Ils peuvent être également décimaux, pour indiquer une fraction de case.</p>
<p>Le <code>ComponentImageModifier</code> possède les variables suivantes :</p>
<ul>
<li>
<p><code>img_offset_x</code>, <code>img_offset_y</code> : décalage, dans le tileset, de l'image à afficher. Modifier ces valeurs revient à modifier, pour un seul game object, les 2 premières valeurs du sprite name, dans <code>config.img_coords</code>.</p>
</li>
<li>
<p><code>img_size_x</code>, <code>img_size_y</code> : taille, dans le tileset, de l'image à afficher. Modifier ces valeurs revient à modifier, pour un seul game object, les 3ème et 4ème valeurs du sprite name, dans <code>config.img_coords</code>. Par défaut, ces valeurs <code>img_size</code> valent <code>config.tile_size</code>.</p>
</li>
<li>
<p><code>area_offset_x</code>, <code>area_offset_y</code> : décalage, dans l'aire de jeu, de l'objet affiché. Ces variables permettent d'afficher un objet entre deux cases (même si, dans la logique du jeu, l'objet appartient toujours à une seule case). Par exemple, si <code>area_offset_x = -1.25</code>, l'objet sera décalé vers la gauche, sur une distance de une case et un quart. L'objet peut s'afficher partiellement en dehors de l'aire de jeu. Par défaut, ces valeurs <code>area_offset</code> valent 0.0.</p>
</li>
<li>
<p><code>area_scale_x</code>, <code>area_scale_y</code> : facteur d'échelle de l'image affichée dans l'aire de jeu. Par exemple, si <code>area_scale_x = 2.5</code>, l'image sera affichée 2,5 fois plus large que sa taille normale. Le positionnement de l'image retaillée est déterminée à l'aide de l'anchor (la valeur &quot;center&quot;/&quot;corner_upleft&quot; définie dans <code>config.img_coords</code>). Par défaut, ces valeurs <code>area_scale</code> valent 1.0.</p>
</li>
</ul>
<p>Ces 8 valeurs peuvent être définies lors de la création du <code>ComponentImageModifier</code> puis modifiées pendant le jeu. Le component se trouve dans la variable membre <code>image_modifier</code> du game object.</p>
<p>Dans l'exemple ci-dessous, le diamant vert est affiché de manière écrasée. Appuyez sur la flèche de gauche ou de droite pour l'écraser encore plus, appuyez sur la flèche du haut ou du bas pour l'étirer.</p>
<pre><code>import squarity

d = squarity.dirs

class GameModel(squarity.GameModelBase):

    def on_start(self):
        self.gobj = squarity.GameObject(
            squarity.Coord(5, 2),
            &quot;gem_green&quot;,
            image_modifier=squarity.ComponentImageModifier(
                area_scale_x=2.0,
                area_scale_y=0.8,
            )
        )
        self.gobj.set_transition_delay(50)
        self.layer_main.add_game_object(self.gobj)

    def on_button_direction(self, direction):
        if direction in (d.Up, d.Down):
            if self.gobj.image_modifier.area_scale_x &gt; 0.1:
                self.gobj.image_modifier.area_scale_x -= 0.1
                self.gobj.image_modifier.area_scale_y += 0.1
        else:
            if self.gobj.image_modifier.area_scale_y &gt; 0.1:
                self.gobj.image_modifier.area_scale_y -= 0.1
                self.gobj.image_modifier.area_scale_x += 0.1
</code></pre>
<p>![<img src="../../assets/doc_img/schema_sprite_infos.png" alt="Schéma décrivant les informations que l'on peut indiquer dans un &quot;image modifier&quot;" />)</p>
<h3 id="transitions-1">Transitions <a class="header-anchor" href="#transitions-1">&#x1F517;</a></h3>
<p>Les 8 valeurs du <code>ComponentImageModifier</code> sont transitionnables, comme les coordonnées d'un game object.</p>
<ul>
<li>Une simple modification de l'une de ces valeurs déclenche une transition entre la valeur courante et la valeur finale, sur une durée définie via <code>game_object.set_transition_delay</code>.</li>
<li>Selon la valeur de <code>game_object.plock_transi</code>, l'interface peut être lockée durant une transition.</li>
<li>La fonction de callback de fin de transition du game object sera appelée, si elle est définie.</li>
<li>Il est possible d'ajouter et d'enchaîner des séquences de transition avec la fonction <code>gobj.image_modifier.add_transitions</code>.</li>
</ul>
<p>L'exemple ci-dessous effectue une petite animation avec le diamant vert. Cliquez dans l'aire de jeu pour la déclencher.</p>
<pre><code>import squarity

class GameModel(squarity.GameModelBase):

    def on_start(self):
        self.gobj = squarity.GameObject(
            squarity.Coord(5, 2),
            &quot;gem_green&quot;,
            image_modifier=squarity.ComponentImageModifier()
        )
        self.layer_main.add_game_object(self.gobj)

    def on_click(self, coord):

        TRANSI_SCALE = (
            (150, 0.5), (150, 1.5), (150, 0.5), (150, 1.5),
            (150, 0.5), (150, 1.5), (150, 0.5), (150, 1.5),
            (150, 0.5), (150, 1.5),
            (150, 0.5), (75, 1),
        )
        self.gobj.image_modifier.add_transition(
            squarity.TransitionSteps(&quot;area_scale_x&quot;, TRANSI_SCALE)
        )
        self.gobj.image_modifier.add_transition(
            squarity.TransitionSteps(&quot;area_scale_y&quot;, TRANSI_SCALE)
        )

        self.gobj.image_modifier.add_transition(
            squarity.TransitionSteps(
                &quot;area_offset_x&quot;,
                ((200, -1), (400, -1), (400, 1), (400, 1), (400, -1), (200, 0))
            )
        )
        self.gobj.image_modifier.add_transition(
            squarity.TransitionSteps(
                &quot;area_offset_y&quot;,
                ((200, 1), (400, -1), (400, -1), (400, 1), (400, 1), (200, 0))
            )
        )
</code></pre>
<h2 id="class-componentbackcaller">class ComponentBackCaller <a class="header-anchor" href="#class-componentbackcaller">&#x1F517;</a></h2>
<p>Cette classe doit être placée dans un game object, au moment de sa création. Elle permet d'exécuter des callbacks au bout d'un temps défini. Il s'agit du même principe que les callbacks de <code>EventResult</code>, mais associées à un game object.</p>
<p>Si le game object est supprimé ou s'il est retiré de son layer, les callbacks prévues ne sont pas exécutées.</p>
<p>Lors de l'instanciation du game object, définisssez le paramètre optionnel <code>back_caller</code> avec <code>ComponentBackCaller()</code>. Puis, ajoutez une callback avec <code>back_caller.add_callback(delayed_callback)</code>.</p>
<p>Contrairement aux autres transitions (coordonnées, sprite name, image modifier), lorsqu'il n'y a plus de callback à exécuter, celles du back_caller ne déclenche pas la callback de fin de transition du game object.</p>
<p>En revanche, les callbacks ajoutées dans le back_caller et qui n'ont pas encore été exécutées sont comptées par la fonction <code>get_nb_undone_transitions</code>. (Note: et c'est bizarre et on devrait avoir une fonction spéciale pour renvoyer le nombre de callback restantes).</p>
<p>Dans le code ci-dessous, le diamant vert ajoute deux callbacks dès le lancement du jeu. L'une sera lancée au bout de 2 secondes, l'autre au bout de 4 secondes. Lorsque vous cliquez dans le jeu, le nombre de transitions restantes s'affiche dans la console.</p>
<pre><code>import squarity

def my_callback():
    print(&quot;coucou de my_callback&quot;)

class GameModel(squarity.GameModelBase):

    def on_start(self):
        self.gobj = squarity.GameObject(
            squarity.Coord(5, 2),
            &quot;gem_green&quot;,
            back_caller=squarity.ComponentBackCaller()
        )
        self.layer_main.add_game_object(self.gobj)
        self.gobj.back_caller.add_callback(
            squarity.DelayedCallBack(2000, my_callback)
        )
        self.gobj.back_caller.add_callback(
            squarity.DelayedCallBack(4000, my_callback)
        )

    def on_click(self, coord):
        print(&quot;Transitions restantes:&quot;, self.gobj.get_nb_undone_transitions())
</code></pre>
<h2 id="itérer-dans-laire-de-jeu">Itérer dans l'aire de jeu <a class="header-anchor" href="#itérer-dans-laire-de-jeu">&#x1F517;</a></h2>
<p>Il est très souvent nécessaire de parcourir tout ou une partie de l'aire de jeu, pour rechercher des game objects spécifiques. La classe <code>Sequencer</code> permet d'effectuer les itérations les plus communes.</p>
<p>Cette classe contient uniquement des fonctions statiques, vous n'avez pas besoin de l'instancier.</p>
<p>La fonction <code>Sequencer.seq_iter</code> renvoie un itérateur. Les paramètres de cette fonction sont des &quot;mini-itérateurs&quot; mis bout à bout. Selon ces paramètres, votre séquenceur renverra des coordonnées, des game objects ou des listes de game objects.</p>
<p>Les mini-itérateurs sont créés à l'aide d'autres fonctions statiques du séquenceur.</p>
<h3 id="itérer-sur-des-coordonnées">Itérer sur des coordonnées <a class="header-anchor" href="#itérer-sur-des-coordonnées">&#x1F517;</a></h3>
<p>Le séquenceur permet d'éviter deux itérations imbriquées sur x et sur y. Il nécessite un seul paramètre, renvoyé par <code>Sequencer.iter_on_rect(rect, instanciate_coord=False)</code>.</p>
<p>Le paramètre <code>rect</code> est un objet <code>Rect</code>. Le paramètre <code>instanciate_coord</code> est un booléen. Lorsqu'il vaut True, l'itérateur recrée un nouvel objet <code>Coord</code> à chaque itération. C'est nécessaire dans une situation où vous auriez besoin de modifier temporairement les coordonnées sur lesquelles vous itérez.</p>
<p>L'exemple ci-dessous remplit l'aire de jeu avec une alternance de diamant vert et de diamant jaune, pour créer une sorte d'échiquier.</p>
<pre><code>import squarity
S = squarity.Sequencer

def get_chessed_gem(coord):
    chessed_gems = [&quot;gem_yellow&quot;, &quot;gem_green&quot;]
    chess_index = (coord.x + coord.y) % 2
    return chessed_gems[chess_index]

class GameModel(squarity.GameModelBase):

    def on_start(self):
        seq = S.seq_iter(S.iter_on_rect(self.rect))
        for coord in seq:
            sprite_name = get_chessed_gem(coord)
            self.gobj = squarity.GameObject(coord, sprite_name)
            self.layer_main.add_game_object(self.gobj)
</code></pre>
<h3 id="itérer-sur-des-game-objects">Itérer sur des Game Objects <a class="header-anchor" href="#itérer-sur-des-game-objects">&#x1F517;</a></h3>
<p>Avec un deuxième paramètre, le séquenceur permet d'itérer sur les game objects d'un ou plusieurs layers.</p>
<p><code>Sequencer.gobj_on_layers(layers)</code> renverra les game objects les un après les autres. Le paramètre <code>layers</code> est la liste de layers dans laquelle on les recherche. L'itération est effectuée sur le rectangle spécifié par <code>iter_on_rect</code>.</p>
<p><code>Sequencer.gobj_on_layers_by_coords(layers)</code> renverra des listes de game objects, en les groupant par coordonnées. Les coordonnées n'ayant aucun game objects généreront des listes vides.</p>
<p>Le troisième paramètre du séquenceur permet de filtrer sur des noms de sprites spécifique: <code>Sequencer.filter_sprites(sprite_names, skip_empty_lists=False)</code>.</p>
<ul>
<li>Le paramètre <code>sprite_names</code> est une liste de strings.</li>
<li>Le paramètre <code>skip_empty_lists</code> est utile avec la fonction <code>gobj_on_layers_by_coords</code>, il permet de passer les cases ne contenant aucun game objects.</li>
</ul>
<p>L'exemple ci-dessous place un diamant vert sur une case et deux diamants verts + un diamant jaune sur une autre. Chaque bouton de direction effectue une itération spécifique et logge les infos dans la console.</p>
<ul>
<li>La flèche du haut itère sur tous les Game Objects.</li>
<li>La flèche du bas itère sur les listes de Game Objects (le log est moche mais c'est pas grave).</li>
<li>La flèche de gauche itère sur les diamants verts.</li>
<li>La flèche de gauche itère sur les listes de diamant verts, en passant les cases qui n'en contiennent pas.</li>
</ul>
<pre><code>import squarity
S = squarity.Sequencer

class GameModel(squarity.GameModelBase):

    def on_start(self):
        self.layer_other = squarity.Layer(self, self.w, self.h)
        self.layers.append(self.layer_other)
        self.layer_main.add_game_object(
            squarity.GameObject(squarity.Coord(5, 2), &quot;gem_green&quot;)
        )
        self.layer_main.add_game_object(
            squarity.GameObject(squarity.Coord(2, 4), &quot;gem_yellow&quot;)
        )
        self.layer_other.add_game_object(
            squarity.GameObject(squarity.Coord(2, 4), &quot;gem_green&quot;)
        )
        self.layer_other.add_game_object(
            squarity.GameObject(squarity.Coord(2, 4), &quot;gem_green&quot;)
        )

    def on_button_direction(self, direction):
        print(&quot;#&quot; * 20)
        if direction == squarity.dirs.Up:
            for gobj in S.seq_iter(
                S.iter_on_rect(self.rect),
                S.gobj_on_layers(self.layers)
            ):
                print(gobj)
        elif direction == squarity.dirs.Down:
            print(*S.seq_iter(
                S.iter_on_rect(self.rect),
                S.gobj_on_layers_by_coords(self.layers)
            ))
        elif direction == squarity.dirs.Left:
            for gobj in S.seq_iter(
                S.iter_on_rect(self.rect),
                S.gobj_on_layers(self.layers),
                S.filter_sprites([&quot;gem_green&quot;])
            ):
                print(gobj)
        elif direction == squarity.dirs.Right:
            for game_objects in S.seq_iter(
                S.iter_on_rect(self.rect),
                S.gobj_on_layers_by_coords(self.layers),
                S.filter_sprites([&quot;gem_green&quot;], True)
            ):
               print(*game_objects)
</code></pre>
<h3 id="récupérer-le-premier-game-object">Récupérer le premier Game Object <a class="header-anchor" href="#récupérer-le-premier-game-object">&#x1F517;</a></h3>
<p>Il est possible de récupérer directement le premier élément renvoyé par un séquenceur, au lieu d'itérer avec. Pour cela, utilisez la fonction <code>Sequencer.seq_first</code> à la place de <code>Sequencer.seq_iter</code>. Le fonctionnement des paramètres est le même. La fonction <code>seq_first</code> itère une seule fois sur la séquence que vous avez fournie et renvoie le premier élément. Si l'itération est vide, la fonction renvoie <code>None</code>.</p>
<p>Pour information, la fonction <code>GameModel.get_first_gobj</code> utilise un séquenceur.</p>
<h2 id="exemple-bonus--afficher-tous-les-sprites-existants">Exemple bonus : afficher tous les sprites existants <a class="header-anchor" href="#exemple-bonus--afficher-tous-les-sprites-existants">&#x1F517;</a></h2>
<p>Attention, cet exemple n'utilise pas le jeu des diamants. Vous devez sélectionner le jeu d'exemple H2O. C'est plus amusant ainsi, car H2O contient beaucoup d'images.</p>
<p>Dans la config, modifier l'information <code>version</code> de &quot;1.0.0&quot; vers &quot;2.1.0&quot;.</p>
<p>Ensuite, supprimez le code existant et remplacez-le par celui-ci:</p>
<pre><code>import json
import squarity

class GameModel(squarity.GameModelBase):

    def on_start(self):
        game_conf = json.loads(self.str_game_conf_json)

        seq = squarity.Sequencer.seq_iter(
            squarity.Sequencer.iter_on_rect(self.rect)
        )
        for coord, sprite_name in zip(seq, game_conf[&quot;img_coords&quot;].keys()):
            self.layer_main.add_game_object(
                squarity.GameObject(coord, sprite_name)
            )
</code></pre>
<p>Vous verrez tous les sprites du jeu affiché les uns après les autres dans l'aire de jeu.</p>
<p>Cet exemple de code fonctionne avec tous les jeux (à condition de les mettre en version 2). Il peut être utile si vous voulez vérifier que vous avez bien défini toutes les coordonnées de tous les noms de sprites.</p>

    </div>
</template>

<style lang="css" scoped src="@/styles/docArticle.css"></style>
