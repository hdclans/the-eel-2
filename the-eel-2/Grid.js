// Classe pour gérer l'affichage de la grille
class Grid {
    constructor(screenCenter) {
        this.screenCenter = screenCenter;
        this.bounds = null;
        this._createBounds();
    }

    _createBounds() {
        const rectWidth = 605;
        const rectHeight = 605;

        this.bounds = {
            left: this.screenCenter.x - rectWidth / 2,
            top: this.screenCenter.y - rectHeight / 2,
            right: this.screenCenter.x + rectWidth / 2,
            bottom: this.screenCenter.y + rectHeight / 2,
            width: rectWidth - 1,
            height: rectHeight - 1
        };
    }

    getBounds() {
        return this.bounds;
    }

    draw(ctx, cellSize) {
        ctx.strokeStyle = "darkgrey";
        ctx.lineWidth = 1;

        // Lignes verticales
        for (let x = this.bounds.left; x <= this.bounds.right; x += cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, this.bounds.top);
            ctx.lineTo(x, this.bounds.bottom);
            ctx.stroke();
        }

        // Lignes horizontales
        for (let y = this.bounds.top; y <= this.bounds.bottom; y += cellSize) {
            ctx.beginPath();
            ctx.moveTo(this.bounds.left, y);
            ctx.lineTo(this.bounds.right, y);
            ctx.stroke();
        }

        // Bord rouge
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.strokeRect(this.bounds.left, this.bounds.top, this.bounds.width, this.bounds.height);
    }
}