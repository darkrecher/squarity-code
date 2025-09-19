<template>
    <div class="doc-article">

<h1 id="partager-un-jeu">Partager un jeu <a class="header-anchor" href="#partager-un-jeu">&#x1F517;</a></h1>
<p>Il est possible d'enregistrer vos jeux et de les partager avec d'autres personnes par un simple lien, si vous avez un compte <a href="https://github.com">github</a>.</p>
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
<p>Ajoutez au début l'url de squarity et le préfixe <code>/#fetchez_githubgist_</code> :</p>
<p><code>http://squarity.fr/#fetchez_githubgist_votre-nom/xxx123/raw/super-jeu.txt</code>.</p>
<p>Attention, si vous indiquez le protocole, mettez <code>http://</code>, et non pas <code>https://</code>. Pour l'instant le site n'est pas en HTTPS. Ce n'est pas grave, les infos qu'il contient sont publiques et non critiques.</p>
<p>Cette url reconstruite est le lien vers votre jeu. Vérifiez qu'il fonctionne bien, puis distribuez-le à vos ami(e)s et devenez une star de la scène vidéoludique indépendante !</p>
<p>Vous pouvez ensuite modifier votre gist pour améliorer ou corriger votre jeu, le lien restera le même. Attention, la mise à jour par github n'est pas instantanée. Vous devrez donc <a href="https://stackoverflow.com/questions/47066049/github-gist-raw-permalink-wont-update">attendre un peu</a> avant de revérifier votre lien.</p>
<p>À titre d'exemple, voici un pacman créé par une gentille personne du nom de 10kbis.</p>
<p>Lien vers le gist : https://gist.githubusercontent.com/darkrecher/b5240940356e3bb7e59c8a2522c279d9/raw/pacman-10kbis.txt</p>
<p>Lien pour jouer directement : <a href="http://squarity.fr/#fetchez_githubgist_darkrecher/b5240940356e3bb7e59c8a2522c279d9/raw/pacman-10kbis.txt">http://squarity.fr/#fetchez_githubgist_darkrecher/b5240940356e3bb7e59c8a2522c279d9/raw/pacman-10kbis.txt</a></p>

    </div>
</template>

<style lang="css" scoped src="@/styles/docArticle.css"></style>
