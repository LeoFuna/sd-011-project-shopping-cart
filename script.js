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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
}

const cartItem = '.cart__items';

const addProductToCart = () => {
  document.querySelectorAll('.item__add').forEach((elem) => elem.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${elem.parentElement.firstChild.innerText}`)
    .then((resp) => resp.json())
    .then((data) => {
      localStorage.setItem('TotalItems', `${document.querySelector('ol').childElementCount}`);
      localStorage.setItem(`Item${document.querySelector('ol').childElementCount}`, 
      `SKU: ${data.id} | NAME: ${data.title} | PRICE: $${data.price}`);
      document.querySelector(cartItem).appendChild(createCartItemElement(data));
    });
  }));
};

const listItems = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((resp) => resp.json())
  .then((resp) => resp.results.forEach((item) => {
      const itemToFind = { sku: item.id, name: item.title, image: item.thumbnail };
      document.querySelectorAll('.items')[0].appendChild(createProductItemElement(itemToFind));
    }))
    .then(() => addProductToCart())
    .then(() => {
      document.querySelector('.loading').remove();
      console.log(document.querySelector('.loading'));
    })
    .catch((err) => console.log(err));
};

const backupListItem = () => {
  if (localStorage.getItem('TotalItems') > 0) {
    for (let i = 0; i <= localStorage.getItem('TotalItems'); i += 1) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      document.querySelector(cartItem).appendChild(li);
      li.innerText = localStorage.getItem(`Item${i}`);
    }
  }
};

window.onload = function onload() { 
  listItems();
  backupListItem();
};