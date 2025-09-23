<template>
    <div class="doc-article">

<h1 id="partager-un-jeu">Partager un jeu <a class="header-anchor" href="#partager-un-jeu">&#x1F517;</a></h1>
<p>Il est possible d'enregistrer vos jeux et de les partager avec d'autres personnes par un simple lien, si vous avez un compte <a href="https://github.com">github</a>.</p>
<h2 id="méthode">Méthode <a class="header-anchor" href="#méthode">&#x1F517;</a></h2>
<p>Connectez-vous sur github, cliquez sur votre avatar en haut à droite et sélectionnez &quot;Your gists&quot;.</p>
<p>Cliquez sur le bouton &quot;+&quot; en haut à droite pour créer un nouveau gist (un texte que vous rendez public).</p>
<p>Choisissez un nom pour votre texte, <strong>attention, pas d'underscore dans le nom du fichier, uniquement des caractères alphanumériques et des tirets &quot;-&quot;</strong>.</p>
<p>Dans le contenu du texte, mettez les informations suivantes les unes à la suite des autres :</p>
<ul>
<li>L'url de votre tileset.</li>
<li>À la ligne en-dessous, un séparateur. Le plus simple est de mettre 8 tirets : <code>------</code>. Attention, pas d'espace au début de la ligne.</li>
<li>Votre configuration json.</li>
<li>Le même séparateur que précédemment. Attention, il faut exactement les mêmes caractères (les 8 tirets).</li>
<li>Votre game_code.</li>
</ul>
<p>En bas à droite, cliquez sur la flèche du bouton pour sélectionner &quot;Create public gist&quot;, puis cliquez sur le bouton.</p>
<p>Lorsque votre gist est sauvegardé, cliquez sur le bouton &quot;Raw&quot; à droite du fichier texte.</p>
<p>L'url affichée dans votre navigateur devrait avoir cette forme :</p>
<p><code>https://gist.githubusercontent.com/votre-nom/xxx123/raw/yyy456/super-jeu.txt</code></p>
<p>Les parties &quot;xxx123&quot; et &quot;yyy456&quot; sont de longues suites de caractères alphanumériques, permettant d'identifier votre gist de manière unique.</p>
<p>Supprimez la partie <code>yyy456/</code> et rechargez la page. Vérifiez que le texte brut de votre jeu s'affiche toujours.</p>
<p>Garder la fin de cette url, à partir de votre nom de compte github. C'est à dire : <code>votre-nom/xxx123/raw/super-jeu.txt</code>.</p>
<p>Ajoutez ce texte au début  l'url de squarity et le préfixe <code>https://squarity.fr/game/#fetchez_githubgist_</code>.</p>
<p>Exemple : <code>https://squarity.fr/game/#fetchez_githubgist_votre-nom/xxx123/raw/super-jeu.txt</code>.</p>
<p>Cette url reconstruite est le lien vers votre jeu. Vérifiez qu'il fonctionne bien, puis distribuez-le à vos ami(e)s et devenez une star de la scène vidéoludique indépendante !</p>
<p>Vous pouvez ensuite modifier votre gist pour améliorer ou corriger votre jeu, le lien restera le même. Attention, la mise à jour par github n'est pas instantanée. Vous devrez donc <a href="https://stackoverflow.com/questions/47066049/github-gist-raw-permalink-wont-update">attendre un peu</a> avant de revérifier votre lien.</p>
<h2 id="exemple">Exemple <a class="header-anchor" href="#exemple">&#x1F517;</a></h2>
<p>Voici un pacman créé par une gentille personne du nom de 10kbis.</p>
<p>Lien vers le gist : <a href="https://gist.githubusercontent.com/darkrecher/b5240940356e3bb7e59c8a2522c279d9/raw/pacman-10kbis.txt">https://gist.githubusercontent.com/darkrecher/b5240940356e3bb7e59c8a2522c279d9/raw/pacman-10kbis.txt</a></p>
<p>Lien pour jouer directement : <a href="https://squarity.fr/game/#fetchez_githubgist_darkrecher/b5240940356e3bb7e59c8a2522c279d9/raw/pacman-10kbis.txt">https://squarity.fr/game/#fetchez_githubgist_darkrecher/b5240940356e3bb7e59c8a2522c279d9/raw/pacman-10kbis.txt</a></p>
<h2 id="redirections-durl">Redirections d'url <a class="header-anchor" href="#redirections-durl">&#x1F517;</a></h2>
<p>La configuration DNS de &quot;squarity.fr&quot; effectue une redirection vers &quot;squarity.pythonanywhere.com&quot;, qui est le vrai site web hébergeant les fichiers.</p>
<p>C'est assez moche. À terme, ce sera corrigé, l'url &quot;interne&quot; de pythonanywhere ne devrait plus être visible.</p>
<p>D'autre part, les versions précédentes de Squarity n'avait pas le texte <code>/game/</code> dans les urls de partage des jeux. La rétro-compatibilité est assurée avec une autre redirection moche. Lorsque le chemin de l'url est un simple <code>/</code>, sans le <code>/game/</code>, et qu'elle contient un bookmark avec <code>#fetchez</code>, on ajoute automatiquement <code>/game/</code>. À terme, cette rétro-compatibilité ne sera peut-être pas conservée.</p>
<p>Pour ces deux raisons :</p>
<p><strong>pensez bien à utiliser des urls commençant par <code>https://squarity.fr/game/#fetchez_githubgist_</code> pour partager vos jeux</strong>.</p>
<p>C'est le seul format d'url qui est garanti de rester (tant que Squarity existera sur internet).</p>

    </div>
</template>

<style lang="css" scoped src="@/styles/docArticle.css"></style>
