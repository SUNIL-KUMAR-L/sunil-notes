// Product data
const products = [
    { id: 1, name: "Smartphone", description: "Latest model with high-res camera", price: 699.99, imageUrl: "https://m.media-amazon.com/images/I/71xb2xkN5qL._SL1500_.jpg", category: "Electronics" },
    { id: 2, name: "Laptop", description: "Powerful laptop for work and gaming", price: 1299.99, imageUrl: "https://m.media-amazon.com/images/I/71ItMeqpN3L._SL1500_.jpg", category: "Electronics" },
    { id: 3, name: "Running Shoes", description: "Comfortable shoes for jogging", price: 89.99, imageUrl: "https://m.media-amazon.com/images/I/61f9pDQDqlL._SY575_.jpg", category: "Sports" },
    { id: 4, name: "Coffee Maker", description: "Automatic coffee machine", price: 79.99, imageUrl: "https://m.media-amazon.com/images/I/61Dy6dNTVCL._SL1500_.jpg", category: "Home Appliances" },
    { id: 5, name: "Headphones", description: "Noise-cancelling wireless headphones", price: 199.99, imageUrl: "https://m.media-amazon.com/images/I/61aRIZ0f0AL._SL1500_.jpg", category: "Electronics" },
    { id: 6, name: "Yoga Mat", description: "Non-slip exercise mat", price: 29.99, imageUrl: "https://m.media-amazon.com/images/I/612K2lgbyIL._SL1500_.jpg", category: "Sports" },
    { id: 7, name: "Blender", description: "High-speed blender for smoothies", price: 69.99, imageUrl: "https://m.media-amazon.com/images/I/61xiE5hfJxL._SL1500_.jpg", category: "Home Appliances" },
    { id: 8, name: "Smart Watch", description: "Fitness tracker and smartwatch", price: 249.99, imageUrl: "https://m.media-amazon.com/images/I/61gTCfKquRL._SL1500_.jpg", category: "Electronics" },
    { id: 9, name: "Dumbbell Set", description: "Adjustable weight dumbbells", price: 149.99, imageUrl: "https://m.media-amazon.com/images/I/61eqwnUco-L._SX522_.jpg", category: "Sports" }
];

// Function to set common header
function setCommonHeader() {
    const header = document.getElementById('pageHeader');
    if (header) {
        header.innerHTML = `
            <div class="header-content">
                <img src="https://via.placeholder.com/150x50?text=Logo" alt="Company Logo" class="logo">
                <nav>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="#">Products</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="cart.html">Cart <span id="cartIcon">0</span></a></li>
                    </ul>
                </nav>
            </div>
        `;
    }
    updateCartIcon();
}

// Function to set common footer
function setCommonFooter() {
    const footer = document.getElementById('pageFooter');
    if (footer) {
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-links">
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>
                <div class="social-media">
                    <a href="#" title="Facebook"><i class="fab fa-facebook"></i></a>
                    <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
            <div class="footer-content">
                <p>&copy; 2023 Your Company Name. All rights reserved.</p>
            </div>
        `;
    }
}

// Function to initialize common elements
function initializeCommonElements() {
    setCommonHeader();
    setCommonFooter();
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

function updateQuantity(productId, newQuantity) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
}

function updateCartIcon() {
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartIcon.textContent = itemCount;
    }
}

function clearCart() {
    cart = [];
    updateCart();
}

// Call initializeCommonElements when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeCommonElements);
