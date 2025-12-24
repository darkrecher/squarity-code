<template>
    <div class="doc-article">

<h1 id="quelle-version-choisir-">Quelle version choisir ? <a class="header-anchor" href="#quelle-version-choisir-">&#x1F517;</a></h1>
<h2 id="versions-disponibles">Versions disponibles <a class="header-anchor" href="#versions-disponibles">&#x1F517;</a></h2>
<p>La version actuelle du moteur de Squarity est la V2. Son nom complet est &quot;2.1.0&quot;.</p>
<p>L'ancienne version V1 est toujours disponible. Son nom complet est &quot;1.0.0&quot;.</p>
<p>Le code des jeux n'est pas compatible entre les deux versions. Si vous créez un jeu avec la V1, vous ne pourrez pas le transférer directement en V2.</p>
<p>La V1 n'évoluera pas (sauf si un bug critique est découvert). Il n'y aura pas de versions &quot;1.0.1&quot;, &quot;1.1.0&quot; ou autres. Mais tant que le site de Squarity sera disponible sur le web, la V1 restera disponible.</p>
<p>La V2 évoluera (&quot;2.1.1&quot;, etc.). Il n'y aura toujours qu'une seule version V2 disponible sur le site (la plus récente). Dans la mesure du possible, les futures versions V2 seront compatibles avec l'actuelle &quot;2.1.0&quot;. Cependant, ce n'est pas garanti à 100%.</p>
<p>Si vous créez un jeu avec la V2, vous avez donc le risque de devoir réadapter votre code quelques mois/années plus tard, pour que votre jeu continue de fonctionner. Nous mettons tout en œuvre pour que ce risque soit le plus minimal possible. Veuillez nous excuser pour la gêne occasionnée. C'est la vie.</p>
<p>Pas de V3 prévue pour l'instant.</p>
<h2 id="comment-indiquer-la-version-de-votre-jeu">Comment indiquer la version de votre jeu <a class="header-anchor" href="#comment-indiquer-la-version-de-votre-jeu">&#x1F517;</a></h2>
<p>Ça se passe dans la configuration JSON.</p>
<p>Pour utiliser la V1, indiquez dans la config : <code>&quot;version&quot;: &quot;1.0.0&quot;</code></p>
<p>Pour utiliser la V2, indiquez : <code>&quot;version&quot;: &quot;2.1.0&quot;</code></p>
<p>Le moteur de Squarity vérifie uniquement le premier caractère que vous avez indiqué dans la version. Si c'est &quot;1&quot; -&gt; &quot;1.0.0&quot;. Si c'est &quot;2&quot; -&gt; &quot;2.1.0&quot;.</p>
<p>Un message d'avertissement apparaîtra dans le log de Squarity si vous oubliez d'indiquer la version.</p>
<h2 id="comment-choisir-">Comment choisir ? <a class="header-anchor" href="#comment-choisir-">&#x1F517;</a></h2>
<p>Si vous débutez vraiment, que vous n'avez jamais écrit aucun programme, ni en python, ni dans un autre langage, ce sera peut-être plus facile pour vous de commencer avec la V1. Le code des jeux est plus simple à écrire, il n'y a pas d'objets spécifiques à Squarity (pas de <code>Coord</code>, pas de <code>Layer</code>, etc.).</p>
<p>Si vous souhaitez créer un seul petit jeu très simple, sans intention de le faire évoluer, vous pouvez également utiliser la V1. L'apprentissage et la création devrait vous prendre moins de temps.</p>
<p>Dans tous les autres cas, c'est mieux d'utiliser la V2, car elle permet de faire plus de choses et elle est plus pratique pour certaines fonctionnalités.</p>
<p>Bien entendu, votre choix n'est pas définitif. Vous pouvez commencer à créer quelques jeux avec la V1, puis passer à la V2. L'apprentissage de la V2 ira plus vite si vous connaissez déjà la V1, car les deux versions ont beaucoup d'éléments et de notions en commun.</p>
<p>Il est possible de partager vos jeux aussi bien en V1 qu'en V2, la méthode est la même. Voir la page expliquant <a href="share-your-game">comment partager un jeu</a>.</p>
<h2 id="fonctionnalités-communes-aux-deux-versions">Fonctionnalités communes aux deux versions <a class="header-anchor" href="#fonctionnalités-communes-aux-deux-versions">&#x1F517;</a></h2>
<ul>
<li>Exécuter du code python (version 3.7.4), récupérer les messages d'erreurs et les exceptions de votre code.</li>
<li>Utiliser une aire de jeu de n'importe quelle taille, ayant la forme d'un quadrillage en deux dimensions.</li>
<li>Afficher des images sur les cases de cette aire de jeu, chaque image tient exactement dans sa case.</li>
<li>Afficher des images avec une transparence progressive, grâce au format d'image .png.</li>
<li>Récupérer les événements de clics de souris, avec l'indication de la case cliquée.</li>
<li>Récupérer les événements de touches de clavier (les 4 directions, les actions &quot;1&quot; et &quot;2&quot;).</li>
<li>Écrire du texte et des emojis dans le log de Squarity.</li>
<li>Définir l'ordre d'affichage des objets situés sur une même case (de manière pas très pratique).</li>
<li>Exécuter une action différée (un code python spécifique qui se déclenche après un délai et qui peut changer des objets dans le jeu).</li>
<li>Exécuter des actions différées en boucle (une action différée qui planifie une autre action différée, et ainsi de suite).</li>
<li>Bloquer temporairement l'interface de jeu, pour afficher des animations ou des &quot;cut scenes&quot;.</li>
</ul>
<h2 id="fonctionnalités-disponibles-uniquement-en-v2">Fonctionnalités disponibles uniquement en V2 <a class="header-anchor" href="#fonctionnalités-disponibles-uniquement-en-v2">&#x1F517;</a></h2>
<ul>
<li>Afficher des objets décalés par rapport aux cases de l'aire de jeu.</li>
<li>Grossir/rétrécir les objets, qui peuvent dépasser sur les cases adjacentes.</li>
<li>Animer automatiquement des transitions pixel par pixel, pour les déplacements, les décalages et les tailles d'objets.</li>
<li>Définir des séquences de mouvements, décalage et tailles.</li>
<li>Récupérer la configuration JSON dans le code du jeu.</li>
<li>Définir l'ordre d'affichage des objets de manière plus pratique, avec les <code>Layer</code>.</li>
<li>Utiliser des classes de base pour faciliter le code des jeux (<code>Coord</code>, <code>Direction</code>, <code>Rect</code>, ...).</li>
<li>Récupérer rapidement un ou plusieurs game objects spécifiques, avec des itérateurs spécifiques (classe <code>Sequencer</code>, fonction <code>get_first_gobj</code>).</li>
<li>Définir des actions différées avec des fonctions de callbacks.</li>
<li>Bloquer l'interface du jeu, de manière visible ou invisible.</li>
<li>Bloquer automatiquement l'interface du jeu tant que certains objets effectuent des transitions.</li>
<li>Exécuter automatiquement une callback lorsqu'un objet a fini toutes ses transitions.</li>
<li>Connaître le nombre de transitions restant à effectuer pour un objet.</li>
<li>plein d'autres choses dans le futur.</li>
</ul>

    </div>
</template>

<style lang="css" scoped src="@/styles/docArticle.css"></style>
