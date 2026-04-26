//todo ---------- счетчик (добавить в корзину) ---------------------------------
//todo ↓↓↓ (Для Виктора)
document.addEventListener('DOMContentLoaded', function () {
  //* Функция для обновления общего счетчика корзины
  function updateTotalCartQuantity() {
    let totalQuantity = 0;

    //* Собираем все значения количества со всех товаров
    document
      .querySelectorAll('.items_greed_wrapper .input')
      .forEach((input) => {
        let val = parseInt(input.value) || 0;
        totalQuantity += val;
      });

    const cartQuantity = document.querySelector('.cart-user__quantity');

    if (cartQuantity) {
      if (totalQuantity > 0) {
        cartQuantity.textContent = totalQuantity;
        cartQuantity.style.display = 'flex'; //* или 'inline-flex', смотрите ваш CSS
      } else {
        cartQuantity.style.display = 'none';
      }
    }

    console.log('Общее количество:', totalQuantity); //* Для отладки
  }

  // Обработка каждого товара
  document.querySelectorAll('.items_greed_wrapper').forEach((wrapper) => {
    const addToCartBtn = wrapper.querySelector('.add-to-cart');
    const quantityBlock = wrapper.querySelector('.quantity');

    if (!addToCartBtn || !quantityBlock) return;

    const input = quantityBlock.querySelector('.input');
    const minusBtn = quantityBlock.querySelector('.quantity-remove');
    const plusBtn = quantityBlock.querySelector('.quantity-add');

    //* Функция обновления видимости кнопки/счетчика для конкретного товара
    function updateItemVisibility() {
      let currentValue = parseInt(input.value) || 0;

      if (currentValue > 0) {
        addToCartBtn.style.display = 'none';
        quantityBlock.style.display = 'flex';
      } else {
        addToCartBtn.style.display = 'block';
        quantityBlock.style.display = 'none';
      }

      //* Обновляем общий счетчик корзины
      updateTotalCartQuantity();
    }

    //* Функция изменения количества
    function updateValue(change) {
      let currentValue = parseInt(input.value) || 0;
      let newValue = currentValue + change;

      if (newValue < 0) newValue = 0;
      input.value = newValue;
      updateItemVisibility();
    }

    //* Обработчик на кнопку "в корзину"
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateValue(1);
    });

    //* Обработчик на кнопку "+"
    if (plusBtn) {
      plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateValue(1);
      });
    }

    //* Обработчик на кнопку "-"
    if (minusBtn) {
      minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateValue(-1);
      });
    }

    //* Обработчик ручного ввода
    if (input) {
      input.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
          input.value = 0;
        }
        updateItemVisibility();
      });

      //* Запрещаем ввод букв
      input.addEventListener('keydown', (e) => {
        if (e.key === '-' || e.key === 'e' || e.key === '.' || e.key === ',') {
          e.preventDefault();
        }
      });
    }

    //* Инициализация видимости
    updateItemVisibility();
  });

  //* Первоначальное обновление счетчика
  updateTotalCartQuantity();
});

//todo --------- счетчик (добавить в корзину в КОРЗИНЕ) ------------------------
//todo ↓↓↓ (Для Виктора)
document.addEventListener('DOMContentLoaded', function () {
  function updateTotalCartQuantity() {
    let totalQuantity = 0;
    document.querySelectorAll('.counter-wrapper .input').forEach((input) => {
      totalQuantity += parseInt(input.value) || 0;
    });
    const cartQuantity = document.querySelector('.cart-user__quantity');
    if (cartQuantity) {
      cartQuantity.textContent = totalQuantity;
      if (totalQuantity > 0) {
        cartQuantity.style.display = 'flex';
      } else {
        cartQuantity.style.display = 'none';
      }
    }
  }

  document.querySelectorAll('.counter-wrapper').forEach((wrapper) => {
    const input = wrapper.querySelector('.input');
    const minusBtn = wrapper.querySelector('.quantity-remove');
    const plusBtn = wrapper.querySelector('.quantity-add');

    if (!input) return;

    function updateValue(change) {
      let currentValue = parseInt(input.value) || 0;
      let newValue = currentValue + change;
      if (newValue < 0) newValue = 0;
      input.value = newValue;
      updateTotalCartQuantity();
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateValue(1);
      });
    }

    if (minusBtn) {
      minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateValue(-1);
      });
    }

    if (input) {
      input.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
          input.value = 0;
        }
        updateTotalCartQuantity();
      });
    }
  });

  updateTotalCartQuantity();
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
        formattedDate += ` ${selectedTime}`; // Убрал предлог "в"
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

//todo ----------------------[ Preloader ]--------------------------------------
//todo ↓↓↓ (Для Виктора)

function loaded(item) {
  //* Блокируем скролл сразу
  // document.body.classList.add('no-scroll');

  let done = false;

  function removePreloader() {
    if (done) return;
    done = true;
    document.querySelector(item).classList.add('preloader-remove');
    document.documentElement.classList.add('loaded');
    //* Разблокируем скролл после загрузки
    // document.body.classList.remove('no-scroll');
    document.body.style.scrollbarWidth = 'thin';
  }

  if (document.readyState === 'complete') {
    setTimeout(removePreloader, 150);
  } else {
    window.addEventListener('load', function () {
      setTimeout(removePreloader, 150);
    });
  }
}

if (document.querySelector('.preloader')) {
  loaded('.preloader');
}
//todo -------------------- [ Открытие модалок ]--------------------------------
//todo ↓↓↓ (Для Виктора)
document.addEventListener('DOMContentLoaded', () => {
  const element = document.querySelectorAll('.className');
});
//* -------------------- [ Плавны скролл стр.] ---------------------------------
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
