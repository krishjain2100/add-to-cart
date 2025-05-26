const cart = {};
const cartButton = document.querySelector('.cart-container');
const shoppingTab = document.querySelector('.shopping-tab');
const itemsContainer = document.querySelector('.items');
const badge = document.querySelector('.number');

cartButton.addEventListener('click', () => {
    shoppingTab.classList.toggle('active');
});


document.querySelectorAll('.add-to-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.product-card'); //nearest parent with said class
        const name = card.dataset.name;
        const price = card.dataset.price;
        const image = card.dataset.image;
        addToCart(name, price, image);
    });
});


function addToCart(name, price, image) {
    if (cart[name]) {
        updateQuantity(name, cart[name].qty + 1);
    }
    else {
        const itemElem = createItemTile(name, price, image);
        itemsContainer.appendChild(itemElem);
        cart[name] = { price, qty: 1, image, element: itemElem };
    }
    badge.innerText = String(+badge.innerText + 1);
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
    </div>
  `;
    tile.querySelector('.left-arrow')
        .addEventListener('click', () => changeBy(name, -1));
    tile.querySelector('.right-arrow')
        .addEventListener('click', () => changeBy(name, 1));
    return tile;
}

function changeBy(name, change) {
    const entry = cart[name];
    const newQty = entry.qty + change;
    if (newQty <= 0) {
        itemsContainer.removeChild(entry.element);
        delete cart[name];
    }
    else {
        updateQuantity(name, newQty);
    }
    refreshBadge();
}


function updateQuantity(name, qty) {
    cart[name].qty = qty;
    cart[name].element.querySelector('.quantity').innerText = qty;
}


function refreshBadge() {
    let total = 0;
    for (let item of Object.values(cart)) {
        total += item.qty;
    }
    badge.innerText = total;
}
