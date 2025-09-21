// Classe pour gérer le menu principal et game over
class Menu {
    constructor(canvas, ctx, game) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.game = game;
        this.selectedSpeed = config.SPEED_NORMAL;

        // Boutons du menu
        const centerX = config.SCREEN_WIDTH / 2;
        const centerY = config.SCREEN_HEIGHT / 2;

        this.playButtonRect = {
            x: centerX - 120,
            y: centerY + 100,
            width: 240,
            height: 60
        };

        this.speedSlowRect = {
            x: centerX - 240,
            y: centerY - 50,
            width: 150,
            height: 70
        };

        this.speedNormalRect = {
            x: centerX - 75,
            y: centerY - 50,
            width: 150,
            height: 70
        };

        this.speedFastRect = {
            x: centerX + 90,
            y: centerY - 50,
            width: 150,
            height: 70
        };

        this.restartButtonRect = {
            x: centerX - 120,
            y: centerY + 50,
            width: 240,
            height: 60
        };
    }

    drawOverlay(alpha = 200) {
        this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha / 255})`;
        this.ctx.fillRect(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT);
    }

    drawMainMenu() {
        this.drawOverlay();

        // Titre
        this.ctx.fillStyle = "white";
        this.ctx.font = "56px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("THE EEL", config.SCREEN_WIDTH / 2, config.SCREEN_HEIGHT / 2 - 180);

        // Meilleur score
        this.ctx.font = "24px Arial";
        this.ctx.fillStyle = "lightblue";
        this.ctx.fillText(`Best Score: ${this.game.getBestScore()}`, config.SCREEN_WIDTH / 2, config.SCREEN_HEIGHT / 2 - 140);

        // Label vitesse
        this.ctx.font = "28px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Speed:", config.SCREEN_WIDTH / 2, config.SCREEN_HEIGHT / 2 - 100);

        // Boutons de vitesse
        this._drawSpeedButtons();

        // Bouton PLAY
        this._drawButton(this.playButtonRect, "PLAY", "darkgreen", "white", 3);
    }

    drawGameOver(finalScore) {
        this.drawOverlay(180);

        const centerX = config.SCREEN_WIDTH / 2;
        const centerY = config.SCREEN_HEIGHT / 2;

        // Texte Game Over
        this.ctx.fillStyle = "red";
        this.ctx.font = "48px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER", centerX, centerY - 80);

        // Score final
        this.ctx.font = "32px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`Final Score: ${finalScore}`, centerX, centerY - 30);

        // Meilleur score
        const bestScore = this.game.getBestScore();
        const isNewRecord = finalScore === bestScore && finalScore > 0;

        this.ctx.font = "26px Arial";
        if (isNewRecord) {
            this.ctx.fillStyle = "gold";
            this.ctx.fillText("NEW BEST SCORE!", centerX, centerY + 10);
        } else {
            this.ctx.fillStyle = "lightblue";
            this.ctx.fillText(`Best Score: ${bestScore}`, centerX, centerY + 10);
        }

        // Bouton Restart
        this._drawButton(this.restartButtonRect, "RESTART", "darkgreen", "white", 2);
    }

    _drawSpeedButtons() {
        const speeds = [
            { rect: this.speedSlowRect, text: "SLOW", speed: config.SPEED_SLOW },
            { rect: this.speedNormalRect, text: "NORMAL", speed: config.SPEED_NORMAL },
            { rect: this.speedFastRect, text: "FAST", speed: config.SPEED_FAST }
        ];

        for (const { rect, text, speed } of speeds) {
            const isSelected = speed === this.selectedSpeed;
            const bgColor = isSelected ? "green" : "darkgray";
            const borderColor = isSelected ? "white" : "gray";

            this._drawButton(rect, text, bgColor, borderColor, 2);
        }
    }

    _drawButton(rect, text, bgColor, borderColor, borderWidth) {
        // Fond du bouton
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

        // Bordure
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderWidth;
        this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

        // Texte
        this.ctx.fillStyle = "white";
        this.ctx.font = "22px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, rect.x + rect.width / 2, rect.y + rect.height / 2 + 8);
    }

    handleClick(x, y) {
        if (this._isPointInRect(x, y, this.speedSlowRect)) {
            this.selectedSpeed = config.SPEED_SLOW;
            return "speed_changed";
        } else if (this._isPointInRect(x, y, this.speedNormalRect)) {
            this.selectedSpeed = config.SPEED_NORMAL;
            return "speed_changed";
        } else if (this._isPointInRect(x, y, this.speedFastRect)) {
            this.selectedSpeed = config.SPEED_FAST;
            return "speed_changed";
        } else if (this._isPointInRect(x, y, this.playButtonRect)) {
            return "play";
        }
        return null;
    }

    handleGameOverClick(x, y) {
        if (this._isPointInRect(x, y, this.restartButtonRect)) {
            return "restart";
        }
        return null;
    }

    getSelectedSpeed() {
        return this.selectedSpeed;
    }

    _isPointInRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width &&
               y >= rect.y && y <= rect.y + rect.height;
    }
}