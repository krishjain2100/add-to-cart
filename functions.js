const cart = {};
const cartButton = document.querySelector('.cart-container');
const shoppingTab = document.querySelector('.shopping-tab');
const itemsContainer = document.querySelector('.items');
const badge = document.querySelector('.number');
const price = document.querySelector('.price');
const clearButton = document.querySelector('.clear');

cartButton.addEventListener('click', () => shoppingTab.classList.toggle('active'));

clearButton.addEventListener('click', () => {
    for (const name in cart) {
        itemsContainer.removeChild(cart[name].element);
        delete cart[name];
    }
    localStorage.removeItem('cart');
    refreshNumbers();
})


function addToCart(name, price, image) {
    if (cart[name]) updateQuantity(name, cart[name].qty + 1);
    else {
        const itemElem = createItemTile(name, price, image);
        itemsContainer.appendChild(itemElem);
        cart[name] = { price, qty: 1, image, element: itemElem };
    }
    refreshNumbers();
}


function createItemTile(name, price, image) {
    const tile = document.createElement('div');
    tile.className = 'item-tile';
    tile.dataset.name = name;
    tile.innerHTML = `
    <div class="prod-img">
      <img src="${image}" alt="${name}">
    </div>
    <div class="prod-info">
      <div class="prod-name">${name}</div>
      <div class="prod-price">$${price}</div>
      <div class="quantity-controller">
        <div class="left-arrow">◀</div>
        <div class="quantity">1</div>
        <div class="right-arrow">▶</div>
      </div>
    </div>`
    tile.querySelector('.left-arrow').addEventListener('click', () => changeBy(name, -1));
    tile.querySelector('.right-arrow').addEventListener('click', () => changeBy(name, 1));
    return tile;
}

function changeBy(name, change) {
    const entry = cart[name];
    const newQty = entry.qty + change;
    if (newQty <= 0) {
        itemsContainer.removeChild(entry.element);
        delete cart[name];
    }
    else updateQuantity(name, newQty);
    refreshNumbers();
}

function updateQuantity(name, qty) {
    cart[name].qty = qty;
    cart[name].element.querySelector('.quantity').innerText = qty;
}

function refreshNumbers() {
    let total = 0;
    let Price = 0;
    for (let item of Object.values(cart)) {
        total += item.qty;
        Price += item.qty * item.price
    }
    badge.innerText = total;
    price.innerText = "$" + Price.toFixed(2);

    localStorage.setItem('cart', JSON.stringify(cart));
}

async function loadProducts() {
    const res = await fetch('https://dummyjson.com/products');
    const data = await res.json();
    const products = data.products;
    const contentDiv = document.querySelector('.content');
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.name = product.title;
        card.dataset.price = product.price;
        card.dataset.image = product.thumbnail;
        card.innerHTML = `
            <div class="product-img">
                <img src="${product.thumbnail}" alt="${product.title}">
            </div>
            <div class="product-name">${product.title}</div>
            <div class="product-price">$${product.price}</div>
            <div><button class="add-to-cart">Add to Cart</button></div>`

        const btn = card.querySelector('.add-to-cart');
        btn.addEventListener('click', () => {
            const { name, price, image } = card.dataset;
            addToCart(name, price, image);
            shoppingTab.classList.add('active');
        });
        contentDiv.appendChild(card);
    });

    document.querySelectorAll('.add-to-cart').forEach((btn) => {

    });
}
loadProducts();

const loaded = localStorage.getItem('cart');

if (loaded) {
    const loadedCart = JSON.parse(loaded);
    for (const name in loadedCart) {
        const item = loadedCart[name];
        const itemElem = createItemTile(name, item.price, item.image);
        itemsContainer.appendChild(itemElem);
        cart[name] = {
            price: item.price,
            qty: item.qty,
            image: item.image,
            element: itemElem
        };
        updateQuantity(name, item.qty);
    }
    refreshNumbers();
}

