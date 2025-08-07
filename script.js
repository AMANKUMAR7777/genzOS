//I have optimized my all the code using AI because mine one is soo unoptiomized and unclean

class RetroGenZOS {
    constructor() {
        // added some quotes using AI because im not a good writer
        this.quotes = [
            "ngl this OS kinda slaps different",
            "bestie this is giving me LIFE rn",
            "the aesthetic is literally *chef's kiss* immaculate",
            "ok but like... this OS really understood the assignment tho",
            "why am i actually emotional over an operating system???",
            "this OS said 'i'm the moment' and honestly? valid",
            "the vibes are immaculate no notes whatsoever",
            "OS really said 'watch me serve' and then DID THAT",
            "this just hits different when you're chronically online",
            "main character energy fr no cap detected"
        ];

        this.currentQuoteIndex = 0;
        this.openWindows = new Map(); // changed from windows bc it was confusing me
        this.topZIndex = 100;
        
        this.initialize();
    }

    initialize() {
        this.doBootSequence();
        this.setupClickyApps();
        this.makeQuoteGeneratorWork();
        this.setupAllTheWindowStuff();
        this.setupTaskbarThings();
        this.startClock();
    }

    doBootSequence() {
        setTimeout(() => {
            gsap.to('.boot-screen', {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    document.querySelector('.boot-screen').style.display = 'none';
                    this.animateDesktopAppearance();
                }
            });
        }, 3500); // 3.5 seconds
    }

    animateDesktopAppearance() {
        const apps = document.querySelectorAll('.app');
        
        // make apps pop in with some nice animations
        gsap.from(apps, {
            scale: 0,
            rotation: 180,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)" // this ease is *chef's kiss*
        });

        // slides in the quote box from the right
        gsap.from('.quote-display', {
            x: 300,
            opacity: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "power2.out"
        });
    }

    setupClickyApps() {
        const allApps = document.querySelectorAll('.app');
        
        allApps.forEach(app => {
            // handles clicks
            app.addEventListener('click', () => {
                const appType = app.dataset.app;
                this.launchWindow(appType);
                
                // little click animtaions
                gsap.to(app, {
                    scale: 0.9,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            });

            // hover effects
            app.addEventListener('mouseenter', () => {
                gsap.to(app, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });

            app.addEventListener('mouseleave', () => {
                gsap.to(app, { scale: 1, duration: 0.2, ease: "power2.out" });
            });
        });
    }

    makeQuoteGeneratorWork() {
        const btn = document.getElementById('new-quote');
        const textEl = document.getElementById('meme-quote');
        
        btn.addEventListener('click', () => {
            this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
            
            // fade out, change text, fade back in effects
            gsap.to(textEl, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    textEl.textContent = this.quotes[this.currentQuoteIndex];
                    gsap.to(textEl, { opacity: 1, duration: 0.2 });
                }
            });
        });
    }

    setupAllTheWindowStuff() {
        this.makeDraggable();
        this.handleWindowButtons();
    }

    launchWindow(appName) {
        const windowEl = document.getElementById(`${appName}-window`);
        if (!windowEl) {
            console.log(`couldn't find window for ${appName} rip`);
            return;
        }

        this.topZIndex++;
        windowEl.style.zIndex = this.topZIndex;
        windowEl.style.display = 'block';

        // random position so windows don't overlap eachothers
        const maxX = window.innerWidth - 400;
        const maxY = window.innerHeight - 300;
        const randomX = Math.random() * Math.max(0, maxX);
        const randomY = Math.random() * Math.max(0, maxY);

        gsap.set(windowEl, {
            x: randomX,
            y: randomY,
            scale: 0,
            opacity: 0
        });

        // animates the window appearing
        gsap.to(windowEl, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });

        this.addToTaskbar(appName, windowEl);
    }

    handleWindowButtons() {
        // using event delegation bc it's more cleaner
        document.addEventListener('click', (e) => {
            if (e.target.matches('.close-btn')) {
                const win = e.target.closest('.window');
                this.closeWindow(win);
            } else if (e.target.matches('.minimize-btn')) {
                const win = e.target.closest('.window');
                this.hideWindow(win);
            } else if (e.target.matches('.maximize-btn')) {
                const win = e.target.closest('.window');
                this.toggleFullscreen(win);
            }
        });
    }

    closeWindow(windowEl) {
        gsap.to(windowEl, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                windowEl.style.display = 'none';
                this.removeFromTaskbar(windowEl);
            }
        });
    }

    hideWindow(windowEl) {
        // animation of minimize to taskbar
        gsap.to(windowEl, {
            scale: 0.1,
            y: window.innerHeight,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => { windowEl.style.display = 'none'; }
        });
    }

    toggleFullscreen(windowEl) {
        const isMaxed = windowEl.classList.contains('maximized');
        
        if (isMaxed) {
            // restores it to the original size
            windowEl.classList.remove('maximized');
            gsap.to(windowEl, {
                x: windowEl.dataset.origX || 120,
                y: windowEl.dataset.origY || 120, 
                width: windowEl.dataset.origW || 400,
                height: windowEl.dataset.origH || 300,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            // saves the current position and size before maximizing
            const rect = windowEl.getBoundingClientRect();
            windowEl.dataset.origX = rect.left;
            windowEl.dataset.origY = rect.top;
            windowEl.dataset.origW = rect.width;
            windowEl.dataset.origH = rect.height;
            
            windowEl.classList.add('maximized');
            // CSS handles the real maximization
        }
    }

    makeDraggable() {
        let dragging = false;
        let activeWindow = null;
        let startMouseX, startMouseY, startWinLeft, startWinTop;

        document.addEventListener('mousedown', (e) => {
            // drag from title bar
            if (e.target.closest('.title-bar')) {
                activeWindow = e.target.closest('.window');
                if (activeWindow && !activeWindow.classList.contains('maximized')) {
                    dragging = true;
                    startMouseX = e.clientX;
                    startMouseY = e.clientY;
                    startWinLeft = activeWindow.offsetLeft;
                    startWinTop = activeWindow.offsetTop;
                    
                    // brings to front
                    this.topZIndex++;
                    activeWindow.style.zIndex = this.topZIndex;
                }
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (dragging && activeWindow) {
                const deltaX = e.clientX - startMouseX;
                const deltaY = e.clientY - startMouseY;
                activeWindow.style.left = `${startWinLeft + deltaX}px`;
                activeWindow.style.top = `${startWinTop + deltaY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            dragging = false;
            activeWindow = null;
        });
    }

    addToTaskbar(appName, windowEl) {
        const taskbarArea = document.querySelector('.taskbar-items');
        let existingBtn = document.querySelector(`[data-window="${appName}"]`);
        
        if (existingBtn) return; 

        const btn = document.createElement('div');
        btn.className = 'taskbar-item active';
        btn.dataset.window = appName;
        btn.textContent = windowEl.querySelector('.title-text')?.textContent || appName;

        btn.addEventListener('click', () => {
            if (windowEl.style.display === 'none') {
                
                windowEl.style.display = 'block';
                gsap.fromTo(windowEl,
                    { scale: 0.1, y: window.innerHeight, opacity: 0 },
                    { scale: 1, y: windowEl.dataset.origY || 0, opacity: 1, 
                      duration: 0.3, ease: "back.out(1.7)" }
                );
            } else {
                //bring to front
                this.topZIndex++;
                windowEl.style.zIndex = this.topZIndex;
            }
        });

        taskbarArea.appendChild(btn);
    }

    removeFromTaskbar(windowEl) {
        const appName = windowEl.id.replace('-window', '');
        const btn = document.querySelector(`[data-window="${appName}"]`);
        btn?.remove();
    }

    setupTaskbarThings() {
        const startButton = document.querySelector('.start-btn');
        startButton?.addEventListener('click', () => {
            console.log('start menu clicked but like... not implemented yet lol');
        });
    }

    startClock() {
        const clockEl = document.querySelector('.time-display');
        
        const tick = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit', 
                hour12: true
            });
            if (clockEl) clockEl.textContent = timeStr;
        };

        tick(); // run immediately
        setInterval(tick, 1000);
    }
}

// fire it up when page loads
document.addEventListener('DOMContentLoaded', () => {
    new RetroGenZOS();
});
