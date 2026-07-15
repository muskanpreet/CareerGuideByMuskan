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
    const amount = isQuickSession ? '₹199' : '₹299';
    
    const emailHTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Session booked</title></head>
<body style="margin:0; padding:24px 12px; background:#f6f8fb; font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif; color:#1e293b; line-height:1.55;">
    <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e6ebf2;">

        <!-- Header strip -->
        <div style="background:#2563eb; padding:20px 24px;">
            <div style="color:#dbeafe; font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase;">CareerGuide</div>
            <div style="color:#ffffff; font-size:20px; font-weight:600; margin-top:4px;">You're booked in 🎯</div>
        </div>

        <!-- Body -->
        <div style="padding:24px;">
            <p style="font-size:15px; margin:0 0 14px 0;">Hi ${bookingData.name},</p>
            <p style="font-size:15px; margin:0 0 20px 0; color:#475569;">Thanks for booking a session with me. Here's a quick summary — save this email so you have it handy on the day.</p>

            <!-- Booking card -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px 18px; margin:0 0 22px 0;">
                <table style="width:100%; border-collapse:collapse; font-size:14px;">
                    <tr>
                        <td style="padding:6px 0; color:#64748b; width:110px;">Session</td>
                        <td style="padding:6px 0; font-weight:600;">${bookingData.sessionType === '30min' ? '30-minute quick session' : '60-minute detailed session'}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0; color:#64748b;">Date</td>
                        <td style="padding:6px 0; font-weight:600;">${formattedDate}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0; color:#64748b;">Time</td>
                        <td style="padding:6px 0; font-weight:600;">${bookingData.time} IST</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0; color:#64748b;">Amount</td>
                        <td style="padding:6px 0; font-weight:600; color:${amount === 'FREE' ? '#10b981' : '#2563eb'};">${amount}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0; color:#64748b;">Booking ID</td>
                        <td style="padding:6px 0; font-family:monospace; font-size:12px; color:#475569;">${bookingId}</td>
                    </tr>
                </table>
            </div>

            ${amount !== 'FREE' ? `
            <!-- Payment -->
            <div style="margin:0 0 22px 0;">
                <div style="font-size:13px; font-weight:600; color:#0f172a; margin:0 0 8px 0;">Payment</div>
                <p style="font-size:14px; margin:0 0 4px 0;">UPI: <strong style="color:#2563eb;">oshinkaur175@oksbi</strong></p>
                <p style="font-size:14px; margin:0 0 12px 0; color:#64748b;">Name: Muskanpreet Kaur</p>
                <img src="https://careerguidebymuskan.netlify.app/images/qrcode.png" alt="UPI QR" width="160" height="160" style="display:block; border:1px solid #e2e8f0; border-radius:8px; padding:6px; background:#ffffff;" />
                <p style="font-size:12px; color:#64748b; margin:8px 0 0 0;">Scan with GPay, PhonePe or any UPI app.</p>
            </div>
            ` : `
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; border-radius:8px; padding:12px 14px; margin:0 0 22px 0; font-size:14px;">
                🎉 This session is on the house — nothing to pay.
            </div>
            `}

            <!-- What next -->
            <div style="font-size:13px; font-weight:600; color:#0f172a; margin:0 0 8px 0;">What happens next</div>
            <ul style="margin:0 0 20px 20px; padding:0; font-size:14px; color:#334155;">
                <li style="margin:4px 0;">I'll send you a Google Meet link before your session starts.</li>
                <li style="margin:4px 0;">Feel free to jot down anything you'd like to discuss.</li>
                <li style="margin:4px 0;">Need to reschedule or ask something? Just reply to this email.</li>
            </ul>

            <p style="font-size:14px; margin:0; color:#334155;">See you soon,<br><strong>Muskanpreet</strong></p>
        </div>

        <!-- Small footer -->
        <div style="padding:14px 24px; border-top:1px solid #eef2f7; font-size:12px; color:#94a3b8;">
            CareerGuide by Muskanpreet · Reply to this email anytime.
        </div>
    </div>
</body></html>`;
    
    return emailHTML;
}

/**
 * Send booking confirmation email via EmailJS REST API
 * @param {Object} bookingData - Booking data
 * @param {string} bookingId - Booking ID
 */
function sendBookingConfirmationEmail(bookingData, bookingId) {
    
    try {
        // Generate the email HTML
        const emailHTML = generateBookingConfirmationEmail(bookingData, bookingId);
        
        // Format date for display
        const dateObj = new Date(bookingData.date);
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Determine amount (matching form values: 30min or 60min)
        const isQuickSession = bookingData.sessionType === '30min';
        const amount = isQuickSession ? '₹199' : '₹299';
        
        // Admin notification email (sent to owner so bookings are visible)
        const ADMIN_EMAIL = 'oshinkaur175@gmail.com';

        // Build a compact, distinct admin summary — deliberately different from the
        // customer HTML so Gmail doesn't dedupe/spam-drop it as a near-duplicate,
        // and so it's actually useful in the inbox at a glance.
        const adminHTML = `
        <!DOCTYPE html><html><body style="font-family: -apple-system, Segoe UI, Arial, sans-serif; background:#f5f7fa; padding:20px; margin:0; color:#1e293b;">
            <div style="max-width:560px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden;">
                <div style="background:#2563eb; color:#fff; padding:16px 20px;">
                    <div style="font-size:12px; opacity:0.85; letter-spacing:0.5px;">NEW BOOKING</div>
                    <div style="font-size:18px; font-weight:600; margin-top:2px;">${bookingData.name}</div>
                </div>
                <table style="width:100%; border-collapse:collapse; font-size:14px;">
                    <tr><td style="padding:10px 20px; color:#64748b; width:120px;">Session</td><td style="padding:10px 20px;"><strong>${bookingData.sessionType}</strong> · ${amount}</td></tr>
                    <tr><td style="padding:10px 20px; color:#64748b; border-top:1px solid #f1f5f9;">Date &amp; Time</td><td style="padding:10px 20px; border-top:1px solid #f1f5f9;"><strong>${formattedDate}</strong> at <strong>${bookingData.time} IST</strong></td></tr>
                    <tr><td style="padding:10px 20px; color:#64748b; border-top:1px solid #f1f5f9;">Email</td><td style="padding:10px 20px; border-top:1px solid #f1f5f9;"><a href="mailto:${bookingData.email}" style="color:#2563eb; text-decoration:none;">${bookingData.email}</a></td></tr>
                    <tr><td style="padding:10px 20px; color:#64748b; border-top:1px solid #f1f5f9;">Phone</td><td style="padding:10px 20px; border-top:1px solid #f1f5f9;"><a href="tel:${bookingData.phone}" style="color:#2563eb; text-decoration:none;">${bookingData.phone}</a></td></tr>
                    <tr><td style="padding:10px 20px; color:#64748b; border-top:1px solid #f1f5f9; vertical-align:top;">Message</td><td style="padding:10px 20px; border-top:1px solid #f1f5f9; white-space:pre-wrap;">${(bookingData.message || '—').replace(/</g,'&lt;')}</td></tr>
                    <tr><td style="padding:10px 20px; color:#64748b; border-top:1px solid #f1f5f9;">Booking ID</td><td style="padding:10px 20px; border-top:1px solid #f1f5f9; font-family:monospace; font-size:12px;">${bookingId}</td></tr>
                </table>
                <div style="padding:14px 20px; background:#f8fafc; font-size:12px; color:#64748b; border-top:1px solid #e2e8f0;">
                    Reply to this email to contact the customer directly. Manage all bookings in the admin dashboard.
                </div>
            </div>
        </body></html>`;

        // Prepare email parameters (client confirmation)
        const emailParams = {
            service_id: EMAIL_CONFIG.SERVICE_ID,
            template_id: EMAIL_CONFIG.TEMPLATE_ID,
            user_id: EMAIL_CONFIG.PUBLIC_KEY,
            template_params: {
                to_email: bookingData.email,
                to_name: bookingData.name,
                subject: `Your session on ${formattedDate} at ${bookingData.time}`,
                html_message: emailHTML,
                from_name: 'Muskanpreet Kaur',
                from_email: 'muskanpreet175@gmail.com',
                reply_to: 'muskanpreet175@gmail.com'
            }
        };

        // Prepare admin notification parameters — distinct HTML + subject to avoid
        // Gmail treating it as a duplicate of the customer email
        const adminEmailParams = {
            service_id: EMAIL_CONFIG.SERVICE_ID,
            template_id: EMAIL_CONFIG.TEMPLATE_ID,
            user_id: EMAIL_CONFIG.PUBLIC_KEY,
            template_params: {
                to_email: ADMIN_EMAIL,
                to_name: 'CareerGuide Admin',
                subject: `[Booking] ${bookingData.name} · ${formattedDate} ${bookingData.time} · ${amount}`,
                html_message: adminHTML,
                from_name: 'CareerGuide Bookings',
                from_email: 'muskanpreet175@gmail.com',
                // Lets you reply directly to the customer from Gmail
                reply_to: bookingData.email
            }
        };


        const sendEmail = (params, label) =>
            fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
            .then(response => {
                if (response.ok) {
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            });

        // Send both emails independently so one failing doesn't block the other.
        // Stagger the admin send so Gmail is less likely to treat them as related.
        sendEmail(emailParams, 'client').catch((error) => {
            console.error('❌ Error sending client email:', error);
        });

        setTimeout(() => {
            sendEmail(adminEmailParams, 'admin').catch((error) => {
            console.error('❌ Error sending admin notification email:', error);
            // Store an admin-side pending record so the booking isn't silently lost
            try {
                const adminPending = JSON.parse(localStorage.getItem('pendingAdminNotifications')) || [];
                adminPending.push({
                    to: ADMIN_EMAIL,
                    subject: adminEmailParams.template_params.subject,
                    html: adminHTML,
                    timestamp: new Date().toISOString(),
                    bookingId: bookingId,
                    customerName: bookingData.name,
                    customerEmail: bookingData.email,
                    customerPhone: bookingData.phone,
                    sessionType: bookingData.sessionType,
                    date: bookingData.date,
                    time: bookingData.time
                });
                localStorage.setItem('pendingAdminNotifications', JSON.stringify(adminPending));
            } catch (e) {
                console.error('Could not store admin notification fallback:', e);
            }
        });
        }, 700);
        
    } catch (error) {
        console.error('❌ Error in sendBookingConfirmationEmail:', error);
    }
}

