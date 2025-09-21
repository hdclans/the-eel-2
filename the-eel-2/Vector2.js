// Utilitaire Vector2 pour remplacer pygame.Vector2
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Opérations mathématiques
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    // Négation (équivalent à -vector en Python)
    negate() {
        return new Vector2(-this.x, -this.y);
    }

    // Égalité
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    // Copie
    copy() {
        return new Vector2(this.x, this.y);
    }

    // Longueur
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Normalisation
    normalize() {
        const len = this.length();
        if (len === 0) return new Vector2(0, 0);
        return new Vector2(this.x / len, this.y / len);
    }

    // Conversion en chaîne
    toString() {
        return `Vector2(${this.x}, ${this.y})`;
    }
}