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
  //* ========== ЛЕВАЯ ПАНЕЛЬ ==========
  const openButtonLeftAll = document.querySelectorAll(
    '.acccount-section__link-button'
  );

  const closeButtonLeft = document.querySelector('.side-menu__close-menu');
  const asideMenuLeft = document.querySelector('.aside-menu-l');

  // Переменная для хранения активной кнопки (той, которая открыла панель)
  let activeOpenButton = null;

  openButtonLeftAll.forEach((openButtonLeft) => {
    if (openButtonLeft) {
      openButtonLeft.addEventListener('click', () => {
        asideMenuLeft?.classList.toggle('open');
        openButtonLeft.classList.toggle('active');

        // Запоминаем текущую активную кнопку
        if (openButtonLeft.classList.contains('active')) {
          activeOpenButton = openButtonLeft;
        } else {
          activeOpenButton = null;
        }
      });
    }
  });

  if (closeButtonLeft) {
    closeButtonLeft.addEventListener('click', () => {
      asideMenuLeft?.classList.toggle('open');
      if (activeOpenButton) {
        activeOpenButton.classList.toggle('active');
      }
    });
  }

  //* ========== ФУНКЦИЯ ЗАКРЫТИЯ ПАНЕЛЕЙ ==========
  function closePanel() {
    //* ====== Левая панель ======
    asideMenuLeft?.classList.remove('open');
    if (activeOpenButton) {
      activeOpenButton.classList.remove('active');
      activeOpenButton = null;
    }
    // Если переменная verticalDotsLeft определена где-то выше, раскомментируйте
    // verticalDotsLeft?.classList.remove('horizontal');
  }

  //* ========== ФУНКЦИЯ ЗАКРЫТИЯ ВСЕХ ПАНЕЛЕЙ ==========
  function closeAllPanels() {
    closePanel();
    // Здесь можно добавить закрытие других панелей
  }

  //* ========== ОБЩАЯ ФУНКЦИЯ ДЛЯ ШИРИНЫ ЭКРАНА ==========
  function checkScreenWidth() {
    if (window.innerWidth > 992) {
      closePanel();
    }
  }

  //* ========== ЗАКРЫТИЕ ПРИ СКРОЛЛЕ ==========
  let scrollTimeout;
  function handleScroll() {
    //* ====== Очищаем предыдущий таймер ======
    clearTimeout(scrollTimeout);

    //* Закрываем панели при скролле
    closeAllPanels();

    //* Дополнительно: можно добавить задержку, чтобы не закрывалось при каждом тике
    scrollTimeout = setTimeout(() => {
      closePanel();
    }, 100);
  }

  //* ========== ЗАКРЫТИЕ ПРИ КЛИКЕ ВНЕ ПАНЕЛИ ==========
  function handleClickOutside(event) {
    //* Проверяем, был ли клик вне левой панели и не по кнопке открытия
    const isLeftPanel = asideMenuLeft?.contains(event.target);

    // Проверяем, был ли клик по любой из кнопок открытия
    let isLeftButton = false;
    if (openButtonLeftAll.length > 0) {
      openButtonLeftAll.forEach((button) => {
        if (button.contains(event.target)) {
          isLeftButton = true;
        }
      });
    }

    //* Если клик был вне панели и не по кнопке
    if (!isLeftPanel && !isLeftButton) {
      closePanel();
    }
  }

  //* ====== Запускаем проверку при загрузке ======
  checkScreenWidth();

  //* ====== События ======
  window.addEventListener('resize', checkScreenWidth);
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleClickOutside);
});

//todo -------------------- [ Открытие модалок ]--------------------------------
//todo ↓↓↓ (Для Виктора)
document.addEventListener('DOMContentLoaded', () => {
  //* Элементы модальных окон
  const modalLogin = document.querySelector('.modal-login');
  const modalRegistration = document.querySelector('.modal-registration');
  const modalAuthorized = document.querySelector('.modal-authorized'); // Новая модалка для авторизованных

  //* Кнопки открытия/закрытия
  const loginButton = document.getElementById('login-btn');
  const regButton = document.querySelector('.reg-button');
  const closeButton1 = document.querySelector('.modal-login__close-button');
  const closeButton2 = document.querySelector(
    '.modal-registration__close-button'
  );
  const closeButton3 = document.querySelector(
    '.modal-authorized__close-button'
  ); // Крестик для новой модалки

  //* Функция проверки авторизации пользователя (настройте под свою логику)
  const isUserAuthenticated = () => {
    // Примеры проверки - выберите подходящий вариант:

    // Вариант 1: проверка токена в localStorage
    return localStorage.getItem('userToken') !== null;

    // Вариант 2: проверка sessionStorage
    // return sessionStorage.getItem('isLoggedIn') === 'true';

    // Вариант 3: проверка cookie
    // return document.cookie.includes('user_session=');

    // Вариант 4: глобальная переменная
    // return window.userLoggedIn || false;
  };

  //* Вспомогательные функции
  const openModal = (modal) => {
    if (modal) modal.classList.add('open-modal');
  };
  const closeModal = (modal) => {
    if (modal) modal.classList.remove('open-modal');
  };
  //* Закрытие при клике на оверлей (фон)
  const handleOverlayClick = (modal, event) => {
    if (event.target === modal) closeModal(modal);
  };
  //* Закрытие по клавише Escape
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      closeModal(modalLogin);
      closeModal(modalRegistration);
      closeModal(modalAuthorized);
    }
  };

  //* --- Назначение обработчиков (с проверкой существования элементов) ---
  //* ГЛАВНАЯ ЛОГИКА: проверка авторизации перед открытием
  const handleMainAction = () => {
    if (isUserAuthenticated()) {
      // Пользователь авторизован - открываем модалку для авторизованных
      openModal(modalAuthorized);
    } else {
      // Пользователь не авторизован - открываем модалку логина
      openModal(modalLogin);
    }
  };

  // Открытие окна логина (старая логика - можно оставить или заменить)
  if (loginButton && modalLogin) {
    // Если нужно, чтобы кнопка login-btn всегда открывала логин (без проверки)
    loginButton.addEventListener('click', () => openModal(modalLogin));

    // ИЛИ если нужно, чтобы та же кнопка проверяла авторизацию:
    // loginButton.addEventListener('click', handleMainAction);
  }

  //* Если у вас есть другая кнопка, которая должна проверять авторизацию
  const actionButton = document.querySelector('.action-button'); // Замените на ваш селектор
  if (actionButton) {
    actionButton.addEventListener('click', handleMainAction);
  }

  //* Закрытие окна логина через крестик
  if (closeButton1 && modalLogin) {
    closeButton1.addEventListener('click', () => closeModal(modalLogin));
  }

  //* Закрытие окна регистрации через крестик
  if (closeButton2 && modalRegistration) {
    closeButton2.addEventListener('click', () => closeModal(modalRegistration));
  }

  //* Закрытие окна авторизованных через крестик
  if (closeButton3 && modalAuthorized) {
    closeButton3.addEventListener('click', () => closeModal(modalAuthorized));
  }

  //* Переключение с логина на регистрацию
  if (regButton && modalLogin && modalRegistration) {
    regButton.addEventListener('click', () => {
      closeModal(modalLogin);
      openModal(modalRegistration);
    });
  }

  //* Закрытие логина по клику на фон
  if (modalLogin) {
    modalLogin.addEventListener('click', (event) =>
      handleOverlayClick(modalLogin, event)
    );
  }

  //* Закрытие регистрации по клику на фон
  if (modalRegistration) {
    modalRegistration.addEventListener('click', (event) =>
      handleOverlayClick(modalRegistration, event)
    );
  }

  //* Закрытие модалки авторизованных по клику на фон
  if (modalAuthorized) {
    modalAuthorized.addEventListener('click', (event) =>
      handleOverlayClick(modalAuthorized, event)
    );
  }

  //* Глобальное закрытие по Escape для любых открытых модалок
  document.addEventListener('keydown', handleEscape);
});
//todo Функция автоматической подстройки высоты

function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto'; // Сбрасываем высоту
  textarea.style.height = textarea.scrollHeight + 'px'; // Устанавливаем по содержимому
}

// Применяем ко всем textarea с классом select__input
function autoResizeText() {
  document.addEventListener('DOMContentLoaded', () => {
    // Функция автоматической подстройки высоты
    function autoResizeTextarea(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }

    // Применяем ко всем textarea с классом select__input
    document.querySelectorAll('.select__input').forEach((textarea) => {
      //* Инициализация
      autoResizeTextarea(textarea);

      // При вводе текста
      textarea.addEventListener('input', function () {
        autoResizeTextarea(this);
      });

      //* При изменении значения программно (например, через выбор из списка)
      const observer = new MutationObserver(function () {
        autoResizeTextarea(textarea);
      });
      observer.observe(textarea, {
        attributes: true,
        attributeFilter: ['value'],
      });
    });
  });
}

autoResizeText();

//todo ------- выпадающий список в личный кабинет (плкупатель -> ) -------------
//todo ↓↓↓ (Для Виктора)
function selectDropByer() {
  // document.addEventListener('DOMContentLoaded', () => {
  const openButton = document.querySelector('.delivery__help-info');
  const dropBox = document.querySelector('.select__drop-info');
  const item = document.querySelector('.delivery__item');
  const closeButton = document.querySelector('.close-button');

  const _toggleOpen = (el) => {
    const collapse = new ItcCollapse(item.querySelector('._collapse'));
    if (el.classList.contains('_active-collapse')) {
      el.classList.remove('_active-collapse');
      collapse.toggle();
    } else {
      el.classList.add('_active-collapse');
      collapse.toggle();
    }
  };

  // Безопасная проверка — добавляем обработчик только если кнопка существует
  if (openButton && dropBox && item) {
    openButton.addEventListener('click', () => {
      _toggleOpen(dropBox);
    });
  }

  // Безопасная проверка для кнопки закрытия
  if (closeButton && dropBox && item) {
    closeButton.addEventListener('click', () => {
      if (dropBox.classList.contains('_show')) {
        _toggleOpen(dropBox);
      }
    });
  }
  // });
}
selectDropByer();
//* ----------------------------------------------------------------------------
function handleSubmit(event) {
  event.preventDefault(); // Отменяем перезагрузку страницы
  const inn = document.getElementById('innInput').value;
  console.log('Выбран ИНН:', inn);
  // Дальше ваша логика
}
//* ----------------------------------------------------------------------------

// todo Основная функция инициализации формы поиска по ИНН
function initInnSearch() {
  const input = document.getElementById('innInput');
  const dropdown = document.getElementById('innDropdown');

  // Добавлено: проверка наличия элементов на странице
  if (!input || !dropdown) return;

  let timeoutId = null;

  function getCleanInn(value) {
    if (!value) return '';
    return value.replace(/\s/g, '').replace(/\D/g, '').substring(0, 12);
  }

  function displayOrganizations(organizationsList) {
    dropdown.innerHTML = '';

    if (organizationsList.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'inn-form__dropdown-empty';

      const titleLink = document.createElement('a');
      titleLink.className = 'inn-form__dropdown-empty-title';
      titleLink.textContent = 'Другой филиал';
      titleLink.href = '#';
      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.style.display = 'none';
        input.setAttribute('data-manual-inn', 'true');
      });

      const descSpan = document.createElement('div');
      descSpan.className = 'inn-form__dropdown-empty-desc';
      descSpan.textContent =
        'Выберите, если ИНН введен правильно, но вашего филиала нет в списке';

      emptyDiv.appendChild(titleLink);
      emptyDiv.appendChild(descSpan);
      dropdown.appendChild(emptyDiv);
      dropdown.style.display = 'block';
      return;
    }

    organizationsList.forEach((org) => {
      const item = document.createElement('div');
      item.className = 'inn-form__dropdown-item';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'inn-form__dropdown-name';
      nameSpan.textContent = org.name;

      const innKppSpan = document.createElement('span');
      innKppSpan.className = 'inn-form__dropdown-inn';
      innKppSpan.textContent = `ИНН ${org.inn} / КПП ${org.kpp}`;

      item.appendChild(nameSpan);
      item.appendChild(innKppSpan);

      item.addEventListener('click', () => {
        input.value = org.inn;
        dropdown.style.display = 'none';
      });

      dropdown.appendChild(item);
    });

    dropdown.style.display = 'block';
  }

  //todo ⚠️ Удалить полностью (это временный мок-код)
  function searchOrganizations(searchValue) {
    const cleanInn = getCleanInn(searchValue);

    if (cleanInn.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    // 🔻 СЮДА ПРИДЁТ ОТВЕТ ОТ API 🔻
    // Временный пример для проверки работы (удалишь при подключении API)
    const mockData = [
      {
        name: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ЯНДЕКС"',
        inn: '7736207543',
        kpp: '772701001',
      },
      {
        name: 'ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "СБЕРБАНК РОССИИ"',
        inn: '7707083893',
        kpp: '773601001',
      },
      {
        name: 'ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "ГАЗПРОМ"',
        inn: '7736050003',
        kpp: '997950001',
      },
      {
        name: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ОЗОН ТЕХНОЛОГИИ"',
        inn: '7708503727',
        kpp: '770801001',
      },
      {
        name: 'АКЦИОНЕРНОЕ ОБЩЕСТВО "АЛЬФА-БАНК"',
        inn: '7702079183',
        kpp: '770801001',
      },
    ].filter((org) => org.inn.startsWith(cleanInn));

    displayOrganizations(mockData);
  }

  // Функция поиска через реальное API (закомментирована)
  // async function searchOrganizations(searchValue) {
  //   const cleanInn = getCleanInn(searchValue);

  //   if (cleanInn.length < 3) {
  //     dropdown.style.display = 'none';
  //     return;
  //   }

  //   // Показываем загрузку
  //   dropdown.innerHTML =
  //     '<div class="inn-form__dropdown-empty">⏳ Поиск...</div>';
  //   dropdown.style.display = 'block';

  //   try {
  //     const response = await fetch(
  //       'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: 'Token ВАШ_ТОКЕН_СЮДА',
  //         },
  //         body: JSON.stringify({ query: cleanInn, count: 10 }),
  //       }
  //     );

  //     const data = await response.json();

  //     const organizations = data.suggestions.map((s) => ({
  //       name: s.data.name.full,
  //       inn: s.data.inn,
  //       kpp: s.data.kpp || '—',
  //     }));

  //     displayOrganizations(organizations);
  //   } catch (error) {
  //     dropdown.innerHTML =
  //       '<div class="inn-form__dropdown-empty">⚠️ Ошибка загрузки</div>';
  //     console.error('API error:', error);
  //   }
  // }
  //* --------------------------------------------------------------------------

  function handleInput() {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      searchOrganizations(input.value);
    }, 300);
  }

  function handleClickOutside(event) {
    if (!input.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.style.display = 'none';
    }
  }

  input.addEventListener('input', handleInput);
  input.addEventListener('keyup', function () {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      searchOrganizations(input.value);
    }, 300);
  });
  document.addEventListener('click', handleClickOutside);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('innInput');

  // Добавлено: проверка наличия элемента
  if (!input) return;

  const inn = input.value.replace(/\s/g, '');

  if (inn && inn.length >= 10) {
    alert('Выбран ИНН: ' + inn);
  } else {
    alert('Пожалуйста, выберите организацию из списка');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInnSearch);
} else {
  initInnSearch();
}

function innReady() {
  function initInnSearch() {
    const input = document.getElementById('innInput');
    const dropdown = document.getElementById('innDropdown');

    // Добавлено: проверка наличия элементов на странице
    if (!input || !dropdown) return;

    let timeoutId = null;

    function getCleanInn(value) {
      if (!value) return '';
      return value.replace(/\s/g, '').replace(/\D/g, '').substring(0, 12);
    }

    function displayOrganizations(organizationsList) {
      dropdown.innerHTML = '';

      if (organizationsList.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'inn-form__dropdown-empty';

        const titleLink = document.createElement('a');
        titleLink.className = 'inn-form__dropdown-empty-title';
        titleLink.textContent = 'Другой филиал';
        titleLink.href = '#';
        titleLink.addEventListener('click', (e) => {
          e.preventDefault();
          dropdown.style.display = 'none';
          input.setAttribute('data-manual-inn', 'true');
        });

        const descSpan = document.createElement('div');
        descSpan.className = 'inn-form__dropdown-empty-desc';
        descSpan.textContent =
          'Выберите, если ИНН введен правильно, но вашего филиала нет в списке';

        emptyDiv.appendChild(titleLink);
        emptyDiv.appendChild(descSpan);
        dropdown.appendChild(emptyDiv);
        dropdown.style.display = 'block';
        return;
      }

      organizationsList.forEach((org) => {
        const item = document.createElement('div');
        item.className = 'inn-form__dropdown-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'inn-form__dropdown-name';
        nameSpan.textContent = org.name;

        const innKppSpan = document.createElement('span');
        innKppSpan.className = 'inn-form__dropdown-inn';
        innKppSpan.textContent = `ИНН ${org.inn} / КПП ${org.kpp}`;

        item.appendChild(nameSpan);
        item.appendChild(innKppSpan);

        item.addEventListener('click', () => {
          input.value = org.inn;
          dropdown.style.display = 'none';
        });

        dropdown.appendChild(item);
      });

      dropdown.style.display = 'block';
    }

    //todo ⚠️ Удалить полностью (это временный мок-код)
    function searchOrganizations(searchValue) {
      const cleanInn = getCleanInn(searchValue);

      if (cleanInn.length === 0) {
        dropdown.style.display = 'none';
        return;
      }

      // 🔻 СЮДА ПРИДЁТ ОТВЕТ ОТ API 🔻
      // Временный пример для проверки работы (удалишь при подключении API)
      const mockData = [
        {
          name: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ЯНДЕКС"',
          inn: '7736207543',
          kpp: '772701001',
        },
        {
          name: 'ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "СБЕРБАНК РОССИИ"',
          inn: '7707083893',
          kpp: '773601001',
        },
        {
          name: 'ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "ГАЗПРОМ"',
          inn: '7736050003',
          kpp: '997950001',
        },
        {
          name: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ОЗОН ТЕХНОЛОГИИ"',
          inn: '7708503727',
          kpp: '770801001',
        },
        {
          name: 'АКЦИОНЕРНОЕ ОБЩЕСТВО "АЛЬФА-БАНК"',
          inn: '7702079183',
          kpp: '770801001',
        },
      ].filter((org) => org.inn.startsWith(cleanInn));

      displayOrganizations(mockData);
    }

    // Функция поиска через реальное API (закомментирована)
    // async function searchOrganizations(searchValue) {
    //   const cleanInn = getCleanInn(searchValue);

    //   if (cleanInn.length < 3) {
    //     dropdown.style.display = 'none';
    //     return;
    //   }

    //   // Показываем загрузку
    //   dropdown.innerHTML =
    //     '<div class="inn-form__dropdown-empty">⏳ Поиск...</div>';
    //   dropdown.style.display = 'block';

    //   try {
    //     const response = await fetch(
    //       'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
    //       {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //           Authorization: 'Token ВАШ_ТОКЕН_СЮДА',
    //         },
    //         body: JSON.stringify({ query: cleanInn, count: 10 }),
    //       }
    //     );

    //     const data = await response.json();

    //     const organizations = data.suggestions.map((s) => ({
    //       name: s.data.name.full,
    //       inn: s.data.inn,
    //       kpp: s.data.kpp || '—',
    //     }));

    //     displayOrganizations(organizations);
    //   } catch (error) {
    //     dropdown.innerHTML =
    //       '<div class="inn-form__dropdown-empty">⚠️ Ошибка загрузки</div>';
    //     console.error('API error:', error);
    //   }
    // }
    //* --------------------------------------------------------------------------

    function handleInput() {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        searchOrganizations(input.value);
      }, 300);
    }

    function handleClickOutside(event) {
      if (!input.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
      }
    }

    input.addEventListener('input', handleInput);
    input.addEventListener('keyup', function () {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        searchOrganizations(input.value);
      }, 300);
    });
    document.addEventListener('click', handleClickOutside);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('innInput');

    // Добавлено: проверка наличия элемента
    if (!input) return;

    const inn = input.value.replace(/\s/g, '');

    if (inn && inn.length >= 10) {
      alert('Выбран ИНН: ' + inn);
    } else {
      alert('Пожалуйста, выберите организацию из списка');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInnSearch);
  } else {
    initInnSearch();
  }
}
innReady();
//* ----------------------------------------------------------------------------
