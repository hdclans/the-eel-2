// États possibles du jeu
const GameState = {
    MENU: "menu",
    PLAYING: "playing",
    WAITING_START: "waiting_start",
    GAME_OVER: "game_over"
};

// Gestionnaire d'états du jeu
class GameStateManager {
    constructor() {
        this._state = GameState.MENU;
        this._gameStarted = false;
    }

    get state() {
        return this._state;
    }

    get isMenu() {
        return this._state === GameState.MENU;
    }

    get isPlaying() {
        return this._state === GameState.PLAYING;
    }

    get isWaitingStart() {
        return this._state === GameState.WAITING_START;
    }

    get isGameOver() {
        return this._state === GameState.GAME_OVER;
    }

    get gameStarted() {
        return this._gameStarted;
    }

    transitionTo(newState) {
        this._state = newState;
    }

    startGame() {
        this._state = GameState.WAITING_START;
        this._gameStarted = false;
    }

    beginPlaying() {
        this._state = GameState.PLAYING;
        this._gameStarted = true;
    }

    gameOver() {
        this._state = GameState.GAME_OVER;
    }

    restart() {
        this._state = GameState.MENU;
        this._gameStarted = false;
    }

    shouldUpdateGame() {
        return this.isPlaying && this._gameStarted;
    }
}