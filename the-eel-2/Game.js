// Classe principale du jeu
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Configuration de la fenêtre
        this.canvas.width = config.SCREEN_WIDTH;
        this.canvas.height = config.SCREEN_HEIGHT;
        this.running = true;
        this.lastTime = 0;

        // Centre de l'écran
        this.center = new Vector2(
            this.canvas.width / 2,
            this.canvas.height / 2
        );

        // Meilleur score (localStorage)
        this.bestScore = parseInt(localStorage.getItem('eelBestScore')) || 0;

        // Chargeur d'images
        this.imageLoader = new ImageLoader();
        this._loadImages();

        // Gestionnaires
        this.stateManager = new GameStateManager();
        this.menu = new Menu(this.canvas, this.ctx, this);

        // Composants du jeu
        this._initGameComponents();

        // Événements
        this._setupEventListeners();
    }

    _loadImages() {
        this.imageLoader.loadImage('food', 'the-eel-2/images/food.svg');
        // Ajouter d'autres images ici plus tard
    }

    _initGameComponents() {
        this.eel = new Eel(5, 5);
        this.food = new Food(this.imageLoader);
        this.grid = new Grid(this.center);
        this.score = 0;
        // Ajouter 3 segments initiaux (mais score reste à 0)
        this.eel.addSegment();
        this.eel.addSegment();
        this.eel.addSegment();
        this.food.generate([this.eel.getHeadPosition()]);
    }

    _setupEventListeners() {
        // Événements clavier
        document.addEventListener('keydown', (event) => {
            this._handleKeyboardInput(event);
        });

        // Événements souris
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this._handleMouseClick(x, y);
        });
    }

    run() {
        const gameLoop = (currentTime) => {
            if (!this.running) return;

            const dt = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;

            this.update(dt);
            this.draw();

            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }

    update(dt) {
        if (!this.stateManager.shouldUpdateGame()) {
            return;
        }

        // Mise à jour de l'anguille
        this.eel.updateMovement(dt);

        // Vérifier les collisions
        this._checkCollisions();
    }

    _checkCollisions() {
        // Collision avec les limites
        if (this.eel.isOutOfBounds()) {
            this._handleGameOver();
            return;
        }

        // Collision avec soi-même
        if (this.eel.checkSelfCollision()) {
            this._handleGameOver();
            return;
        }

        // Collision avec la nourriture
        const headPos = this.eel.getHeadPosition();
        const foodPos = this.food.getPosition();

        if (headPos[0] === foodPos[0] && headPos[1] === foodPos[1]) {
            this.eel.addSegment();
            this.score++;
            // Régénérer la nourriture en évitant l'anguille
            const avoidPositions = [headPos, ...this.eel.body.map(segment => [Math.round(segment[0]), Math.round(segment[1])])];
            this.food.generate(avoidPositions);
        }
    }

    draw() {
        // Remplir l'arrière-plan
        this.ctx.fillStyle = config.BG_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Toujours dessiner le jeu en arrière-plan
        this._drawGameElements();

        // Dessiner les overlays selon l'état
        if (this.stateManager.isMenu) {
            this.menu.drawMainMenu();
        } else if (this.stateManager.isGameOver) {
            const finalScore = this._calculateFinalScore();
            this.menu.drawGameOver(finalScore);
        } else {
            this._drawScore();
        }
    }

    _drawGameElements() {
        const gridBounds = this.grid.getBounds();
        this.grid.draw(this.ctx, config.CELL_SIZE);
        this.food.draw(this.ctx, gridBounds);
        this.eel.draw(this.ctx, gridBounds);
    }

    _drawScore() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "36px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`Score: ${this.score}`, 20, 56);

        // Afficher le meilleur score à droite seulement s'il y en a un
        if (this.bestScore > 0) {
            this.ctx.textAlign = "right";
            this.ctx.font = "24px Arial";
            this.ctx.fillStyle = "lightblue";
            this.ctx.fillText(`Best: ${this.bestScore}`, config.SCREEN_WIDTH - 20, 40);
        }
    }

    _handleGameOver() {
        // Vérifier si c'est un nouveau record
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('eelBestScore', this.bestScore.toString());
        }
        this.stateManager.gameOver();
    }

    _calculateFinalScore() {
        return this.score;
    }

    getBestScore() {
        return this.bestScore;
    }

    _handleMouseClick(x, y) {
        if (this.stateManager.isMenu) {
            const action = this.menu.handleClick(x, y);
            if (action === "play") {
                this._startNewGame();
            }
        } else if (this.stateManager.isGameOver) {
            const action = this.menu.handleGameOverClick(x, y);
            if (action === "restart") {
                this._restartGame();
            }
        }
    }

    _handleKeyboardInput(event) {
        if (!this.stateManager.isWaitingStart && !this.stateManager.isPlaying) {
            return;
        }

        // Empêcher le comportement par défaut des touches de direction
        event.preventDefault();

        const directions = {
            'KeyW': new Vector2(0, -1),
            'ArrowUp': new Vector2(0, -1),
            'KeyS': new Vector2(0, 1),
            'ArrowDown': new Vector2(0, 1),
            'KeyA': new Vector2(-1, 0),
            'ArrowLeft': new Vector2(-1, 0),
            'KeyD': new Vector2(1, 0),
            'ArrowRight': new Vector2(1, 0)
        };

        const direction = directions[event.code];
        if (direction) {
            if (this.stateManager.isWaitingStart) {
                // Ne pas démarrer vers la gauche
                if (direction.x === -1) {
                    return;
                }
                this.stateManager.beginPlaying();
                this.eel.startMovement(direction);
            } else if (this.stateManager.isPlaying) {
                this.eel.setPendingDirection(direction);
            }
        }
    }

    _startNewGame() {
        const selectedSpeed = this.menu.getSelectedSpeed();
        config.MOVE_INTERVAL = selectedSpeed;
        this.stateManager.startGame();
        this._initGameComponents();
    }

    _restartGame() {
        this.stateManager.restart();
        this._initGameComponents();
    }
}