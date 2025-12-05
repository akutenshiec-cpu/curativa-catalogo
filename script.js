document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const headerNav = document.getElementById('header-nav');
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownItem = document.querySelector('.nav-item-dropdown');

    if (hamburgerBtn && headerNav) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            headerNav.classList.toggle('active');
            const icon = hamburgerBtn.querySelector('i');
            if (headerNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    if (dropdownTrigger && dropdownItem) {
        dropdownTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                dropdownItem.classList.toggle('active');
                const icon = dropdownTrigger.querySelector('i');
                if(icon) {
                    if(dropdownItem.classList.contains('active')){
                        icon.classList.remove('fa-chevron-right');
                        icon.classList.add('fa-chevron-left');
                    } else {
                        icon.classList.remove('fa-chevron-left');
                        icon.classList.add('fa-chevron-right');
                    }
                }
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && headerNav.classList.contains('active')) {
            if (!headerNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                headerNav.classList.remove('active');
                if(dropdownItem) dropdownItem.classList.remove('active');
                hamburgerBtn.querySelector('i').classList.remove('fa-times');
                hamburgerBtn.querySelector('i').classList.add('fa-bars');
            }
        }
    });

    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768 && headerNav.classList.contains('active')) {
            headerNav.classList.remove('active');
            if(dropdownItem) dropdownItem.classList.remove('active');
            hamburgerBtn.querySelector('i').classList.remove('fa-times');
            hamburgerBtn.querySelector('i').classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-link:not(.dropdown-trigger), .dropdown-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && headerNav) {
                headerNav.classList.remove('active');
                if(hamburgerBtn) {
                    const icon = hamburgerBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevHeroBtn = document.querySelector('.hero-arrow.prev');
    const nextHeroBtn = document.querySelector('.hero-arrow.next');
    const progressBar = document.querySelector('.progress-fill');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; 

    if (slides.length > 0) {
        function showSlide(index) {
            if (index >= slides.length) currentSlide = 0;
            else if (index < 0) currentSlide = slides.length - 1;
            else currentSlide = index;
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            slides[currentSlide].classList.add('active');
            if(dots[currentSlide]) dots[currentSlide].classList.add('active');
            if(progressBar) {
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = '100%';
                    progressBar.style.transition = `width ${slideDuration}ms linear`;
                }, 50);
            }
        }
        function nextSlide() { showSlide(currentSlide + 1); }
        function prevSlide() { showSlide(currentSlide - 1); }
        function resetTimer() {
            clearInterval(slideInterval);
            if(progressBar) {
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
            }
            slideInterval = setInterval(nextSlide, slideDuration);
            if(progressBar) {
                setTimeout(() => {
                    progressBar.style.transition = `width ${slideDuration}ms linear`;
                    progressBar.style.width = '100%';
                }, 50);
            }
        }
        showSlide(0);
        resetTimer();
        if(nextHeroBtn) nextHeroBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if(prevHeroBtn) prevHeroBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.slide);
                showSlide(index);
                resetTimer();
            });
        });
    }

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
    document.querySelectorAll('.zoomable, .collage-container img').forEach(img => {
        img.addEventListener('click', () => {
            if(lightbox && lightboxImg) {
                lightbox.style.display = "flex";
                lightboxImg.src = img.src;
            }
        });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.style.display = "none");
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.style.display = "none"; });

    const distModal = document.getElementById('distributor-modal');
    const closeDistBtn = document.getElementById('close-distributor');
    const distLink1 = document.getElementById('distributor-link');
    const distLink2 = document.getElementById('distributor-link-2');

    if(distModal && closeDistBtn) {
        closeDistBtn.addEventListener('click', () => distModal.classList.add('hidden'));
        if(distLink1) distLink1.addEventListener('click', (e) => { e.preventDefault(); distModal.classList.remove('hidden'); });
        if(distLink2) distLink2.addEventListener('click', (e) => { e.preventDefault(); distModal.classList.remove('hidden'); });
    }
});

let cart = [];
const floatingCart = document.getElementById('floating-cart');
const cartCountEl = document.getElementById('cart-count');
const cartTotalPreview = document.getElementById('cart-total-price');
const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items-list');
const finalTotalEl = document.getElementById('final-total');

window.addFromHero = function(id) {
    const productCard = document.querySelector(`.product-item[data-id="${id}"]`);
    if(productCard) {
        updateProductQty(productCard, 1);
        alert('¡Agregado al carrito!');
    }
};

document.addEventListener('click', (e) => {
    if (e.target.closest('.plus')) {
        updateProductQty(e.target.closest('.plus').closest('.product-item'), 1);
    }
    if (e.target.closest('.minus')) {
        updateProductQty(e.target.closest('.minus').closest('.product-item'), -1);
    }
});

function updateProductQty(card, change) {
    if(!card) return;
    const id = card.getAttribute('data-id');
    const name = card.getAttribute('data-name');
    const price = parseFloat(card.getAttribute('data-price'));
    const qtyDisplay = card.querySelector('.qty-display');
    let item = cart.find(i => i.id === id);
    let currentQty = item ? item.qty : 0;
    let newQty = currentQty + change;
    if (newQty < 0) newQty = 0;
    if(qtyDisplay) qtyDisplay.textContent = newQty;
    if (newQty > 0) {
        if (item) item.qty = newQty;
        else cart.push({ id, name, price, qty: newQty });
    } else {
        cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
}

window.changeModalQty = function(id, change) {
    const card = document.querySelector(`.product-item[data-id="${id}"]`);
    if (card) {
        updateProductQty(card, change);
    } else {
        let item = cart.find(i => i.id === id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
            updateCartUI();
        }
    }
};

window.removeAllItem = function(id) {
    cart = cart.filter(i => i.id !== id);
    const card = document.querySelector(`.product-item[data-id="${id}"]`);
    if(card) card.querySelector('.qty-display').textContent = '0';
    updateCartUI();
};

function updateCartUI() {
    let totalQty = 0;
    let totalPrice = 0;
    cart.forEach(item => { totalQty += item.qty; totalPrice += (item.price * item.qty); });
    if(cartCountEl) cartCountEl.textContent = totalQty;
    if(cartTotalPreview) cartTotalPreview.textContent = `$${totalPrice.toFixed(2)}`;
    if (totalQty > 0) {
        if(floatingCart) floatingCart.classList.remove('hidden');
    } else { 
        if(floatingCart) floatingCart.classList.add('hidden'); 
        if(cartModal) cartModal.classList.add('hidden'); 
    }
    renderModalList(totalPrice);
}

function renderModalList(totalPrice) {
    if(!cartItemsList) return;
    cartItemsList.innerHTML = '';
    if (cart.length === 0) { cartItemsList.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>'; return; }
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item-row';
        div.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">$${item.price.toFixed(2)} c/u</span>
                <div class="modal-qty-controls">
                    <button onclick="changeModalQty('${item.id}', -1)" class="modal-qty-btn"><i class="fas fa-minus"></i></button>
                    <span>${item.qty}</span>
                    <button onclick="changeModalQty('${item.id}', 1)" class="modal-qty-btn"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="item-right">
                <span class="item-price">$${(item.qty * item.price).toFixed(2)}</span>
                <button onclick="removeAllItem('${item.id}')" class="remove-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        cartItemsList.appendChild(div);
    });
    if(finalTotalEl) finalTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
}

if(floatingCart) floatingCart.addEventListener('click', () => cartModal.classList.remove('hidden'));
const closeCartBtn = document.getElementById('close-cart');
if(closeCartBtn) closeCartBtn.addEventListener('click', () => cartModal.classList.add('hidden'));
const continueBtn = document.getElementById('continue-shopping-btn');
if(continueBtn) continueBtn.addEventListener('click', () => cartModal.classList.add('hidden'));

const clearBtn = document.getElementById('clear-cart-btn');
if(clearBtn) clearBtn.addEventListener('click', () => {
    if(confirm('¿Estás seguro de vaciar el carrito?')) {
        cart = [];
        document.querySelectorAll('.qty-display').forEach(span => span.textContent = '0');
        updateCartUI();
    }
});

const checkoutBtn = document.getElementById('checkout-btn');
if(checkoutBtn) checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    const nameInput = document.getElementById('customer-name');
    const provinceSelect = document.getElementById('customer-province');
    
    const customerName = nameInput ? nameInput.value.trim() : "";
    const province = provinceSelect ? provinceSelect.value : "";

    if (!customerName) {
        alert("Por favor, escribe tu nombre.");
        if(nameInput) { nameInput.focus(); nameInput.style.borderColor = "#FBAA26"; }
        return;
    }
    
    if (!province) {
        alert("Por favor, selecciona tu provincia.");
        if(provinceSelect) { provinceSelect.focus(); provinceSelect.style.borderColor = "#FBAA26"; }
        return;
    }

    let message = `Hola Curativa, soy ${customerName} desde ${province}. Este es mi pedido:\n\n`;
    let subtotalCart = 0;

    cart.forEach(item => {
        const itemTotal = item.qty * item.price;
        message += `▪ ${item.qty} x ${item.name} ($${itemTotal.toFixed(2)})\n`;
        subtotalCart += itemTotal;
    });

    let shippingCost = 0;
    if (province !== "Loja") {
        shippingCost = 5.50;
        message += `\n📦 Envío Servientrega: $${shippingCost.toFixed(2)}`;
    } else {
        message += `\n📦 Entrega Local (Loja)`;
    }

    let finalTotal = subtotalCart + shippingCost;

    message += `\n\n*TOTAL A PAGAR: $${finalTotal.toFixed(2)}*`;
    message += `\n\n(Adjunto mi comprobante de pago para el envío).`;

    window.open(`https://wa.me/593999913839?text=${encodeURIComponent(message)}`, '_blank');
});