<template>
    <div class="doc-toc">

<a href="#doc-start"><h1>Documentation de référence de Squarity V2 </h1></a>
<a href="#le-tileset"><h2>Le tileset </h2></a>
<a href="#configuration-json"><h2>Configuration json </h2></a>
<a href="#informations-générales-de-la-config"><h3>Informations générales de la config </h3></a>
<a href="#définition-des-images"><h3>Définition des images </h3></a>
<a href="#version-du-moteur-squarity"><h3>Version du moteur Squarity </h3></a>
<a href="#descriptions-et-notes-de-bas-de-page"><h3>Descriptions et notes de bas de page </h3></a>
<a href="#notions-de-base-du-game-code"><h2>Notions de base du "game code" </h2></a>
<a href="#schéma-daffichage-calculs-des-tailles"><h2>Schéma d'affichage, calculs des tailles </h2></a>
<a href="#class-direction"><h2>class Direction </h2></a>
<a href="#liste-des-directions"><h3>Liste des directions </h3></a>
<a href="#rotations"><h3>Rotations </h3></a>
<a href="#class-coord"><h2>class Coord </h2></a>
<a href="#instanciation"><h3>Instanciation </h3></a>
<a href="#méthodes-de-base"><h3>Méthodes de base </h3></a>
<a href="#méthodes-de-modification"><h3>Méthodes de modification </h3></a>
<a href="#class-rect"><h2>class Rect </h2></a>
<a href="#création-dun-rect"><h3>Création d'un Rect </h3></a>
<a href="#méthode-coord_upleft"><h3>Méthode coord_upleft </h3></a>
<a href="#méthode-in_bounds"><h3>Méthode in_bounds </h3></a>
<a href="#méthode-on_borders"><h3>Méthode on_borders </h3></a>
<a href="#méthodes-move_dir-et-move_by_vect"><h3>Méthodes move_dir et move_by_vect </h3></a>
<a href="#class-gameobject"><h2>class GameObject </h2></a>
<a href="#nom-du-sprite"><h3>Nom du sprite </h3></a>
<a href="#coordonnées-accès-et-modification"><h3>Coordonnées (accès et modification) </h3></a>
<a href="#transitions-ajoutées-automatiquement"><h3>Transitions ajoutées automatiquement. </h3></a>
<a href="#callback-de-fin-de-transition"><h3>Callback de fin de transition </h3></a>
<a href="#class-layer"><h2>class Layer </h2></a>
<a href="#ajouter-et-retirer-des-game-objects"><h3>Ajouter et retirer des game objects </h3></a>
<a href="#récupérer-des-tiles-et-des-game-objects"><h3>Récupérer des tiles et des game objects </h3></a>
<a href="#créer-des-layers-et-les-ajouter-dans-le-jeu"><h3>Créer des layers et les ajouter dans le jeu </h3></a>
<a href="#class-layersparse"><h3>class LayerSparse </h3></a>
<a href="#class-gamemodel"><h2>class GameModel </h2></a>
<a href="#liste-des-callbacks"><h3>Liste des callbacks </h3></a>
<a href="#variables-membres-de-gamemodel"><h3>Variables membres de GameModel </h3></a>
<a href="#méthode-get_first_gobj"><h3>Méthode get_first_gobj </h3></a>
<a href="#class-eventresult"><h2>class EventResult </h2></a>
<a href="#callback-différée"><h3>Callback différée </h3></a>
<a href="#player-lock-plock-custom"><h3>Player Lock (plock) Custom </h3></a>
<a href="#annuler-le-rendu-de-laire-de-jeu"><h3>Annuler le rendu de l'aire de jeu </h3></a>
<a href="#transitions"><h2>Transitions </h2></a>
<a href="#modification-dune-variable-transitionnable"><h3>Modification d'une variable transitionnable </h3></a>
<a href="#pour-les-coordonnées"><h4>Pour les coordonnées </h4></a>
<a href="#pour-le-sprite-name"><h4>Pour le sprite name </h4></a>
<a href="#fonction-add_transition"><h3>Fonction add_transition </h3></a>
<a href="#enchaînement-des-transitions"><h3>Enchaînement des transitions </h3></a>
<a href="#blocage-de-linterface-player-lock-transi"><h3>Blocage de l'interface (Player Lock Transi) </h3></a>
<a href="#annuler-les-transitions-en-cours"><h3>Annuler les transitions en cours </h3></a>
<a href="#info-supplémentaires-pour-les-sprites"><h2>Info supplémentaires pour les sprites </h2></a>
<a href="#class-componentimagemodifier"><h2>class ComponentImageModifier </h2></a>
<a href="#initialisation"><h3>Initialisation </h3></a>
<a href="#variables-membres"><h3>Variables membres </h3></a>
<a href="#transitions-1"><h3>Transitions </h3></a>
<a href="#class-componentbackcaller"><h2>class ComponentBackCaller </h2></a>
<a href="#itérer-dans-laire-de-jeu"><h2>Itérer dans l'aire de jeu </h2></a>
<a href="#itérer-sur-des-coordonnées"><h3>Itérer sur des coordonnées </h3></a>
<a href="#itérer-sur-les-bords-dun-rectangle"><h3>Itérer sur les bords d'un rectangle </h3></a>
<a href="#itérer-sur-des-game-objects"><h3>Itérer sur des Game Objects </h3></a>
<a href="#récupérer-le-premier-game-object"><h3>Récupérer le premier Game Object </h3></a>
<a href="#exemple-bonus--afficher-tous-les-sprites-existants"><h2>Exemple bonus : afficher tous les sprites existants </h2></a>

    </div>
</template>

<style lang="css" scoped src="@/styles/docToc.css"></style>
