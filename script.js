const cartContainer = document.querySelector('.cart__items');
let actualPrice = 0;

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

function sumCartItems({ price }) {
  actualPrice += price;
  if (actualPrice.length - 1 && actualPrice.length - 2 === 0) {
    Math.round(actualPrice);
  } else {
    actualPrice.toFixed(2);
  }
  const totalValueCart = document.querySelector('.total-price');
  totalValueCart.innerText = actualPrice;
}

// função que remove um determinado item do localStorage sempre que este for removido do carrinho de compras.

function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const parentOfItem = (event.target.parentNode);
  parentOfItem.removeChild(event.target);
  removeFromLocalStorage(event.target.id);
  sumCartItems(parseFloat(event.target.innerText.split('$')[1]));
}

// função que seta os itens no localStorage toda vez que for adicionado ao carrinho.

function addToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = id; // modificação realizada para poder passar o SKU do produto para o HTML de forma que possamos consultar depois para ter acesso ao mesmo e removê-lo do localStorage.
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartItemElement = (event) => {
  const itemSKU = getSkuFromProductItem(event.target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${itemSKU}`)
  .then((response) => response.json())
  .then((data) => {
    const cartItemCreated = createCartItemElement(data);
    cartContainer.appendChild(cartItemCreated);
    sumCartItems(data);
    addToLocalStorage(itemSKU);
  });
};

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const newButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  newButton.addEventListener('click', addCartItemElement);
  section.appendChild(newButton);

  return section;
}

// Essa função vai servir para fazer a requisição ao endpoint do termo pesquisado e em seguida acessar todos os termos retornados colocando como filhos do container feito para os Itens.

const fetchItems = (searchTerm) => {
  const itemsContainer = document.querySelector('.items');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`)
  .then((response) => response.json())
  .then((data) => data.results
  .forEach((product) => itemsContainer.appendChild(createProductItemElement(product))))
  .catch((error) => alert(`Erro na requisição: ${error}`));
};

fetchItems('computador');

// addCartFromLocalStorage captura as chaves do Objeto localStorage e as itera, fazendo uma requisição à API por cada chave usando o SKU do produto, fazendo assim a criação do carrinho de compras usando o armazenamento do browser.

const addCartFromLocalStorage = () => {
  const productsInLocalStorage = Object.keys(localStorage);
  productsInLocalStorage.forEach(async (product) => {
    fetch(`https://api.mercadolibre.com/items/${product}`)
    .then((response) => response.json())
    .then((data) => {
      const cartItemCreated = createCartItemElement(data);
      cartContainer.appendChild(cartItemCreated);
    })
    .catch((error) => alert(`Erro na requisição: ${error}`));
  });
};

const eraseCart = () => {
  localStorage.clear();
  cartContainer.innerHTML = '';
};

document.querySelector('.empty-cart').addEventListener('click', eraseCart);

window.onload = function onload() {
  addCartFromLocalStorage();
};
