/* =====================================================
   PRODESK IT - Premium Interaction & Animation Script
   ===================================================== */

/**
 * 1. THREE.JS PARTICLE BACKGROUND
 * Creates a starfield/particle system in the background
 */
function initThreeJS() {
    const canvas = document.getElementById('heroCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Particles Geometry
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Position
        positions[i] = (Math.random() - 0.5) * 15;
        // Color (Mix of brand gold and white)
        const isGold = Math.random() > 0.8;
        colors[i] = isGold ? 0.898 : 1; // R (0.898 ~ #E5B54F-ish)
        colors[i + 1] = isGold ? 0.710 : 1; // G
        colors[i + 2] = isGold ? 0.310 : 1; // B
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse Interaction for Particles
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        points.rotation.y += 0.001;
        points.rotation.x += 0.0005;

        // Subtle movement with mouse
        points.position.x += (mouseX * 0.5 - points.position.x) * 0.05;
        points.position.y += (mouseY * 0.5 - points.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/**
 * 2. TYPEWRITER EFFECT
 */
function initTypewriter() {
    const element = document.getElementById('typewriter');
    const words = ["Digital", "Innovative", "Scalable", "Reliable"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 100;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 200;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 1500; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/**
 * 3. MAGNETIC BUTTON EFFECT
 */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
            const text = btn.querySelector('.btn-text');
            if (text) text.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
            const text = btn.querySelector('.btn-text');
            if (text) text.style.transform = `translate(0, 0)`;
        });
    });
}

/**
 * 4. CARD TILT & GLOW EFFECT
 */
function initCardEffects() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
            
            // Tilt
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = -(x - centerX) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });
}

/**
 * 5. STAT COUNTER ANIMATION
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = { threshold: 0.5 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCount(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
    
    function animateCount(el, target) {
        let current = 0;
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, stepTime);
    }
}

/**
 * 6. SCROLL REVEAL ANIMATIONS
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-text, .service-card, .about-text, .about-visual');
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger transition if needed via inline style
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

/**
 * 7. CORE UI INTERACTIONS (Theme, Navbar, Menu)
 */
function initCoreUI() {
    const navbar = document.getElementById('navbar');
    const themeToggle = document.getElementById('themeToggle');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Mobile Menu
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        document.getElementById('navbarNav').classList.toggle('active');
    });

    // Initial Theme Check
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

/**
 * 8. BOOKING CALENDAR LOGIC
 */
function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthDisplay = document.getElementById('currentMonth');
    const timeSlotsGrid = document.getElementById('timeSlots');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const bookingForm = document.getElementById('bookingForm');
    
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();
    
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        monthDisplay.textContent = `${months[currentMonth]} ${currentYear}`;

        // Add day names
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'day-name';
            dayEl.textContent = day;
            calendarGrid.appendChild(dayEl);
        });

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Fill empty slots
        for (let i = 0; i < firstDay; i++) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyEl);
        }

        // Fill actual days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = i;
            
            if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayEl.classList.add('today');
            }

            dayEl.addEventListener('click', () => {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
                dayEl.classList.add('active');
                renderTimeSlots();
            });

            calendarGrid.appendChild(dayEl);
        }
    }

    function renderTimeSlots() {
        timeSlotsGrid.innerHTML = '';
        timeSlots.forEach(time => {
            const btn = document.createElement('button');
            btn.className = 'time-btn';
            btn.textContent = time;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
            timeSlotsGrid.appendChild(btn);
        });
    }

    prevMonthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const activeDay = document.querySelector('.calendar-day.active');
        const activeTime = document.querySelector('.time-btn.selected');
        
        if (!activeDay || !activeTime) {
            alert('Please select both a date and a time slot.');
            return;
        }

        const submitBtn = bookingForm.querySelector('.btn');
        submitBtn.textContent = 'Booking...';
        
        setTimeout(() => {
            alert('Meeting booked successfully! We will contact you soon.');
            submitBtn.textContent = 'Book Meeting';
            bookingForm.reset();
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
        }, 1500);
    });

    renderCalendar();
}

// Initialize everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initTypewriter();
    initMagneticButtons();
    initCardEffects();
    initStatsCounter();
    initScrollReveal();
    initCoreUI();
    initCalendar();
    
    console.log('✨ Prodesk IT Premium Experience Initialized');
});
