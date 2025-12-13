// ============================
// Admin Password Security
// ============================

// Password hashing using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Store the hashed password (generated from "Muskan123")
// To change password: 
// 1. Open change-password.html in your browser
// 2. Enter new password and click "Generate Hash"
// 3. Replace ADMIN_PASSWORD_HASH below with the generated hash
const ADMIN_PASSWORD_HASH = '37e769a9d71a262c9acfa7b3d5e6183e756ff05c8c4e3fb6fe6338c87336eeb0'; // Hash of "Muskan123"

// Verify password function
async function verifyAdminPassword(inputPassword) {
    const inputHash = await hashPassword(inputPassword);
    return inputHash === ADMIN_PASSWORD_HASH;
}

// ============================
// Rate limiting for booking form
// ============================
const RATE_LIMIT_KEY = 'booking_attempts';
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds

function checkRateLimit() {
    const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
    const now = Date.now();
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    
    if (recentAttempts.length >= MAX_ATTEMPTS) {
        const oldestAttempt = Math.min(...recentAttempts);
        const timeLeft = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestAttempt)) / 60000);
        return {
            allowed: false,
            timeLeft: timeLeft
        };
    }
    
    return { allowed: true };
}

function recordAttempt() {
    const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
    attempts.push(Date.now());
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(attempts));
}

// Add to booking form submission
const originalBookingHandler = bookingForm.onsubmit;
bookingForm.addEventListener('submit', function(e) {
    const rateCheck = checkRateLimit();
    
    if (!rateCheck.allowed) {
        e.preventDefault();
        showNotification(`Too many booking attempts. Please try again in ${rateCheck.timeLeft} minutes.`, 'error');
        return false;
    }
    
    recordAttempt();
}, true);
