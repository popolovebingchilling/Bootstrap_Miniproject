document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the menu page or cart page
    if (document.querySelector('.btn-cart-link')) {
        setupMenuPage();
        handleMenuTabs();
    }
    if (document.getElementById('cart-items-container')) {
        displayCart();
    }
});

function handleMenuTabs() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam) {
        // Find the correct tab button
        const tabTrigger = document.querySelector(`#nav-${tabParam}-tab`);
        if (tabTrigger) {
            // Wait slightly for AOS/Bootstrap to settle
            setTimeout(() => {
                const tab = new bootstrap.Tab(tabTrigger);
                tab.show();
            }, 100);
        }
    }
}

function setupMenuPage() {
    const cartButtons = document.querySelectorAll('.btn-cart-link');
    
    cartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Find the parent modal
            const modal = btn.closest('.detail-modal');
            if (!modal) return;
            
            const name = modal.querySelector('.detail-name').innerText;
            const price = modal.querySelector('.detail-price').innerText.split(' ')[0];
            const image = modal.querySelector('.detail-img').src;
            
            // Get selected size
            const sizeInput = modal.querySelector('.size-opts input:checked');
            const size = sizeInput ? modal.querySelector(`label[for="${sizeInput.id}"]`).innerText : 'Regular';
            
            // Get extras
            const extras = [];
            modal.querySelectorAll('.extras-grid input:checked').forEach(chk => {
                extras.push(modal.querySelector(`label[for="${chk.id}"]`).innerText.replace('+', ''));
            });
            
            const cartItem = {
                id: Date.now(),
                name,
                price,
                image,
                size,
                extras
            };
            
            // Save to localStorage
            const cart = JSON.parse(localStorage.getItem('feane_cart') || '[]');
            cart.push(cartItem);
            localStorage.setItem('feane_cart', JSON.stringify(cart));
            
            // Redirect to cart page
            window.location.href = 'cart.html';
        });
    });
}

function displayCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    const cart = JSON.parse(localStorage.getItem('feane_cart') || '[]');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="py-5">
                <i class="bi bi-cart-x display-1 text-muted"></i>
                <p class="mt-3 lead">Your cart is empty.</p>
                <a href="menu.html" class="btn btn-order mt-3">Back to Menu</a>
            </div>
        `;
        if (totalEl) totalEl.innerText = '$0.00';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemPrice = parseFloat(item.price.replace('$', ''));
        total += itemPrice;
        
        return `
            <div class="card mb-3 bg-dark border-secondary">
                <div class="row g-0 align-items-center">
                    <div class="col-3 col-md-2 p-2">
                        <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
                    </div>
                    <div class="col-6 col-md-7">
                        <div class="card-body py-2">
                            <h5 class="card-title mb-0">${item.name}</h5>
                            <p class="card-text small text-warning mb-0">${item.size}</p>
                            <p class="card-text small text-muted">${item.extras.join(', ')}</p>
                        </div>
                    </div>
                    <div class="col-3 col-md-3 text-end p-3">
                        <p class="h5 mb-0">${item.price}</p>
                        <button class="btn btn-sm btn-outline-danger mt-2" onclick="removeFromCart(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
    const totalGrandEl = document.getElementById('cart-total-grand');
    if (totalGrandEl) totalGrandEl.innerText = `$${total.toFixed(2)}`;
}

window.removeFromCart = function(id) {
    let cart = JSON.parse(localStorage.getItem('feane_cart') || '[]');
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('feane_cart', JSON.stringify(cart));
    displayCart();
};

window.clearCart = function() {
    localStorage.removeItem('feane_cart');
    displayCart();
};
