// EmailJS Initialization
const env = document.getElementById('env').dataset;
(function() {
    // Initialize EmailJS with your public key
    emailjs.init(env.emailjsPublicKey);
})();

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});

// EmailJS Contact Form Function
function sendEmail(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Get form data
    const formData = {
        user_name: document.getElementById('contactName').value,
        user_email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };
    
    // EmailJS template parameters
    const templateParams = {
        to_name: "AI Summary Pro Support",
        from_name: formData.user_name,
        from_email: formData.user_email,
        subject: formData.subject,
        message: formData.message +"\n\n" +formData.user_email + "\n" +formData.user_name + "\n" +formData.subject,
        reply_to: formData.user_email
    };
    
    // Send email using EmailJS
    emailjs.send(env.emailjsServiceId, env.emailjsTemplateId, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, function(error) {
            console.log('FAILED...', error);
            showNotification('Failed to send message. Please try again or contact us directly.', 'error');
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
}

// Generator functionality
async function generate() {
    const complaint = document.getElementById("complaint").value.trim();
    const cause = document.getElementById("cause").value.trim();
    const correction = document.getElementById("correction").value.trim();
    const output = document.getElementById("output");

    if (!complaint || !cause || !correction) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }

    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';

    try {
        const res = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ complaint, cause, correction }),
        });

        const data = await res.json();
        
        if (res.ok) {
            output.innerHTML = "";
            const div = document.createElement("div");
            div.className = "summary-box";
            
            const formatted = data.summary
                .replace(/^(Summary|More about the complaint|What might have caused it|Planned correction|Why it is important to fix it)/gmi, "<h3>$1</h3>")
                .replace(/\n{2,}/g, "<br><br>");

            div.innerHTML = `
                <button class="copy-btn" onclick="copyToClipboard(this)">
                    <i class="fas fa-copy"></i>
                    Copy
                </button>
                ${formatted}
                <div class="copied-msg" style="display:none;">
                    <i class="fas fa-check"></i>
                    Copied to clipboard!
                </div>
            `;

            output.appendChild(div);
            
            // Scroll to output
            output.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            showNotification('Summary generated successfully!', 'success');
        } else {
            throw new Error(data.error || 'Failed to generate summary');
        }
    } catch (error) {
        console.error("Error:", error);
        showNotification('Failed to generate summary. Please try again.', 'error');
    } finally {
        // Hide loading overlay
        loadingOverlay.style.display = 'none';
    }
}

function copyToClipboard(button) {
    const textToCopy = button.parentElement.innerText.replace("Copy", "").trim();
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const msg = button.parentElement.querySelector('.copied-msg');
        msg.style.display = "block";
        
        setTimeout(() => {
            msg.style.display = "none";
        }, 2000);
        
        showNotification('Summary copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function resetFields() {
    document.getElementById("complaint").value = "";
    document.getElementById("cause").value = "";
    document.getElementById("correction").value = "";
    document.getElementById("output").innerHTML = "";
    showNotification('Form reset successfully!', 'success');
}

// Utility functions
function scrollToGenerator() {
    const generator = document.getElementById('generator');
    generator.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToFeatures() {
    const features = document.getElementById('features');
    features.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#007bff';
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: background-color 0.3s ease;
    }
    
    .notification-close:hover {
        background: rgba(255,255,255,0.2);
    }
`;
document.head.appendChild(notificationStyles);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .step, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}); 