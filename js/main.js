// ===================================
// Mobile Menu Toggle
// ===================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Animate menu toggle icon
        const spans = menuToggle.querySelectorAll('span');
        if (menuToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ===================================
// Header Scroll Effect
// ===================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// ===================================
// Hero Slider
// ===================================
const heroSlider = document.getElementById('heroSlider');
const prevSlide = document.getElementById('prevSlide');
const nextSlide = document.getElementById('nextSlide');
const sliderIndicators = document.getElementById('sliderIndicators');

if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    let slideInterval;

    // Create indicators
    if (sliderIndicators) {
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('slider-indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            sliderIndicators.appendChild(indicator);
        });
    }

    function updateSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (sliderIndicators) {
                sliderIndicators.children[index].classList.remove('active');
            }
        });

        slides[currentSlide].classList.add('active');
        if (sliderIndicators) {
            sliderIndicators.children[currentSlide].classList.add('active');
        }
    }

    function nextSlideFunc() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide();
    }

    function prevSlideFunc() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlide();
        resetInterval();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlideFunc, 1500);
    }

    if (nextSlide) {
        nextSlide.addEventListener('click', () => {
            nextSlideFunc();
            resetInterval();
        });
    }

    if (prevSlide) {
        prevSlide.addEventListener('click', () => {
            prevSlideFunc();
            resetInterval();
        });
    }

    // Auto-play slider (1.5 seconds for ultra-fast video-like effect)
    slideInterval = setInterval(nextSlideFunc, 1500);

    // Pause on hover
    heroSlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    heroSlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlideFunc, 1500);
    });
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Newsletter Form
// ===================================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;

        // Show success message (you can integrate with your backend here)
        alert('Thank you for subscribing! We\'ll keep you updated with our latest offers.');
        newsletterForm.reset();
    });
}

// ===================================
// Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const animateOnScroll = document.querySelectorAll('.room-card, .facility-card, .section-header');
animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Image Lazy Loading
// ===================================
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===================================
// Active Navigation Link
// ===================================
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

setActiveNavLink();

// ===================================
// Utility Functions
// ===================================

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(amount);
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Loading State
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
});

// ===================================
// Performance Optimization
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// Booking Widget - Set Default Dates
// ===================================
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

if (checkinInput && checkoutInput) {
    // Set minimum date to today
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Set default values
    checkinInput.value = formatDate(today);
    checkoutInput.value = formatDate(tomorrow);

    // Set minimum dates
    checkinInput.setAttribute('min', formatDate(today));
    checkoutInput.setAttribute('min', formatDate(tomorrow));

    // Update checkout min date when checkin changes
    checkinInput.addEventListener('change', () => {
        const selectedDate = new Date(checkinInput.value);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutInput.setAttribute('min', formatDate(nextDay));

        // If checkout is before new checkin, update it
        if (new Date(checkoutInput.value) <= selectedDate) {
            checkoutInput.value = formatDate(nextDay);
        }
    });
}

console.log('Cariton Hotel - Website Loaded Successfully');
