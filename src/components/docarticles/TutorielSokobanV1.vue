<template>
    <div class="doc-article">

<h1 id="tutoriel-soko-ban-v1">Tutoriel Soko-ban (V1) <a class="header-anchor" href="#tutoriel-soko-ban-v1">&#x1F517;</a></h1>
<p>Ce tutoriel vous permet de créer un petit jeu simple avec la version V1 de Squarity. Il s'agit d'un <a href="https://fr.wikipedia.org/wiki/Sokoban">soko-ban</a>, un jeu dans lequel un personnage doit pousser des caisses pour les ranger.</p>
<p>Squarity utilise le langage de programmation python et le format de description de données JSON. Vous n'avez pas besoin de connaître ces notions, mais ça peut aider. Si vous souhaitez découvrir ou approfondir ces sujets, voici <a href="https://python.developpez.com/cours/">un lien vers des cours de python</a>, et la <a href="https://fr.wikipedia.org/wiki/JavaScript_Object_Notation">la page Wikipedia sur le JSON</a>.</p>
<p>Ce tutoriel est un peu long, mais chacune des étapes que vous effectuez vous récompense par un résultat visible dans l'interface de jeu, ce qui permet de garder le courage de continuer.</p>
<h2 id="le-tileset">Le tileset <a class="header-anchor" href="#le-tileset">&#x1F517;</a></h2>
<p>Pour commencer, il faudrait dessiner un &quot;tileset&quot;, c'est à dire une image contenant tous les éléments affichés dans votre jeu.</p>
<p>En voici un déjà prêt :</p>
<p><img src="../../assets/doc_img/sokoban_tileset.png" alt="https://raw.githubusercontent.com/darkrecher/squarity-doc/master/user_manual/sokoban_tileset.png" /></p>
<p>Il comporte 5 images d'objets :</p>
<ul>
<li>un sol avec de l'herbe</li>
<li>un mur</li>
<li>une caisse</li>
<li>le personnage</li>
<li>une cible, représentant un endroit où placer une caisse.</li>
</ul>
<p>Ce tileset comporte des pixels transparents. Si vous créez le vôtre, vous aurez peut-être besoin d'un logiciel gérant la transparence (donc, quelque chose de mieux que Paint).</p>
<p>Le tileset doit être publié sur internet et vous devez connaître son url. Vous pouvez utiliser pour cela des sites d'hébergement d'images, comme https://imgbb.com/ . Lorsque l'image est publiée, vous devez récupérer l'url directe vers le fichier. En général, c'est possible avec un clic droit sur l'image, puis l'option &quot;ouvrir l'image dans un nouvel onglet&quot;. L'url se trouve alors dans la barre d'adresse de votre navigateur web.</p>
<p>Pour vous simplifier la vie, le tileset de ce tutoriel est déjà publié, son url est : https://raw.githubusercontent.com/darkrecher/squarity-doc/master/user_manual/sokoban_tileset.png</p>
<h2 id="un-peu-dherbe">Un peu d'herbe <a class="header-anchor" href="#un-peu-dherbe">&#x1F517;</a></h2>
<p>Nous allons créer un premier programme qui fonctionne, mais qui ne constitue pas encore un vrai jeu. Allez sur le site http://squarity.fr .</p>
<p>Vous verrez un jeu de démonstration, que nous allons remplacer.</p>
<p>Dans le champ <em>&quot;Url de l'image&quot;</em>, supprimez le texte existant, puis copier-collez le texte suivant :</p>
<p><code>https://raw.githubusercontent.com/darkrecher/squarity-doc/master/user_manual/sokoban_tileset.png</code></p>
<p>Dans le champ en-dessous <em>&quot;Config du jeu (en JSON)&quot;</em>, remplacez le texte existant par cette configuration :</p>
<pre><code>{
    &quot;version&quot;: &quot;1.0.0&quot;,
    &quot;tile_size&quot;: 32,
    &quot;img_coords&quot;: {
        &quot;herbe&quot;: [0, 0]
    }
}
</code></pre>
<p>Dans le dernier champ : <em>&quot;Le code du jeu (en python)&quot;</em>, remplacez le texte existant par ce code :</p>
<pre><code>class GameModel():

    def __init__(self):

        self.w = 20
        self.h = 14
        self.tiles = []

        for y in range(self.h):
            ligne = []
            for x in range(self.w):
                game_objects = []
                ligne.append(game_objects)
            self.tiles.append(ligne)

        self.tiles[3][5].append(&quot;herbe&quot;)

    def export_all_tiles(self):
        return self.tiles
</code></pre>
<p>Puis cliquez sur le bouton &quot;Exécuter&quot; au milieu de la page.</p>
<p>Vous devriez voir un petit morceau d'herbe dans le cadre de droite. Youpi !</p>
<p>Votre écran devrait ressembler à ceci (certains boutons ont été supprimés pour simplifier l'image) :</p>
<p><img src="../../assets/doc_img/tuto_screenshot_01.png" alt="https://raw.githubusercontent.com/darkrecher/squarity-doc/master/user_manual/tuto_screenshot_01.png" /></p>
<h2 id="bidouillons-un-peu">Bidouillons un peu <a class="header-anchor" href="#bidouillons-un-peu">&#x1F517;</a></h2>
<p>Nous allons modifier le code, pour essayer de comprendre ce que font certaines parties.</p>
<p>À chaque modification, vous devez recliquer sur le bouton &quot;Exécuter&quot;. Pour aller plus vite, vous pouvez utiliser le raccourci clavier Ctrl-Entrée.</p>
<p>Si votre code est incorrect, un message d'erreur apparaîtra en bas, que vous ne comprendrez pas forcément. Le plus simple est alors de revenir à une version du jeu qui fonctionne : faites des Ctrl-Z, ou au pire refaites les copié-collés du chapitre précédent.</p>
<p>Dans la configuration du jeu, sur la ligne <code>&quot;herbe&quot;: [0, 0]</code>, remplacez l'un des deux zéros par un nombre entre 1 et 64 et regardez le résultat. Modifiez l'autre nombre. Essayez de comprendre ce qu'ils représentent. Pour vous aidez, vous pouvez réafficher dans un autre onglet l'image du tileset que nous avons vu dans le premier chapitre.</p>
<p>Toujours dans la configuration du jeu, sur la ligne <code>&quot;tile_size&quot;: 32,</code>, remplacez le &quot;32&quot; par un autre nombre, entre 1 et 100. Essayez de comprendre ce que ce nombre représente.</p>
<p>Dans le code du jeu, sur la ligne <code>self.tiles[3][5].append(&quot;herbe&quot;)</code>, remplacez l'un des deux nombres par un nombre entre 0 et 13. Modifiez l'autre nombre. Essayez de comprendre ce que ces nombres représentent.</p>
<p>Lequel définit l'abscisse (X) du carré d'herbe ? Lequel définit son ordonnée (Y) ? Est-ce que l'un des deux nombres pourrait être plus grand que 13 ? Modifiez-le pour vérifier. Quelle est la valeur maximale pour X et la valeur maximale pour Y ?</p>
<p>Dupliquez la ligne :</p>
<pre><code>        self.tiles[3][5].append(&quot;herbe&quot;)
</code></pre>
<p>Attention à l'indentation, il faut garder les espaces au début. Dans la ligne dupliquée, modifiez le 3 et le 5. Que voyez-vous dans l'aire de jeu ?</p>
<p>Vous pouvez re-dupliquer la ligne plusieurs fois si vous le souhaitez.</p>
<p>Ne vous embêtez pas à la dupliquer des dizaines de fois pour remplir d'herbe toute l'aire de jeu. Il y a une méthode plus simple que nous verrons juste après.</p>
<p>Pour finir, appuyez sur les boutons du jeu : les flèches ou les actions 1 et 2. Votre jeu va planter et affichera un message d'erreur. C'est normal, nous réglerons ça dans une étape ultérieure.</p>
<h2 id="quelques-explications-concernant-le-code">Quelques explications concernant le code <a class="header-anchor" href="#quelques-explications-concernant-le-code">&#x1F517;</a></h2>
<p>Le champ <em>&quot;config du jeu (en JSON)&quot;</em> ne contient pas votre programme, mais des informations structurées.</p>
<p>La ligne avec le mot <code>tile_size</code> définit la taille des images (en pixels) dans le tileset. On gardera la valeur 32, sinon ça fait n'importe quoi.</p>
<p>Les informations dans <code>img_coords</code> définissent tous les types d'objets que vous utilisez dans votre jeu. Pour l'instant, il n'y en a qu'un seul, qui s'appelle &quot;herbe&quot;.</p>
<p>Les deux valeurs entre crochets correspondent aux coordonnées, dans le tileset, de la portion d'image de ce type d'objet. Il s'agit des coordonnées du coin supérieur gauche. On rajoutera très vite les autres types d'objets.</p>
<p>Le champ <em>&quot;code du jeu (en python)&quot;</em> contient votre programme. Ce programme doit définir une classe intitulée <code>GameModel</code>.</p>
<p>Tout le code qui vient après définit trois fonctions dans cette classe :</p>
<ul>
<li>la fonction <code>__init__</code>: la plus longue.</li>
<li>la fonction <code>export_all_tiles</code>, qui ne contient qu'une ligne de code.</li>
</ul>
<p>Dans un environnement python plus classique, vous devez &quot;instancier&quot; votre classe pour l'utiliser après. Vous n'avez pas besoin de faire ça avec <code>GameModel</code>. Le système dans Squarity s'occupe de l'instancier et d'appeler les bonnes fonctions aux bons moments.</p>
<p>Cependant, rien ne vous empêche de créer vos propres classes et de les instancier quand vous en avez besoin.</p>
<p>Dans le code, les noms de variables commençant par <code>self.</code> signifient qu'elles appartiennent à la classe. Elles sont accessible en lecture et en écriture depuis toutes les fonctions de la classe. Leur valeur est conservée entre deux &quot;tours&quot; de jeu.</p>
<p>Les variables ne commençant pas par <code>self.</code>, par exemple <code>ligne</code> ou <code>game_objects</code> ne sont pas conservées. Vous les définissez et les utilisez dans une fonction, ensuite elles sont effacées.</p>
<p>Vous n'avez pas besoin de savoir ce que signifie une &quot;classe&quot;, ni &quot;instancier une classe&quot; pour la suite de ce tutoriel. Si ça vous intéresse, vous pouvez consulter des cours de python.</p>
<p>Les variables <code>self.w</code> et <code>self.h</code> définissent la taille de l'aire de jeu, en nombre de cases.</p>
<ul>
<li>w = width = largeur = 20 cases,</li>
<li>h = height = hauteur = 14 cases.</li>
</ul>
<p>La variable <code>self.tiles</code> est importante. Elle contient tous les objets à afficher dans le jeu. C'est un tableau en deux dimensions. Chaque case de ce tableau peut contenir plusieurs objets du jeu. Chacun est identifié par une chaîne de caractère, correspondant à son nom.</p>
<p>Au départ, nous avons ajouté un seul objet de jeu dans une seule case du tableau. Il a pour nom : &quot;herbe&quot;.</p>
<p>Selon ce que vous avez bidouillé dans le chapitre précédent, vous en avez peut-être ajouté d'autres.</p>
<p><img src="../../assets/doc_img/annotations_code.png" alt="https://raw.githubusercontent.com/darkrecher/squarity-doc/master/user_manual/annotations_code.png" /></p>
<h2 id="plein-dherbe">Plein d'herbe <a class="header-anchor" href="#plein-dherbe">&#x1F517;</a></h2>
<p>Dans le code du jeu, remplacez la ligne</p>
<pre><code>                game_objects = []
</code></pre>
<p>par</p>
<pre><code>                game_objects = [&quot;herbe&quot;]
</code></pre>
<p>Exécutez votre jeu. Vous devriez voir de l'herbe partout.</p>
<p>La ligne que vous venez de modifier se trouve dans une boucle (pour être exact : dans une boucle de boucle). Elle est exécutée pour chaque case de l'aire de jeu, ce qui ajoute de l'herbe partout.</p>
<p>La ligne <code>self.tiles[3][5].append(&quot;herbe&quot;)</code> n'est plus utile, mais on va la garder pour l'instant.</p>
<h2 id="attention-à-lindentation">Attention à l'indentation <a class="header-anchor" href="#attention-à-lindentation">&#x1F517;</a></h2>
<p>Vous avez peut-être un peu de mal à comprendre entièrement le code du jeu. Ne vous inquiétez pas, ça n'empêche pas de terminer ce tutoriel.</p>
<p>Il y a cependant un point très important à prendre en compte avec le langage de programmation python : l'indentation est significative. Autrement dit : faites attention aux espaces qui se trouvent au début de chaque ligne, ils servent à indiquer la manière dont les blocs de code sont imbriqués.</p>
<p>Pour une explication plus détaillée, consultez <a href="https://python.developpez.com/cours/DiveIntoPython/php/frdiveintopython/getting_to_know_python/indenting_code.php">cette page</a></p>
<h2 id="un-deuxième-type-dobjet">Un deuxième type d'objet <a class="header-anchor" href="#un-deuxième-type-dobjet">&#x1F517;</a></h2>
<p>L'herbe c'est bien, mais un peu monotone. Nous allons ajouter un nouveau type.</p>
<p>Remplacez la configuration du jeu par ceci :</p>
<pre><code>{
    &quot;version&quot;: &quot;1.0.0&quot;,
    &quot;tile_size&quot;: 32,
    &quot;img_coords&quot;: {
        &quot;herbe&quot;: [0, 0],
        &quot;mur&quot;: [32, 0]
    }
}
</code></pre>
<p>Vous avez maintenant deux types d'objets, l'herbe et le mur. N'oubliez pas la virgule entre les deux.</p>
<p>Puis, dans le code du jeu, à la ligne <code>self.tiles[3][5].append(&quot;herbe&quot;)</code>, remplacez le mot <code>&quot;herbe&quot;</code> par <code>&quot;mur&quot;</code>. Attention de bien garder les guillemets.</p>
<p>Exécutez le jeu. Vous devriez voir de l'herbe et un objet de type mur.</p>
<h2 id="vocabulaire-spécifique-à-squarity">Vocabulaire spécifique à Squarity <a class="header-anchor" href="#vocabulaire-spécifique-à-squarity">&#x1F517;</a></h2>
<p>Une image utilisée pour afficher un élément dans l'aire de jeu s'appelle <strong>image de tile</strong>. Autres appellations : <strong>image de tuile</strong>, <strong>tile image</strong>, ou tout simplement <strong>image</strong>.</p>
<p>La grande image contenant toutes les images de tile s'appelle le <strong>tileset</strong>. Autres appellations : <strong>tilesheet</strong>, <strong>image set</strong>, <strong>image atlas</strong>, <strong>atlas</strong>. On utilise le mot &quot;atlas&quot; pour représenter le fait que c'est un ensemble exhaustif, comme les atlas de cartes géographiques.</p>
<p>Ce qui est affichée dans la partie droite de l'écran s'appelle <strong>l'aire de jeu</strong>. C'est là où tout se déroule : les personnages se déplacent, ramassent des objets, discutent entre eux, etc.</p>
<p>Une case dans l'aire de jeu s'appelle une <strong>tile</strong>. Autres appellations : <strong>tuile</strong>, <strong>case</strong>. Ces tiles sont organisées sous forme d'un tableau en deux dimensions. Dans notre programme, ce tableau est enregistré dans la variable <code>self.tiles</code>.</p>
<p>Pour repérer une tile dans ce tableau, on utilise les coordonnées x et y.</p>
<p>X augmente lorsqu'on va vers la droite. Les tiles tout à gauche ont pour coordonnée x = 0. Les tiles tout à droite ont pour coordonnée x = 19.</p>
<p>Y augmente lorsqu'on va vers le bas. Les tiles tout en haut ont pour coordonnée y = 0. Les tiles tout en bas ont pour coordonnée y = 13.</p>
<p>Pour info : les graphiques des cours de maths ont la coordonnée Y dans l'autre sens : Y augmente lorsqu'on va vers le haut. En programmation, on préfère que l'axe des Y soit orienté vers le bas. C'est plus logique car ça correspond au sens de lecture et à l'ordre des pixels sur l'écran.</p>
<p>Les coordonnées sont comptées à partir de zéro, et non à partir de un, parce que c'est comme ça qu'on fait en informatique. Il y a une justification, mais ce serait un peu long de l'expliquer ici.</p>
<p>Un élément placé dans une tile s'appelle un <strong>objet de jeu</strong>. Autres appellations : <strong>game object</strong>, <strong>gamobj</strong>, <strong>gobject</strong>, <strong>gobj</strong>. Il peut y avoir plusieurs game objects sur une même tile. Ils seront dessinés les uns par-dessus les autres.</p>
<p>Chaque game object est défini par son <strong>type de game object</strong>. Autre appellation : <strong>game object type</strong>. Dans notre programme, les mots &quot;herbe&quot; et &quot;mur&quot; sont des types de game object.</p>
<p>Il faut essayer d'utiliser ce vocabulaire pour les noms de variables dans vos programmes, afin qu'il devienne commun aux personnes utilisant Squarity.</p>
<p>On évitera d'utiliser les mots &quot;objet&quot; et &quot;type&quot; tout seul, car ce sont des termes trop génériques, qui sont déjà beaucoup utilisés en programmation.</p>
<p>On peut se permettre d'utiliser les noms anglais (&quot;game object&quot;, &quot;tile&quot;, ...) dans un texte français, puisque la langue française possède déjà des anglicismes. Vous pouvez aussi faire le contraire, car la langue anglaise possède des francicismes. Ha ha ha.</p>
<p>Dans notre programme, nous avons commencé par placer dans chaque tile un seul game object, de type &quot;herbe&quot;. Puis, pour la tile qui est aux coordonnées (x=5, y=3), nous avons ajouté un second game object, de type &quot;mur&quot;.</p>
<p><img src="../../assets/doc_img/schema_self_tiles.png" alt="https://raw.githubusercontent.com/darkrecher/squarity-doc/master/user_manual/schema_self_tiles.png" /></p>
<p>Dans la tile x=5, y=3, on ne voit pas le game object &quot;herbe&quot;, car le game object &quot;mur&quot; est dessiné par dessus et la recouvre entièrement. Mais cette tile possède bien deux game objects.</p>
<h2 id="quelques-règles-du-fonctionnement-de-squarity">Quelques règles du fonctionnement de Squarity <a class="header-anchor" href="#quelques-règles-du-fonctionnement-de-squarity">&#x1F517;</a></h2>
<ul>
<li>On peut créer et supprimer les game objects dans les tiles, et les déplacer d'une tile vers une autre.</li>
<li>Une tile peut contenir autant de game objects que l'on veut.</li>
<li>Une tile peut posséder plusieurs game objects de même type.</li>
<li>L'ordre des game objects dans une tile est important, car il définit l'ordre dans lequel ils seront affichés.</li>
<li>On ne peut pas déplacer, ajouter ou supprimer les tiles elles-mêmes. Ce sont les cases du tableau, et le tableau ne change pas.</li>
<li>Il est possible de changer la taille de l'aire de jeu, mais ce n'est pas expliqué dans ce tutoriel.</li>
<li>On ne peut pas placer un game object sur plusieurs tiles en même temps.</li>
<li><strong>On ne peut pas placer un game object à cheval sur plusieurs tiles</strong>. Les coordonnées sont forcément des nombres entiers. Vous ne pourrez donc jamais avoir un personnage qui se déplace légèrement et se retrouve entre deux tiles, comme dans le premier Zelda ou dans les jeux Bombermans. C'est un choix de conception dans Squarity, pour simplifier la création des jeux.</li>
</ul>
<p>Les types de game object d'un jeu sont tous référencés dans la donnée <code>img_coords</code> de la configuration.</p>
<h2 id="une-liste-de-liste-de-liste">Une liste de liste de liste <a class="header-anchor" href="#une-liste-de-liste-de-liste">&#x1F517;</a></h2>
<p>La notion de &quot;tableau&quot; n'existe pas vraiment en python, on ne peut créer que des listes.</p>
<p>Mais on peut créer une liste contenant des listes.</p>
<ul>
<li>La variable <code>self.tiles</code> est une liste de 14 éléments, représentant les 14 lignes de l'aire de jeu,
<ul>
<li>chacun de ces éléments est une sous-liste de 20 éléments, représentant les 20 cases d'une ligne de l'aire de jeu,
<ul>
<li>chacun de ces éléments est une sous-sous-liste ayant un nombre variable d'éléments, représentant les game objects de la case,
<ul>
<li>chacun de ces éléments est un nom, correspondant à un type de game object.</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>
<p>Lorsqu'on accède à des listes imbriquées, on donne les index dans le même ordre d'imbrication.</p>
<p>Le code <code>self.tiles[3][5]</code> signifie : &quot;la ligne numéro 3, et dans cette ligne, la case numéro 5&quot;. On indique d'abord l'ordonnée (le y), et ensuite l'abscisse (le x).</p>
<p>L'accès à la tile de coordonnée (x, y) se fait avec ce code : <code>self.tiles[y][x]</code>. C'est embarrassant, car l'ordre est inversé par rapport à d'habitude (d'abord le x, puis le y).</p>
<p>Pour avoir un code plus clair, nous allons créer une petite fonction qui renvoie une tile, avec les paramètres dans l'ordre.</p>
<p>Rajoutez ceci à la fin du code du jeu :</p>
<pre><code>    def get_tile(self, x, y):
        return self.tiles[y][x]
</code></pre>
<p>Et ensuite, remplacez la ligne :</p>
<pre><code>        self.tiles[3][5].append(&quot;mur&quot;)
</code></pre>
<p>par la ligne :</p>
<pre><code>        self.get_tile(5, 3).append(&quot;mur&quot;)
</code></pre>
<p>Pensez à bien garder le même nombre d'espace au début de la ligne.</p>
<p>Exécutez le jeu. Vous verrez la même chose qu'avant, mais maintenant nous avons une fonction qui remet les coordonnées dans l'ordre habituel.</p>
<p>La fonction <code>append(&quot;game_object_type&quot;)</code> permet d'ajouter un game object dans une tile. La fonction <code>remove(&quot;game_object_type&quot;)</code> permet d'en supprimer un. Vous pouvez utiliser ces deux fonctions juste après un appel à la fonction <code>self.get_tile(x, y)</code>.</p>
<p>Attention à la fonction <code>remove</code>. Si vous indiquez un type de game object qui n'est pas présent dans la tile, ça fera une erreur. Vous pouvez vérifier préalablement la présence d'un game object comme ceci :</p>
<pre><code>if &quot;mur&quot; in self.get_tile(5, 3):
    self.get_tile(5, 3).remove(&quot;mur&quot;)
</code></pre>
<h2 id="des-prints-des-prouts-et-du-python-pur">Des prints, des prouts, et du python pur <a class="header-anchor" href="#des-prints-des-prouts-et-du-python-pur">&#x1F517;</a></h2>
<p>Au tout début du code du jeu, avant <code>class GameModel()</code>, ajoutez une ligne, et écrivez :</p>
<p><code>print(&quot;prout&quot;)</code></p>
<p>Exécutez le jeu. Vous devriez voir apparaître, dans la fenêtre en bas, le texte &quot;prout&quot;.</p>
<p>Juste après la ligne :</p>
<pre><code>        self.get_tile(5, 3).append(&quot;mur&quot;)
</code></pre>
<p>ajoutez ceci :</p>
<pre><code>        print(self.tiles)
</code></pre>
<p>Exécutez le jeu. Vous devriez voir apparaître un grand texte avec beaucoup de mots &quot;herbe&quot;. Il s'agit du contenu complet de <code>self.tiles</code>.</p>
<p>Tout est écrit sur une seule ligne, c'est un peu difficile à lire. Essayez de repérer les double crochets ouvrants <code>[[</code> et fermants <code>]]</code>, ils marquent la coupure entre deux lignes de tiles. Vous devriez aussi trouver le mot &quot;mur&quot;.</p>
<p>La fonction <code>print</code> écrit ce que vous lui indiquez en paramètre. Du texte simple lorsqu'il est mis entre guillemets, ou bien le contenu d'une variable.</p>
<p>Cette fonction est très utile pour le déboguage, c'est à dire lorsque votre programme fait des messages d'erreur ou qu'il n'exécute pas ce que vous aviez prévu. Vous placez des <code>print</code> à différents endroits pour essayer de comprendre ce qu'il se passe, le chemin d'exécution, le contenu des variables, etc.</p>
<p>Si vous n'êtes pas très à l'aise en python, vous pouvez vous entrainer en allant sur ce site : https://trinket.io/python3 . Il s'agit d'un interpréteur python dans votre navigateur. Vous écrivez du code dans la partie gauche, vous cliquez sur le bouton &quot;Play&quot; et le résultat de votre programme s'affiche dans la partie droite.</p>
<h2 id="on-en-fait-des-caisses">On en fait des caisses <a class="header-anchor" href="#on-en-fait-des-caisses">&#x1F517;</a></h2>
<p>Pour cette étape, vous allez essayer de vous débrouiller un peu tout seul.</p>
<p>Vous devez faire les modifications nécessaires pour afficher une caisse à côté du mur :</p>
<p><img src="../../assets/doc_img/tuto_screenshot_mur_et_caisse.png" alt="https://raw.githubusercontent.com/darkrecher/squarity-doc/master/user_manual/tuto_screenshot_mur_et_caisse.png" /></p>
<p>Dans la configuration du jeu, ajoutez un type de game object appelé &quot;caisse&quot;. Définissez ses coordonnnées d'image à <code>[64, 0]</code>. N'oubliez pas les virgules entre chaque définition de type de game object.</p>
<p>Dans le code du jeu, copiez la ligne <code>self.get_tile(5, 3).append(&quot;mur&quot;)</code> et collez-la juste en dessous (attention aux espaces en début de ligne !).</p>
<p>Dans cette nouvelle ligne de code, modifiez les coordonnées : la tile choisie doit être un peu plus à droite.</p>
<p>Ensuite, modifiez le type d'objet : il faut que ce soit &quot;caisse&quot;.</p>
<p>Si vous n'y arrivez pas, ce n'est pas trop grave, vous pouvez quand même passer au chapitre suivant.</p>
<h2 id="plein-dobjets-et-un-plan-du-niveau">Plein d'objets et un plan du niveau <a class="header-anchor" href="#plein-dobjets-et-un-plan-du-niveau">&#x1F517;</a></h2>
<p>Dans le champ <em>&quot;Config du jeu&quot;</em>, supprimer l'ancien texte et copier-collez la configuration suivante :</p>
<pre><code>{
    &quot;version&quot;: &quot;1.0.0&quot;,
    &quot;tile_size&quot;: 32,
    &quot;img_coords&quot;: {
        &quot;herbe&quot;: [0, 0],
        &quot;mur&quot;: [32, 0],
        &quot;caisse&quot;: [64, 0],
        &quot;personnage&quot;: [0, 32],
        &quot;cible&quot;: [32, 32]
    }
}
</code></pre>
<p>Dans le champ : <em>&quot;Le code du jeu&quot;</em>, supprimer l'ancien texte et copier-collez le code suivant :</p>
<pre><code>PLAN_DU_NIVEAU = (
    &quot;                    &quot;,
    &quot;                $   &quot;,
    &quot;                    &quot;,
    &quot;    ######          &quot;,
    &quot;    #.              &quot;,
    &quot;    ####            &quot;,
    &quot;         $   @      &quot;,
    &quot;                    &quot;,
    &quot;           #    #   &quot;,
    &quot;           #    #   &quot;,
    &quot;           # .$ #   &quot;,
    &quot;           #  . #   &quot;,
    &quot;           ######   &quot;,
    &quot;                    &quot;,
)

corresp_game_objects_a_partir_char = {
    &quot; &quot;: [&quot;herbe&quot;],
    &quot;#&quot;: [&quot;mur&quot;],
    &quot;@&quot;: [&quot;personnage&quot;],
    &quot;$&quot;: [&quot;caisse&quot;],
    &quot;.&quot;: [&quot;cible&quot;]
}

class GameModel():

    def __init__(self):

        self.w = 20
        self.h = 14
        self.tiles = []

        for y in range(self.h):
            ligne_plan_du_niveau = PLAN_DU_NIVEAU[y]
            ligne = []
            for x in range(self.w):
                char_carte = ligne_plan_du_niveau[x]
                game_objects = corresp_game_objects_a_partir_char[char_carte]
                game_objects = list(game_objects)
                ligne.append(game_objects)
            self.tiles.append(ligne)

    def export_all_tiles(self):
        return self.tiles

    def get_tile(self, x, y):
        return self.tiles[y][x]

</code></pre>
<p>Exécutez le jeu. Vous devriez voir ceci :</p>
<p><img src="../../assets/doc_img/tuto_screenshot_level_map.png" alt="https://raw.githubusercontent.com/darkrecher/squarity-doc/master/user_manual/tuto_screenshot_level_map.png" /></p>
<p>Que constate-t-on ? C'est très moche !</p>
<h2 id="bidouillons-un-peu-et-rendons-ça-plus-beau">Bidouillons un peu et rendons ça plus beau <a class="header-anchor" href="#bidouillons-un-peu-et-rendons-ça-plus-beau">&#x1F517;</a></h2>
<p>Dans le programme que vous avez copié-collé, à quel endroit est définie la disposition des game objects dans l'aire de jeu ? Essayez de changer cette disposition, par exemple en ajoutant ou en supprimant des caisses et des murs.</p>
<p>Essayez de comprendre pourquoi c'est moche. Quel est le problème avec les tiles contenant une cible, une caisse ou un personnage ? Qu'est-ce qu'il manque dans ces tiles ? Que faudrait-il faire pour qu'elles s'affichent en moins moche ?</p>
<p>Le plan du niveau est un ensemble de textes, contenant uniquement les caractères <code>#   @ $ .</code>. Pourtant, les noms de vos types d'objets sont : &quot;herbe&quot;, &quot;mur&quot;, &quot;caisse&quot;, &quot;personnage&quot;, &quot;cible&quot;. À quel caractère correspond quel type d'objet ?</p>
<p>Dans le programme, où est définie cette correspondance entre les caractères du plan du niveau et le nom des game objects ?</p>
<p>Pour que l'affichage soit moins moche, vous avez uniquement besoin de modifier cette correspondance. Pas besoin de changer le reste du code.</p>
<p>Petit indice : si on prend le caractère &quot;$&quot;, celui-ci correspond à <code>[&quot;caisse&quot;]</code>, c'est à dire : une liste avec un seul game object dedans, qui est de type &quot;caisse&quot;.</p>
<p>Dans un chapitre précédent, lorsqu'on avait fait un print de la variable self.tiles, l'une des cases avait pour valeur : <code>['herbe', 'mur']</code>.</p>
<p>Cette valeur peut également s'écrire avec des guillemets double : <code>[&quot;herbe&quot;, &quot;mur&quot;]</code>. Elle signifie : une liste avec deux game objects dedans. Le premier est de type &quot;herbe&quot;, le second de type &quot;mur&quot;.</p>
<p>Et si vous mettiez des listes de plusieurs game objects dans la correspondance ente caractères et game objects ? Ce sera peut-être mieux que d'avoir des listes de un seul game object.</p>
<h2 id="la-réponse-pour-que-ce-soit-plus-beau">La réponse pour que ce soit plus beau <a class="header-anchor" href="#la-réponse-pour-que-ce-soit-plus-beau">&#x1F517;</a></h2>
<p>Dans le code du jeu, remplacez cette partie :</p>
<pre><code>corresp_game_objects_a_partir_char = {
    &quot; &quot;: [&quot;herbe&quot;],
    &quot;#&quot;: [&quot;mur&quot;],
    &quot;@&quot;: [&quot;personnage&quot;],
    &quot;$&quot;: [&quot;caisse&quot;],
    &quot;.&quot;: [&quot;cible&quot;]
}
</code></pre>
<p>Par ceci :</p>
<pre><code>corresp_game_objects_a_partir_char = {
    &quot; &quot;: [&quot;herbe&quot;],
    &quot;#&quot;: [&quot;mur&quot;],
    &quot;@&quot;: [&quot;herbe&quot;, &quot;personnage&quot;],
    &quot;$&quot;: [&quot;herbe&quot;, &quot;caisse&quot;],
    &quot;.&quot;: [&quot;herbe&quot;, &quot;cible&quot;],
}
</code></pre>
<p>On a ajouté le type de game object &quot;herbe&quot; dans toutes les listes, sauf les deux premières.</p>
<p>Exécutez le jeu, ça devrait être plus beau, chaque objet devrait s'afficher sur l'herbe, au lieu d'avoir un fond noir moche.</p>
<p>Un dernier petit détail, pour les gens qui s'y connaissent un peu en python. La ligne <code>game_objects = list(game_objects)</code> est importante. La fonction <code>list</code> permet de créer une copie pour chaque tile. Si vous ne le faites pas, vous aurez plusieurs références à la même liste. Lorsque vous changerez le contenu de l'une des tiles (en ajoutant ou supprimant un game object), cela modifiera également toutes les autres. On ne va pas rentrer plus loin dans les explications, tout ce que vous avez à savoir pour ce tutoriel, c'est qu'il faut laisser cette ligne de code.</p>
<h2 id="petite-pause">Petite pause <a class="header-anchor" href="#petite-pause">&#x1F517;</a></h2>
<p>Si vous avez lu et effectué ce qui est demandé jusqu'ici, bravo ! Vous avez bien mérité une petite pause ! Mangez un morceau, jouez à un jeu qui vous plaît et nourrissez votre poisson rouge. Pour la suite, on s'attaquera à un gros morceau : l'interactivité et le déplacement du personnage.</p>
<p><img src="../../assets/doc_img/goldfish.png" alt="https://www.clipartmax.com/middle/m2H7i8m2Z5N4K9K9_goldfish-fish-pixel-pixels-pixelart-aesthetic-localcupc-goldfish-pixel-art/" /></p>
<h2 id="on-écrit-pas-sur-les-murs">On écrit (pas sur les murs) <a class="header-anchor" href="#on-écrit-pas-sur-les-murs">&#x1F517;</a></h2>
<p>Dans le code du jeu, tout à la fin, ajoutez la fonction suivante :</p>
<pre><code>    def on_game_event(self, event_name):
        print(event_name)
</code></pre>
<p>Exécutez le jeu, puis cliquez sur les boutons. Le programme ne plante plus, et du texte s'affiche en bas, selon le bouton appuyé :</p>
<ul>
<li>&quot;U&quot; (up) : le bouton &quot;haut&quot;</li>
<li>&quot;D&quot; (down) : bouton &quot;bas&quot;</li>
<li>&quot;L&quot; (left) : bouton &quot;gauche&quot;</li>
<li>&quot;R&quot; (right) : bouton &quot;droit&quot;</li>
<li>&quot;action_1&quot; : bouton &quot;1&quot;</li>
<li>&quot;action_2&quot; : bouton &quot;2&quot;</li>
</ul>
<p>La fonction que vous avez ajoutée se nomme <code>on_game_event</code>, elle se trouve à l'intérieur de la classe <code>GameModel</code>. Elle est spéciale (on appelle ça une &quot;callback&quot;), car elle est exécutée lorsqu'on appuie sur un bouton du jeu. Le paramètre <code>event_name</code> permet de savoir quel bouton a été appuyé.</p>
<p>Vous pouvez ensuite écrire du code dans la fonction, pour déclencher ce que vous voulez : ouvrir des portes, répandre de la lave, téléporter des monstres, ...</p>
<h2 id="ça-bouge-">Ça bouge ! <a class="header-anchor" href="#ça-bouge-">&#x1F517;</a></h2>
<p>Pour commencer, il faut que le personnage se déplace. C'est l'élément principal du jeu, il mérite bien quelques variables que pour lui.</p>
<p>Dans la fonction d'initialisation, juste après la ligne <code>def __init__(self):</code>, ajoutez ces deux lignes :</p>
<pre><code>        self.personnage_x = 13
        self.personnage_y = 6
</code></pre>
<p>Puis, dans la fonction <code>on_game_event</code> (c'est à dire à la fin du code du jeu), ajoutez ce code :</p>
<pre><code>        tile_personnage = self.get_tile(self.personnage_x, self.personnage_y)
        if &quot;personnage&quot; in tile_personnage:
            tile_personnage.remove(&quot;personnage&quot;)

        self.personnage_x += 1

        tile_personnage = self.get_tile(self.personnage_x, self.personnage_y)
        tile_personnage.append(&quot;personnage&quot;)
</code></pre>
<p>Exécutez le jeu.</p>
<p>Appuyez sur un bouton, n'importe lequel. À chaque fois, le personnage se déplacera vers la droite. Arrivé au bord du jeu, ça plante.</p>
<p>C'est un début.</p>
<h2 id="rebidouillons-un-peu">Rebidouillons un peu <a class="header-anchor" href="#rebidouillons-un-peu">&#x1F517;</a></h2>
<p>Dans la fonction <code>on_game_event</code>, nous avons ajouté trois morceaux de code, séparés par une ligne vide. Le premier supprime le personnage de l'aire de jeu, le deuxième modifie ses coordonnées, le troisième le replace à sa nouvelle position.</p>
<p>Le deuxième bloc de code ne contient qu'une seule ligne : <code>self.personnage_x += 1</code>. L'opérateur <code>+=</code> permet d'ajouter une valeur à une variable. L'opérateur <code>-=</code> permet de soustraire.</p>
<p>Mettez une autre valeur que &quot;1&quot; dans cette ligne de code et essayez de comprendre ce que ça fait.</p>
<p>Remettez la valeur &quot;1&quot;. Essayez de faire en sorte que le personnage se déplace vers la gauche lorsqu'on appuie sur un bouton, puis vers le haut, puis vers le bas.</p>
<p>C'est amusant, mais vous n'avez toujours pas de personnage se déplaçant dans la bonne direction selon le bouton appuyé.</p>
<h2 id="ça-bouge-mieux">Ça bouge mieux <a class="header-anchor" href="#ça-bouge-mieux">&#x1F517;</a></h2>
<p>Remplacez la ligne que vous avez bidouillé :</p>
<pre><code>        self.personnage_x += 1
</code></pre>
<p>Par tout ce bloc :</p>
<pre><code>        if event_name == &quot;R&quot;:
            self.personnage_x += 1
        elif event_name == &quot;L&quot;:
            self.personnage_x -= 1
        if event_name == &quot;D&quot;:
            self.personnage_y += 1
        if event_name == &quot;U&quot;:
            self.personnage_y -= 1
</code></pre>
<p>Exécutez le jeu.</p>
<p>Cette fois-ci, le personnage devrait pouvoir se déplacer dans les 4 directions.</p>
<p>Essayez de sortir des bords de l'aire de jeu. À droite et en bas, ça fera une erreur et vous devrez re-exécutez le jeu.</p>
<p>En haut et à gauche, le personnage réapparaîtra de l'autre côté.</p>
<p>Il y a une raison à cela, provenant de la manière dont les éléments d'une liste sont indexés. Vous trouverez des explications à ce sujet dans des cours de python, si ça vous intéresse. Juste comme ça rapidement : <code>[&quot;a&quot;, &quot;b&quot;, &quot;c&quot;, &quot;d&quot;][0] == &quot;a&quot;</code> et <code>[&quot;a&quot;, &quot;b&quot;, &quot;c&quot;, &quot;d&quot;][-1] == &quot;d&quot;</code>.</p>
<p><img src="../../assets/doc_img/tuto_move_border.png" alt="https://raw.githubusercontent.com/darkrecher/squarity-doc/master/user_manual/tuto_move_border.png" /></p>
<h2 id="empêcher-le-personnage-de-dépasser-les-bords">Empêcher le personnage de dépasser les bords <a class="header-anchor" href="#empêcher-le-personnage-de-dépasser-les-bords">&#x1F517;</a></h2>
<p>Dans le code du jeu, remplacez toute la fonction <code>on_game_event</code> par ce code :</p>
<pre><code>    def on_game_event(self, event_name):

        personnage_dest_x = self.personnage_x
        personnage_dest_y = self.personnage_y

        if event_name == &quot;R&quot;:
            personnage_dest_x += 1
        elif event_name == &quot;L&quot;:
            personnage_dest_x -= 1
        if event_name == &quot;D&quot;:
            personnage_dest_y += 1
        if event_name == &quot;U&quot;:
            personnage_dest_y -= 1

        if not (0 &lt;= personnage_dest_x &lt; self.w and 0 &lt;= personnage_dest_y &lt; self.h):
            return

        tile_personnage = self.get_tile(self.personnage_x, self.personnage_y)
        if &quot;personnage&quot; in tile_personnage:
            tile_personnage.remove(&quot;personnage&quot;)

        self.personnage_x = personnage_dest_x
        self.personnage_y = personnage_dest_y

        tile_personnage = self.get_tile(self.personnage_x, self.personnage_y)
        tile_personnage.append(&quot;personnage&quot;)
</code></pre>
<p>Le personnage ne peut plus sortir de l'aire de jeu.</p>
<p>Voici ce que fait le code que nous venons d'ajouter :</p>
<ul>
<li>Création des variables temporaires <code>personnage_dest_x</code> et <code>personnage_dest_y</code>. Initialisation aux coordonnées actuelles du personnage.</li>
<li>Modification de l'une de ces deux variables, selon le déplacement à faire, comme dans le chapitre précédent.</li>
<li>Vérification que le personnage sort par un bord.</li>
<li>Si il sort, le mouvement n'est pas appliqué. On quitte directement la fonction, en utilisant l'instruction python <code>return</code>.</li>
<li>Si il ne sort pas, on applique le mouvement.</li>
<li>Comme précédemment, on enlève le game object, on modifie les coordonnées réelles du personnage, on rajoute le game object à la nouvelle position.</li>
</ul>
<h2 id="placement-initial-du-personnage">Placement initial du personnage <a class="header-anchor" href="#placement-initial-du-personnage">&#x1F517;</a></h2>
<p>Petite bidouille : la variable <code>PLAN_DU_NIVEAU</code>, au début du code, indique où se trouvent les différents objets. Le personnage est représenté par le caractère <code>@</code>. Placez ce caractère à un autre endroit du plan, exécutez le jeu, déplacez le personnage. Est-ce que ça fonctionne comme il faut ? Manifestement non.</p>
<p>Lors de l'initialisation du jeu, la valeur des variables <code>self.personnage_x</code> et <code>self.personnage_y</code> devrait dépendre du plan du niveau, et plus précisément de l'endroit où se trouve le caractère &quot;@&quot;.</p>
<p>Il faut parcourir tout le plan du niveau, repérer le caractère &quot;@&quot;, prendre ses coordonnées et les placer dans ces deux variables.</p>
<p>Nous effectuons déjà un parcours du plan au début du jeu, profitons-en !</p>
<p>Dans la fonction <code>def __init__(self)</code>, dans la boucle de boucle, juste après la ligne de code <code>ligne.append(game_objects)</code>, ajoutez le code suivant :</p>
<pre><code>                if char_carte == &quot;@&quot;:
                    self.personnage_x = x
                    self.personnage_y = y
</code></pre>
<p>Comme d'habitude, attention aux espaces au début de chaque ligne.</p>
<p>Exécutez le jeu. Il devrait fonctionner comme avant.</p>
<p>Dans la variable <code>PLAN_DU_NIVEAU</code>, déplacez le caractère &quot;@&quot;.</p>
<p>Exécutez le jeu. Déplacez le personnage. Ça devrait être beaucoup mieux qu'avant. Le personnage ne fait plus de téléportation bizarre.</p>
<p>Vous n'avez maintenant plus besoin de ces deux lignes qui sont restées au début de la fonction :</p>
<pre><code>        self.personnage_x = 13
        self.personnage_y = 6
</code></pre>
<p>Vous pouvez tester une mini-bidouille : remodifiez le <code>PLAN_DU_NIVEAU</code> en ajoutant plusieurs caractères &quot;@&quot;. Exécutez le jeu. On voit plusieurs personnages, mais un seul d'entre eux se déplace.</p>
<p>Ajoutez ou déplacez des caractères &quot;@&quot; comme vous le souhaitez, essayez de repérer à chaque fois quel est le personnage qui sera déplaçable. Il n'est pas choisi au hasard.</p>
<p>Dans la suite de ce tutoriel, on gardera des niveaux avec un seul caractère &quot;@&quot;. On ne gère pas le cas avec plusieurs personnages. Mais rien ne vous empêche de créer une autre version du jeu où ce serait géré.</p>
<h2 id="on-se-cogne-sur-les-murs">On se cogne sur les murs <a class="header-anchor" href="#on-se-cogne-sur-les-murs">&#x1F517;</a></h2>
<p>Un personnage qui passe à travers tout, c'est un super-pouvoir génial. Mais ça ne fait pas un jeu très intéressant.</p>
<p>Avant d'effectuer le mouvement, il faut vérifier le contenu de la case de destination. Si cette case contient un game object de type &quot;mur&quot;, il faut annuler le mouvement.</p>
<p>Il est possible que vous soyez un peu dans les choux après ces nombreuses modifs dans le code. C'est comme ça que fonctionne la programmaton. On rajoute des petits morceaux au fur et à mesure. Tout n'est pas écrit d'une traite du début à la fin.</p>
<p>Je vais quand même vous aider, voici un récapitutif complet du code, avec la gestion des murs.</p>
<p>Effacez tout le code de votre jeu, et copier-collez à la place ce gigantesque texte :</p>
<pre><code>PLAN_DU_NIVEAU = (
    &quot;                    &quot;,
    &quot;                $   &quot;,
    &quot;                    &quot;,
    &quot;    ######          &quot;,
    &quot;    #.              &quot;,
    &quot;    ####            &quot;,
    &quot;         $   @      &quot;,
    &quot;                    &quot;,
    &quot;           #    #   &quot;,
    &quot;           #    #   &quot;,
    &quot;           # .$ #   &quot;,
    &quot;           #  . #   &quot;,
    &quot;           ######   &quot;,
    &quot;                    &quot;,
)

corresp_game_objects_a_partir_char = {
    &quot; &quot;: [&quot;herbe&quot;],
    &quot;#&quot;: [&quot;herbe&quot;, &quot;mur&quot;],
    &quot;@&quot;: [&quot;herbe&quot;, &quot;personnage&quot;],
    &quot;$&quot;: [&quot;herbe&quot;, &quot;caisse&quot;],
    &quot;.&quot;: [&quot;herbe&quot;, &quot;cible&quot;],
}

class GameModel():

    def __init__(self):

        self.w = 20
        self.h = 14
        self.tiles = []

        for y in range(self.h):
            ligne_plan_du_niveau = PLAN_DU_NIVEAU[y]
            ligne = []
            for x in range(self.w):
                char_carte = ligne_plan_du_niveau[x]
                game_objects = corresp_game_objects_a_partir_char[char_carte]
                game_objects = list(game_objects)
                if char_carte  == &quot;@&quot;:
                    self.personnage_x = x
                    self.personnage_y = y
                ligne.append(game_objects)
            self.tiles.append(ligne)

    def export_all_tiles(self):
        return self.tiles

    def get_tile(self, x, y):
        return self.tiles[y][x]

    def on_game_event(self, event_name):

        personnage_dest_x = self.personnage_x
        personnage_dest_y = self.personnage_y

        if event_name == &quot;R&quot;:
            personnage_dest_x += 1
        elif event_name == &quot;L&quot;:
            personnage_dest_x -= 1
        if event_name == &quot;D&quot;:
            personnage_dest_y += 1
        if event_name == &quot;U&quot;:
            personnage_dest_y -= 1

        if not (0 &lt;= personnage_dest_x &lt; self.w and 0 &lt;= personnage_dest_y &lt; self.h):
            return

        tile_dest = self.get_tile(personnage_dest_x, personnage_dest_y)
        if &quot;mur&quot; in tile_dest:
            return

        tile_personnage = self.get_tile(self.personnage_x, self.personnage_y)
        if &quot;personnage&quot; in tile_personnage:
            tile_personnage.remove(&quot;personnage&quot;)

        self.personnage_x = personnage_dest_x
        self.personnage_y = personnage_dest_y

        tile_personnage = self.get_tile(self.personnage_x, self.personnage_y)
        tile_personnage.append(&quot;personnage&quot;)
</code></pre>
<p>Exécutez le jeu. Ça devrait fonctionner. Le personnage se déplace, mais ne peut pas aller sur les murs.</p>
<h2 id="seconde-petite-pause">Seconde petite pause <a class="header-anchor" href="#seconde-petite-pause">&#x1F517;</a></h2>
<p>Re-nourrissez votre poisson rouge, il en a besoin.</p>
<p><img src="../../assets/doc_img/fish2.png" alt="http://pixelartmaker.com/art/c9d0a98ae70ec58" /></p>
<h2 id="on-pousse-des-caisses-mais-on-nen-largue-pas">On pousse des caisses (mais on n'en largue pas) <a class="header-anchor" href="#on-pousse-des-caisses-mais-on-nen-largue-pas">&#x1F517;</a></h2>
<p>Vous allez bientôt avoir un jeu jouable. Il faudrait maintenant que le personnage puisse pousser les caisses.</p>
<p>Dans le chapitre précédent, nous avons ajouté une vérification sur le contenu de la tile de destination. S'il y a un mur, la fonction se termine tout de suite.</p>
<p>Il faut une vérification supplémentaire. Si la tile de destination contient une caisse, il faut appliquer le même mouvement sur la caisse et sur le personnage. C'est à dire qu'on enlève la caisse de la tile où elle se trouve, et on la remet sur une tile à côté.</p>
<p>Nous définirons trois variables :</p>
<ul>
<li><code>tile_depart_perso</code> : la tile où se trouve le personnage au départ.</li>
<li><code>tile_dest_perso</code> : la tile de destination du personnage.</li>
<li><code>tile_dest_caisse</code> : la tile de destination de la caisse, si on pousse une caisse.</li>
</ul>
<p>On n'a pas besoin d'une variable <code>tile_depart_caisse</code>, car c'est la même tile que <code>tile_dest_perso</code>.</p>
<p>Ça ajoute beaucoup de modifications, mais uniquement dans la fonction <code>on_game_event</code>. Ci-dessous, la fonction complète mise à jour. Supprimez celle qui est dans le code du jeu et copier-collez celle-ci à la place.</p>
<pre><code>    def on_game_event(self, event_name):

        tile_depart_perso = self.get_tile(self.personnage_x, self.personnage_y)
        personnage_dest_x = self.personnage_x
        personnage_dest_y = self.personnage_y

        if event_name == &quot;R&quot;:
            personnage_dest_x += 1
        elif event_name == &quot;L&quot;:
            personnage_dest_x -= 1
        if event_name == &quot;D&quot;:
            personnage_dest_y += 1
        if event_name == &quot;U&quot;:
            personnage_dest_y -= 1

        if not (0 &lt;= personnage_dest_x &lt; self.w and 0 &lt;= personnage_dest_y &lt; self.h):
            return

        tile_dest_perso = self.get_tile(personnage_dest_x, personnage_dest_y)

        if &quot;mur&quot; in tile_dest_perso:
            return

        if &quot;caisse&quot; in tile_dest_perso:
            caisse_dest_x = personnage_dest_x
            caisse_dest_y = personnage_dest_y
            if event_name == &quot;R&quot;:
                caisse_dest_x += 1
            elif event_name == &quot;L&quot;:
                caisse_dest_x -= 1
            if event_name == &quot;D&quot;:
                caisse_dest_y += 1
            if event_name == &quot;U&quot;:
                caisse_dest_y -= 1

            tile_dest_caisse = self.get_tile(caisse_dest_x, caisse_dest_y)
            tile_dest_perso.remove(&quot;caisse&quot;)
            tile_dest_caisse.append(&quot;caisse&quot;)

        if &quot;personnage&quot; in tile_depart_perso:
            tile_depart_perso.remove(&quot;personnage&quot;)

        tile_dest_perso.append(&quot;personnage&quot;)
        self.personnage_x = personnage_dest_x
        self.personnage_y = personnage_dest_y
</code></pre>
<p>Exécutez le jeu et essayez de pousser une caisse.</p>
<h2 id="empêcher-les-caisses-daller-nimporte-où">Empêcher les caisses d'aller n'importe où <a class="header-anchor" href="#empêcher-les-caisses-daller-nimporte-où">&#x1F517;</a></h2>
<p>Essayez de pousser des caisses un peu partout. Woups ! ça devient bizarre. La caisse sort de l'écran, se téléporte éventuellement de l'autre côté, rentre dans un mur, etc.</p>
<p>Lors d'un mouvement, que ce soit un personnage ou une caisse, il faut effectuer les mêmes vérifications. Si une vérification échoute, il faut annuler tout le mouvement (du personnage et de la caisse).</p>
<p>On pourrait copier-coller des morceaux de code dans la fonction <code>on_game_event</code>. Mais ça ferait un code moche et plus difficile à comprendre.</p>
<p>Nous avons déjà une portion de code qui se répète : l'application d'un mouvement sur des coordonnées.</p>
<p>Dans ces cas là, il faut essayer de ranger le code, de placer les morceaux qui se répètent dans des fonctions et d'utiliser ces fonctions. On appelle ça une &quot;factorisation&quot;.</p>
<p>Allons-y ! Resupprimez toute la fonction <code>on_game_event</code> et remplacez-là par tout le bazar qui suit :</p>
<pre><code>    def coord_mouvement(self, x, y, direction):
        if direction == &quot;R&quot;:
            x += 1
        elif direction == &quot;L&quot;:
            x -= 1
        if direction == &quot;D&quot;:
            y += 1
        if direction == &quot;U&quot;:
            y -= 1
        return (x, y)

    def verifier_mouvement(self, dest_x, dest_y):
        if not (0 &lt;= dest_x &lt; self.w and 0 &lt;= dest_y &lt; self.h):
            return False
        if &quot;mur&quot; in self.get_tile(dest_x, dest_y):
            return False
        return True

    def on_game_event(self, event_name):

        personnage_dest_x, personnage_dest_y = self.coord_mouvement(
            self.personnage_x,
            self.personnage_y,
            event_name
        )
        if not self.verifier_mouvement(personnage_dest_x, personnage_dest_y):
            return

        tile_depart_perso = self.get_tile(self.personnage_x, self.personnage_y)
        tile_dest_perso = self.get_tile(personnage_dest_x, personnage_dest_y)

        if &quot;caisse&quot; in tile_dest_perso:
            caisse_dest_x, caisse_dest_y = self.coord_mouvement(
                personnage_dest_x,
                personnage_dest_y,
                event_name
            )
            if not self.verifier_mouvement(caisse_dest_x, caisse_dest_y):
                return
            tile_dest_caisse = self.get_tile(caisse_dest_x, caisse_dest_y)

            tile_dest_perso.remove(&quot;caisse&quot;)
            tile_dest_caisse.append(&quot;caisse&quot;)

        tile_depart_perso.remove(&quot;personnage&quot;)
        tile_dest_perso.append(&quot;personnage&quot;)
        self.personnage_x = personnage_dest_x
        self.personnage_y = personnage_dest_y
</code></pre>
<p>Exécutez le jeu. Essayez de pousser les caisses. Elles ne peuvent plus sortir de l'aire de jeu et ne peuvent plus aller dans les murs.</p>
<h2 id="une-caisse-qui-encaisse">Une caisse qui encaisse <a class="header-anchor" href="#une-caisse-qui-encaisse">&#x1F517;</a></h2>
<p>Essayez de pousser une caisse sur une autre caisse.</p>
<p>Oups, bug ! Les deux caisses se retrouvent sur la même tile. Si vous poussez encore une fois, l'une des deux caisses se déplace et le personnage se retrouve sur l'autre caisse. C'est amusant mais ce n'est pas du tout ce qu'on veut.</p>
<p>Il faut rajouter une dernière vérification : une caisse ne peut pas être poussée sur une autre caisse.</p>
<p>Cette vérification ne peut pas être ajoutée dans la fonction générique <code>verifier_mouvement</code>, car on s'en sert pour vérifier à la fois les mouvements des caisses et du personnage. Or, il y a une différence entre les deux types d'objets : un personnage peut pousser une caisse mais une caisse ne peut pas pousser une caisse. On ne peut pas factoriser toute la vérification.</p>
<p>Il faut donc ajouter la dernière vérification dans la fonction <code>on_game_event</code>.</p>
<p>Après cette ligne :</p>
<pre><code>            tile_dest_caisse = self.get_tile(caisse_dest_x, caisse_dest_y)
</code></pre>
<p>Ajoutez ce code :</p>
<pre><code>            if &quot;caisse&quot; in tile_dest_caisse:
                return
</code></pre>
<p>Exécutez le jeu. Essayez de pousser une caisse sur une autre caisse. Ça ne devrait plus être possible.</p>
<h2 id="condition-de-victoire">Condition de victoire <a class="header-anchor" href="#condition-de-victoire">&#x1F517;</a></h2>
<p>Le jeu est maintenant jouable, mais il n'est pas très fun.</p>
<p>Le but est d'amener chaque caisse sur une cible. Mais si vous y parvenez, il ne se passera rien de spécial. Le minimum serait d'afficher un message de récompense.</p>
<p>Il faut consulter toutes les tiles de l'aire de jeu. Si l'une d'elles contient une caisse mais pas de cible, cela signifie que les caisses n'ont pas toutes été rangées, et le jeu n'est pas gagné. Pas la peine de continuer la consultation des tiles. Mais si chaque caisse est sur une cible, alors on peut afficher un message.</p>
<p>Ce traitement est indépendant de tous les traitements existant dans le code. Nous le placerons donc dans une fonction, même si elle ne sera utilisée qu'une seule fois.</p>
<p>Ajoutez ceci à la fin du code :</p>
<pre><code>    def verifier_caisses_sur_cible(self):
        for y in range(self.h):
            for x in range(self.w):
                current_tile = self.get_tile(x, y)
                if &quot;caisse&quot; in current_tile and &quot;cible&quot; not in current_tile:
                    return False
        return True
</code></pre>
<p>On n'a besoin de faire cette vérification que lorsqu'une caisse a été déplacée.</p>
<p>Dans la fonction <code>on_game_event</code>, après cette ligne :</p>
<pre><code>            tile_dest_caisse.append(&quot;caisse&quot;)
</code></pre>
<p>Ajoutez ce morceau de code :</p>
<pre><code>            if self.verifier_caisses_sur_cible():
                print(&quot;Bravo, vous avez gagné !&quot;)
</code></pre>
<p>Exécutez le jeu. Placez chaque caisse sur une cible. Vous verrez votre superbe message de félicitations s'afficher en bas.</p>
<h2 id="le-grand-final">Le grand final <a class="header-anchor" href="#le-grand-final">&#x1F517;</a></h2>
<p>Voilà, votre jeu est jouable et il affiche un message en cas de victoire. C'est fun, yeah !</p>
<p>Il reste à ajouter quelques détails :</p>
<ul>
<li>D'autres caractères dans le plan du niveau, pour représenter une tile contenant à la fois une caisse et une cible, et une une tile contenant à la fois une cible et le personnage.</li>
<li>La possibilité de définir plusieurs niveaux. Le jeu passe automatiquement au niveau suivant après une victoire.</li>
<li>Lorsqu'on appuie deux fois de suite sur le bouton d'action numéro 1, le niveau en cours est réinitialisé.</li>
</ul>
<p>Ce tutoriel est déjà assez long comme ça et ces détails ajoutent des morceaux de code un peu partout, je vais donc directement vous donner tout le code final.</p>
<p>Les niveaux sont définis au début du code, sous forme d'une liste de variables structurées de la même manière que l'ancienne variable <code>PLAN_DU_NIVEAU</code>. Vous pouvez ajouter, modifier, ou supprimer des niveaux comme bon vous semble.</p>
<p>Voici tous les caractères utilisés :</p>
<ul>
<li><code>#</code> : mur</li>
<li><code>@</code> : personnage</li>
<li><code>+</code> : personnage sur une cible</li>
<li><code>$</code> : caisse</li>
<li><code>*</code> : caisse sur une cible</li>
<li><code>.</code> : cible</li>
<li>&quot; &quot; (un espace) : rien</li>
</ul>
<p>Au final, votre jeu ressemblera à ceci :</p>
<p><img src="../../assets/doc_img/tuto_screenshot_final.png" alt="https://raw.githubusercontent.com/darkrecher/squarity-doc/master/user_manual/tuto_screenshot_final.png" /></p>
<p>Effacez tout le code du jeu actuel, copier-collez tout le texte ci-dessous. Comme ça, même si vous êtes dans les choux et que vous n'avez pas entièrement compris les étapes précédentes, vous avez votre jeu complet :</p>
<pre><code>PLANS_DES_NIVEAUX_ET_DESCRIPTIONS = (
    (
        &quot;Origine de ce niveau : http://www.sokobano.de/wiki/index.php?title=Optimizer&quot;,
        (
            &quot;                    &quot;,
            &quot;          ####      &quot;,
            &quot;         ##. ##     &quot;,
            &quot;     ##### .  #     &quot;,
            &quot;     #   #  # #     &quot;,
            &quot;     # $ #  # #     &quot;,
            &quot;     # $      #     &quot;,
            &quot;     ######  ##     &quot;,
            &quot;          # ##      &quot;,
            &quot;          # #       &quot;,
            &quot;          # #       &quot;,
            &quot;         ## ##      &quot;,
            &quot;         # @ #      &quot;,
            &quot;         #   #      &quot;,
        )
    ),
    (
        &quot;Origine : https://www.mathsisfun.com/games/sokoban.html (un peu transformé)&quot;,
        (
            &quot;    #####           &quot;,
            &quot;    #   #      ###  &quot;,
            &quot;    #$  #      #.#  &quot;,
            &quot;  ###  $###    # #  &quot;,
            &quot;  #  $  $ #   ## ###&quot;,
            &quot;### # ### #   #   .#&quot;,
            &quot;#   # ### #####  ###&quot;,
            &quot;# $  $           ..#&quot;,
            &quot;########### ###  ###&quot;,
            &quot;          # # #   .#&quot;,
            &quot;          # # ## ###&quot;,
            &quot;          # #  # #  &quot;,
            &quot;          # #  #.#  &quot;,
            &quot;          #@#  ###  &quot;,
        )
    ),
    (
        &quot;Origine : https://www.mathsisfun.com/games/sokoban.html&quot;,
        (
            &quot;                    &quot;,
            &quot;                    &quot;,
            &quot;                    &quot;,
            &quot;         #####      &quot;,
            &quot;##########   #      &quot;,
            &quot; @      . $  #      &quot;,
            &quot;########## $.#      &quot;,
            &quot;       #.##$ #      &quot;,
            &quot;       # # . ##     &quot;,
            &quot;       #$ *$$.#     &quot;,
            &quot;       #   .  #     &quot;,
            &quot;       ## #####     &quot;,
            &quot;        # #         &quot;,
            &quot;        # #         &quot;,
        )
    ),
    (
        &quot;Origine : https://alonso-delarte.medium.com/the-basics-of-sokoban-level-formats-&quot;
        &quot;for-designing-your-own-sokoban-levels-51882a7a36f0&quot;,
        (
            &quot;       #####        &quot;,
            &quot;   #####   #####    &quot;,
            &quot;   #           #    &quot;,
            &quot;   #  ### ###  #    &quot;,
            &quot; #### #     # ####  &quot;,
            &quot;##    #  *  #    #  &quot;,
            &quot;   $  # *+*      #  &quot;,
            &quot;##    #  *  #    #  &quot;,
            &quot; #### #     # ####  &quot;,
            &quot;   #  ### ###  #    &quot;,
            &quot;   #           #    &quot;,
            &quot;   #####   #####    &quot;,
            &quot;       #####        &quot;,
            &quot;                    &quot;,
        ),
    ),
    (
        &quot;Bravo, vous avez réussi tous les niveaux. Pourquoi ne pas en profiter pour créer les vôtres ?&quot;,
        (
            &quot;         @          &quot;,
            &quot;#  #  ### #   #  #  &quot;,
            &quot;#  #  #    # #   #  &quot;,
            &quot;####  ##    #    #  &quot;,
            &quot;#  #  #     #       &quot;,
            &quot;#  #  ###   #    #  &quot;,
            &quot;                    &quot;,
            &quot;        ####        &quot;,
            &quot;       #    #       &quot;,
            &quot;      # .  . #      &quot;,
            &quot;      #      #      &quot;,
            &quot;      #  ..  #      &quot;,
            &quot;       #    #       &quot;,
            &quot;        ####        &quot;,
        ),
    ),
)

corresp_game_objects_a_partir_char = {
    &quot; &quot;: [&quot;herbe&quot;],
    &quot;#&quot;: [&quot;herbe&quot;, &quot;mur&quot;],
    &quot;@&quot;: [&quot;herbe&quot;, &quot;personnage&quot;],
    &quot;$&quot;: [&quot;herbe&quot;, &quot;caisse&quot;],
    &quot;.&quot;: [&quot;herbe&quot;, &quot;cible&quot;],
    &quot;+&quot;: [&quot;herbe&quot;, &quot;cible&quot;, &quot;personnage&quot;],
    &quot;*&quot;: [&quot;herbe&quot;, &quot;cible&quot;, &quot;caisse&quot;],
}

class GameModel():

    def debuter_niveau(self):

        description, plan_du_niveau = PLANS_DES_NIVEAUX_ET_DESCRIPTIONS[self.numero_niveau]
        print(description)
        print()
        self.tiles = []

        for y in range(self.h):
            ligne_plan_du_niveau = plan_du_niveau[y]
            ligne = []
            for x in range(self.w):
                char_carte = ligne_plan_du_niveau[x]
                game_objects = corresp_game_objects_a_partir_char[char_carte]
                game_objects = list(game_objects)
                if &quot;personnage&quot; in game_objects:
                    self.personnage_x = x
                    self.personnage_y = y
                ligne.append(game_objects)
            self.tiles.append(ligne)

    def __init__(self):
        self.w = 20
        self.h = 14
        self.numero_niveau = 0
        self.debuter_niveau()
        self.niveau_reussi = False
        self.confirm_reset_level = False

    def export_all_tiles(self):
        return self.tiles

    def get_tile(self, x, y):
        return self.tiles[y][x]

    def coord_mouvement(self, x, y, direction):
        if direction == &quot;R&quot;:
            x += 1
        elif direction == &quot;L&quot;:
            x -= 1
        if direction == &quot;D&quot;:
            y += 1
        if direction == &quot;U&quot;:
            y -= 1
        return (x, y)

    def verifier_mouvement(self, dest_x, dest_y):
        if not (0 &lt;= dest_x &lt; self.w and 0 &lt;= dest_y &lt; self.h):
            return False
        if &quot;mur&quot; in self.get_tile(dest_x, dest_y):
            return False
        return True

    def verifier_caisses_sur_cible(self):
        for y in range(self.h):
            for x in range(self.w):
                current_tile = self.get_tile(x, y)
                if &quot;caisse&quot; in current_tile and &quot;cible&quot; not in current_tile:
                    return False
        return True

    def on_game_event(self, event_name):

        if self.niveau_reussi:
            self.numero_niveau += 1
            self.debuter_niveau()
            self.niveau_reussi = False
            return

        if event_name == &quot;action_1&quot;:
            if self.confirm_reset_level:
                self.debuter_niveau()
                self.confirm_reset_level = False
                print(&quot;réinitialisation niveau&quot;)
            else:
                self.confirm_reset_level = True
                print(&quot;Appuyez à nouveau sur le bouton '1'&quot;)
                print(&quot;pour confirmer la réinitialisation du niveau.&quot;)
            return

        self.confirm_reset_level = False

        personnage_dest_x, personnage_dest_y = self.coord_mouvement(
            self.personnage_x,
            self.personnage_y,
            event_name
        )
        if not self.verifier_mouvement(personnage_dest_x, personnage_dest_y):
            return

        tile_depart_perso = self.get_tile(self.personnage_x, self.personnage_y)
        tile_dest_perso = self.get_tile(personnage_dest_x, personnage_dest_y)

        if &quot;caisse&quot; in tile_dest_perso:
            caisse_dest_x, caisse_dest_y = self.coord_mouvement(
                personnage_dest_x,
                personnage_dest_y,
                event_name
            )
            if not self.verifier_mouvement(caisse_dest_x, caisse_dest_y):
                return
            tile_dest_caisse = self.get_tile(caisse_dest_x, caisse_dest_y)
            if &quot;caisse&quot; in tile_dest_caisse:
                return

            tile_dest_perso.remove(&quot;caisse&quot;)
            tile_dest_caisse.append(&quot;caisse&quot;)
            if self.verifier_caisses_sur_cible():
                print(&quot;Bravo, vous avez gagné !&quot;)
                print(&quot;Appuyez sur un bouton pour passer au niveau suivant&quot;)
                print(&quot;&quot;)
                self.niveau_reussi = True

        tile_depart_perso.remove(&quot;personnage&quot;)
        tile_dest_perso.append(&quot;personnage&quot;)
        self.personnage_x = personnage_dest_x
        self.personnage_y = personnage_dest_y
</code></pre>
<p>Si vous en avez assez de faire des copié-collés, vous pouvez directement jouer à la version finale de ce sokoban <a href="https://squarity.pythonanywhere.com/game/#fetchez_tutorial_sokobanv1">ici</a> .</p>
<p>J'ai ajouté plein de commentaires dans le code, pour le re-expliquer plus en détail. Ça peut vous aider à comprendre comment fonctionnne certaines parties.</p>
<p>Si vous êtes arrivés jusqu'ici, bravo ! N'hésitez pas à bidouiller le code autant que vous le pouvez, pour mieux comprendre comment il fonctionne. Consultez des tutoriels et des cours spécifiques sur le python. Créez d'autres jeux, ou modifiez celui-là. Bref : amusez-vous !</p>

    </div>
</template>

<style lang="css" scoped src="@/styles/docArticle.css"></style>
