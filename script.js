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
  // const itemsSection = document.getElementsByClassName('items');
  const section = document.createElement('section');
  section.className = 'item';
  section.innerHTML = { sku, name, image };
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  // itemsSection.appendChild(section);

  return section;
}

function getMercadoLivre() {
  const param = { headers: { Accept: 'application/json' } };
  const promise = fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', param);
  const sectionItems = document.querySelector('.items');
  promise
    .then((response) => {
      response.json().then((data) => {
        console.log(data);
        data.results.forEach(({ id, title, thumbnail }) => {
          sectionItems.appendChild(createProductItemElement(
            { sku: id, name: title, image: thumbnail },
            ));
        });
      });
    });
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

window.onload = function onload() {
  getMercadoLivre();
};
