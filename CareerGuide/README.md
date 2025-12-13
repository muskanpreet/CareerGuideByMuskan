# Career Guidance Website

A professional consultancy website for 1:1 LinkedIn and career guidance sessions targeting college graduates and early career professionals.

## 🎯 Features

- **Professional Design**: Modern, minimalist, developer-style UI
- **Fully Responsive**: Mobile-first design that works on all devices
- **Interactive Elements**: Smooth animations and hover effects
- **Service Showcase**: LinkedIn review, career consultancy, interview prep
- **Booking System**: Integrated calendar with time slot selection
- **Testimonials**: Student feedback section
- **Contact Form**: Easy communication channel

## 🚀 Quick Start

### Option 1: Open Locally

1. Simply open `index.html` in your web browser
2. No build process required - it's a static website!

### Option 2: Local Server (Recommended)

Using Python:
```bash
python -m http.server 8000
```

Then visit: `http://localhost:8000`

Using Node.js:
```bash
npx serve
```

## 📁 Project Structure

```
sessiom/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Interactive functionality
├── README.md           # This file
└── netlify.toml        # Netlify deployment config (optional)
```

## 🌐 Deployment Options

### Deploy to Netlify (Recommended - FREE)

1. **Via Drag & Drop** (Easiest):
   - Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag your entire project folder
   - Get instant live URL!

2. **Via GitHub**:
   - Push code to GitHub
   - Connect GitHub repo to Netlify
   - Auto-deploys on every push

### Deploy to Vercel (FREE)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Deploy to GitHub Pages (FREE)

1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/career-guidance.git
   git push -u origin main
   ```
3. Go to Settings → Pages
4. Select "main" branch → Save
5. Your site will be live at: `https://yourusername.github.io/career-guidance/`

## 🎨 Customization

### Update Your Information

**In `index.html`:**
- Replace social media links in the contact section
- Update testimonials with real feedback
- Modify the "About Me" section with your story

### Colors

**In `styles.css` (lines 1-20):**
```css
:root {
    --primary-color: #2563eb;  /* Main brand color */
    --accent-color: #06b6d4;   /* Accent highlights */
    /* Modify these to match your brand */
}
```

### Booking Integration

The booking form currently logs data to console. To integrate with a real booking system:

**Option 1: Use Calendly**
Replace the booking form section with Calendly embed:
```html
<div class="calendly-inline-widget" data-url="https://calendly.com/yourusername"></div>
<script src="https://assets.calendly.com/assets/external/widget.js"></script>
```

**Option 2: Use Google Forms**
- Create a Google Form with booking fields
- Embed it in the booking section

**Option 3: Backend Integration**
Uncomment the fetch code in `script.js` (lines 115-125) and connect to your backend API.

## 📧 Contact Form Integration

### Option 1: Formspree (FREE)
1. Go to [https://formspree.io](https://formspree.io)
2. Get your form endpoint
3. Update the contact form action:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option 2: EmailJS (FREE)
1. Sign up at [https://www.emailjs.com](https://www.emailjs.com)
2. Add EmailJS script to `index.html`
3. Update form submission in `script.js`

### Option 3: Netlify Forms (FREE)
1. Add `netlify` attribute to form:
```html
<form name="contact" method="POST" data-netlify="true">
```
2. Deploy to Netlify
3. Form submissions appear in Netlify dashboard

## 💳 Payment Integration

To accept payments for sessions:

### Razorpay (India)
1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Get API keys
3. Add payment button to booking confirmation

### Stripe (International)
1. Sign up at [https://stripe.com](https://stripe.com)
2. Use Stripe Checkout for session payments

## 🔧 Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, Variables
- **JavaScript (Vanilla)**: No frameworks - pure JS
- **Font Awesome**: Icons
- **Google Fonts**: Inter typeface

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 SEO Optimization

The site includes:
- Meta descriptions
- Semantic HTML
- Fast load times
- Mobile-responsive
- Clean URLs (when deployed)

**To improve SEO further:**
1. Add Open Graph tags for social sharing
2. Include structured data (JSON-LD)
3. Add a sitemap.xml
4. Submit to Google Search Console

## 📈 Analytics

To track visitors, add Google Analytics:

1. Get tracking ID from [analytics.google.com](https://analytics.google.com)
2. Add before `</head>` in `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🤝 Support

For questions or issues:
- Email: your.email@example.com
- LinkedIn: [Your Profile]
- Instagram: [Your Profile]

## 📄 License

This project is free to use for personal purposes.

## 🙏 Acknowledgments

- Icons: Font Awesome
- Fonts: Google Fonts (Inter)
- Design inspiration: Modern SaaS landing pages

---

**Built with ❤️ for helping college graduates succeed in their careers**
