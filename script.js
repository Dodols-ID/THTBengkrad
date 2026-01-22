// color transition

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');

    const sectionColors = [
        { h: 210, s: 40, l: 95 },  
        { h: 120, s: 30, l: 95 },  
        { h: 280, s: 30, l: 95 },  
        { h: 340, s: 40, l: 95 }   
    ];

    let currentColorIndex = 0;
    let targetColorIndex = 0;
    let colorTransitionProgress = 0;

    // interpolate color pas hiver
    function interpolateHSL(color1, color2, progress) {
        const h = color1.h + (color2.h - color1.h) * progress;
        const s = color1.s + (color2.s - color1.s) * progress;
        const l = color1.l + (color2.l - color1.l) * progress;
        return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
    }

    // color shift pas hovernya
    function updateBackgroundColor() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const totalHeight = document.body.scrollHeight - windowHeight;

        if (totalHeight <= 0) return;

        const scrollProgress = Math.min(scrollY / totalHeight, 1);
        const totalSections = sections.length;
        const sectionProgress = scrollProgress * (totalSections - 1);

        const currentSectionIndex = Math.floor(sectionProgress);
        const sectionScrollProgress = sectionProgress - currentSectionIndex;

        const currentColor = sectionColors[Math.min(currentSectionIndex, sectionColors.length - 1)];
        const nextColor = sectionColors[Math.min(currentSectionIndex + 1, sectionColors.length - 1)];

        const interpolatedColor = interpolateHSL(currentColor, nextColor, sectionScrollProgress);

        // bikin gradien warna
        const gradient = `linear-gradient(135deg, ${interpolatedColor}, ${adjustLightness(interpolatedColor, -10)})`;
        document.body.style.background = gradient;
    }

    // helper
    function adjustLightness(hslString, adjustment) {
        const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (!match) return hslString;

        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        let l = parseInt(match[3]) + adjustment;
        l = Math.max(0, Math.min(100, l));

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    // smooth scrolling
    const navLinks = document.querySelectorAll('aside a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                highlightSection(targetSection);
            }
        });
    });

    // throtlled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                updateBackgroundColor();
                scrollTimeout = null;

                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;

                sections.forEach((section, index) => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;

                    if (scrollY >= sectionTop - windowHeight / 2 &&
                        scrollY < sectionTop + sectionHeight - windowHeight / 2) {
                        setActiveSection(section);
                    }
                });
            }, 16);
        }
    });

    updateBackgroundColor();
});

function fadeInSection(section) {
    section.style.transform = 'scale(1.01)';
    section.style.filter = 'brightness(1.05)';

    const container = section.querySelector('.container');
    if (container) {
        container.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        container.style.transform = 'translateY(-3px)';
    }
}

function fadeOutSection(section) {
    section.style.transform = 'scale(1)';
    section.style.filter = 'brightness(1)';
    const container = section.querySelector('.container');
    if (container) {
        container.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        container.style.transform = 'translateY(0)';
    }
}

function highlightSection(section) {
    section.style.transition = 'all 0.3s ease';
    fadeInSection(section);

    setTimeout(() => {
        fadeOutSection(section);
    }, 1000);
}

function setActiveSection(section) {
    document.querySelectorAll('section').forEach(s => {
        s.classList.remove('active');
        fadeOutSection(s);
    });

    section.classList.add('active');
    fadeInSection(section);

    const sectionId = section.id;
    const navLinks = document.querySelectorAll('aside a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// css actuive container
const style = document.createElement('style');
style.textContent = `
    aside a.active {
        background-color: #007bff;
        color: white;
    }

    section.active .container h1 {
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);