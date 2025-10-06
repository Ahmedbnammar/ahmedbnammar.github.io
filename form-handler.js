// Contact form handling
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = this.form.querySelector('.btn');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.btnLoading = this.submitBtn.querySelector('.btn-loading');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        this.setLoadingState(true);
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        try {
            // Using EmailJS (you'll need to set this up)
            // Alternatively, you can use Formspree or Netlify Forms
            const response = await this.sendEmail(data);
            
            if (response.ok) {
                this.showSuccess();
                this.form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            this.showError();
            console.error('Form submission error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    async sendEmail(data) {
        // Method 1: Using Formspree (replace with your Formspree endpoint)
        return fetch('https://formspree.io/f/your-form-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Method 2: Using EmailJS (you'll need to set up an account)
        /*
        return emailjs.send('your_service_id', 'your_template_id', {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message
        });
        */

        // Method 3: Using Netlify Forms (add netlify attribute to form)
        // Just return fetch(this.form.action, {
        //     method: 'POST',
        //     body: new FormData(this.form)
        // });
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.btnText.style.display = 'none';
            this.btnLoading.style.display = 'flex';
        } else {
            this.submitBtn.disabled = false;
            this.btnText.style.display = 'block';
            this.btnLoading.style.display = 'none';
        }
    }

    showSuccess() {
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        const message = currentLang === 'fr' 
            ? 'Message envoyé avec succès! Je vous répondrai bientôt.' 
            : 'Message sent successfully! I will get back to you soon.';
        
        this.showNotification(message, 'success');
    }

    showError() {
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        const message = currentLang === 'fr'
            ? "Erreur d'envoi. Veuillez réessayer ou m'envoyer un email directement."
            : "Sending error. Please try again or send me an email directly.";
        
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Add notification styles
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
`;
document.head.appendChild(notificationStyles);

// Initialize contact form
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});