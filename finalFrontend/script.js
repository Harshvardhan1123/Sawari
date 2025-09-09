// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initAccordion();
    initSmoothScrolling();
    initContactForm();
    initActiveNavigation();
    initBusTracker();
    initAuthModal();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const hamburgerIcon = document.getElementById('hamburgerIcon');

    if (mobileMenuBtn && mobileNav && hamburgerIcon) {
        mobileMenuBtn.addEventListener('click', function() {
            const isOpen = mobileNav.classList.contains('show');
            
            if (isOpen) {
                mobileNav.classList.remove('show');
                hamburgerIcon.classList.remove('active');
            } else {
                mobileNav.classList.add('show');
                hamburgerIcon.classList.add('active');
            }
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('show');
                hamburgerIcon.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileNav.contains(event.target)) {
                mobileNav.classList.remove('show');
                hamburgerIcon.classList.remove('active');
            }
        });
    }
}

// Accordion Functionality
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-accordion');
            const content = document.getElementById(targetId);
            const icon = this.querySelector('.accordion-icon');
            
            // Close all other accordions
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    const otherId = otherHeader.getAttribute('data-accordion');
                    const otherContent = document.getElementById(otherId);
                    const otherIcon = otherHeader.querySelector('.accordion-icon');
                    
                    otherHeader.classList.remove('active');
                    otherContent.classList.remove('show');
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current accordion
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                this.classList.remove('active');
                content.classList.remove('show');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            } else {
                this.classList.add('active');
                content.classList.add('show');
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
            }
        });
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = {};
            
            // Extract form values
            const inputs = this.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                formValues[input.type] = input.value;
            });
            
            // Show success message (in a real app, you'd send this to a server)
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// Active Navigation Highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', debounce(updateActiveNav, 10));
    
    // Initial call
    updateActiveNav();
}

// Bus Tracker Functionality
function initBusTracker() {
    const trackButton = document.querySelector('.bus-tracker-card .btn-primary');
    const routeSelect = document.querySelector('.bus-tracker-card select');
    const stopInput = document.querySelector('.bus-tracker-card input');
    const statusTime = document.querySelector('.status-time');
    
    if (trackButton && routeSelect && stopInput && statusTime) {
        trackButton.addEventListener('click', function() {
            const selectedRoute = routeSelect.value;
            const enteredStop = stopInput.value.trim();
            
            if (!selectedRoute) {
                showNotification('Please select a bus route.', 'error');
                return;
            }
            
            if (!enteredStop) {
                showNotification('Please enter a stop name or location.', 'error');
                return;
            }
            
            // Simulate bus tracking (in a real app, this would call an API)
            trackButton.textContent = 'Tracking...';
            trackButton.disabled = true;
            
            setTimeout(() => {
                // Generate random arrival time between 1-10 minutes
                const arrivalMinutes = Math.floor(Math.random() * 10) + 1;
                statusTime.textContent = `${arrivalMinutes} minute${arrivalMinutes !== 1 ? 's' : ''}`;
                
                trackButton.textContent = 'Track My Bus';
                trackButton.disabled = false;
                
                showNotification(`Bus found! Arriving in ${arrivalMinutes} minute${arrivalMinutes !== 1 ? 's' : ''}.`, 'success');
            }, 2000);
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    // Add styles for notification
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
            animation: slideInRight 0.3s ease-out;
        }
        
        .notification-success {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #166534;
        }
        
        .notification-error {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
        }
        
        .notification-info {
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1d4ed8;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .notification-message {
            flex: 1;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            color: currentColor;
            opacity: 0.7;
        }
        
        .notification-close:hover {
            opacity: 1;
            background-color: rgba(0, 0, 0, 0.1);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 640px) {
            .notification {
                left: 20px;
                right: 20px;
                top: 20px;
                max-width: none;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add notification to DOM
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification && notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Utility Functions
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

// Handle responsive navigation
function handleResize() {
    const mobileNav = document.getElementById('mobileNav');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    
    if (window.innerWidth > 768) {
        if (mobileNav && hamburgerIcon) {
            mobileNav.classList.remove('show');
            hamburgerIcon.classList.remove('active');
        }
    }
}

window.addEventListener('resize', debounce(handleResize, 250));

// Handle form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// Handle newsletter subscription
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('newsletter-btn')) {
        e.preventDefault();
        const input = e.target.previousElementSibling;
        const email = input.value.trim();
        
        if (!email) {
            showNotification('Please enter your email address.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate API call
        e.target.textContent = 'Subscribing...';
        e.target.disabled = true;
        
        setTimeout(() => {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            input.value = '';
            e.target.textContent = 'Subscribe';
            e.target.disabled = false;
        }, 1500);
    }
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle route tracking buttons
document.addEventListener('click', function(e) {
    if (e.target.textContent.startsWith('Track Route')) {
        e.preventDefault();
        const routeNumber = e.target.textContent.match(/\d+/)[0];
        
        e.target.textContent = 'Tracking...';
        e.target.disabled = true;
        
        setTimeout(() => {
            const arrivalMinutes = Math.floor(Math.random() * 15) + 2;
            showNotification(`Route ${routeNumber}: Next bus in ${arrivalMinutes} minutes`, 'success');
            e.target.textContent = `Track Route ${routeNumber}`;
            e.target.disabled = false;
        }, 1500);
    }
});

// Handle support buttons
document.addEventListener('click', function(e) {
    const supportActions = ['Start Chat', 'Call Now', 'Send Email', 'Visit Help Center'];
    
    if (supportActions.includes(e.target.textContent)) {
        e.preventDefault();
        let message = '';
        
        switch (e.target.textContent) {
            case 'Start Chat':
                message = 'Live chat feature would open here in a real application.';
                break;
            case 'Call Now':
                message = 'Phone dialer would open with our support number in a real application.';
                break;
            case 'Send Email':
                message = 'Email client would open with our support email in a real application.';
                break;
            case 'Visit Help Center':
                message = 'Help center would open in a new tab in a real application.';
                break;
        }
        
        showNotification(message, 'info');
    }
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect for cards
    const cards = document.querySelectorAll('.route-card, .feature-card, .support-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add loading state management
function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.style.opacity = '0.6';
        element.style.cursor = 'not-allowed';
        element.disabled = true;
    } else {
        element.style.opacity = '1';
        element.style.cursor = 'pointer';
        element.disabled = false;
    }
}

// Initialize tooltips for better UX (simple version)
function initTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Call tooltip initialization
initTooltips();

// Auth Modal Functionality
function initAuthModal() {
    const authModal = document.getElementById('authModal');
    const authModalClose = document.getElementById('authModalClose');
    const guestContinue = document.getElementById('guestContinue');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const googleAuthBtn = document.getElementById('googleAuthBtn');
    const passwordToggles = document.querySelectorAll('.password-toggle');

    // Check if user has visited before or is logged in
    const hasVisited = localStorage.getItem('busTracker_hasVisited');
    const savedUser = localStorage.getItem('busTracker_user');
    
    if (hasVisited === 'true' || savedUser) {
        authModal.classList.add('hidden');
        if (savedUser) {
            updateUIForLoggedInUser(JSON.parse(savedUser));
        }
    }

    // Close modal handlers
    authModalClose.addEventListener('click', closeAuthModal);
    guestContinue.addEventListener('click', closeAuthModal);
    
    // Close on backdrop click
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(targetTab + 'Tab').classList.add('active');
        });
    });

    // Password toggle functionality
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const isPassword = input.type === 'password';
            
            input.type = isPassword ? 'text' : 'password';
            
            // Update icon
            const eyeIcon = this.querySelector('svg');
            if (isPassword) {
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.637 6.637m3.241 3.241l4.242 4.242M12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21l-6-6m3 3l-6-6"></path>
                `;
            } else {
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                `;
            }
        });
    });

    // Form submissions
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin(this);
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup(this);
    });

    // Google auth
    googleAuthBtn.addEventListener('click', function() {
        handleGoogleAuth();
    });

    function closeAuthModal() {
        authModal.classList.add('hidden');
        localStorage.setItem('busTracker_hasVisited', 'true');
        showNotification("You can always sign up later to save your favorite routes!", 'info');
    }

    function handleLogin(form) {
        const formData = new FormData(form);
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate login
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            email: email,
            firstName: email.split('@')[0],
            lastName: '',
            provider: 'email'
        };

        authenticateUser(user, 'login');
    }

    function handleSignup(form) {
        const firstName = form.querySelector('input[placeholder="First name"]').value;
        const lastName = form.querySelector('input[placeholder="Last name"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[placeholder="Create a password"]').value;
        const confirmPassword = form.querySelector('input[placeholder="Confirm your password"]').value;
        const termsAccepted = form.querySelector('input[type="checkbox"]').checked;

        if (!firstName || !lastName || !email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showNotification("Passwords don't match", 'error');
            return;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        if (!termsAccepted) {
            showNotification('Please accept the terms and conditions', 'error');
            return;
        }

        // Simulate signup
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            email: email,
            firstName: firstName,
            lastName: lastName,
            provider: 'email'
        };

        authenticateUser(user, 'signup');
    }

    function handleGoogleAuth() {
        // Simulate Google auth
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            email: 'user@gmail.com',
            firstName: 'John',
            lastName: 'Doe',
            provider: 'google'
        };

        authenticateUser(user, 'login');
    }

    function authenticateUser(user, type) {
        localStorage.setItem('busTracker_user', JSON.stringify(user));
        localStorage.setItem('busTracker_hasVisited', 'true');
        
        authModal.classList.add('hidden');
        updateUIForLoggedInUser(user);

        if (type === 'login') {
            showNotification(`Welcome back, ${user.firstName}!`, 'success');
        } else {
            showNotification(`Welcome to BusTracker, ${user.firstName}! Your account has been created.`, 'success');
        }
    }

    function updateUIForLoggedInUser(user) {
        // Update navigation to show user info
        const desktopCTA = document.querySelector('.desktop-nav');
        const mobileCTA = document.querySelector('.mobile-nav-cta');

        if (desktopCTA) {
            desktopCTA.innerHTML = `
                <div class="user-menu">
                    <div class="user-avatar" id="userAvatar">
                        ${user.firstName.charAt(0).toUpperCase()}
                    </div>
                    <div class="user-dropdown" id="userDropdown">
                        <div class="user-info">
                            <p class="user-name">${user.firstName} ${user.lastName}</p>
                            <p class="user-email">${user.email}</p>
                        </div>
                        <div class="dropdown-separator"></div>
                        <button class="dropdown-item">
                            <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Profile
                        </button>
                        <button class="dropdown-item">My Routes</button>
                        <button class="dropdown-item">Settings</button>
                        <div class="dropdown-separator"></div>
                        <button class="dropdown-item" id="logoutBtn">
                            <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                            Log out
                        </button>
                    </div>
                </div>
            `;

            // Add user menu functionality
            const userAvatar = document.getElementById('userAvatar');
            const userDropdown = document.getElementById('userDropdown');
            const logoutBtn = document.getElementById('logoutBtn');

            userAvatar.addEventListener('click', function() {
                userDropdown.classList.toggle('show');
            });

            document.addEventListener('click', function(e) {
                if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });

            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('busTracker_user');
                showNotification('You have been logged out', 'info');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            });
        }

        if (mobileCTA) {
            mobileCTA.innerHTML = `
                <div class="user-info" style="padding: 0.75rem; border-bottom: 1px solid var(--border); margin-bottom: 0.5rem;">
                    <p style="font-weight: 500; margin: 0 0 0.25rem 0;">${user.firstName} ${user.lastName}</p>
                    <p style="font-size: 0.875rem; color: var(--muted-foreground); margin: 0; overflow: hidden; text-overflow: ellipsis;">${user.email}</p>
                </div>
                <button class="btn btn-outline full-width" onclick="localStorage.removeItem('busTracker_user'); location.reload();">
                    <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 0.5rem;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Log out
                </button>
            `;
        }
    }
}

console.log('BusTracker website loaded successfully!');
// === AI Trip Planner ===
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('trip-planner-form');
    const startInput = document.getElementById('start-point');
    const endInput = document.getElementById('end-point');
    const loading = document.getElementById('loading-indicator');
    const result = document.getElementById('trip-plan-result');
    const generateBtn = document.getElementById('generate-plan-btn');

    if (!form) return; // Agar form hi nahi hai toh code run mat karo

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // User Input
        const start = startInput.value.trim();
        const end = endInput.value.trim();

        if (!start || !end) {
            alert('⚠️ Please enter both start and destination points.');
            return;
        }

        // Show Loading
        loading.classList.remove('hidden');
        result.classList.add('hidden');
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        try {
            // Simulated AI Response — API se later connect karenge
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Trip Plan Result
            const plan = `
                <div style="padding: 1rem;">
                    <h3>Your Trip Plan 🚌</h3>
                    <p><b>Start:</b> ${start}</p>
                    <p><b>Destination:</b> ${end}</p>
                    <p><b>Best Route:</b> Bus 112 → Central Depot → Bus 215 → ${end}</p>
                    <p><b>Approx Time:</b> 35 mins</p>
                    <p><b>Cost:</b> ₹25</p>
                </div>
            `;

            result.innerHTML = plan;
            result.classList.remove('hidden');
        } finally {
            // Reset Button
            loading.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Plan';
        }
    });
});