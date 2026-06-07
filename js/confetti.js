// Advanced Confetti Animation System
class ConfettiSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.gravity = 0.15;
        this.friction = 0.99;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', 
            '#F38181', '#667EEA', '#764BA2', '#F093FB',
            '#FFA502', '#FF69B4', '#00CED1', '#32CD32'
        ];

        const size = Math.random() * 8 + 3;
        const velocity = {
            x: (Math.random() - 0.5) * 12,
            y: (Math.random() - 0.5) * 12 - 3
        };

        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -10,
            width: size,
            height: size,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity,
            alpha: 1,
            decay: Math.random() * 0.015 + 0.008,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.3,
            wobble: Math.random() * 0.1,
            wobbleSpeed: Math.random() * 0.05 + 0.01
        };
    }

    burst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(x, y));
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Physics
            p.velocity.y += this.gravity;
            p.velocity.x *= this.friction;
            p.velocity.y *= this.friction;

            // Position
            p.x += p.velocity.x;
            p.y += p.velocity.y;

            // Rotation
            p.rotation += p.rotationSpeed;
            p.wobble += p.wobbleSpeed;

            // Alpha decay
            p.alpha -= p.decay;

            // Remove dead particles
            if (p.alpha <= 0 || p.y > this.canvas.height) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const p of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.translate(p.x + Math.sin(p.wobble) * 5, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
            this.ctx.restore();
        }
    }

    animate() {
        this.update();
        this.draw();

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }

    clear() {
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Initialize if canvas exists
if (document.getElementById('confetti')) {
    window.confettiSystem = new ConfettiSystem(document.getElementById('confetti'));
}
