# EmailJS Setup Guide for AI Summary Pro

This guide will help you set up EmailJS to enable email functionality for the contact form.

## 🚀 Step-by-Step Setup

### 1. Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Add Email Service

1. Log in to your EmailJS dashboard
2. Go to "Email Services" in the left sidebar
3. Click "Add New Service"
4. Choose your email provider (Gmail, Outlook, etc.)
5. Follow the authentication steps for your provider
6. Note down your **Service ID** (you'll need this later)

### 3. Create Email Template

1. Go to "Email Templates" in the left sidebar
2. Click "Create New Template"
3. Use this template structure:

```html
Subject: New Contact Form Message from {{from_name}}

Hello {{to_name}},

You have received a new message from the AI Summary Pro contact form:

**From:** {{from_name}}
**Email:** {{from_email}}
**Subject:** {{subject}}

**Message:**
{{message}}

---
This message was sent from the AI Summary Pro website contact form.
Reply directly to this email to respond to {{from_name}}.
```

4. Save the template and note down your **Template ID**

### 4. Get Your Public Key

1. Go to "Account" in the left sidebar
2. Click on "API Keys"
3. Copy your **Public Key**

### 5. Update the JavaScript Code

Replace the placeholder values in `public/script.js`:

```javascript
// Replace these values with your actual EmailJS credentials
emailjs.init("YOUR_PUBLIC_KEY"); // Your actual public key

// In the sendEmail function, replace:
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
// With your actual Service ID and Template ID
```

### 6. Test the Contact Form

1. Start your server: `npm start`
2. Navigate to the contact section
3. Fill out the form and submit
4. Check your email to confirm it's working

## 🔧 Configuration Details

### Required EmailJS Credentials

You need to replace these placeholders in `public/script.js`:

- `YOUR_PUBLIC_KEY` - Your EmailJS public key
- `YOUR_SERVICE_ID` - Your email service ID
- `YOUR_TEMPLATE_ID` - Your email template ID

### Example Configuration

```javascript
// EmailJS Initialization
(function() {
    emailjs.init("user_abc123def456ghi789"); // Your actual public key
})();

// In sendEmail function:
emailjs.send('service_xyz123', 'template_abc456', templateParams)
```

## 📧 Email Template Variables

The contact form sends these variables to your email template:

- `{{to_name}}` - Recipient name (set to "AI Summary Pro Support")
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email address
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{reply_to}}` - Reply-to email address

## 🛡️ Security Considerations

### Free Plan Limitations
- EmailJS free plan allows 200 emails per month
- Consider upgrading for business use

### Best Practices
- Keep your API keys secure
- Don't commit API keys to public repositories
- Use environment variables for production

## 🔍 Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check browser console for errors
   - Verify EmailJS credentials are correct
   - Ensure email service is properly connected

2. **Template variables not working**
   - Verify template syntax matches EmailJS format
   - Check that variable names match exactly

3. **CORS errors**
   - EmailJS handles CORS automatically
   - Ensure you're using the correct CDN link

### Debug Steps

1. Open browser developer tools (F12)
2. Check the Console tab for error messages
3. Verify EmailJS is loaded properly
4. Test with a simple email first

## 📱 Testing on Different Devices

### Desktop Testing
- Test in different browsers (Chrome, Firefox, Safari, Edge)
- Verify form validation works
- Check email delivery

### Mobile Testing
- Test on iOS and Android devices
- Verify responsive design
- Check touch interactions

## 🚀 Production Deployment

### Environment Variables
For production, consider using environment variables:

```javascript
// In production, you might want to load these from environment variables
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'your_public_key';
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'your_template_id';
```

### Security Enhancements
- Use environment variables for sensitive data
- Implement rate limiting
- Add CAPTCHA for spam prevention
- Consider server-side validation

## 📞 Support

If you encounter issues:

1. Check EmailJS documentation: [docs.emailjs.com](https://docs.emailjs.com/)
2. Review EmailJS community forum
3. Contact EmailJS support for account issues
4. Check browser console for JavaScript errors

## ✅ Checklist

- [ ] EmailJS account created
- [ ] Email service added and configured
- [ ] Email template created
- [ ] Public key obtained
- [ ] JavaScript code updated with real credentials
- [ ] Contact form tested successfully
- [ ] Email delivery confirmed
- [ ] Mobile testing completed
- [ ] Production deployment ready

---

**Note:** Keep your EmailJS credentials secure and never share them publicly. For production use, consider implementing additional security measures like rate limiting and server-side validation. 