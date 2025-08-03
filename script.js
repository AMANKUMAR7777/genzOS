class RetroGenZOS {
    constructor() {
        this.quotes = [
            "No cap this OS is straight fire fr fr",
            "Periodt this is giving main character energy",
            "The way this OS serves looks... chefs kiss",
            "Say less this OS understood the assignment",
            "Not me crying over how aesthetic this is",
            "This OS really said I am THAT girl",
            "Living for this energy no notes",
            "The OS is OSing respectfully",
            "This hits different when youre built different",
            "Main character moment right here chief"
        ];
        
        this.currentQuoteIndex = 0;
        this.windows = new Map();
        this.zIndex = 100;
        
        this.init();
    }

    init() {
        this.setupBootScreen();
        this.setupApps();
        this.setupQuoteGenerator();
        this.setupWindowSystem();
        this.setupTaskbar();
        this.updateTime();
    }

    setupBootScreen() {
        setTimeout(() => {
            gsap.to('.boot-screen', {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    document.querySelector('.boot-screen').style.display = 'none';
                    this.animateDesktopLoad();
                }
            });
        }, 3500);
    }

    animateDesktopLoad() {
        const apps = document.querySelectorAll('.app');
        
        gsap.from(apps, {
            scale: 0,
            rotation: 180,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });

        gsap.from('.quote-display', {
            x: 300,
            opacity: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "power2.out"
        });
    }

    setupApps() {
        const apps = document.querySelectorAll('.app');
        
        apps.forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.dataset.app;
                this.openWindow(appName);
                
                // Retro click animation
                gsap.to(app, {
                    scale: 0.9,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            });

            app.addEventListener('mouseenter', () => {
                gsap.to(app, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });

            app.addEventListener('mouseleave', () => {
                gsap.to(app, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
        });
    }

    setupQuoteGenerator() {
        const quoteBtn = document.getElementById('new-quote');
        const quoteText = document.getElementById('meme-quote');
        
        quoteBtn.addEventListener('click', () => {
            this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
            
            gsap.to(quoteText, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    quoteText.textContent = this.quotes[this.currentQuoteIndex];
                    gsap.to(quoteText, {
                        opacity: 1,
                        duration: 0.2
                    });
                }
            });
        });
    }

    setupWindowSystem() {
        // Keep your existing window drag and resize functionality
        this.setupWindowDragging();
        this.setupWindowControls();
        this.setupWindowResize();
    }

    openWindow(appName) {
        const window = document.getElementById(`${appName}-window`);
        if (!window) return;

        this.zIndex++;
        window.style.zIndex = this.zIndex;
        window.style.display = 'block';
        
        // Random position for new windows
        const maxX = window.innerWidth - 400;
        const maxY = window.innerHeight - 300;
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        
        gsap.set(window, {
            x: x,
            y: y,
            scale: 0,
            opacity: 0
        });
        
        gsap.to(window, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });

        this.addTaskbarItem(appName, window);
    }

    setupWindowControls() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn')) {
                const window = e.target.closest('.window');
                this.closeWindow(window);
            }
            
            if (e.target.classList.contains('minimize-btn')) {
                const window = e.target.closest('.window');
                this.minimizeWindow(window);
            }
            
            if (e.target.classList.contains('maximize-btn')) {
                const window = e.target.closest('.window');
                this.toggleMaximize(window);
            }
        });
    }

    closeWindow(window) {
        gsap.to(window, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                window.style.display = 'none';
                this.removeTaskbarItem(window);
            }
        });
    }

    minimizeWindow(window) {
        gsap.to(window, {
            scale: 0.1,
            y: window.innerHeight,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                window.style.display = 'none';
            }
        });
    }

    toggleMaximize(window) {
        if (window.classList.contains('maximized')) {
            window.classList.remove('maximized');
            gsap.to(window, {
                x: window.dataset.originalX || 120,
                y: window.dataset.originalY || 120,
                width: window.dataset.originalWidth || 400,
                height: window.dataset.originalHeight || 300,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            // Store original dimensions
            const rect = window.getBoundingClientRect();
            window.dataset.originalX = rect.left;
            window.dataset.originalY = rect.top;
            window.dataset.originalWidth = rect.width;
            window.dataset.originalHeight = rect.height;
            
            window.classList.add('maximized');
        }
    }

    setupWindowDragging() {
        // Keep your existing drag functionality from the original code
        let isDragging = false;
        let currentWindow = null;
        let startX, startY, startLeft, startTop;

        document.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('title-bar') || e.target.closest('.title-bar')) {
                currentWindow = e.target.closest('.window');
                if (currentWindow && !currentWindow.classList.contains('maximized')) {
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    startLeft = currentWindow.offsetLeft;
                    startTop = currentWindow.offsetTop;
                    
                    this.zIndex++;
                    currentWindow.style.zIndex = this.zIndex;
                }
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && currentWindow) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                currentWindow.style.left = (startLeft + deltaX) + 'px';
                currentWindow.style.top = (startTop + deltaY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            currentWindow = null;
        });
    }

    setupWindowResize() {
        // Keep your existing resize functionality
        // This would be your existing resize handle code
    }

    addTaskbarItem(appName, window) {
        const taskbarItems = document.querySelector('.taskbar-items');
        const existingItem = document.querySelector(`[data-window="${appName}"]`);
        
        if (!existingItem) {
            const item = document.createElement('div');
            item.className = 'taskbar-item active';
            item.dataset.window = appName;
            item.textContent = window.querySelector('.title-text').textContent;
            
            item.addEventListener('click', () => {
                if (window.style.display === 'none') {
                    window.style.display = 'block';
                    gsap.fromTo(window, 
                        { scale: 0.1, y: window.innerHeight, opacity: 0 },
                        { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
                    );
                } else {
                    this.zIndex++;
                    window.style.zIndex = this.zIndex;
                }
            });
            
            taskbarItems.appendChild(item);
        }
    }

    removeTaskbarItem(window) {
        const appName = window.id.replace('-window', '');
        const taskbarItem = document.querySelector(`[data-window="${appName}"]`);
        if (taskbarItem) {
            taskbarItem.remove();
        }
    }

    setupTaskbar() {
        const startBtn = document.querySelector('.start-btn');
        startBtn.addEventListener('click', () => {
            // Add start menu functionality here if needed
            console.log('Start menu clicked - no cap!');
        });
    }

    updateTime() {
        const timeDisplay = document.querySelector('.time-display');
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], {
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true
            });
            timeDisplay.textContent = timeString;
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }
}

// Initialize the OS when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RetroGenZOS();
});
