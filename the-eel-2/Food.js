// Classe représentant la nourriture
class Food {
    constructor(imageLoader) {
        this.x = 0;
        this.y = 0;
        this.imageLoader = imageLoader;
        this.generate();
    }

    generate(avoidPositions = []) {
        // Générer position aléatoire
        this.x = Math.floor(Math.random() * 11);
        this.y = Math.floor(Math.random() * 11);

        // Éviter les positions occupées
        for (const [avoidX, avoidY] of avoidPositions) {
            if (this.x === avoidX && this.y === avoidY) {
                this.generate(avoidPositions); // Régénérer
                return;
            }
        }
    }

    getPosition() {
        return [this.x, this.y];
    }

    draw(ctx, gridBounds) {
        const foodPixelX = gridBounds.left + (this.x * config.CELL_SIZE);
        const foodPixelY = gridBounds.top + (this.y * config.CELL_SIZE);

        // Utiliser l'image si elle est chargée et valide, sinon dessiner un cercle rouge
        const foodImage = this.imageLoader.getImage('food');
        if (foodImage && this.imageLoader.isLoaded('food') && foodImage.complete && !foodImage.src.includes('404')) {
            // Dessiner l'image centrée dans la cellule
            ctx.drawImage(
                foodImage,
                foodPixelX + (config.CELL_SIZE - foodImage.width) / 2,
                foodPixelY + (config.CELL_SIZE - foodImage.height) / 2
            );
        } else {
            // Fallback : cercle rouge
            const centerX = foodPixelX + config.CELL_SIZE / 2;
            const centerY = foodPixelY + config.CELL_SIZE / 2;
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}