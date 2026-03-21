
## Ordre des jeux à ajouter

X cat fragmentator

X anniversaire avec les lettres

X pac man

loops in pools


snake match

game of no-life

soko punk


## Idée pour le prochain jeu


Genre Dungeon Sweeper, mais juste avec des couleurs.


Il y a des tonneaux radioactifs à enlever. Ils fuient de différentes manières, ce qui permet de détecter la radioactivité sur différentes cases. Mais ça s'additionne, donc des fois on sait pas trop où c'est.

Lorsqu'on révèle une case, on gagne parfois un peu d'argent, et on voit la radioactivité dessus.

Si on révèle une case contenant un tonneau, on crève direct.

On peut acheter des "bouclier". Un type de bouclier par tonneau.

Si on active un bouclier avant de révéler une case contenant un tonneau, on ne meurt pas, le bouclier est utilisé, le tonneau est supprimé.

Si on active un bouclier et qu'on révèle une case ne contenant pas de tonneau, le bouclier est utilisé. Dommage !

Et après, on peut imaginer d'autres bonus : scan d'une zone précise, détection de la case la plus proche contenant de l'argent, etc.



Exemple.


Les tonneaux radioactifs jaunes fuient de cette manière.

      1
      2
    3 3 3
1 2 3 J 3 2 1
    3 3 3
      2
      1

Si on en met plusieurs, ça donne ceci :

1
2
3 3       1
J 3 2 1   2
3 3   1 3 3 3
2   1 4 3 J 3 2 1
1   3 3 6 3 3
1 2 3 J 3 4 1
    3 3 3 1
      2
      1

Il y a des tonneaux qui font d'autres patterns : diagonale, quadrillage, dans une seule direction, ...

Et peut-être qu'on peut construire/poser des trucs sur des zones étendus et non radioactives : un détecteur spécifique, une machine à fabriquer de l'argent, une boutique, etc.

Les tonneaux violets fuient comme ça :

1           1
  2       2
    3 3 3
    3 V 3
    3 3 3
  2       2
1           1

Les tonneaux verts fuient comme ça :

1   1   1   1
  1   1   1
1   3 3 3   1
  1 3 G 3 1
1   3 3 3   1
  1   1   1
1   1   1   1

Lorsqu'on révèle une case, on a la somme, et les couleurs présentes, mais on sait pas le détail.

Exemple :

    1
    2
  3 3 3
2 3 J 3 2 1
1 3 3 3     1
  2 2     2
    4 3 3
    3 V 3
    3 3 3
  2       2
1           1

Dans la disposition ci-dessus, il y a une case avec 4. On sait qu'il y a du jaune et du violet dans cette case. Mais on ne sait pas que c'est 3 violet + 1 jaune.

Et on pourrait même imaginer, dans des niveaux plus haut, de n'avoir que l'info "4". On sait pas de quelles couleurs il est composé. Et il faut un équipement spécial pour le décomposer.

À tester, voir si c'est intéressant...

On change cette histoire de bouclier.

Pour enlever un tonneau, il faut révéler toutes les cases autour de lui, puis poser un désactivateur (ou pas, si c'est relou de le faire à chaque fois).

Du coup, on peut pas enlever un tonneau adjacent à un autre tonneau. Les boucliers peuvent être posé sur une case adjacente à un tonneau, sans la révéler.

Un tonneau dont toutes les cases adjacentes sont, soit révélées, soit avec un bouclier, peut être enlevé.

Les boucliers sont réutilisables.

On a besoin, au max, de 3 boucliers en même temps.

Exemple:

. . . . .
V V V V .
V V V V .
V V V V .
. . . . .

On commence par enlever ceux des coins.

Les cases peuvent donner, comme bonus : de l'argent, du "scrap", des échantillons radioactifs (quand on enlève un tonneau).

Objets à acheter/débloquer :

 - convertisseur scrap->argent.
 - boucliers.
 - détecteur directionnel/distanciel de cases contenant des gros tas d'argent. (on peut les déplacer)
 - indicateur de couleurs (ils ont une portée limitée).
 - connexion entre indicateur de couleurs (ça augmente leur portée, jusqu'à pouvoir couvrir toute l'aire de jeu).
 - indicateur du nombre total de tonneau d'une couleur précise.
 - upgrade de l'indicateur du nombre total de tonneau, pour indiquer le nombre de chaque type.
 - indicateur de la case la plus proche ayant une radioactivité supérieure à 5 ? Je sais pas si c'est utile.
 - indicateur de où exactement se trouve un tonneau, à partir d'une case ayant de la radioactivité lui appartenant. (très pratique, mais très cher).
 - kamikaze qui révèle une case et enlève le tonneau qu'il y a dessus, sans que ça fasse perdre le jeu.

Les bâtiments :

 - constructeur pour acheter la boutique, le convertisseur scrap, indicateur de couleurs, connexions, centre de recherche.
 - boutique pour acheter les boucliers, indicateur d'argent, indicateur de tonneau, kamikaze, réparation du désactivateur.
 - centre de recherche pour les indicateur de nombre total et leurs upgrades ? Et peut-être les boucliers aussi.


Peut-être que les boucliers, il faut qu'ils correspondent à la couleur du tonneau sur lequel on le pose ? Et si c'est pas bon, ça pète quand on essaie d'enlever le tonneau au milieu. Comme ça, faut en acheter plus. Parce que là, pour l'instant, il y a pas grand chose à acheter, donc ça a peu d'intérêt d'amasser de l'argent.

Est-ce qu'il faudrait acheter les désactivateurs ? Genre au bout de 5 utilisations, il pète, faut le réparer.



On double toute les valeurs, et on met 2 type de tonneaux par couleur.

Courte portée :

      2
      4
    6 6 6
2 4 6 J 6 4 2
    6 6 6
      4
      2

Longue portée :

            1
            2
            3
            4
            5
          6 6 6
1 2 3 4 5 6 J 6 5 4 3 2 1
          6 6 6
            5
            4
            3
            2
            1


## truc machin pour faire les annotations d'images

<text style="fill:#ffffff; letter-spacing:0; font-family:Noto Sans; font-size:30; stroke:#0000ff"><tspan x="0">The ball to destroy bricks</tspan></text>

