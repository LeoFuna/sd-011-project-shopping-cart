const totalPrice = document.querySelector('.total-price');
console.log(totalPrice);

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// 3 - Remova o item do carrinho de compras ao clicar nele

function cartItemClickListener(event, keepItems, count, price) {
  localStorage.removeItem(`items${count}`);
  keepItems.removeChild(event.target);
  totalPrice.innerHTML = parseFloat(Number(totalPrice.innerHTML) - Number(price));
}

// 4 - Carregue o carrinho de compras através do LocalStorage ao iniciar a página

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  const keepItems = document.querySelector('.cart__items');
  localStorage.setItem(`items${keepItems.childElementCount}`, `${sku}|${name}|${price}`);
  const count = keepItems.childElementCount;
  li.addEventListener('click', (event) => 
    cartItemClickListener(event, keepItems, count, price));
  ol.appendChild(li);
  totalPrice.innerHTML = parseFloat(Number(totalPrice.innerHTML) + Number(price));
  return li;
}

// 2. Adicione o produto ao carrinho de compras

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  const getItems = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  
  getItems.appendChild(section);
  return section;
}

// 1. Crie uma lista de produtos

function chargePage() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results.forEach((value) => createProductItemElement(value)))
    .then(() => {
      for (let index = 0; index < localStorage.length; index += 1) {
        const [sku, name, price] = (localStorage.getItem(`items${index}`).split('|'));
        const objItem = { sku, name, price };
        createCartItemElement(objItem);
      }
    });
}

window.onload = function onload() {
  chargePage();
};
