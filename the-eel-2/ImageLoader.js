// Système de chargement d'images
class ImageLoader {
    constructor() {
        this.images = {};
        this.loadedCount = 0;
        this.totalCount = 0;
        this.onAllLoaded = null;
    }

    loadImage(name, path) {
        this.totalCount++;
        const img = new Image();

        img.onload = () => {
            this.loadedCount++;
            if (this.loadedCount === this.totalCount && this.onAllLoaded) {
                this.onAllLoaded();
            }
        };

        img.onerror = () => {
            console.error(`Failed to load image: ${path}`);
            this.loadedCount++;
            if (this.loadedCount === this.totalCount && this.onAllLoaded) {
                this.onAllLoaded();
            }
        };

        img.src = path;
        this.images[name] = img;
    }

    getImage(name) {
        return this.images[name];
    }

    isLoaded(name) {
        const img = this.images[name];
        return img && img.complete;
    }

    areAllLoaded() {
        return this.loadedCount === this.totalCount;
    }
}