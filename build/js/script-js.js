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
};

//* ====== ИНИЦИАЛИЗАЦИЯ СЧЁТЧИКОВ В КАТАЛОГЕ (с переключением видимости) ======
function initCatalogCounters() {
  document.querySelectorAll('.items_greed_wrapper').forEach((wrapper) => {
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
  // Ищем все блоки .product-cart__quantity (в корзине) и любые другие .quantity, которые не внутри .items_greed_wrapper
  const otherBlocks = document.querySelectorAll(
    '.product-cart__quantity, .quantity:not(.items_greed_wrapper .quantity)'
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

//* ==================== ЗАПУСК ПРИ ЗАГРУЗКЕ ===================================
document.addEventListener('DOMContentLoaded', function () {
  initCatalogCounters(); // счётчики в каталоге с переключением кнопка/счётчик
  initOtherCounters(); // все остальные счётчики (корзина и пр.)
  if (document.querySelector('.cart-page')) {
    initCartPageSpecific(); // дополнительная логика для страницы корзины
  }
});
//todo ---------------------[ Date and time ]-----------------------------------
//todo ↓↓↓ (Для Виктора)
document.addEventListener('DOMContentLoaded', function () {
  const datePicker = document.getElementById('deliveryDate');
  const timePicker = document.getElementById('deliveryTime');

  if (datePicker && timePicker) {
    //* Минимальная дата - сегодня
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    datePicker.min = `${yyyy}-${mm}-${dd}`;

    //* Устанавливаем начальное время
    timePicker.value = '12:00';

    //* Функция объединения даты и времени в одну строку
    function getCombinedDateTime() {
      const selectedDate = datePicker.value;
      const selectedTime = timePicker.value;

      if (!selectedDate) return '';

      const date = new Date(selectedDate);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      let formattedDate = date.toLocaleDateString('ru-RU', options);

      if (selectedTime) {
        formattedDate += ` ${selectedTime}`;
      }

      return formattedDate;
    }

    //* Функция обновления значения в select__input
    function updateSelectInput() {
      const formattedValue = getCombinedDateTime();

      if (formattedValue) {
        //* Находим родительский блок data-select
        const selectGroup = datePicker.closest('[data-select]');

        if (selectGroup) {
          //* Находим select__input внутри этого блока
          const selectInput = selectGroup.querySelector('.select__input');

          //* Меняем значение в input (дата и время вместе)
          if (selectInput) {
            selectInput.value = formattedValue;
            console.log('Установлено значение:', formattedValue);
          }
        }
      }
    }

    //* При изменении даты
    datePicker.addEventListener('change', function () {
      updateSelectInput();

      //* Опционально: автоматически установить время, если его нет
      if (!timePicker.value) {
        timePicker.value = '12:00';
      }
    });

    //* При изменении времени
    timePicker.addEventListener('change', function () {
      updateSelectInput();
    });

    //* Если нужно закрывать dropdown после выбора
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
      closeButton.addEventListener('click', function () {
        const selectGroup = datePicker.closest('[data-select]');
        const selectDropdown = selectGroup.querySelector('.select__drop-down');
        if (selectDropdown) {
          selectDropdown.classList.add('_collapse');
          const select = selectGroup.querySelector('.select');
          if (select) {
            select.classList.remove('_active-collapse');
          }
        }
      });
    }
  }

  //todo

  const selectButton = document.querySelector('.selection-button');
  if (selectButton) {
    selectButton.addEventListener('click', function () {
      const allCheckboxes = document.querySelectorAll('.check-box__input');

      //* Проверяем, все ли чекбоксы уже выделены
      const allChecked = Array.from(allCheckboxes).every(
        (checkbox) => checkbox.checked === true
      );

      if (allChecked) {
        //* Если все выделены - снимаем выделение
        allCheckboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
        selectButton.textContent = 'Выделить всё';
      } else {
        // Если не все выделены - выделяем всё
        allCheckboxes.forEach((checkbox) => {
          checkbox.checked = true;
        });
        selectButton.textContent = 'Снять выделение';
      }
    });
  }
});
//todo -------------------------------------------------------------------------
//todo ↓↓↓ (Для Виктора) - скрытие панелей в "Личном кабинете"
document.addEventListener('DOMContentLoaded', () => {
  //* ========== ПРАВАЯ ПАНЕЛЬ ==========
  const openButtonRight = document.querySelector(
    '.acccount-section__open-button'
  );
  const closeButtonRight = document.querySelector('.profile__close-button');
  const asideMenuRight = document.querySelector('.aside-menu-r');
  const verticalDotsRight = document.getElementById('verticalDots');

  if (openButtonRight) {
    openButtonRight.addEventListener('click', () => {
      asideMenuRight?.classList.toggle('open');
      openButtonRight?.classList.toggle('active');
      if (window.innerWidth <= 992) {
        // verticalDotsRight?.classList.toggle('horizontal');
      }
    });
  }

  if (closeButtonRight) {
    closeButtonRight.addEventListener('click', () => {
      asideMenuRight?.classList.toggle('open');
      openButtonRight?.classList.toggle('active');
      if (window.innerWidth <= 992) {
        // verticalDotsRight?.classList.toggle('horizontal');
      }
    });
  }

  //* ========== ЛЕВАЯ ПАНЕЛЬ ==========
  const openButtonLeft = document.querySelector(
    '.acccount-section__link-button'
  );
  const closeButtonLeft = document.querySelector('.side-menu__close-menu');
  const asideMenuLeft = document.querySelector('.aside-menu-l');
  const verticalDotsLeft = document.getElementById('verticalDotsLeft');

  if (openButtonLeft) {
    openButtonLeft.addEventListener('click', () => {
      asideMenuLeft?.classList.toggle('open');
      openButtonLeft?.classList.toggle('active');
      if (window.innerWidth <= 992) {
        verticalDotsLeft?.classList.toggle('horizontal');
      }
    });
  }

  if (closeButtonLeft) {
    closeButtonLeft.addEventListener('click', () => {
      asideMenuLeft?.classList.toggle('open');
      openButtonLeft?.classList.toggle('active');
      if (window.innerWidth <= 992) {
        verticalDotsLeft?.classList.toggle('horizontal');
      }
    });
  }

  //* ========== ФУНКЦИЯ ЗАКРЫТИЯ ПАНЕЛЕЙ ==========
  function closeAllPanels() {
    //* ====== Правая панель ======
    asideMenuRight?.classList.remove('open');
    openButtonRight?.classList.remove('active');
    verticalDotsRight?.classList.remove('horizontal');

    //* ======  Левая панель ======
    asideMenuLeft?.classList.remove('open');
    openButtonLeft?.classList.remove('active');
    verticalDotsLeft?.classList.remove('horizontal');
  }

  //* ========== ОБЩАЯ ФУНКЦИЯ ДЛЯ ШИРИНЫ ЭКРАНА ==========
  function checkScreenWidth() {
    if (window.innerWidth > 992) {
      closeAllPanels();
    }
  }

  //* ========== ЗАКРЫТИЕ ПРИ СКРОЛЛЕ ==========
  let scrollTimeout;
  function handleScroll() {
    //* ======  Очищаем предыдущий таймер ======
    clearTimeout(scrollTimeout);

    //* Закрываем панели при скролле
    closeAllPanels();

    //* Дополнительно: можно добавить задержку, чтобы не закрывалось при каждом тике
    scrollTimeout = setTimeout(() => {
      closeAllPanels();
    }, 100);
  }

  //* ========== ЗАКРЫТИЕ ПРИ КЛИКЕ ВНЕ ПАНЕЛИ (опционально) ==========
  function handleClickOutside(event) {
    //* Проверяем, был ли клик вне правой панели и не по кнопке открытия
    const isRightPanel = asideMenuRight?.contains(event.target);
    const isRightButton = openButtonRight?.contains(event.target);

    //* Проверяем, был ли клик вне левой панели и не по кнопке открытия
    const isLeftPanel = asideMenuLeft?.contains(event.target);
    const isLeftButton = openButtonLeft?.contains(event.target);

    //* Если клик был вне обеих панелей и не по кнопкам открытия
    if (!isRightPanel && !isRightButton && !isLeftPanel && !isLeftButton) {
      closeAllPanels();
    }
  }

  //* ====== Запускаем проверку при загрузке ======
  checkScreenWidth();

  //* ======  События ======
  window.addEventListener('resize', checkScreenWidth);
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleClickOutside);
});
//todo -------------------- [ Открытие модалок ]--------------------------------
//todo ↓↓↓ (Для Виктора)
