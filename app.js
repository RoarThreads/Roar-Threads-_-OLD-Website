// App State
let appState = {
    currentSection: 'home',
    cart: [],
    wishlist: [],
    user: null,
    products: [],
    filteredProducts: [],
    currentProduct: null
};

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: "Classic Cotton Tee",
        price: 24.99,
        originalPrice: 29.99,
        rating: 4.5,
        reviews: 89,
        colors: ["Black", "White", "Navy", "Gray"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        badges: ["Bestseller", "Eco-Friendly"],
        category: "T-Shirts",
        description: "Our signature cotton tee made from 100% organic cotton. Soft, comfortable, and built to last.",
        images: ["https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/39911dbf-48af-4e86-9077-e07f7a1a32d8.png"],
        inStock: true,
        materials: "100% Organic Cotton",
        care: "Machine wash cold, tumble dry low"
    },
    {
        id: 2,
        name: "Essential Hoodie",
        price: 49.99,
        originalPrice: null,
        rating: 4.7,
        reviews: 156,
        colors: ["Black", "Gray", "Navy", "Olive"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        badges: ["New"],
        category: "Hoodies",
        description: "The perfect everyday hoodie. Cozy fleece interior with a modern fit.",
        images: ["https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/39911dbf-48af-4e86-9077-e07f7a1a32d8.png"],
        inStock: true,
        materials: "80% Cotton, 20% Polyester",
        care: "Machine wash cold, hang dry"
    },
    {
        id: 3,
        name: "Vintage Graphic Tee",
        price: 19.99,
        originalPrice: 34.99,
        rating: 4.3,
        reviews: 67,
        colors: ["White", "Black", "Cream"],
        sizes: ["S", "M", "L", "XL"],
        badges: ["Sale", "Limited"],
        category: "T-Shirts",
        description: "Retro-inspired graphic tee with vintage wash finish.",
        images: ["https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/39911dbf-48af-4e86-9077-e07f7a1a32d8.png"],
        inStock: true,
        materials: "100% Cotton",
        care: "Machine wash cold, tumble dry low"
    },
    {
        id: 4,
        name: "Premium Tank Top",
        price: 22.99,
        originalPrice: null,
        rating: 4.4,
        reviews: 43,
        colors: ["White", "Black", "Navy", "Gray", "Olive"],
        sizes: ["XS", "S", "M", "L", "XL"],
        badges: ["New", "Eco-Friendly"],
        category: "T-Shirts",
        description: "Lightweight tank perfect for layering or wearing alone.",
        images: ["https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/39911dbf-48af-4e86-9077-e07f7a1a32d8.png"],
        inStock: true,
        materials: "95% Organic Cotton, 5% Elastane",
        care: "Machine wash cold, tumble dry low"
    },
    {
        id: 5,
        name: "Zip-Up Hoodie",
        price: 59.99,
        originalPrice: 69.99,
        rating: 4.6,
        reviews: 92,
        colors: ["Black", "Gray", "Navy"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        badges: ["Sale", "Bestseller"],
        category: "Hoodies",
        description: "Full-zip hoodie with premium fleece lining and adjustable hood.",
        images: ["https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/39911dbf-48af-4e86-9077-e07f7a1a32d8.png"],
        inStock: true,
        materials: "85% Cotton, 15% Polyester",
        care: "Machine wash cold, hang dry"
    },
    {
        id: 6,
        name: "Baseball Cap",
        price: 18.99,
        originalPrice: null,
        rating: 4.2,
        reviews: 34,
        colors: ["Black", "Navy", "White", "Gray"],
        sizes: ["One Size"],
        badges: ["New"],
        category: "Accessories",
        description: "Classic baseball cap with adjustable strap and embroidered logo.",
        images: ["https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/39911dbf-48af-4e86-9077-e07f7a1a32d8.png"],
        inStock: true,
        materials: "100% Cotton Twill",
        care: "Spot clean only"
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing app...');
    initializeApp();
    setupEventListeners();
    loadProducts();
    updateCartCount();
    updateWishlistCount();
});

function initializeApp() {
    console.log('Initializing app state...');
    // Load saved state from localStorage
    const savedCart = localStorage.getItem('roar-cart');
    const savedWishlist = localStorage.getItem('roar-wishlist');
    
    if (savedCart) {
        try {
            appState.cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error parsing saved cart:', e);
            appState.cart = [];
        }
    }
    
    if (savedWishlist) {
        try {
            appState.wishlist = JSON.parse(savedWishlist);
        } catch (e) {
            console.error('Error parsing saved wishlist:', e);
            appState.wishlist = [];
        }
    }
    
    appState.products = sampleProducts;
    appState.filteredProducts = sampleProducts;
    
    // Ensure home section is visible by default
    showSection('home');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Collection cards
    document.querySelectorAll('.collection-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Collection card clicked:', this.dataset.category);
            const category = this.dataset.category;
            showSection('collections');
            setTimeout(() => filterProductsByCategory(category), 100);
        });
    });
    
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSubmit();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSearchSubmit();
        });
    }
    
    // Cart and wishlist buttons - Fixed cart navigation
    const cartBtn = document.getElementById('cart-btn');
    const wishlistBtn = document.getElementById('wishlist-btn');
    const accountBtn = document.getElementById('account-btn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Cart button clicked - navigating to cart');
            showSection('cart');
        });
    }
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Wishlist button clicked - navigating to wishlist');
            showSection('wishlist');
        });
    }
    
    if (accountBtn) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Account button clicked - navigating to account');
            showSection('account');
        });
    }
    
    // Filter controls
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sizeFilter = document.getElementById('size-filter');
    const sortFilter = document.getElementById('sort-filter');
    const clearFilters = document.getElementById('clear-filters');
    
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
    if (sizeFilter) sizeFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
    if (clearFilters) clearFilters.addEventListener('click', clearAllFilters);
    
    // Forms
    const newsletterForm = document.getElementById('newsletter-form');
    const contactForm = document.getElementById('contact-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.dataset.tab;
            switchAuthTab(tabType);
        });
    });
    
    // Modal close
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Click outside modal to close
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // Hero CTA buttons
    document.querySelectorAll('.hero-cta .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.textContent.includes('Shop Now')) {
                showSection('collections');
            } else if (this.textContent.includes('Discover')) {
                showSection('about');
            }
        });
    });
    
    // Promo card buttons
    document.querySelectorAll('.promo-card .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.textContent.includes('Shop Sale')) {
                showSection('collections');
                setTimeout(() => {
                    // Filter for sale items
                    const filtered = appState.products.filter(p => p.originalPrice);
                    appState.filteredProducts = filtered;
                    renderProducts();
                }, 100);
            } else {
                showSection('collections');
            }
        });
    });
    
    console.log('Event listeners setup complete');
}

function handleNavigation(e) {
    e.preventDefault();
    console.log('Navigation clicked:', this);
    const href = this.getAttribute('href');
    if (!href) return;
    
    const sectionId = href.replace('#', '');
    console.log('Navigating to section:', sectionId);
    
    showSection(sectionId);
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    this.classList.add('active');
}

function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        appState.currentSection = sectionId;
        console.log('Section shown:', sectionId);
        
        // Load section-specific content
        if (sectionId === 'collections') {
            setTimeout(() => renderProducts(), 50);
        } else if (sectionId === 'cart') {
            setTimeout(() => renderCart(), 50);
        } else if (sectionId === 'wishlist') {
            setTimeout(() => renderWishlist(), 50);
        }
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.replace('#', '') === sectionId) {
                link.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo(0, 0);
    } else {
        console.error('Section not found:', sectionId);
    }
}

function toggleMobileMenu() {
    const navbarMenu = document.getElementById('navbar-menu');
    if (navbarMenu) {
        const isVisible = navbarMenu.style.display === 'flex';
        navbarMenu.style.display = isVisible ? 'none' : 'flex';
    }
}

function handleSearchSubmit() {
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim()) {
        console.log('Search submitted:', searchInput.value);
        handleSearch({ target: searchInput });
        showSection('collections');
    }
}

function loadProducts() {
    console.log('Loading products...');
    // In a real app, this would fetch from Qikink API
    // For demo, we'll use sample data
    if (appState.currentSection === 'collections') {
        renderProducts();
    }
}

function renderProducts() {
    console.log('Rendering products...');
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.getElementById('products-count');
    
    if (!productsGrid) {
        console.error('Products grid not found');
        return;
    }
    
    if (appState.filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: var(--space-32);">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button class="btn btn--primary" onclick="clearAllFilters()">Clear Filters</button>
            </div>
        `;
        if (productsCount) productsCount.textContent = 'No products found';
        return;
    }
    
    productsGrid.innerHTML = appState.filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-badges">
                    ${product.badges.map(badge => `
                        <span class="product-badge badge-${badge.toLowerCase().replace(' ', '-')}">${badge}</span>
                    `).join('')}
                </div>
                <div class="product-actions">
                    <button class="action-btn wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
                        ${appState.wishlist.includes(product.id) ? '❤️' : '♥'}
                    </button>
                    <button class="action-btn quick-view-btn" data-product-id="${product.id}" title="Quick View">
                        👁
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-rating">
                    <span class="rating-stars">${'⭐'.repeat(Math.floor(product.rating))}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <button class="btn btn--primary add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    if (productsCount) {
        productsCount.textContent = `Showing ${appState.filteredProducts.length} products`;
    }
    
    // Add event listeners to product cards
    setTimeout(() => setupProductEventListeners(), 100);
}

function setupProductEventListeners() {
    console.log('Setting up product event listeners...');
    
    // Product card clicks
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.action-btn') || e.target.closest('.add-to-cart')) {
                return; // Don't navigate if clicking action buttons
            }
            const productId = parseInt(this.dataset.productId);
            console.log('Product card clicked:', productId);
            showProductDetail(productId);
        });
    });
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            console.log('Add to cart clicked:', productId);
            addToCart(productId);
        });
    });
    
    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            console.log('Wishlist clicked:', productId);
            toggleWishlist(productId);
        });
    });
    
    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            console.log('Quick view clicked:', productId);
            showProductDetail(productId);
        });
    });
}

function showProductDetail(productId) {
    console.log('Showing product detail:', productId);
    const product = appState.products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    appState.currentProduct = product;
    const container = document.getElementById('product-detail-container');
    
    container.innerHTML = `
        <div class="product-gallery">
            <div class="main-image">
                <img src="${product.images[0]}" alt="${product.name}" id="main-product-image">
            </div>
            <div class="thumbnail-images">
                ${product.images.map((img, index) => `
                    <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                        <img src="${img}" alt="${product.name}">
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="product-details">
            <h1>${product.name}</h1>
            <div class="product-rating">
                <span class="rating-stars">${'⭐'.repeat(Math.floor(product.rating))}</span>
                <span class="rating-count">(${product.reviews} reviews)</span>
            </div>
            <div class="product-price">
                <span class="current-price">$${product.price}</span>
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
            </div>
            
            <div class="variant-selectors">
                <div class="variant-group">
                    <label>Color</label>
                    <div class="color-options">
                        ${product.colors.map((color, index) => `
                            <div class="color-option ${index === 0 ? 'selected' : ''}" 
                                 data-color="${color}" 
                                 style="background-color: ${getColorCode(color)}"
                                 title="${color}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="variant-group">
                    <label>Size</label>
                    <div class="size-options">
                        ${product.sizes.map((size, index) => `
                            <div class="size-option ${index === 1 ? 'selected' : ''}" data-size="${size}">
                                ${size}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="quantity-selector">
                <label>Quantity</label>
                <div class="quantity-controls">
                    <button class="quantity-btn" type="button" onclick="changeQuantity(-1)">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="10" id="product-quantity">
                    <button class="quantity-btn" type="button" onclick="changeQuantity(1)">+</button>
                </div>
            </div>
            
            <div class="product-actions-main">
                <button class="btn btn--primary" onclick="addCurrentProductToCart()">Add to Cart</button>
                <button class="btn btn--secondary" onclick="toggleWishlist(${product.id})">
                    ${appState.wishlist.includes(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
            </div>
            
            <div class="product-description">
                <h3>Description</h3>
                <p>${product.description}</p>
                <p><strong>Materials:</strong> ${product.materials}</p>
                <p><strong>Care Instructions:</strong> ${product.care}</p>
            </div>
            
            <div class="product-info-links">
                <a href="#" onclick="openSizeGuide(); return false;">📏 Size Guide</a>
                <a href="#" onclick="showShippingInfo(); return false;">🚚 Shipping Info</a>
                <a href="#" onclick="showReturnPolicy(); return false;">↩️ Return Policy</a>
            </div>
        </div>
    `;
    
    showSection('product-detail');
    setTimeout(() => setupProductDetailEventListeners(), 100);
}

function setupProductDetailEventListeners() {
    console.log('Setting up product detail event listeners...');
    
    // Color selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Size selection
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Thumbnail selection
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const imageUrl = this.dataset.image;
            const mainImg = document.getElementById('main-product-image');
            if (mainImg) mainImg.src = imageUrl;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function getColorCode(colorName) {
    const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Navy': '#000080',
        'Gray': '#808080',
        'Grey': '#808080',
        'Olive': '#556B2F',
        'Cream': '#F5F5DC',
        'Red': '#FF0000',
        'Blue': '#0000FF'
    };
    return colorMap[colorName] || '#CCCCCC';
}

function changeQuantity(change) {
    const quantityInput = document.getElementById('product-quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        const newValue = currentValue + change;
        
        if (newValue >= 1 && newValue <= 10) {
            quantityInput.value = newValue;
        }
    }
}

function addCurrentProductToCart() {
    if (!appState.currentProduct) return;
    
    const selectedColor = document.querySelector('.color-option.selected')?.dataset.color || appState.currentProduct.colors[0];
    const selectedSize = document.querySelector('.size-option.selected')?.dataset.size || appState.currentProduct.sizes[0];
    const quantityInput = document.getElementById('product-quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    
    addToCart(appState.currentProduct.id, selectedColor, selectedSize, quantity);
}

function addToCart(productId, color = null, size = null, quantity = 1) {
    console.log('Adding to cart:', productId, color, size, quantity);
    const product = appState.products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    const cartItem = {
        id: Date.now(), // Unique cart item ID
        productId: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color: color || product.colors[0],
        size: size || product.sizes[0],
        quantity: quantity
    };
    
    // Check if same item already exists
    const existingItem = appState.cart.find(item => 
        item.productId === productId && 
        item.color === cartItem.color && 
        item.size === cartItem.size
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        appState.cart.push(cartItem);
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(cartItemId) {
    console.log('Removing from cart:', cartItemId);
    appState.cart = appState.cart.filter(item => item.id !== cartItemId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartItemQuantity(cartItemId, newQuantity) {
    console.log('Updating cart item quantity:', cartItemId, newQuantity);
    const item = appState.cart.find(item => item.id === cartItemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(cartItemId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            renderCart();
        }
    }
}

function renderCart() {
    console.log('Rendering cart...');
    const cartEmpty = document.getElementById('cart-empty');
    const cartItems = document.getElementById('cart-items');
    
    if (!cartEmpty || !cartItems) {
        console.error('Cart elements not found');
        return;
    }
    
    if (appState.cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
    
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 75 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    cartItems.innerHTML = `
        <div class="cart-items-list">
            ${appState.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Color: ${item.color} | Size: ${item.size}</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="btn btn--outline btn--sm" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `).join('')}
        </div>
        
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax:</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="btn btn--primary btn--full-width" onclick="proceedToCheckout()">
                Proceed to Checkout
            </button>
        </div>
    `;
}

function proceedToCheckout() {
    showNotification('Checkout functionality would be implemented here with real payment processing.');
}

function toggleWishlist(productId) {
    console.log('Toggling wishlist:', productId);
    const existingIndex = appState.wishlist.findIndex(id => id === productId);
    
    if (existingIndex > -1) {
        appState.wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist');
    } else {
        appState.wishlist.push(productId);
        showNotification('Added to wishlist');
    }
    
    saveWishlist();
    updateWishlistCount();
    
    if (appState.currentSection === 'wishlist') {
        renderWishlist();
    }
    
    // Update product detail page if showing
    if (appState.currentSection === 'product-detail' && appState.currentProduct?.id === productId) {
        const wishlistBtn = document.querySelector('.product-actions-main .btn--secondary');
        if (wishlistBtn) {
            wishlistBtn.textContent = appState.wishlist.includes(productId) ? 'Remove from Wishlist' : 'Add to Wishlist';
        }
    }
}

function renderWishlist() {
    console.log('Rendering wishlist...');
    const wishlistGrid = document.getElementById('wishlist-grid');
    const wishlistEmpty = document.getElementById('wishlist-empty');
    const wishlistDescription = document.getElementById('wishlist-description');
    
    if (!wishlistGrid || !wishlistEmpty || !wishlistDescription) {
        console.error('Wishlist elements not found');
        return;
    }
    
    if (appState.wishlist.length === 0) {
        wishlistEmpty.style.display = 'block';
        wishlistDescription.textContent = 'Save your favorite items for later';
        wishlistGrid.innerHTML = '';
        return;
    }
    
    wishlistEmpty.style.display = 'none';
    wishlistDescription.textContent = `${appState.wishlist.length} items saved`;
    
    const wishlistProducts = appState.wishlist.map(id => 
        appState.products.find(p => p.id === id)
    ).filter(Boolean);
    
    wishlistGrid.innerHTML = wishlistProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-actions">
                    <button class="action-btn wishlist-btn" data-product-id="${product.id}" title="Remove from Wishlist">
                        ❤️
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <button class="btn btn--primary add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    setTimeout(() => setupProductEventListeners(), 100);
}

function applyFilters() {
    console.log('Applying filters...');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sizeFilter = document.getElementById('size-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (!categoryFilter || !priceFilter || !sizeFilter || !sortFilter) {
        console.error('Filter elements not found');
        return;
    }
    
    const categoryValue = categoryFilter.value;
    const priceValue = priceFilter.value;
    const sizeValue = sizeFilter.value;
    const sortValue = sortFilter.value;
    
    let filtered = [...appState.products];
    
    // Category filter
    if (categoryValue) {
        filtered = filtered.filter(product => 
            product.category.toLowerCase().includes(categoryValue.toLowerCase())
        );
    }
    
    // Price filter
    if (priceValue) {
        const [min, max] = priceValue.split('-').map(Number);
        filtered = filtered.filter(product => {
            if (max) {
                return product.price >= min && product.price <= max;
            } else {
                return product.price >= min;
            }
        });
    }
    
    // Size filter
    if (sizeValue) {
        filtered = filtered.filter(product => 
            product.sizes.includes(sizeValue)
        );
    }
    
    // Sort
    if (sortValue) {
        switch (sortValue) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
        }
    }
    
    appState.filteredProducts = filtered;
    renderProducts();
}

function clearAllFilters() {
    console.log('Clearing all filters...');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sizeFilter = document.getElementById('size-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) categoryFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (sizeFilter) sizeFilter.value = '';
    if (sortFilter) sortFilter.value = 'featured';
    
    appState.filteredProducts = [...appState.products];
    renderProducts();
}

function filterProductsByCategory(category) {
    console.log('Filtering by category:', category);
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter && category) {
        let filterValue = '';
        switch(category) {
            case 'tshirts':
            case 't-shirts':
                filterValue = 'tshirts';
                break;
            case 'hoodies':
                filterValue = 'hoodies';
                break;
            case 'accessories':
                filterValue = 'accessories';
                break;
            default:
                filterValue = '';
        }
        categoryFilter.value = filterValue;
        applyFilters();
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    console.log('Searching for:', query);
    
    if (query.length === 0) {
        appState.filteredProducts = [...appState.products];
    } else {
        appState.filteredProducts = appState.products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
    
    if (appState.currentSection === 'collections') {
        renderProducts();
    }
}

function handleNewsletterSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    console.log('Newsletter signup:', email);
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Thanks for subscribing! Check your email for your 15% discount code.');
        e.target.reset();
    }, 1000);
}

function handleContactForm(e) {
    e.preventDefault();
    console.log('Contact form submitted');
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you within 24 hours.');
        e.target.reset();
    }, 1000);
}

function switchAuthTab(tabType) {
    console.log('Switching auth tab:', tabType);
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-tab="${tabType}"]`);
    if (activeTab) activeTab.classList.add('active');
    
    // Show/hide forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) loginForm.style.display = tabType === 'login' ? 'block' : 'none';
    if (registerForm) registerForm.style.display = tabType === 'register' ? 'block' : 'none';
}

function openSizeGuide() {
    console.log('Opening size guide...');
    const modal = document.getElementById('size-guide-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    console.log('Closing modal...');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

function showShippingInfo() {
    showNotification('Standard shipping: 5-7 business days (Free over $75). Express: 2-3 days ($9.99).');
}

function showReturnPolicy() {
    showNotification('Free returns within 30 days. Items must be unworn with original tags.');
}

function showNotification(message, duration = 3000) {
    console.log('Showing notification:', message);
    
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: var(--space-12) var(--space-16);
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Add CSS animation if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

function updateCartCount() {
    const count = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}

function updateWishlistCount() {
    const wishlistCountEl = document.getElementById('wishlist-count');
    if (wishlistCountEl) {
        wishlistCountEl.textContent = appState.wishlist.length;
    }
}

function saveCart() {
    try {
        localStorage.setItem('roar-cart', JSON.stringify(appState.cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

function saveWishlist() {
    try {
        localStorage.setItem('roar-wishlist', JSON.stringify(appState.wishlist));
    } catch (e) {
        console.error('Error saving wishlist:', e);
    }
}

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

// Global functions for HTML onclick handlers
window.showSection = showSection;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.toggleWishlist = toggleWishlist;
window.changeQuantity = changeQuantity;
window.addCurrentProductToCart = addCurrentProductToCart;
window.proceedToCheckout = proceedToCheckout;
window.openSizeGuide = openSizeGuide;
window.closeModal = closeModal;
window.showShippingInfo = showShippingInfo;
window.showReturnPolicy = showReturnPolicy;
window.clearAllFilters = clearAllFilters;