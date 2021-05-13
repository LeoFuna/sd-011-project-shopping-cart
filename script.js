const cartItem = '.cart__items';

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

function createProductItemElement(sku, name, image) {
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

function saveCardListen() {
  const setItem = document.querySelector(cartItem);
  localStorage.setItem('key', setItem.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove('li');
  saveCardListen();
}

function saveCardListenContinue() {
  const cartItemStorage = localStorage.getItem('key');
  const olWay = document.querySelector(cartItem);
  olWay.innerHTML = cartItemStorage;
  const listOl = document.querySelectorAll(cartItem);
  listOl.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => {
      const setId = data;
      document.querySelector(cartItem).appendChild(createCartItemElement(setId));
      saveCartListen();
  }); 
};

const pickCar = () => {
  const buttonAddPickCar = document.querySelectorAll('.item__add');
  buttonAddPickCar.forEach((button) => {
    button.addEventListener('click', (event) => {
      const getId = getSkuFromProductItem(event.target.parentElement);
      fetchId(getId);
    });
  });
};

const fetchCurrency = () => {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return new Promise((resolve, reject) => {
    fetch(endPoint)
      .then((response) => response.json())
      .then((object) => {
        resolve(object.results);
        if (object.results.error) {
          throw new Error(object.results.error);
        }
      }).catch((error) => reject(window.alert(error)));
  });
};

const fetchCurrencyAsyncAwait = async () => {
  const data = await fetchCurrency();
  data.forEach((object) => {
    const productElement = createProductItemElement(
      object.id, object.title, object.thumbnail,
    );
    document.querySelector('.items').appendChild(productElement);
  });
};

window.onload = async function onload() {
  await fetchCurrencyAsyncAwait();
  pickCar();
  saveCardListen();
  saveCardListenContinue();
};