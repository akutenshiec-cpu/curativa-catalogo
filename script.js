// --- LÓGICA DEL HERO CARRUSEL ---
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
const prevHeroBtn = document.querySelector('.hero-arrow.prev');
const nextHeroBtn = document.querySelector('.hero-arrow.next');
const progressBar = document.querySelector('.progress-fill');
let currentSlide = 0;
let slideInterval;
const slideDuration = 5000; 

function initHeroCarousel() {
    if (slides.length > 0) {
        showSlide(0);
        resetTimer();
        
        nextHeroBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        prevHeroBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.slide);
                showSlide(index);
                resetTimer();
            });
        });
    }
}

function showSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    progressBar.style.width = '0%';
    setTimeout(() => {
        progressBar.style.width = '100%';
        progressBar.style.transition = `width ${slideDuration}ms linear`;
    }, 50);
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

function resetTimer() {
    clearInterval(slideInterval);
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    slideInterval = setInterval(nextSlide, slideDuration);
    setTimeout(() => {
        progressBar.style.transition = `width ${slideDuration}ms linear`;
        progressBar.style.width = '100%';
    }, 50);
}

document.addEventListener('DOMContentLoaded', initHeroCarousel);

// --- LÓGICA CARRITO ---
let cart = [];
const floatingCart = document.getElementById('floating-cart');
const cartCountEl = document.getElementById('cart-count');
const cartTotalPreview = document.getElementById('cart-total-price');
const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items-list');
const finalTotalEl = document.getElementById('final-total');

document.addEventListener('click', (e) => {
    if (e.target.closest('.plus')) {
        const btn = e.target.closest('.plus');
        const card = btn.closest('.product-item');
        updateProductQty(card, 1);
    }
    if (e.target.closest('.minus')) {
        const btn = e.target.closest('.minus');
        const card = btn.closest('.product-item');
        updateProductQty(card, -1);
    }
});

document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.carousel-track');
    const prevBtn = wrapper.querySelector('.prev-btn');
    const nextBtn = wrapper.querySelector('.next-btn');
    if (track && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => { track.scrollBy({ left: 220, behavior: 'smooth' }); });
        prevBtn.addEventListener('click', () => { track.scrollBy({ left: -220, behavior: 'smooth' }); });
    }
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const zoomableImages = document.querySelectorAll('.zoomable, .collage-container img');

zoomableImages.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
    });
});

if (lightboxClose) { lightboxClose.addEventListener('click', () => { lightbox.style.display = "none"; }); }
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.style.display = "none"; });

function updateProductQty(card, change) {
    const id = card.getAttribute('data-id');
    const name = card.getAttribute('data-name');
    const price = parseFloat(card.getAttribute('data-price'));
    const qtyDisplay = card.querySelector('.qty-display');
    
    let item = cart.find(i => i.id === id);
    let newQty = (item ? item.qty : 0) + change;
    if (newQty < 0) newQty = 0;

    qtyDisplay.textContent = newQty;

    if (newQty > 0) {
        if (item) item.qty = newQty;
        else cart.push({ id, name, price, qty: newQty });
    } else {
        cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
}

window.removeFromCart = function(id) {
    cart = cart.filter(i => i.id !== id);
    const card = document.querySelector(`.product-item[data-id="${id}"]`);
    if(card) card.querySelector('.qty-display').textContent = '0';
    updateCartUI();
}

function updateCartUI() {
    let totalQty = 0;
    let totalPrice = 0;
    cart.forEach(item => { totalQty += item.qty; totalPrice += (item.price * item.qty); });

    cartCountEl.textContent = totalQty;
    cartTotalPreview.textContent = `$${totalPrice.toFixed(2)}`;

    if (totalQty > 0) floatingCart.classList.remove('hidden');
    else { floatingCart.classList.add('hidden'); cartModal.classList.add('hidden'); }

    renderModalList(totalPrice);
}

function renderModalList(totalPrice) {
    cartItemsList.innerHTML = '';
    if (cart.length === 0) { cartItemsList.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>'; return; }

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item-row';
        div.innerHTML = `
            <div class="item-info"><span class="item-name">${item.name}</span><span class="item-qty">Cant: ${item.qty} x $${item.price.toFixed(2)}</span></div>
            <div class="item-right"><span class="item-price">$${(item.qty * item.price).toFixed(2)}</span><button onclick="removeFromCart('${item.id}')" class="remove-btn"><i class="fas fa-trash"></i></button></div>
        `;
        cartItemsList.appendChild(div);
    });
    finalTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
}

floatingCart.addEventListener('click', () => { cartModal.classList.remove('hidden'); });
document.getElementById('close-cart').addEventListener('click', () => { cartModal.classList.add('hidden'); });

document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) return;
    let message = "Hola Curativa, este es mi pedido:\n\n";
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.qty * item.price;
        message += `▪ ${item.qty} x ${item.name} ($${subtotal.toFixed(2)})\n`;
        total += subtotal;
    });
    message += `\n*TOTAL A PAGAR: $${total.toFixed(2)}*`;
    message += `\n\n(Adjunto mi comprobante de pago para el envío).`;
    window.open(`https://wa.me/593999913839?text=${encodeURIComponent(message)}`, '_blank');
});