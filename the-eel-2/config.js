// Configuration du jeu
const config = {
    // Taille de la fenêtre
    SCREEN_WIDTH: 1280,
    SCREEN_HEIGHT: 720,

    // Couleurs
    BG_COLOR: "darkblue",
    PLAYER_COLOR: "darkgreen",

    // Joueur
    PLAYER_RADIUS: 25,
    PLAYER_SPEED: 55 * 10 / 2, // pixels par seconde (55 pixels en 0.2s)
    MOVE_INTERVAL: 2 / 10,

    // Vitesses de jeu
    SPEED_SLOW: 3 / 10,      // 0.3s
    SPEED_NORMAL: 2 / 10,    // 0.2s
    SPEED_FAST: 1 / 10,      // 0.1s

    // FPS
    FPS: 60,

    // Grille
    GRID_COLOR: "darkred",
    CELL_SIZE: 55
};