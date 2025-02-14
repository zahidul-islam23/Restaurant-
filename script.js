// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Remove preloader when page is loaded
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        preloader.style.display = 'none';
    });

    // Navbar scroll effect
    const header = document.querySelector('.header');
    const navHeight = header.offsetHeight;
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > navHeight) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > navHeight) {
            header.style.transform = `translateY(-${navHeight}px)`;
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;

    menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        menuBtn.classList.toggle('open');
        navLinks.style.display = isMenuOpen ? 'flex' : 'none';
    });

    // Cart Functionality
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    let cart = [];

    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        document.body.style.overflow = 'auto';
    });

    // Add to Cart Function
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }

        updateCart();
    }

    // Update Cart Display
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="item-actions">
                        <button onclick="updateQuantity(${item.id}, 'decrease')">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 'increase')">+</button>
                    </div>
                </div>
            `;
        });

        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }

    // Update Item Quantity
    window.updateQuantity = function(itemId, action) {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            if (action === 'increase') {
                item.quantity++;
            } else if (action === 'decrease') {
                item.quantity--;
                if (item.quantity === 0) {
                    cart = cart.filter(cartItem => cartItem.id !== itemId);
                }
            }
            updateCart();
        }
    };

    // Order Now Button Click Handler
    const orderButtons = document.querySelectorAll('.btn-order');
    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.special-card');
            const item = {
                id: Date.now(), // Using timestamp as temporary ID
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.price').textContent.replace('$', '')),
                image: card.querySelector('img').src
            };
            addToCart(item);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Added to cart!';
            card.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.remove();
            }, 2000);
        });
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = header.offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (isMenuOpen) {
                    menuBtn.click();
                }
            }
        });
    });

    // Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show success message
            contactForm.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for your message!</h3>
                    <p>We'll get back to you soon.</p>
                </div>
            `;
        });
    }

    // Image Loading Animation
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
});