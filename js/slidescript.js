document.addEventListener("DOMContentLoaded", function () {

    // ── Custom cursor ──────────────────────────────────────────────
    document.body.style.cursor = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewport=\"0 0 32 32\" style=\"fill:black;font-size:24px;\"><text y=\"50%\" transform=\"translate(0, 12)\">✨</text></svg>'), auto";

    // ── Overlay toggle ─────────────────────────────────────────────
    const futureBtn = document.querySelector('.future');
    const textOverlay = document.getElementById('textOverlay');

    futureBtn.addEventListener('click', function () {
        textOverlay.classList.toggle('visible');
        this.textContent = textOverlay.classList.contains('visible') ? '💥' : '🐜';
    });

    // ── Canvas loading + pixelation ────────────────────────────────
    const gallery = document.getElementById('gallery');
    const canvases = Array.from(gallery.querySelectorAll('canvas'));

    canvases.forEach(canvas => {
        const img = new Image();
        img.src = canvas.getAttribute('data-src');
        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.addEventListener('mousemove', function (e) {
                const x = e.clientX - this.getBoundingClientRect().left;
                const level = Math.max(1, Math.min(x / this.width * 100, 100));
                pixelate(ctx, img, level);
                this.style.filter = `blur(${(100 - level) / 20}px)`;
            });

            canvas.addEventListener('mouseleave', function () {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                this.style.filter = 'none';
            });
        };
    });

    // ── Navigation ─────────────────────────────────────────────────
    let currentIndex = 0;

    function navigate(delta) {
        currentIndex = Math.max(0, Math.min(currentIndex + delta, canvases.length - 1));
        gallery.scrollTo({ left: canvases[currentIndex].offsetLeft, behavior: 'smooth' });
    }

    document.getElementById('prevButton').addEventListener('click', () => navigate(-1));
    document.getElementById('nextButton').addEventListener('click', () => navigate(1));

    // Sync index when user scrolls manually
    let rafPending = false;
    gallery.addEventListener('scroll', () => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            const sl = gallery.scrollLeft;
            currentIndex = canvases.reduce((best, c, i) =>
                Math.abs(c.offsetLeft - sl) < Math.abs(canvases[best].offsetLeft - sl) ? i : best, 0);
            rafPending = false;
        });
    });
});

// ── Pixelation helper ──────────────────────────────────────────────
function pixelate(ctx, img, level) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w / level, h / level);
    ctx.drawImage(ctx.canvas, 0, 0, w / level, h / level, 0, 0, w, h);
}
