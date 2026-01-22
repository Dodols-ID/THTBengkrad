// color transition

// Global variable to store images by section
let sectionImagesData = {};

// Function to load section images from Supabase
async function loadSectionImages() {
    try {
        const { data: images, error } = await window.supabaseClient
            .from('section_images')
            .select('*')
            .order('section_id, image_order');

        if (error) {
            console.error('Error loading images:', error);
            return;
        }

        // Group images by section
        sectionImagesData = {};
        images.forEach(img => {
            if (!sectionImagesData[img.section_id]) {
                sectionImagesData[img.section_id] = [];
            }
            sectionImagesData[img.section_id].push(img);
        });

        // Initialize carousels for sections that have images
        Object.keys(sectionImagesData).forEach(sectionId => {
            initializeCarousel(sectionId, sectionImagesData[sectionId]);
        });

        console.log('Section images loaded successfully');
    } catch (error) {
        console.error('Error loading section images:', error);
    }
}

// Carousel initialization and controls
function initializeCarousel(sectionId, images) {
    const carousel = document.querySelector(`[data-section="${sectionId}"]`);
    if (!carousel || images.length === 0) return;

    const imgElement = carousel.querySelector('.carousel-image');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    let currentIndex = 0;
    let autoPlayInterval = null;

    // Set initial image
    updateCarouselImage();

    // Create dots
    createCarouselDots();

    // Navigation functions
    function updateCarouselImage() {
        if (images[currentIndex]) {
            imgElement.style.opacity = '0';

            setTimeout(() => {
                imgElement.src = images[currentIndex].image_url;
                imgElement.alt = `Section ${sectionId} Image ${currentIndex + 1}`;
                imgElement.style.opacity = '1';
            }, 150);

            // Update dots
            updateActiveDot();
        }
    }

    function createCarouselDots() {
        dotsContainer.innerHTML = '';
        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToImage(index));
            dotsContainer.appendChild(dot);
        });
    }

    function updateActiveDot() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToImage(index) {
        currentIndex = index;
        updateCarouselImage();
        resetAutoPlay();
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarouselImage();
        resetAutoPlay();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarouselImage();
        resetAutoPlay();
    }

    function resetAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
    }

    function startAutoPlay() {
        // Optional: Auto-play every 5 seconds
        autoPlayInterval = setInterval(nextImage, 5000);
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Keyboard navigation (arrow keys)
    function handleKeyPress(e) {
        // Only respond to arrow keys when carousel is visible
        const rect = carousel.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevImage();
            }
        }
    }

    document.addEventListener('keydown', handleKeyPress);

    // Start auto-play
    startAutoPlay();

    // Pause auto-play on hover
    carousel.addEventListener('mouseenter', () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    });

    carousel.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
}

// Function to load section data from Supabase
async function loadSectionData() {
    try {
        const { data: sections, error } = await window.supabaseClient
            .from('sections')
            .select('*')
            .order('section_id');

        if (error) {
            console.error('Error fetching section data:', error);
            return;
        }

        // Populate each section with data from database
        sections.forEach(sectionData => {
            const sectionElement = document.getElementById(sectionData.section_id);
            if (sectionElement) {
                const container = sectionElement.querySelector('.container');
                if (container) {
                    const titleElement = container.querySelector('h1');
                    const imageElement = container.querySelector('img');
                    const contentElement = container.querySelector('p');

                    if (titleElement) titleElement.textContent = sectionData.title;
                    if (imageElement) {
                        imageElement.src = sectionData.image_url || '#';
                        imageElement.alt = `${sectionData.title} Image`;
                    }
                    if (contentElement) contentElement.textContent = sectionData.content;

                    // Update navigation link text
                    const navLink = document.querySelector(`aside a[href="#${sectionData.section_id}"]`);
                    if (navLink) {
                        navLink.textContent = sectionData.title;
                    }
                }
            }
        });

        console.log('Section data loaded successfully');
    } catch (error) {
        console.error('Error loading section data:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // Load data from Supabase first
    await loadSectionData();
    await loadSectionImages();
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