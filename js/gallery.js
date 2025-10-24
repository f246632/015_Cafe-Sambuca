// ======================================
// CAFE SAMBUCA - GALLERY FUNCTIONALITY
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

// ======================================
// GALLERY LIGHTBOX
// ======================================

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    let images = [];

    // Collect all gallery images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        images.push({
            src: img.src,
            alt: img.alt
        });

        // Add click event to open lightbox
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyboard);
    }

    // Update lightbox image
    function updateLightboxImage() {
        if (images[currentImageIndex]) {
            lightboxImage.src = images[currentImageIndex].src;
            lightboxImage.alt = images[currentImageIndex].alt;

            // Add fade-in animation
            lightboxImage.style.opacity = '0';
            setTimeout(() => {
                lightboxImage.style.transition = 'opacity 0.3s ease';
                lightboxImage.style.opacity = '1';
            }, 10);
        }
    }

    // Show next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Show previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    // Keyboard navigation
    function handleKeyboard(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
        }
    }

    // Event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevImage);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    }

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - show next
                showNextImage();
            } else {
                // Swipe right - show previous
                showPrevImage();
            }
        }
    }
}

// ======================================
// GALLERY FILTERING (Optional Enhancement)
// ======================================

function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.dataset.category;

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Initialize filter if filter buttons exist
initGalleryFilter();

// ======================================
// LAZY LOADING FOR GALLERY IMAGES
// ======================================

function initGalleryLazyLoad() {
    const galleryImages = document.querySelectorAll('.gallery-item img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Add loading animation
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';

                    img.addEventListener('load', function() {
                        img.style.opacity = '1';
                    });

                    // Load the image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        galleryImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
initGalleryLazyLoad();

// ======================================
// GALLERY ANIMATIONS
// ======================================

function addGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        // Stagger animation
        item.style.animationDelay = `${index * 0.1}s`;

        // Add hover effect
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.gallery-overlay');
            const icon = this.querySelector('.gallery-icon');

            if (overlay && icon) {
                overlay.style.opacity = '1';
                icon.style.transform = 'scale(1) rotate(360deg)';
                icon.style.transition = 'transform 0.5s ease';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.gallery-icon');
            if (icon) {
                icon.style.transform = 'scale(0)';
            }
        });
    });
}

// Initialize animations
addGalleryAnimations();

// ======================================
// PRELOAD ADJACENT IMAGES IN LIGHTBOX
// ======================================

function preloadAdjacentImages(currentIndex, images) {
    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;

    // Preload next image
    const nextImg = new Image();
    nextImg.src = images[nextIndex].src;

    // Preload previous image
    const prevImg = new Image();
    prevImg.src = images[prevIndex].src;
}

// ======================================
// EXPORT FOR TESTING
// ======================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initGallery,
        initGalleryFilter,
        initGalleryLazyLoad,
        addGalleryAnimations
    };
}
