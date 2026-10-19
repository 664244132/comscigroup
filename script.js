// =========================================
// สไลด์แบนเนอร์ (Slider) + จุดนำทาง
// =========================================
const slides = document.querySelectorAll('.slide');
const dotsBox = document.getElementById('dots');
let currentSlide = 0, slideTimer;

function showSlide(n) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    dotsBox && dotsBox.children[currentSlide]?.classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dotsBox && dotsBox.children[currentSlide]?.classList.add('active');
}
if (slides.length) {
    if (dotsBox) {
        slides.forEach((_, i) => {
            const d = document.createElement('button');
            d.className = 'dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', 'ภาพที่ ' + (i + 1));
            d.onclick = () => { showSlide(i); restartTimer(); };
            dotsBox.appendChild(d);
        });
    }
    const restartTimer = () => { clearInterval(slideTimer); slideTimer = setInterval(() => showSlide(currentSlide + 1), 5000); };
    restartTimer();
}

// =========================================
// ปุ่มแสดง/ซ่อน ขั้นตอนเตรียมงาน
// =========================================
function togglePrep() {
    const box = document.getElementById('prep-content');
    const btn = document.querySelector('.btn-toggle');
    const open = box.classList.toggle('show');
    btn && btn.classList.toggle('open', open);
}

// =========================================
// ปุ่มเลื่อนกลับขึ้นบนสุด
// =========================================
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 300);
});
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// =========================================
// แกลเลอรีภาพกิจกรรม (แก้ไขรูป/คำบรรยายที่นี่)
// =========================================
const galleryData = [
    ['image/6.jpg',  ''],
    ['image/7.jpg',  ''],
    ['image/8.jpg',  ''],
    ['image/9.jpg',  ''],
    ['image/10.jpg', ''],
    ['image/11.jpg', ''],
    ['image/12.jpg', ''],
    ['image/13.jpg', ''],
    ['image/14.jpg', ''],
    ['image/15.jpg', ''],
    ['image/16.jpg', ''],
    ['image/17.jpg', ''],
    ['image/18.jpg', ''],
    ['image/19.jpg', ''],
    ['image/20.jpg', ''],
    ['image/21.jpg', ''],
    ['image/22.jpg', ''],
    ['image/23.jpg', '']
];
const grid = document.getElementById('gallery-grid');
const lb = document.getElementById('lightbox');
let lbIndex = 0;

if (grid) {
    galleryData.forEach(([src, cap], i) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<div class="gallery-thumb"><img src="${src}" alt="${cap}" loading="lazy"></div><p class="gallery-caption">${cap}</p>`;
        item.querySelector('img').onerror = function () { this.style.display = 'none'; };
        item.onclick = () => openLightbox(i);
        grid.appendChild(item);
    });
}
function openLightbox(i) {
    if (!lb) return;
    lbIndex = (i + galleryData.length) % galleryData.length;
    lb.querySelector('img').src = galleryData[lbIndex][0];
    lb.querySelector('p').textContent = galleryData[lbIndex][1] + '  (' + (lbIndex + 1) + '/' + galleryData.length + ')';
    lb.classList.add('open');
}
function closeLightbox() { lb && lb.classList.remove('open'); }
if (lb) {
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', e => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
        if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
    });
}

// =========================================
// เอฟเฟกต์เลื่อนเข้าจอ + ตัวเลขนับขึ้น + เมนูไฮไลต์
// =========================================
const revealables = document.querySelectorAll('.section-block, .member-row, .stat, .prep-content');
revealables.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('show');
        const n = en.target.querySelector('[data-count]');
        if (n) countUp(n);
        io.unobserve(en.target);
    });
}, { threshold: 0.12 });
revealables.forEach(el => io.observe(el));

function countUp(el) {
    const end = +el.dataset.count; let cur = 0;
    const step = Math.max(1, Math.ceil(end / 30));
    const t = setInterval(() => { cur = Math.min(end, cur + step); el.textContent = cur; if (cur >= end) clearInterval(t); }, 40);
}

const navLinks = document.querySelectorAll('.nav-anchors a');
if (navLinks.length) {
    const spy = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(s => spy.observe(s));
}