//* ============== ГЛОБАЛЬНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ СЧЁТЧИКА КОРЗИНЫ ==============

window.updateTotalCartQuantity = function () {
  let totalQuantity = 0;
  // Собираем значения из всех полей количества (универсальный селектор)
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
  // 👇 ВОТ ЭТИ 3 СТРОЧКИ
  // Синхронизация с side-menu__col-tovara
  const sideMenuTovara = document.querySelector('.side-menu__col-tovara');
  if (sideMenuTovara && cartQuantity) {
    sideMenuTovara.textContent = cartQuantity.textContent;
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

    //* Если уже есть обработчики – не добавляем повторно
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
  // Ищем все блоки .product-cart__quantity (в корзине) и любые другие .quantity, которые не внутри .items-greed__wrapper
  const otherBlocks = document.querySelectorAll(
    '.product-cart__quantity, .quantity:not(.items-greed__wrapper .quantity)'
  );

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
    const discount = getNumberFromBlock(discountBlock);
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
        const newQty = parseInt(input.value, 10) || 1;
        if (newQty > 0) {
          const newTotal = pricePerUnit * newQty;
          priceSpan.textContent = formatPrice(newTotal);
        }
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
    cart.querySelectorAll('.product-cart__item').forEach((item) => {
      const deleteBtn = item.querySelector('[id="delete-product"]');
      if (deleteBtn && !deleteBtn.hasAttribute('data-listener')) {
        deleteBtn.setAttribute('data-listener', 'true');
        deleteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          item.remove();
          updateCartVisibility();
        });
      }
    });
  }

  function initDeleteAllButton() {
    if (!deleteAllBtn || deleteAllBtn.hasAttribute('data-listener')) return;
    deleteAllBtn.setAttribute('data-listener', 'true');
    deleteAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cart
        .querySelectorAll('.product-cart__item')
        .forEach((item) => item.remove());
      updateCartVisibility();
    });
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

//todo ============== ОБЩИЙ ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =======================
// ------------------ Личный кабинет (загрузка контента) -----------------------
//* ============== ГЛОБАЛЬНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ СЧЁТЧИКА КОРЗИНЫ ==============
window.updateTotalCartQuantity = function () {
  let totalQuantity = 0;
  // Собираем значения из всех полей количества (универсальный селектор)
  document
    .querySelectorAll('.quantity .input, .quantity__input .input')
    .forEach((input) => {
      let val = parseInt(input.value, 10);
      if (!isNaN(val) && val > 0) totalQuantity += val;
    });

  // Обновляем side-menu__col-tovara напрямую из totalQuantity
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

    // Обновляет видимость кнопки "В корзину" и блока количества
    function updateItemVisibility() {
      let currentValue = parseInt(input.value, 10) || 0;
      addToCartBtn.style.display = currentValue > 0 ? 'none' : 'block';
      quantityBlock.style.display = currentValue > 0 ? 'flex' : 'none';
      window.updateTotalCartQuantity();
    }

    // Изменяет значение количества
    function updateValue(change) {
      let newValue = (parseInt(input.value, 10) || 0) + change;
      if (newValue < 0) newValue = 0;
      input.value = newValue;
      updateItemVisibility();
    }

    // Добавляем обработчики с защитой от дублирования
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
      // Запрещаем ввод некорректных символов
      input.addEventListener('keydown', (e) => {
        if (e.key === '-' || e.key === 'e' || e.key === '.' || e.key === ',')
          e.preventDefault();
      });
    }
    updateItemVisibility(); // Устанавливаем начальное состояние
  });
}

//* === ИНИЦИАЛИЗАЦИЯ ВСЕХ ОСТАЛЬНЫХ СЧЁТЧИКОВ (без переключения видимости) ====
function initOtherCounters() {
  // Ищем блоки .product-cart__quantity (в корзине) и любые другие .quantity, не внутри .items-greed__wrapper
  const otherBlocks = document.querySelectorAll(
    '.product-cart__quantity, .quantity:not(.items-greed__wrapper .quantity)'
  );

  otherBlocks.forEach((block) => {
    if (block.hasAttribute('data-quantity-initialized')) return;
    block.setAttribute('data-quantity-initialized', 'true');

    const input = block.querySelector('.input');
    const minusBtn = block.querySelector('.quantity-remove');
    const plusBtn = block.querySelector('.quantity-add');

    if (!input) return;

    // Изменяет количество и обновляет общий счётчик
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

  // Извлекает число из текстового блока (удаляет все нецифровые символы)
  function getNumberFromBlock(block) {
    if (!block) return 0;
    const text = block.textContent.trim();
    const num = parseFloat(text.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  }

  // Форматирует цену с пробелами и валютой
  function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' руб';
  }

  // Пересчитывает общую сумму корзины с учётом скидки
  function updateTotalSums() {
    let productsTotal = 0;
    cart.querySelectorAll('.product-cart__new-price').forEach((el) => {
      productsTotal += getNumberFromBlock(el);
    });
    const discount = getNumberFromBlock(discountBlock);
    let finalWithDiscount = productsTotal - discount;
    if (finalWithDiscount < 0) finalWithDiscount = 0;
    if (fullSumBlock) fullSumBlock.textContent = formatPrice(productsTotal);
    if (discountedSumBlock)
      discountedSumBlock.textContent = formatPrice(finalWithDiscount);
  }

  // Показывает/скрывает блоки при пустой корзине
  function toggleEmptyCartBlocks(hasItems) {
    if (deliveryContent) deliveryContent.style.display = hasItems ? '' : 'none';
    if (profileBlock) profileBlock.style.display = hasItems ? 'none' : 'block';
  }

  // Обновляет видимость корзины и сообщения "Корзина пуста"
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

  // Инициализирует контролы количества в корзине (с пересчётом цены за единицу)
  function initCartQuantityControls() {
    cart.querySelectorAll('.product-cart__item').forEach((item) => {
      const priceSpan = item.querySelector('.product-cart__new-price');
      const input = item.querySelector('.quantity__input .input');
      if (!priceSpan || !input) return;

      const currentTotal = getNumberFromBlock(priceSpan);
      const quantity = parseInt(input.value, 10) || 1;
      const pricePerUnit = currentTotal / quantity; // Сохраняем цену за единицу
      item.dataset.pricePerUnit = pricePerUnit;

      // Обновляет цену товара при изменении количества
      const updatePriceAndSum = () => {
        const newQty = parseInt(input.value, 10) || 1;
        if (newQty > 0) {
          const newTotal = pricePerUnit * newQty;
          priceSpan.textContent = formatPrice(newTotal);
        }
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

  // Инициализирует кнопки удаления отдельных товаров
  function initDeleteButtons() {
    cart.querySelectorAll('.product-cart__item').forEach((item) => {
      const deleteBtn = item.querySelector('[id="delete-product"]');
      if (deleteBtn && !deleteBtn.hasAttribute('data-listener')) {
        deleteBtn.setAttribute('data-listener', 'true');
        deleteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          item.remove();
          updateCartVisibility();
        });
      }
    });
  }

  // Инициализирует кнопку "Удалить все"
  function initDeleteAllButton() {
    if (!deleteAllBtn || deleteAllBtn.hasAttribute('data-listener')) return;
    deleteAllBtn.setAttribute('data-listener', 'true');
    deleteAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cart
        .querySelectorAll('.product-cart__item')
        .forEach((item) => item.remove());
      updateCartVisibility();
    });
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

//todo ============== ОБЩИЙ ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =======================
//* ----------------- Личный кабинет (загрузка контента) -----------------------
document.addEventListener('DOMContentLoaded', function () {
  // 👇 Инициализируем счётчики на всех страницах
  leftMenuOpenClose();
  initCounter();

  // 👇 Логика для страницы личного кабинета (если она есть на странице)
  const content = document.querySelector('.personal-data');
  const sideMenuList = document.querySelector('.side-menu__list');

  // 👇 Проверяем, есть ли на странице блок личного кабинета
  if (content && sideMenuList) {
    // Добавил проверку sideMenuList

    // Функция для получения текста кнопки по data-page
    function getPageTitle(page) {
      const button = sideMenuList.querySelector(
        `.tab-button[data-page="${page}"]`
      );
      return button ? button.textContent.trim() : page;
    }

    // Функция для обновления хлебных крошек
    function updateBreadcrumbs(page, pageTitle) {
      const breadcrumb = document.querySelector('.breadcrumb');
      if (!breadcrumb) return;

      // Очищаем все li, кроме первого (Главная)
      while (breadcrumb.children.length > 1) {
        breadcrumb.removeChild(breadcrumb.lastChild);
      }

      // Добавляем второй уровень (Личный кабинет)
      const secondLi = document.createElement('li');
      const secondSpan = document.createElement('span');
      secondSpan.className = 'tab-button';
      secondSpan.setAttribute('data-page', 'user-account');
      secondSpan.textContent = 'Личный кабинет';
      secondLi.appendChild(secondSpan);
      breadcrumb.appendChild(secondLi);

      // Если это не страница личного кабинета, добавляем третий уровень
      if (page !== 'user-account') {
        const thirdLi = document.createElement('li');
        const thirdSpan = document.createElement('span');
        thirdSpan.className = 'tab-button active';
        thirdSpan.setAttribute('data-page', page);
        thirdSpan.textContent = pageTitle;
        thirdLi.appendChild(thirdSpan);
        breadcrumb.appendChild(thirdLi);

        // Убираем класс active у второго уровня
        secondSpan.classList.remove('active');
      } else {
        // На странице личного кабинета делаем активным второй уровень
        secondSpan.classList.add('active');
      }
      // 👇 инициализируем клики по крошкам
      initBreadcrumbClicks();
    }

    // 👇 Инициализирует клики по хлебным крошкам
    function initBreadcrumbClicks() {
      const breadcrumb = document.querySelector('.breadcrumb');
      if (!breadcrumb) return;

      const breadcrumbLinks = breadcrumb.querySelectorAll('span[data-page]');
      breadcrumbLinks.forEach((link) => {
        if (link.hasAttribute('data-breadcrumb-listener')) return;
        link.setAttribute('data-breadcrumb-listener', 'true');

        link.addEventListener('click', (e) => {
          e.preventDefault();
          const page = link.getAttribute('data-page');
          if (!page) return;

          const targetButton = sideMenuList.querySelector(
            `.tab-button[data-page="${page}"]`
          );
          if (targetButton) {
            setActiveButton(targetButton);
            loadPage(page);
          }
        });
      });
    }

    // 👇 Устанавливает активную кнопку в боковом меню
    function setActiveButton(activeLink) {
      // Удаляем класс active-link у всех кнопок ТОЛЬКО внутри side-menu__list
      const allLinks = sideMenuList.querySelectorAll('.tab-button');
      allLinks.forEach((btn) => {
        btn.classList.remove('active-link');
      });
      // Добавляем класс active-link выбранной кнопке
      if (activeLink) {
        activeLink.classList.add('active-link');
      }
    }

    // 👇 Привязывает обработчики кликов к кнопкам меню
    function bindEvents() {
      const links = sideMenuList.querySelectorAll('.tab-button');
      links.forEach((link) => {
        // Удаляем старые обработчики, чтобы не дублировать
        link.removeEventListener('click', link._listener);
        // Создаём новый обработчик
        const handler = function () {
          const page = this.getAttribute('data-page');
          if (!page) return; // Пропускаем кнопки без data-page

          // Устанавливаем активную кнопку
          setActiveButton(this);
          // Загружаем контент
          loadPage(page);
        };
        link._listener = handler;
        link.addEventListener('click', handler);
      });
    }

    // 👇 Загружает контент страницы через fetch
    function loadPage(page) {
      fetch(`user/${page}.html`)
        .then((response) => {
          if (!response.ok) throw new Error('Page not found');
          return response.text();
        })
        .then((data) => {
          content.innerHTML = data;

          // Обновляем хлебные крошки
          const pageTitle = getPageTitle(page);
          updateBreadcrumbs(page, pageTitle);
          window.updateTotalCartQuantity();

          // Запускаем специфичные для страницы инициализации
          if (page === 'user-account') {
            if (typeof maskPhone === 'function') maskPhone();
            leftMenuOpenClose();
            dynamicAdaptive();
          } else if (page === 'user-order') {
            leftMenuOpenClose();
            if (typeof itSelect === 'function') itSelect();
            if (typeof selectDropByer === 'function') selectDropByer();
            if (typeof autoResizeText === 'function') autoResizeText();
          } else if (page === 'user-history') {
            leftMenuOpenClose();
            if (typeof itSelect === 'function') itSelect();
            if (typeof selectDropByer === 'function') selectDropByer();
            if (typeof autoResizeText === 'function') autoResizeText();
            initCounter(); // Переинициализируем счётчики после загрузки
          } else if (page === 'user-profile') {
            leftMenuOpenClose();
            dynamicAdaptive();
            if (typeof maskPhone === 'function') maskPhone();
          } else if (page === 'user-organitrashion') {
            leftMenuOpenClose();
            // if (typeof collapseBlock === 'function') collapseBlock();
            // Вызываем маску и поиск ПОСЛЕ загрузки контента
            if (typeof maskInn === 'function') maskInn();
            if (typeof initInnSearch === 'function') initInnSearch();
          } else if (page === 'user-repair') {
          }
        })
        .catch((error) => {
          content.innerHTML = '<p>Ошибка загрузки контента</p>';
        });
    }

    // 👇 Определяем кнопку по умолчанию (user-account или первую)
    const defaultButton =
      sideMenuList.querySelector('.tab-button[data-page="user-account"]') ||
      sideMenuList.querySelector('.tab-button');

    if (defaultButton) {
      setActiveButton(defaultButton);
      loadPage('user-account');
    }

    bindEvents();
  }
});
//* ----------------------------------------------------------------------------
