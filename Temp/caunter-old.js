//* ============== ГЛОБАЛЬНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ СЧЁТЧИКА КОРЗИНЫ ==============
window.updateTotalCartQuantity = function () {
  let totalQuantity = 0;

  document
    .querySelectorAll('.quantity .input, .quantity__input .input')
    .forEach((input) => {
      let val = parseInt(input.value, 10);
      if (!isNaN(val) && val > 0) totalQuantity += val;
    });

  const cartQuantity = document.querySelector('.cart-user__quantity');
  if (cartQuantity) {
    cartQuantity.textContent = totalQuantity;
    cartQuantity.style.display = totalQuantity > 0 ? 'flex' : 'none';
  }

  const sideMenuTovara = document.querySelector('.side-menu__col-tovara');
  if (sideMenuTovara) {
    sideMenuTovara.textContent = totalQuantity;
    sideMenuTovara.style.display = totalQuantity > 0 ? 'flex' : 'none';
  }
};

//* ====== ИНИЦИАЛИЗАЦИЯ СЧЁТЧИКОВ В КАТАЛОГЕ (с переключением видимости) ======
function initCatalogCounters() {
  document.querySelectorAll('.items-greed__wrapper').forEach((wrapper) => {
    const addToCartBtn = wrapper.querySelector('.add-to-cart');
    const quantityBlock = wrapper.querySelector('.quantity');
    if (!addToCartBtn || !quantityBlock) return;

    const input = quantityBlock.querySelector('.input');
    const minusBtn = quantityBlock.querySelector('.quantity-remove');
    const plusBtn = quantityBlock.querySelector('.quantity-add');

    function updateItemVisibility() {
      let currentValue = parseInt(input.value, 10) || 0;
      addToCartBtn.style.display = currentValue > 0 ? 'none' : 'block';
      quantityBlock.style.display = currentValue > 0 ? 'flex' : 'none';
      window.updateTotalCartQuantity();
    }

    function updateValue(change) {
      let newValue = (parseInt(input.value, 10) || 0) + change;
      if (newValue < 0) newValue = 0;
      input.value = newValue;
      updateItemVisibility();
    }

    if (addToCartBtn && !addToCartBtn.hasAttribute('data-listener')) {
      addToCartBtn.setAttribute('data-listener', 'true');
      addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateValue(1);
      });
    }
    if (plusBtn && !plusBtn.hasAttribute('data-listener')) {
      plusBtn.setAttribute('data-listener', 'true');
      plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateValue(1);
      });
    }
    if (minusBtn && !minusBtn.hasAttribute('data-listener')) {
      minusBtn.setAttribute('data-listener', 'true');
      minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateValue(-1);
      });
    }
    if (input && !input.hasAttribute('data-listener')) {
      input.setAttribute('data-listener', 'true');
      input.addEventListener('input', (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 0) input.value = 0;
        updateItemVisibility();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === '-' || e.key === 'e' || e.key === '.' || e.key === ',')
          e.preventDefault();
      });
    }
    updateItemVisibility();
  });
}

//* === ИНИЦИАЛИЗАЦИЯ ВСЕХ ОСТАЛЬНЫХ СЧЁТЧИКОВ (без переключения видимости) ====
function initOtherCounters() {
  const otherBlocks = document.querySelectorAll('.product-cart__quantity');

  otherBlocks.forEach((block) => {
    if (block.hasAttribute('data-quantity-initialized')) return;
    block.setAttribute('data-quantity-initialized', 'true');

    const input = block.querySelector('.input');
    const minusBtn = block.querySelector('.quantity-remove');
    const plusBtn = block.querySelector('.quantity-add');

    if (!input) return;

    const changeQuantity = (delta) => {
      let newVal = (parseInt(input.value, 10) || 0) + delta;
      if (newVal < 0) newVal = 0;
      input.value = newVal;
      window.updateTotalCartQuantity();
    };

    if (plusBtn && !plusBtn.hasAttribute('data-listener')) {
      plusBtn.setAttribute('data-listener', 'true');
      plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        changeQuantity(1);
      });
    }
    if (minusBtn && !minusBtn.hasAttribute('data-listener')) {
      minusBtn.setAttribute('data-listener', 'true');
      minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        changeQuantity(-1);
      });
    }
    if (!input.hasAttribute('data-listener')) {
      input.setAttribute('data-listener', 'true');
      input.addEventListener('input', () => {
        let val = parseInt(input.value, 10);
        if (isNaN(val) || val < 0) input.value = 0;
        window.updateTotalCartQuantity();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === '-' || e.key === 'e' || e.key === '.' || e.key === ',')
          e.preventDefault();
      });
    }
  });
}

//* ==== ЛОГИКА ДЛЯ СТРАНИЦЫ КОРЗИНЫ (суммы, удаление, переключение блоков) ====
function initCartPageSpecific() {
  const cart = document.querySelector('.product-cart');
  if (!cart) return;

  const emptyMessage = document.querySelector('.product-cart__cart-empty');
  const fullSumBlock = document.querySelector('.purchase-result__sum');
  const discountedSumBlock = document.querySelector('.delivery__sum');
  const discountBlock = document.querySelector('.discount-product__price');
  const deliveryContent = document.querySelector('.delivery__content');
  const profileBlock = document.querySelector('.profile');
  const deleteAllBtn = document.querySelector('.delete-all');

  function getNumberFromBlock(block) {
    if (!block) return 0;
    const text = block.textContent.trim();
    const num = parseFloat(text.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  }

  function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' руб';
  }

  function updateTotalSums() {
    let productsTotal = 0;
    cart.querySelectorAll('.product-cart__new-price').forEach((el) => {
      productsTotal += getNumberFromBlock(el);
    });
    const discount = discountBlock ? getNumberFromBlock(discountBlock) : 0;
    let finalWithDiscount = productsTotal - discount;
    if (finalWithDiscount < 0) finalWithDiscount = 0;
    if (fullSumBlock) fullSumBlock.textContent = formatPrice(productsTotal);
    if (discountedSumBlock)
      discountedSumBlock.textContent = formatPrice(finalWithDiscount);
  }

  function toggleEmptyCartBlocks(hasItems) {
    if (deliveryContent) deliveryContent.style.display = hasItems ? '' : 'none';
    if (profileBlock) profileBlock.style.display = hasItems ? 'none' : 'block';
  }

  function updateCartVisibility() {
    const items = cart.querySelectorAll('.product-cart__item');
    const hasItems = items.length > 0;
    if (!hasItems) {
      cart.style.display = 'none';
      if (emptyMessage) emptyMessage.style.display = 'block';
      if (fullSumBlock) fullSumBlock.textContent = '0 руб';
      if (discountedSumBlock) discountedSumBlock.textContent = '0 руб';
    } else {
      cart.style.display = '';
      if (emptyMessage) emptyMessage.style.display = 'none';
      updateTotalSums();
    }
    toggleEmptyCartBlocks(hasItems);
    window.updateTotalCartQuantity();
  }

  function initCartQuantityControls() {
    cart.querySelectorAll('.product-cart__item').forEach((item) => {
      const priceSpan = item.querySelector('.product-cart__new-price');
      const input = item.querySelector('.quantity__input .input');
      if (!priceSpan || !input) return;

      const currentTotal = getNumberFromBlock(priceSpan);
      const quantity = parseInt(input.value, 10) || 1;
      const pricePerUnit = currentTotal / quantity;
      item.dataset.pricePerUnit = pricePerUnit;

      const updatePriceAndSum = () => {
        let newQty = parseInt(input.value, 10) || 0;
        if (newQty <= 0) {
          item.remove();
          updateCartVisibility();
          return;
        }
        const newTotal = pricePerUnit * newQty;
        priceSpan.textContent = formatPrice(newTotal);
        updateTotalSums();
        window.updateTotalCartQuantity();
      };

      if (!input.hasAttribute('data-cart-listener')) {
        input.setAttribute('data-cart-listener', 'true');
        input.addEventListener('input', updatePriceAndSum);
      }
      const addBtn = item.querySelector('.quantity-add');
      const removeBtn = item.querySelector('.quantity-remove');
      if (addBtn && !addBtn.hasAttribute('data-cart-listener')) {
        addBtn.setAttribute('data-cart-listener', 'true');
        addBtn.addEventListener('click', updatePriceAndSum);
      }
      if (removeBtn && !removeBtn.hasAttribute('data-cart-listener')) {
        removeBtn.setAttribute('data-cart-listener', 'true');
        removeBtn.addEventListener('click', updatePriceAndSum);
      }
    });
  }

  function initDeleteButtons() {
    if (cart.hasAttribute('data-delete-listener')) return;
    cart.setAttribute('data-delete-listener', 'true');

    cart.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[id="delete-product"]');
      if (!deleteBtn) return;
      e.preventDefault();
      const item = deleteBtn.closest('.product-cart__item');
      if (item) {
        item.remove();
        updateCartVisibility();
      }
    });
  }

  function initDeleteAllButton() {
    if (deleteAllBtn && !deleteAllBtn.hasAttribute('data-listener')) {
      deleteAllBtn.setAttribute('data-listener', 'true');
      deleteAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cart
          .querySelectorAll('.product-cart__item')
          .forEach((item) => item.remove());
        updateCartVisibility();
      });
    }
  }

  initCartQuantityControls();
  initDeleteButtons();
  initDeleteAllButton();
  updateCartVisibility();
}

//* ==================== ЕДИНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ==========================
function initCounter() {
  initCatalogCounters();
  initOtherCounters();
  if (document.querySelector('.cart-page')) {
    initCartPageSpecific();
  }
}

initCounter();
