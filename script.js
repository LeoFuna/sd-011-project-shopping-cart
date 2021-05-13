const items = document.querySelector('.items');
const cart = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui 
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
async function fetchProduct(query) {
  return fetch(`https://api.mercadolibre.com/items/${query}`)
  .then((response) => response.json());
}

async function appendCartItem(event) {
  const id = event.target.parentElement.firstElementChild.innerText;
  const product = await fetchProduct(id);
  const { title: name, price: salePrice } = product;
  cart.appendChild(createCartItemElement({ sku: id, name, salePrice }));
}

async function fetchProductList(query) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json())
  .then((response) => response.results);
}

async function appendProductList(query) {
  const productList = await fetchProductList(query);
  await productList.forEach((element) => {
    const { id: sku, title: name, thumbnail: image } = element;
    items.appendChild(createProductItemElement({ sku, name, image }));
  });
  const buttonList = document.querySelectorAll('.item__add');
  buttonList.forEach((element) => element.addEventListener('click', appendCartItem));
}

window.onload = function onload() { 
  appendProductList('computador');
};