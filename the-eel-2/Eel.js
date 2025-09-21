// Classe représentant l'anguille
class Eel {
    constructor(startX = 5, startY = 5) {
        // Position en coordonnées de grille
        this.gridX = startX;
        this.gridY = startY;
        this.targetGridX = startX;
        this.targetGridY = startY;

        // Direction et mouvement
        this.autoDirection = new Vector2(1, 0);
        this.pendingDirection = null;
        this.moveTimer = 0;
        this.firstMove = true;
        this.bodyDelay = 1/120;
        this.bodyMoveTimer = 0;

        // Corps de l'anguille
        this.body = [];
        this.bodyHistory = [];
        this.initialSegmentsToAdd = 3;
        this.segmentsAdded = 0;
    }

    addSegment() {
        const segmentSpacing = Math.floor(config.MOVE_INTERVAL * config.FPS * 1.5);
        const newSegmentIndex = this.body.length * segmentSpacing + segmentSpacing;

        if (this.bodyHistory.length > newSegmentIndex) {
            this.body.push([
                this.bodyHistory[this.bodyHistory.length - 1 - newSegmentIndex][0],
                this.bodyHistory[this.bodyHistory.length - 1 - newSegmentIndex][1]
            ]);
        } else {
            this.body.push([-10, -10]);
        }
    }

    updateMovement(dt) {
        this.moveTimer += dt;
        this.bodyMoveTimer += dt;

        // Ajouter position actuelle à l'historique
        if (this.bodyMoveTimer >= this.bodyDelay) {
            this.bodyHistory.push([this.gridX, this.gridY]);
            this.bodyMoveTimer = 0;
        }

        // Ajouter progressivement les segments initiaux
        if (this.segmentsAdded < this.initialSegmentsToAdd && this.bodyMoveTimer >= this.bodyDelay) {
            const segmentSpacing = Math.floor(config.MOVE_INTERVAL * config.FPS * 1.5);
            if (this.bodyHistory.length >= (this.segmentsAdded + 1) * segmentSpacing) {
                this.addSegment();
                this.segmentsAdded++;
            }
        }

        // Changement de direction et mouvement synchronisés
        if (this.moveTimer >= config.MOVE_INTERVAL) {
            this.moveTimer -= config.MOVE_INTERVAL;

            // Appliquer changement de direction si valide
            if (this.pendingDirection && this._isValidDirectionChange(this.pendingDirection)) {
                this.autoDirection = this.pendingDirection.copy();
                this.pendingDirection = null;
            }

            // Mouvement
            if (this.firstMove) {
                this.firstMove = false;
                this.targetGridX = 5 + this.autoDirection.x;
                this.targetGridY = 5 + this.autoDirection.y;
            } else {
                this.targetGridX += this.autoDirection.x;
                this.targetGridY += this.autoDirection.y;
            }
        }

        // Mettre à jour positions des segments
        this._updateBodySegments();

        // Mouvement fluide
        this._interpolatePosition();

        // Limiter taille historique
        this._limitHistory();
    }

    _updateBodySegments() {
        // Espacement réduit car on ajoute une position à chaque frame maintenant
        const segmentSpacing = Math.floor(config.MOVE_INTERVAL * config.FPS * 1.5);

        for (let i = 0; i < this.body.length; i++) {
            // Chaque segment suit l'historique avec un décalage temporel
            const delay = (i + 1) * segmentSpacing;
            const baseIndex = this.bodyHistory.length - 1 - delay;

            if (baseIndex >= 0) {
                this.body[i] = [
                    this.bodyHistory[baseIndex][0],
                    this.bodyHistory[baseIndex][1]
                ];
            }
        }
    }

    _interpolatePosition() {
        const progress = Math.min(this.moveTimer / config.MOVE_INTERVAL, 1.0);

        if (this.firstMove) {
            this.gridX = 5;
            this.gridY = 5;
        } else {
            const startX = this.targetGridX - this.autoDirection.x;
            const startY = this.targetGridY - this.autoDirection.y;

            this.gridX = startX + (this.targetGridX - startX) * progress;
            this.gridY = startY + (this.targetGridY - startY) * progress;
        }
    }

    _limitHistory() {
        const positionsPerCell = Math.floor(config.MOVE_INTERVAL * config.FPS);
        const maxHistory = this.body.length * positionsPerCell + 100;
        if (this.bodyHistory.length > maxHistory) {
            this.bodyHistory = this.bodyHistory.slice(-maxHistory);
        }
    }

    getPixelPosition(gridBounds) {
        const pixelX = gridBounds.left + (this.gridX * config.CELL_SIZE) + (config.CELL_SIZE / 2);
        const pixelY = gridBounds.top + (this.gridY * config.CELL_SIZE) + (config.CELL_SIZE / 2);
        return new Vector2(pixelX, pixelY);
    }


    _isValidDirectionChange(newDirection) {
        // Empêcher le demi-tour (direction opposée)
        const opposite = this.autoDirection.negate();
        return !(newDirection.x === opposite.x && newDirection.y === opposite.y);
    }

    setPendingDirection(direction) {
        // Enregistrer la direction sans vérification - elle sera vérifiée dans updateMovement
        this.pendingDirection = direction.copy();
    }

    startMovement(direction) {
        if (this.firstMove) {
            this.autoDirection = new Vector2(1, 0); // Toujours commencer vers la droite
            this.pendingDirection = direction.copy();
            this.moveTimer = 0; // Reset le timer pour un démarrage propre
            // Assurer que les positions de départ sont correctes
            this.previousX = this.gridX;
            this.previousY = this.gridY;
        }
    }

    getHeadPosition() {
        return [Math.round(this.gridX), Math.round(this.gridY)];
    }

    checkSelfCollision() {
        // Pas de collision si moins de 4 segments
        if (this.body.length < 4) {
            return false;
        }

        const [currentGridX, currentGridY] = this.getHeadPosition();

        // Vérifier collision avec les segments du corps (en ignorant les 2 premiers)
        for (let i = 2; i < this.body.length; i++) {
            const segment = this.body[i];
            const segmentGridX = Math.round(segment[0]);
            const segmentGridY = Math.round(segment[1]);

            if (currentGridX === segmentGridX && currentGridY === segmentGridY) {
                return true;
            }
        }
        return false;
    }

    isOutOfBounds() {
        return !(this.targetGridX >= 0 && this.targetGridX < 11 && 
                this.targetGridY >= 0 && this.targetGridY < 11);
    }

    draw(ctx, gridBounds) {
        // Dessiner les segments du corps
        ctx.fillStyle = config.PLAYER_COLOR;
        for (const segmentPos of this.body) {
            const segmentPixelX = gridBounds.left + (segmentPos[0] * config.CELL_SIZE) + (config.CELL_SIZE / 2);
            const segmentPixelY = gridBounds.top + (segmentPos[1] * config.CELL_SIZE) + (config.CELL_SIZE / 2);
            
            ctx.beginPath();
            ctx.arc(segmentPixelX, segmentPixelY, config.PLAYER_RADIUS, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Dessiner la tête
        const pixelPos = this.getPixelPosition(gridBounds);
        ctx.beginPath();
        ctx.arc(pixelPos.x, pixelPos.y, config.PLAYER_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    }
}