const paramJSON = { headers: { Accept: 'application/json' } };
function getProductList() {
  const APIurl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return fetch(APIurl, paramJSON)
    .then((response) => response.json())
    .then((json) => (json.results
      .map(({ id, title, thumbnail }) => ({ sku: id, name: title, image: thumbnail }))));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function loopCreateElement(array) {
  const getItemsSection = document.querySelector('.items');
  array.forEach((element) => getItemsSection.appendChild(createProductItemElement(element)));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // 
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function insertItemToCart(object) {
  const cartContainer = document.querySelector('.cart__items');
  cartContainer.appendChild(createCartItemElement(object));
}

function fetchSelectedItem(param) {
  return fetch(`https://api.mercadolibre.com/items/${param}`, paramJSON)
  .then((response) => response.json())
  .then(({ id, title, price }) => ({ sku: id, name: title, salePrice: price }))
  .then((object) => insertItemToCart(object));
}

function getElement() {
  const getItemsBoard = document.querySelectorAll('.item');
  getItemsBoard.forEach((element) => element.lastChild.addEventListener('click', (event) => {
    console.log(event.target.parentNode.firstChild.innerText);
    return fetchSelectedItem(event.target.parentNode.firstChild.innerText);
  }));
}

async function execute() {
  const productList = await getProductList();
  await loopCreateElement(productList);
  await getElement();
}

window.onload = function onload() {
  execute();
};