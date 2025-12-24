<template>
    <div class="doc-article">

<h1 id="documentation-de-référence-de-squarity-v1">Documentation de référence de Squarity V1 <a class="header-anchor" href="#documentation-de-référence-de-squarity-v1">&#x1F517;</a></h1>
<p><a href="http://squarity.fr">Squarity</a> est un espace de création et de partage de jeux vidéo jouables en ligne.</p>
<p>Ce manuel suppose que vous ayez déjà un minimum de connaissance en informatique (langage python, format JSON, ...). Pour les personnes qui débutent, vous pouvez lire <a href="https://github.com/darkrecher/squarity-doc/blob/master/user_manual/tutoriel_sokoban.md">le tutoriel soko-ban</a>, plus long mais plus détaillé.</p>
<p>Les jeux sont en 2D &quot;case par case&quot;, (comme les dames, le démineur, ...). L'aire de jeu est une grille composée de carrés, sur lesquels sont placés des éléments.</p>
<p>La &quot;game logic&quot; (le fonctionnement et les règles du jeu) est définie par du code en python.</p>
<p>Un jeu est défini par trois composants :</p>
<ul>
<li>tileset,</li>
<li>configuration,</li>
<li>&quot;game_code&quot;.</li>
</ul>
<h2 id="le-tileset">Le tileset <a class="header-anchor" href="#le-tileset">&#x1F517;</a></h2>
<p>Il s'agit d'une image au format jpg, png ou autre, contenant les éléments de votre jeu (décors, personnages, objets). Voici quelques exemples :</p>
<p><img src="../../assets/doc_img/h2o_tileset.png" alt="Le tileset original (et moche) de H2O" /></p>
<p><img src="../../assets/doc_img/tutorial_tileset.png" alt="Le tileset utilisé dans les mini exemples de tutoriels" /></p>
<p>Chaque élément de jeu est contenu dans un carré, qui ont tous la même taille en pixels.</p>
<p>Les pixels transparents, dans le format png, sont pris en compte.</p>
<p>Pour que votre tileset soit accessible dans Squarity, il doit être publié sur internet. Utilisez des sites d'hébergement d'images comme imgur ou imgbb. Récupérez le lien direct de votre fichier et indiquez-le dans le champ &quot;Url de l'image&quot;.</p>
<p>Si l'image n'est pas trop grande, vous pouvez également la convertir en url-data, avec un service en ligne comme <a href="https://ezgif.com/image-to-datauri">ezgif</a>.</p>
<h2 id="la-configuration">La configuration <a class="header-anchor" href="#la-configuration">&#x1F517;</a></h2>
<p>Il s'agit d'un texte, au format JSON. Voici un exemple :</p>
<pre><code>{
    &quot;version&quot;: &quot;1.0.0&quot;,
    &quot;tile_size&quot;: 32,
    &quot;img_coords&quot;: {
        &quot;X&quot;: [0, 0],
        &quot;.&quot;: [32, 0],
        &quot;H&quot;: [64, 0],
        &quot;C&quot;: [96, 0],
        &quot;water_right&quot;: [0, 32],
        &quot;water_down&quot;: [32, 32],
        &quot;water_left&quot;: [64, 32],
        &quot;water_up&quot;: [96, 32],
        &quot;O&quot;: [0, 256],
        &quot;wet_grid&quot;: [32, 256],
        &quot;S&quot;: [64, 256]
    }
}
</code></pre>
<p>Cette configuration est un dictionnaire (une &quot;correspondance&quot;), contenant deux éléments :</p>
<ul>
<li>le premier a pour clé <code>tile_size</code> et pour valeur un nombre. Il définit la taille, en pixels, de chacun des éléments du jeu, tel que vous les avez dessinés dans votre tileset.</li>
<li>le suivant a pour clé <code>img_coords</code> et pour valeur un sous-dictionnaire :
<ul>
<li>chacun de ses sous-éléments a pour clé un texte (de un ou plusieurs caractères), définissant un nom d'objet dans votre jeu. La valeur correspondante est une liste de deux nombres, indiquant les coordonnées du coin supérieur gauche, dans votre tileset, de l'image de cet objet du jeu.</li>
</ul>
</li>
</ul>
<p>Par défaut, l'aire de jeu a une largeur de 20 cases et une hauteur de 14 cases. Vous pouvez changer cette taille en ajoutant un élément dans la configuration :</p>
<pre><code>    &quot;game_area&quot;: {
        &quot;nb_tile_width&quot;: 22,
        &quot;nb_tile_height&quot;: 15
    }
</code></pre>
<h2 id="le-game_code">Le game_code <a class="header-anchor" href="#le-game_code">&#x1F517;</a></h2>
<p>Il s'agit d'un texte écrit en langage python.</p>
<p>Ce code doit décrire le contenu de l'aire de jeu (quels objets se trouvent sur quelle case) et ce qui se passe lorsque la personne qui joue appuie sur une touche de direction ou d'action.</p>
<p>Voici la structure minimale du code :</p>
<pre><code>class GameModel():

    def __init__(self):
        self.w = 20 # width (largeur) : 20 cases
        self.h = 14 # height (hauteur) : 14 cases
        self.tiles = [
            [
                [] for x in range(self.w)
            ]
            for y in range(self.h)
        ]

    def export_all_tiles(self):
        return self.tiles

    def on_game_event(self, event_name):
        pass
</code></pre>
<p>Ce code définit une classe <code>GameModel</code>, contenant la fonction <code>__init__</code> et deux callbacks, c'est à dire des fonctions appelées automatiquement par le système de jeu.</p>
<p>Vous pouvez bien entendu ajouter d'autres classes, d'autres fonctions, d'autres variables membres dans <code>GameModel</code>, etc.</p>
<h3 id="fonction-gamemodel__init__self">Fonction GameModel.__init__(self) <a class="header-anchor" href="#fonction-gamemodel__init__self">&#x1F517;</a></h3>
<p>Cette fonction est exécutée une seule fois, au début du jeu.</p>
<p>Ce n'est pas obligé d'initialiser une variable membre <code>self.tiles</code>, mais c'est une bonne pratique.</p>
<p>Cette variable membre est constituée d'un tableau de 20*14 cases, chacune contenant une liste vide. Si vous avez défini une autre taille dans la configuration, vous devez changer les variables <code>self.w</code> et <code>self.h</code>.</p>
<p>Vous pouvez ensuite remplir ce tableau, en ajoutant une ou plusieurs strings dans les listes vides. Ces strings correspondent aux noms des objets définis dans la partie <code>img_coords</code> de la configuration.</p>
<h3 id="fonction-gamemodelexport_all_tilesself">Fonction GameModel.export_all_tiles(self) <a class="header-anchor" href="#fonction-gamemodelexport_all_tilesself">&#x1F517;</a></h3>
<p>Cette fonction est appelée à chaque rendu (dessin à l'écran) de l'aire de jeu.</p>
<p>Il faut renvoyer un tableau 2D dont chaque case contient une liste de strings. Il faut donc renvoyer &quot;une liste de liste de liste de strings&quot;.</p>
<p>L'ordre des noms dans chacune des listes définit l'ordre de dessin des objets sur la case.</p>
<p>Cette fonction peut effectuer des traitements spécifiques, par exemple construire le nom d'un objet complexe et le placer dans une des cases. Le comportement le plus commun est de renvoyer directement <code>self.tiles</code>.</p>
<p>Cette fonction pourra, dans le futur, renvoyer d'autres informations sur la situation du jeu.</p>
<h3 id="fonction-gamemodelon_game_eventself-event_name">Fonction GameModel.on_game_event(self, event_name) <a class="header-anchor" href="#fonction-gamemodelon_game_eventself-event_name">&#x1F517;</a></h3>
<p>Cette fonction est appelée à chaque événement du jeu : une action de la personne qui joue, ou bien une action différée qui a été préalablement enregistrée.</p>
<p>Le paramètre <code>event_name</code> indique le type d'action. Il peut prendre les valeurs suivantes :</p>
<ul>
<li>&quot;U&quot; (up) : le bouton &quot;haut&quot; a été appuyé</li>
<li>&quot;D&quot; (down) : bouton &quot;bas&quot;</li>
<li>&quot;L&quot; (left) : bouton &quot;gauche&quot;</li>
<li>&quot;R&quot; (right) : bouton &quot;droit&quot;</li>
<li>&quot;action_1&quot; : bouton &quot;1&quot;</li>
<li>&quot;action_2&quot; : bouton &quot;2&quot;</li>
</ul>
<p>Ces événements sont également déclenchés par des appuis de touches sur le clavier (flèches de direction, touches &quot;1&quot; et &quot;2&quot;). Pour cela, le focus doit être sur l'aire de jeu ou sur les boutons (il faut avoir cliqué dessus).</p>
<p>Le paramètre <code>event_name</code> peut prendre d'autres valeurs, dans le cas des actions différées. Cette fonctionnalité n'est pas documentée pour l'instant.</p>
<p>La fonction <code>on_game_event</code> a pour charge de modifier la situation du jeu, c'est à dire le contenu de <code>self.tiles</code>, en fonction de l'événement. Elle implémente la plus grande partie de la &quot;game logic&quot;.</p>
<p>Un rendu complet de l'aire de jeu est déclenché après chaque appel de cette fonction. Sauf si on indique explicitement qu'on ne le veut pas (fonctionnement non documenté pour l'instant).</p>
<h2 id="données-renvoyées-par-on_game_event">Données renvoyées par on_game_event <a class="header-anchor" href="#données-renvoyées-par-on_game_event">&#x1F517;</a></h2>
<p>La fonction <code>on_game_event</code> peut renvoyer une chaîne de caractère JSON, contenant différentes indications que le moteur de Squarity interprétera. Ce n'est pas obligatoire, la fonction peut ne contenir aucune instruction <code>return</code>, dans ce cas elle renverra <code>None</code> et le moteur ne fera rien de plus.</p>
<p>Vous trouverez des exemples de ces JSON dans <a href="https://squarity.pythonanywhere.com/game/#fetchez_example_magician">le jeu du sorcier</a>.</p>
<h3 id="action-différée">Action différée <a class="header-anchor" href="#action-différée">&#x1F517;</a></h3>
<p>Ce JSON peut contenir une clé <code>delayed_actions</code>. La valeur doit être une liste de sous-dictionnaire, avec une clé <code>name</code> et une clé <code>delay_ms</code>.</p>
<p>Exemple de ligne de code renvoyant un JSON avec une action différée:</p>
<p><code>return &quot;&quot;&quot; { &quot;delayed_actions&quot;: [ {&quot;name&quot;: &quot;my_action&quot;, &quot;delay_ms&quot;: 500} ] } &quot;&quot;&quot;</code></p>
<p>Avec ce JSON, le moteur exécutera à nouveau la fonction <code>GameModel.on_game_event</code>, 500 millisecondes plus tard. Le paramètre <code>event_name</code> aura la valeur <code>&quot;my_action&quot;</code>.</p>
<p>Lors de cet exécution différée de <code>on_game_event</code>, il est tout à fait possible de renvoyer un autre JSON avec une (ou plusieurs) autres actions différées, et ainsi de suite.</p>
<h3 id="blocagedéblocage-de-linterface">Blocage/déblocage de l'interface <a class="header-anchor" href="#blocagedéblocage-de-linterface">&#x1F517;</a></h3>
<p>Le JSON peut contenir une clé <code>player_locks</code> et/ou une clé <code>player_unlocks</code>. Les valeurs doivent être des listes de chaînes de caractères.</p>
<p>Chaque chaîne correspond à une &quot;raison&quot; de bloquer l'interface de la personne qui joue.</p>
<p>L'interface est entièrement bloquée tant qu'il y a au moins une raison en cours : les boutons de directions et d'actions apparaissent en grisé, les touches de clavier et les clics de souris n'ont aucun effet dans le jeu.</p>
<p>Lorsque vous bloquez l'interface, il est fortement conseillé de prévoir en même temps un enchaînement d'action différée, qui finira par débloquer l'interface.</p>
<p>Ces blocages d'interface peuvent être utile pour montrer des animations prédéfinies, à regarder sans jouer.</p>
<p>Petit exemple :</p>
<ul>
<li>Vous renvoyez le JSON <code>&quot;&quot;&quot; { &quot;delayed_actions&quot;: [ {&quot;name&quot;: &quot;play_anim&quot;, &quot;delay_ms&quot;: 500} ], &quot;player_locks&quot;: [&quot;anim&quot;] } &quot;&quot;&quot;</code>, pour bloquer l'interface tout en planifiant l'action différée <code>&quot;play_anim&quot;</code>.</li>
<li>Cette action différée déclenchera éventuellement d'autres actions différées.</li>
<li>Au bout d'un moment, l'une de ces actions renvoie le JSON <code>&quot;&quot;&quot; { &quot;player_unlocks&quot;: [&quot;anim&quot;] } &quot;&quot;&quot;</code> pour débloquer l'interface.</li>
</ul>
<p>Si vous avez bloqué l'interface avec plusieurs raisons différentes et que vous ne savez plus trop lesquelles, vous pouvez renvoyer le déblocague <code>*</code> pour supprimer en une fois toutes les raisons en cours. Exemple : <code>&quot;&quot;&quot; { &quot;player_unlocks&quot;: [&quot;*&quot;] } &quot;&quot;&quot;</code></p>
<h3 id="annulation-du-rendu">Annulation du rendu <a class="header-anchor" href="#annulation-du-rendu">&#x1F517;</a></h3>
<p>Si la fonction <code>on_game_event</code> ne change pas la disposition des game objects, vous pouvez indiquer au moteur de Squarity que ce n'est pas la peine de redessiner l'aire de jeu. Ça permet d'optimiser l'exécution de votre jeu.</p>
<p>Le JSON peut contenir une clé <code>redraw</code>, qui vaut 1 par défaut. Si vous la définissez à 0, le rendu n'est pas effectué pour cette fois.</p>
<p>Exemple : <code>&quot;&quot;&quot;{ &quot;redraw&quot;: 0 }&quot;&quot;&quot;</code></p>
<p>Il est bien entendu possible d'avoir plusieurs clés en même temps, et plusieurs éléments dans les listes, le tout dans un même JSON. Vous pourriez, en une seule fois, planifier 10 actions différées, bloquer l'interface pour 15 raisons différentes, la débloquer pour 20 autres raisons, le tout en annulant le rendu.</p>
<h2 id="démarrer-le-jeu">Démarrer le jeu <a class="header-anchor" href="#démarrer-le-jeu">&#x1F517;</a></h2>
<p>Cliquez sur le bouton &quot;Exécuter&quot; au milieu de la page. Le jeu est entièrement réinitialisé, la classe <code>GameModel</code> est reconstruite à partir du nouveau game_code.</p>
<p>Si l'url du tileset a changée, l'image est rechargée. Si vous avez modifié votre tileset mais que l'url est restée la même, vous devez changer l'url, exécuter le jeu, puis remettre l'ancienne url. Ce petit désagrément sera corrigé dès que possible.</p>
<p>Pour l'instant, il n'est pas possible de sauvegarder la partie en cours. Le jeu recommence au début à chaque exécution et à chaque rechargement de la page.</p>
<h2 id="quelques-détails-techniques">Quelques détails techniques <a class="header-anchor" href="#quelques-détails-techniques">&#x1F517;</a></h2>
<p>Le game_code doit être codé en python version 3.7.4, il est exécuté par votre navigateur web, grâce à <a href="https://github.com/iodide-project/pyodide">Pyodide</a>. Ça fonctionne plus ou moins bien sur les smartphones, selon leur type et beaucoup d'autres choses.</p>
<p>Lorsque votre code python comporte des erreurs, celles-ci apparaissent dans la zone de texte en bas de la page.</p>
<p>Lorsque vous appelez la fonction <code>print(&quot;message&quot;)</code>, le texte s'affiche également dans cette zone de texte. Vous pouvez utiliser cette fonctionnalité pour debugger et pour le jeu lui-même.</p>
<p>Évitez de déclencher des prints trop fréquents, car cela ralentit l'exécution. Chaque print modifie le DOM (la structure interne de la page web) et prend donc un peu de temps.</p>
<p>Une bonne pratique serait d'avoir une fonction <code>debug(message)</code>, exécutant un print uniquement si un booléen global <code>debug_mode</code> est mis à True. Avant la distribution de votre jeu, mettez ce booléen à False.</p>

    </div>
</template>

<style lang="css" scoped src="@/styles/docArticle.css"></style>
