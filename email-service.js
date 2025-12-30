// ============================
// Email Service for CareerGuide
// ============================

// ⚠️ SETUP INSTRUCTIONS:
// Using EmailJS REST API (no library needed)

const EMAIL_CONFIG = {
    SERVICE_ID: 'service_3ofuexb',      // Your EmailJS Service ID
    TEMPLATE_ID: 'template_oha16ro',    // Your EmailJS Template ID
    PUBLIC_KEY: 'jq26AN-iaVU9jU5ax'    // Your Public Key
};

// Initialize EmailJS via direct API (no library needed)
function initEmailJS() {
    console.log('✅ EmailJS API initialized (no library needed)');
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailJS);
} else {
    initEmailJS();
}

/**
 * Generate booking confirmation email
 * @param {Object} bookingData - Booking data from form
 * @param {string} bookingId - Unique booking ID
 * @returns {string} HTML email content
 */
function generateBookingConfirmationEmail(bookingData, bookingId) {
    // Format date
    const dateObj = new Date(bookingData.date);
    const formattedDate = dateObj.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Determine amount based on session type (form sends '30min' or '60min')
    const isQuickSession = bookingData.sessionType === '30min';
    const amount = isQuickSession ? 'FREE' : '₹49';
    
    const emailHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Session Booking Confirmation</title>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .body { padding: 30px 25px; }
                .section { margin: 25px 0; }
                .section-title { color: #2c3e50; font-size: 15px; font-weight: 700; margin-bottom: 18px; border-bottom: 2px solid #667eea; padding-bottom: 12px; }
                .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px; line-height: 1.5; }
                .detail-label { color: #667eea; font-weight: 600; }
                .detail-value { color: #2c3e50; text-align: right; }
                .amount-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0; }
                .amount-label { font-size: 13px; opacity: 0.9; margin-bottom: 5px; }
                .amount { font-size: 32px; font-weight: 700; }
                .upi-info { background: #f8f9fb; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 13px; }
                .upi-info strong { display: block; color: #667eea; margin-bottom: 5px; }
                .notes { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; font-size: 13px; color: #856404; }
                .notes strong { display: block; margin-bottom: 8px; }
                .notes ul { margin: 10px 0 0 20px; padding: 0; }
                .notes li { margin: 5px 0; }
                .footer { background: #2c3e50; color: #ecf0f1; padding: 25px; text-align: center; font-size: 12px; }
                .footer p { margin: 5px 0; }
                .footer strong { display: block; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Your Session is Confirmed!</h1>
                </div>
                
                <div class="body">
                    <p style="color: #555; font-size: 16px; margin: 0 0 20px 0;">Hi <strong>${bookingData.name}</strong>,</p>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">Thank you for booking a session with CareerGuide! We're excited to help you advance your career. Your session has been successfully confirmed.</p>
                    
                    <div class="section">
                        <div class="section-title">📋 YOUR SESSION DETAILS</div>
                        <div class="detail-row">
                            <span class="detail-label">Session Type:</span>
                            <span class="detail-value">${bookingData.sessionType}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Date:</span>
                            <span class="detail-value">${formattedDate}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Time:</span>
                            <span class="detail-value">${bookingData.time} IST</span>
                        </div>
                        <div class="detail-row" style="border-bottom: none;">
                            <span class="detail-label">Phone:</span>
                            <span class="detail-value">${bookingData.phone}</span>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">💰 PAYMENT DETAILS</div>
                        <div class="amount-box">
                            <div class="amount-label">Amount Due</div>
                            <div class="amount">${amount}</div>
                        </div>
                        ${amount === 'FREE' ? '<p style="text-align: center; color: #27ae60; font-weight: 600;">🎉 This session is FREE!</p>' : ''}
                    </div>
                    
                    ${amount !== 'FREE' ? `
                    <div class="upi-info">
                        <strong>UPI ID:</strong> oshinkaur175@oksbi<br>
                        <strong style="margin-top: 8px;">Name:</strong> Muskanpreet Kaur
                    </div>
                    ` : ''}
                    
                    <div class="notes">
                        <strong>⚠️ IMPORTANT NOTES</strong>
                        <ul>
                            ${amount !== 'FREE' ? '<li>Please complete payment within 24 hours to secure your slot.</li>' : ''}
                            <li>You can cancel or reschedule up to 24 hours before the session.</li>
                            <li>Ensure you have a stable internet connection and a quiet environment.</li>
                            <li>The Google Meet link will be shared 1 hour before the session starts.</li>
                            <li>This is a one-on-one personalized session tailored to your needs.</li>
                        </ul>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 25px;">If you have any questions or need to reschedule, feel free to reach out via email.</p>
                    
                    <p style="color: #2c3e50; font-size: 15px; font-weight: 600; margin-top: 20px;">We look forward to chatting with you! 💪</p>
                </div>
                
                <div class="footer">
                    <strong>Muskanpreet Kaur</strong>
                    <p>Career Guidance Consultant<br>Microsoft Azure Team</p>
                    <p style="margin-top: 15px; border-top: 1px solid #34495e; padding-top: 15px;">
                        📧 muskanpreet175@gmail.com<br>
                        🌐 careerguidebymuskan.netlify.app
                    </p>
                    <p style="margin-top: 15px; opacity: 0.7;">© 2025 CareerGuide. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    return emailHTML;
}

/**
 * Send booking confirmation email via EmailJS REST API
 * @param {Object} bookingData - Booking data
 * @param {string} bookingId - Booking ID
 */
function sendBookingConfirmationEmail(bookingData, bookingId) {
    console.log('📧 sendBookingConfirmationEmail called');
    console.log('📧 Email:', bookingData.email);
    console.log('📧 Name:', bookingData.name);
    console.log('📧 Booking ID:', bookingId);
    
    try {
        // Generate the email HTML
        const emailHTML = generateBookingConfirmationEmail(bookingData, bookingId);
        console.log('📧 Email HTML generated');
        
        // Format date for display
        const dateObj = new Date(bookingData.date);
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Determine amount (matching form values: 30min or 60min)
        const isQuickSession = bookingData.sessionType === '30min';
        const amount = isQuickSession ? 'FREE' : '₹49';
        
        // Prepare email parameters
        const emailParams = {
            service_id: EMAIL_CONFIG.SERVICE_ID,
            template_id: EMAIL_CONFIG.TEMPLATE_ID,
            user_id: EMAIL_CONFIG.PUBLIC_KEY,
            template_params: {
                to_email: bookingData.email,
                to_name: bookingData.name,
                subject: '✅ Your CareerGuide Session is Confirmed!',
                html_message: emailHTML,
                from_name: 'Muskanpreet Kaur',
                from_email: 'muskanpreet175@gmail.com'
            }
        };
        
        console.log('📧 Sending email via EmailJS REST API...');
        
        // Send email using EmailJS REST API
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailParams)
        })
        .then(response => {
            console.log('📧 API Response:', response.status);
            if (response.ok) {
                console.log('✅ Email sent successfully!');
                console.log('📧 Email sent to:', bookingData.email);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .catch((error) => {
            console.error('❌ Error sending email:', error);
            console.log('Error details:', error.message);
            // If EmailJS fails, store for manual sending
            storeEmailForManualSending(bookingData, bookingId, emailHTML);
            console.log('⚠️ Email stored for manual sending');
        });
        
    } catch (error) {
        console.error('❌ Error in sendBookingConfirmationEmail:', error);
    }
}

/**
 * Get pending emails (for admin dashboard)
 */
function getPendingEmails() {
    return JSON.parse(localStorage.getItem('pendingEmails')) || [];
}

/**
 * Store email for manual sending (fallback)
 */
function storeEmailForManualSending(bookingData, bookingId, emailHTML) {
    const emailData = {
        to: bookingData.email,
        subject: `✅ Your CareerGuide Session is Confirmed!`,
        html: emailHTML,
        timestamp: new Date().toISOString(),
        bookingId: bookingId,
        customerName: bookingData.name,
        customerEmail: bookingData.email
    };
    
    let pendingEmails = JSON.parse(localStorage.getItem('pendingEmails')) || [];
    pendingEmails.push(emailData);
    localStorage.setItem('pendingEmails', JSON.stringify(pendingEmails));
}

/**
 * Download email as HTML file for easy sending
 */
function downloadEmailAsHTML(bookingId) {
    const emails = getPendingEmails();
    const email = emails.find(e => e.bookingId === bookingId);
    
    if (!email) {
        console.error('Email not found for booking ID:', bookingId);
        alert('Email not found');
        return;
    }
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(email.html));
    element.setAttribute('download', `booking-confirmation-${bookingId}.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    console.log('✅ Email downloaded as HTML file');
}

/**
 * Copy email content to clipboard for pasting in Gmail/Outlook
 */
function copyEmailToClipboard(bookingId) {
    const emails = getPendingEmails();
    const email = emails.find(e => e.bookingId === bookingId);
    
    if (!email) {
        alert('Email not found');
        return;
    }
    
    // Copy the HTML content
    navigator.clipboard.writeText(email.html).then(() => {
        alert('Email HTML copied to clipboard! You can now paste it in your email client.');
        console.log('✅ Email HTML copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please try again.');
    });
}

