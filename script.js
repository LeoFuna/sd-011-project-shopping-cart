window.onload = function onload() { };

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
   
}


const productsList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=pc_gamer')
    .then((r) => r.json())
    .then((data) => {
     data.results.forEach((product) => {
        const object = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(object));
      });
    });
};

window.onload = async () => {
  productsList();
};