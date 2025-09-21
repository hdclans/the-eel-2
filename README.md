# The Eel

Jeu Snake fluide en JavaScript avec Canvas HTML5, inspiré du Snake Google. Deuxième version de The Eel, originalement fait en Python.

## Lancement

1. Cloner le repository
```bash
git clone https://github.com/hdclans/the-eel.git
cd the-eel
```

2. Ouvrir `index.html` dans votre navigateur web

Ou simplement double-cliquer sur le fichier `index.html` pour jouer immédiatement !

## Structure du projet
- `index.html` - Page principale du jeu
- `the-eel-2/` - Dossier contenant tous les scripts JavaScript
  - `config.js` - Configuration du jeu (vitesses, couleurs, tailles)
  - `Vector2.js` - Classe pour les vecteurs 2D
  - `Eel.js` - Logique principale de l'anguille
  - `Game.js` - Boucle de jeu et gestion des états
  - `Grid.js` - Gestion de la grille de jeu
  - `Food.js` - Gestion de la nourriture avec support d'images
  - `Menu.js` - Interface utilisateur et menus
  - `ImageLoader.js` - Système de chargement d'images
  - `GameState.js` - Gestion des états du jeu
  - `main.js` - Point d'entrée principal
  - `images/` - Dossier pour les ressources graphiques

## Prérequis
- Un navigateur web moderne supportant HTML5 Canvas
- Aucune installation requise

## Personnalisation
### Images personnalisées
Placez vos images dans `the-eel-2/images/` :
- `food.svg` ou `food.png` - Image de la nourriture (55x55px recommandé)

## Contrôles
- Flèches directionnelles pour diriger l'anguille
- Le jeu démarre automatiquement au premier mouvement

## Configuration
Modifiez le fichier `the-eel-2/config.js` pour ajuster :
- Vitesse de jeu
- Taille des éléments
- Couleurs
- Dimensions de la grille