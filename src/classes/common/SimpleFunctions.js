export function isNonePython(val) {
    // Quand du code python renvoie None, la variable javascript prend la valeur "undefined"

    // https://www.tutorialrepublic.com/faq/how-to-determine-if-variable-is-undefined-or-null-in-javascript.php
    // La manière de vérifier si une variable est "undefined" en javascript est
    // vraiment dégueulasse, mais tout le monde fait comme ça.
    // "undefined" est un mot-clé de base du javascript, mais pour tester cette valeur,
    // il faut passer par un typeof et une comparaison de chaîne de caractères.
    // Tu te fous vraiment de ma gueule, javascript.
    return typeof val === 'undefined';
}
