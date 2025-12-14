// ============================
// Navigation & Mobile Menu
// ============================
const navbar = document.getElementById('navbar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================
// Smooth Scroll with Offset
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================
// Scroll to Top Button
// ============================
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================
// Booking Form Handling
// ============================
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (!bookingForm) {
        console.error('Booking form not found');
        return;
    }

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Update available time slots when date changes
    dateInput.addEventListener('change', function() {
        updateAvailableTimeSlots(this.value);
    });

    // Function to update time slot availability
    function updateAvailableTimeSlots(selectedDate) {
        const timeSelect = document.getElementById('time');
        const options = timeSelect.querySelectorAll('option');
        
        options.forEach(option => {
            if (option.value === '') return; // Skip the placeholder option
            
            const timeValue = option.value;
            const isAvailable = isSlotAvailable(selectedDate, timeValue);
            
            if (!isAvailable) {
                option.disabled = true;
                option.style.color = '#cbd5e1';
                option.style.backgroundColor = '#f1f5f9';
                option.textContent = option.textContent.replace(' (Booked)', '') + ' (Booked)';
            } else {
                option.disabled = false;
                option.style.color = '';
                option.style.backgroundColor = '';
                option.textContent = option.textContent.replace(' (Booked)', '');
            }
        });
    }

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted'); // Debug log
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            sessionType: document.getElementById('sessionType').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (!formData.name || !formData.email || !formData.phone || !formData.sessionType || !formData.date || !formData.time || !formData.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Phone validation (basic)
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            showNotification('Please enter a valid phone number', 'error');
            return;
        }
        
        // Check if slot is available
        if (!isSlotAvailable(formData.date, formData.time)) {
            showNotification('This time slot is already booked. Please choose another time.', 'error');
            return;
        }
        
        // Save booking to database
        console.log('Saving booking with data:', formData);
        console.log('Firebase initialized:', typeof window.isFirebaseInitialized !== 'undefined' ? window.isFirebaseInitialized : 'unknown');
        
        const booking = saveBooking(formData);
        console.log('Booking saved:', booking);
        
        if (booking) {
            // Show success message with booking ID
            showNotification(`✅ Booking confirmed! Your booking ID is ${booking.id}. Check your email for details.`, 'success');
            
            // Log booking stats
            const stats = getBookingStats();
            console.log('Booking stats:', stats);
            
            // Reset form
            bookingForm.reset();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.error('Failed to save booking');
            showNotification('Error processing booking. Please try again.', 'error');
        }
    });
});

// ============================
// Contact Form Handling
// ============================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };
        
        // Validate form
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
        // Simulate form submission
        
        // Show success message
        showNotification('Message sent successfully! I will get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        
        // In a real application, send to backend
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
    });
}

// ============================
// Notification System
// ============================
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 24px;
            background: white;
            color: #1f2937;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 16px;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
            border-left: 4px solid;
        }
        
        @media (prefers-color-scheme: dark) {
            .notification {
                background: #1e293b;
                color: #e2e8f0;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            }
        }
        
        .notification-success {
            border-color: #10b981;
        }
        
        .notification-error {
            border-color: #ef4444;
        }
        
        .notification-info {
            border-color: #3b82f6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }
        
        .notification-content i {
            font-size: 1.25rem;
        }
        
        .notification-success i {
            color: #10b981;
        }
        
        .notification-error i {
            color: #ef4444;
        }
        
        .notification-info i {
            color: #3b82f6;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #64748b;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
        }
        
        .notification-close:hover {
            color: #0f172a;
        }
        
        @media (prefers-color-scheme: dark) {
            .notification-close {
                color: #94a3b8;
            }
            
            .notification-close:hover {
                color: #e2e8f0;
            }
        }
        
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
        
        @media (max-width: 768px) {
            .notification {
                right: 16px;
                left: 16px;
                max-width: none;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ============================
// Intersection Observer for Animations
// ============================
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

// Add animation styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    .service-card,
    .testimonial-card,
    .pricing-card,
    .step,
    .hero-text,
    .contact-info {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .hero-card {
        opacity: 0;
        transform: scale(0.8) rotate(-5deg);
        transition: opacity 1s ease-out, transform 1s ease-out;
    }
    
    .about-text {
        opacity: 0;
        transform: translateX(-30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    
    .about-card {
        opacity: 0;
        transform: translateX(30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
`;
document.head.appendChild(animationStyle);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .pricing-card, .step, .hero-card, .about-card, .hero-text, .about-text, .contact-info');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add parallax effect to hero
    addParallaxEffect();
});

// ============================
// Active Navigation Link
// ============================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Add active link styles
const activeLinkStyle = document.createElement('style');
activeLinkStyle.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeLinkStyle);

// ============================
// Form Field Validation Feedback
// ============================
const inputs = document.querySelectorAll('input, textarea, select');

inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required')) {
            if (!this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#10b981';
            }
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary-color)';
    });
});

// ============================
// Dynamic Year in Footer
// ============================
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} CareerGuide. All rights reserved.`;
}

// ============================
// Initialize on Load
// ============================
window.addEventListener('load', () => {
    // Add loaded class for any initial animations
    document.body.classList.add('loaded');
    
    // Trigger navigation highlight
    highlightNavigation();
    
    // Start counter animation
    setTimeout(() => {
        animateCounters();
    }, 500);
});

// ============================
// Counter Animation
// ============================
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach((stat, index) => {
        const originalText = stat.textContent.trim();
        
        const isRating = originalText.includes('/');
        let finalValue;
        
        if (isRating) {
            finalValue = parseFloat(originalText.split('/')[0]);
        } else {
            finalValue = parseInt(originalText.replace('+', ''));
        }
        
        let current = 0;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            current = finalValue * progress;
            
            if (progress < 1) {
                if (isRating) {
                    stat.textContent = current.toFixed(1) + '/5';
                } else {
                    stat.textContent = Math.floor(current) + '+';
                }
                requestAnimationFrame(animate);
            } else {
                stat.textContent = originalText;
            }
        };
        
        // Reset to 0 before starting
        stat.textContent = isRating ? '0.0/5' : '0+';
        
        // Start animation
        requestAnimationFrame(animate);
    });
}

// ============================
// Parallax Effect
// ============================
function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        // Only apply parallax to hero section, not to other sections
        if (scrolled < heroHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / heroHeight) * 0.3;
        } else {
            hero.style.transform = 'translateY(0)';
            hero.style.opacity = '1';
        }
    });
}

// ============================
// Mouse Glow Effect
// ============================
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.service-card, .pricing-card, .testimonial-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    });
});

// Add glow effect styles
const glowStyle = document.createElement('style');
glowStyle.textContent = `
    .service-card,
    .pricing-card,
    .testimonial-card {
        --mouse-x: 50%;
        --mouse-y: 50%;
        position: relative;
    }
    
    .service-card::after,
    .pricing-card::after,
    .testimonial-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        opacity: 0;
        background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(37, 99, 235, 0.1),
            transparent 40%
        );
        transition: opacity 0.3s;
        pointer-events: none;
    }
    
    .service-card:hover::after,
    .pricing-card:hover::after,
    .testimonial-card:hover::after {
        opacity: 1;
    }
`;
document.head.appendChild(glowStyle);
