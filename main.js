// Main application functionality
class PortfolioApp {
    constructor() {
        this.currentLang = 'en';
        this.currentTheme = 'dark';
        this.typingInterval = null;
        this.init();
    }

    init() {
        this.detectLanguage();
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.animateLanguageBars();
    }

    detectLanguage() {
        // Check saved preference
        const savedLang = localStorage.getItem('preferredLanguage');
        const browserLang = navigator.language || navigator.userLanguage;
        
        if (savedLang) {
            this.currentLang = savedLang;
        } else if (browserLang.startsWith('fr')) {
            this.currentLang = 'fr';
        }
        
        this.setLanguage(this.currentLang);
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        
        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update content
        this.updateContent();
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[this.currentLang] && translations[this.currentLang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[this.currentLang][key];
                } else {
                    element.innerHTML = translations[this.currentLang][key];
                }
            }
        });
        
        // Update typing animation
        this.updateTypingAnimation();
    }

    updateTypingAnimation() {
        const texts = typingTexts[this.currentLang] || typingTexts.en;
        const typingText = document.getElementById('typing-text');
        
        // Clear existing animation
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        };
        
        // Start typing animation
        setTimeout(type, 1000);
    }

    setupEventListeners() {
        // Language switching
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setLanguage(e.target.dataset.lang);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('preferredTheme', this.currentTheme);
        
        // Update theme button icon
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    
                    if (entry.target.classList.contains('timeline-item')) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, 200);
                    }
                    
                    if (entry.target.classList.contains('language-progress')) {
                        this.animateProgressBar(entry.target);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('section, .timeline-item, .language-progress').forEach(element => {
            observer.observe(element);
        });
    }

    animateLanguageBars() {
        document.querySelectorAll('.language-progress').forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = '0%';
            // Animation will be triggered by intersection observer
        });
    }

    animateProgressBar(bar) {
        const level = bar.getAttribute('data-level');
        setTimeout(() => {
            bar.style.width = level + '%';
        }, 300);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});