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
  // coloque seu código aqu
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getAPIList = () => {
  return new Promise((resolve, reject) => {
    const param = { method: 'GET', headers: { Accept: 'application/json' } };
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', param)
      .then((response) => response.json())
      .then((json) => resolve(json.results))
      .catch((error) => reject(error));
  });
};

getAPIList()
  .then((list) => {
    const productContainer = document.querySelector('.item');
    list.forEach((product) => {
      const productDetails = {
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      };
      const productElement = createProductItemElement(productDetails);
      productContainer.appendChild(productElement);
    });
  })
  .catch((error) => console.error(error));

window.onload = function onload() {
  getAPIList();
};
