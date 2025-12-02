document.addEventListener("DOMContentLoaded", () => {
    const heroContent = document.querySelector('.hero-content');
    if(heroContent) {
        setTimeout(() => {
            heroContent.classList.add('anim-fade-in');
        }, 100);
    }
});