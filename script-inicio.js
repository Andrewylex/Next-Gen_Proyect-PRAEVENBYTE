// SCRIPT PARA PRAEVENSOFT - UNA SOLA PANTALLA

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. ANIMACIÓN DEL NÚMERO +1000
    const numberElement = document.querySelector('.number');
    
    function animateNumber() {
        const originalText = numberElement.textContent;
        
        if (originalText.startsWith('+')) {
            const targetNumber = parseInt(originalText.replace('+', ''));
            let currentNumber = 0;
            const duration = 1500; // 1.5 segundos
            const steps = 60; // 60 frames
            const increment = targetNumber / steps;
            
            const animate = () => {
                currentNumber += increment;
                if (currentNumber < targetNumber) {
                    numberElement.textContent = '+' + Math.floor(currentNumber);
                    requestAnimationFrame(animate);
                } else {
                    numberElement.textContent = originalText;
                    // Efecto de pulso final
                    numberElement.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        numberElement.style.transform = 'scale(1)';
                    }, 300);
                }
            };
            
            // Iniciar animación después de 500ms
            setTimeout(animate, 500);
        }
    }
    
    // 2. EFECTOS HOVER PARA CARDS
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(138, 43, 226, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // 3. EFECTO PARA BOTÓN PRINCIPAL
    const heroButton = document.querySelector('.hero-button');
    
    heroButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.08)';
        this.style.boxShadow = '0 25px 50px rgba(138, 43, 226, 0.6)';
    });
    
    heroButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 10px 30px rgba(138, 43, 226, 0.4)';
    });
    
    // 4. ANIMACIÓN DE ENTRADA PARA ELEMENTOS
    function animateOnScroll() {
        const elements = document.querySelectorAll('.hero-stats, .hero-title, .hero-subtitle, .hero-description, .hero-button, .info-card');
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // 5. EFECTO DE PARTÍCULAS PARA FONDO (opcional)
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 80px;
            width: calc(100% - 80px);
            height: 100vh;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        
        document.body.appendChild(particlesContainer);
        
        // Crear partículas
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: radial-gradient(circle, #8A2BE2, transparent);
                border-radius: 50%;
                opacity: ${Math.random() * 0.3 + 0.1};
            `;
            
            // Posición aleatoria
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Animación
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.animation = `
                float ${duration}s ease-in-out ${delay}s infinite alternate
            `;
            
            particlesContainer.appendChild(particle);
        }
        
        // Agregar keyframes para la animación
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.1;
                }
                25% {
                    transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.2);
                    opacity: 0.3;
                }
                50% {
                    transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(0.8);
                    opacity: 0.2;
                }
                75% {
                    transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.1);
                    opacity: 0.25;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // 6. INICIALIZACIÓN
    function init() {
        // Configurar estados iniciales para animación
        const elementsToAnimate = document.querySelectorAll('.hero-stats, .hero-title, .hero-subtitle, .hero-description, .hero-button, .info-card');
        elementsToAnimate.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Iniciar animaciones
        setTimeout(animateNumber, 300);
        setTimeout(animateOnScroll, 500);
        
        // Crear partículas
        createParticles();
        
        // Efecto de sonido opcional al hacer clic (sin audio, solo visual)
        heroButton.addEventListener('click', function(e) {
            // Efecto de onda al hacer clic
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Agregar keyframes para ripple
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
    
    // Iniciar todo
    init();
    
    // 7. AJUSTAR AL REDIMENSIONAR VENTANA
    window.addEventListener('resize', function() {
        // Si es necesario, ajustar el layout
    });
    
    // 8. CONTADOR DE TIEMPO EN LA PÁGINA (opcional)
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage++;
        if (timeOnPage === 10) { // Después de 10 segundos
            // Podría mostrar algún mensaje o efecto sutil
            console.log('Usuario lleva 10 segundos en la página');
        }
    }, 1000);
});