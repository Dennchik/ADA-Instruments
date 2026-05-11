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
function leftMenuOpenClose() {
  // Ждем полной загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const openButtonLeft = document.querySelector('._open-menu');
    const closeButtonLeft = document.querySelector('.side-menu__close-menu');
    const asideMenuLeft = document.querySelector('.aside-menu-l');
    const tabButtons = document.querySelectorAll('.tab-button');

    if (!openButtonLeft) {
      return;
    }

    if (!asideMenuLeft) {
      return;
    }

    console.log('Все элементы найдены');

    // Снимаем все старые обработчики, делаем клон и заменяем
    const newButton = openButtonLeft.cloneNode(true);
    openButtonLeft.parentNode.replaceChild(newButton, openButtonLeft);

    // Обновляем переменную
    const newOpenButton = document.querySelector('._open-menu');

    function closePanel() {
      asideMenuLeft.classList.remove('open');
      newOpenButton.classList.remove('active');
    }

    tabButtons.forEach((tabButton) => {
      tabButton.addEventListener('click', () => {
        asideMenuLeft.classList.remove('open');
      });
    });
    function openPanel() {
      asideMenuLeft.classList.add('open');
      newOpenButton.classList.add('active');
    }

    function togglePanel() {
      if (asideMenuLeft.classList.contains('open')) {
        closePanel();
      } else {
        openPanel();
      }
    }

    // Новый обработчик
    newOpenButton.addEventListener('click', function (event) {
      event.stopPropagation();
      event.preventDefault();
      togglePanel();
    });

    // Крестик
    if (closeButtonLeft) {
      const newClose = closeButtonLeft.cloneNode(true);
      closeButtonLeft.parentNode.replaceChild(newClose, closeButtonLeft);
      newClose.addEventListener('click', function (event) {
        event.stopPropagation();
        closePanel();
      });
    }

    // Закрытие при клике вне панели
    document.addEventListener('click', function (event) {
      // Проверяем существование элементов
      if (!asideMenuLeft) return;

      const isClickOnPanel = asideMenuLeft.contains(event.target);

      // Проверяем, что клик не по панели и панель открыта
      if (!isClickOnPanel && asideMenuLeft.classList.contains('open')) {
        closePanel();
      }
    });

    console.log('Инициализация завершена');
  }
}

leftMenuOpenClose();
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

//todo Применяем ко всем textarea с классом select__input
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

  // Проверка наличия элементов на странице
  if (!input || !dropdown) return;
  if (input.hasAttribute('data-inn-search-initialized')) return;
  input.setAttribute('data-inn-search-initialized', 'true');

  let timeoutId = null;
  let isSelecting = false; // 👈 ФЛАГ ДЛЯ БЛОКИРОВКИ ПОИСКА ПРИ ВЫБОРЕ

  function getCleanInn(value) {
    if (!value) return '';
    return value.replace(/\s/g, '').replace(/\D/g, '').substring(0, 12);
  }

  function displayOrganizations(organizationsList) {
    dropdown.innerHTML = '';

    if (organizationsList.length === 0) {
      const emptyDiv = document.createElement('a');
      emptyDiv.className = 'inn-form__dropdown-empty';

      const titleLink = document.createElement('div');
      titleLink.className = 'inn-form__dropdown-empty-title';
      titleLink.textContent = 'Другой филиал';
      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
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

      const addressSpan = document.createElement('span');
      addressSpan.className = 'inn-form__dropdown-address';
      addressSpan.textContent = org.address || 'Адрес не указан';

      item.appendChild(nameSpan);
      item.appendChild(innKppSpan);
      item.appendChild(addressSpan);

      item.addEventListener('click', (event) => {
        event.stopPropagation();

        isSelecting = true; // 👈 ВКЛЮЧАЕМ ФЛАГ, ЧТОБЫ НЕ ТРИГГЕРИТЬ ПОИСК

        // Вставляем отформатированный ИНН с пробелами
        const formattedInn = org.inn.replace(
          /(\d{3})(\d{3})(\d{4})/,
          '$1 $2 $3'
        );
        input.value = formattedInn;
        dropdown.style.display = 'none';

        // Выключаем флаг после того, как событие input обработается
        setTimeout(() => {
          isSelecting = false;
        }, 100);
      });

      dropdown.appendChild(item);
    });

    dropdown.style.display = 'block';
  }

  // 🔻 СЮДА ПРИДЁТ ОТВЕТ ОТ API 🔻
  // Временный пример для проверки работы (удалишь при подключении API)
  const MOCK_DATA = [
    {
      name: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ЯНДЕКС"',
      inn: '7736207543',
      kpp: '772701001',
      address: 'г Москва, ул Льва Толстого, д 16',
    },
    {
      name: 'ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "СБЕРБАНК РОССИИ"',
      inn: '7707083893',
      kpp: '773601001',
      address: 'г Москва, ул Вавилова, д 19',
    },
    {
      name: 'ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "ГАЗПРОМ"',
      inn: '7736050003',
      kpp: '997950001',
      address: 'г Санкт-Петербург, ул Набережная реки Мойки, д 16',
    },
    {
      name: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ОЗОН ТЕХНОЛОГИИ"',
      inn: '7708503727',
      kpp: '770801001',
      address: 'г Москва, пр-кт Вернадского, д 29',
    },
    {
      name: 'АКЦИОНЕРНОЕ ОБЩЕСТВО "АЛЬФА-БАНК"',
      inn: '7702079183',
      kpp: '770801001',
      address: 'г Москва, ул Каланчевская, д 27',
    },
  ];

  // Функция поиска (использует мок-данные)
  function searchOrganizations(searchValue) {
    const cleanInn = getCleanInn(searchValue);

    if (cleanInn.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    const filteredData = MOCK_DATA.filter((org) =>
      org.inn.startsWith(cleanInn)
    );
    displayOrganizations(filteredData);
  }

  // Реальная функция для API DaData (закомментирована до получения токена)
  // async function searchOrganizations(searchValue) {
  //   const cleanInn = getCleanInn(searchValue);
  //   if (cleanInn.length < 3) {
  //     dropdown.style.display = 'none';
  //     return;
  //   }
  //
  //   dropdown.innerHTML = '<div class="inn-form__dropdown-empty">⏳ Поиск...</div>';
  //   dropdown.style.display = 'block';
  //
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
  //
  //     const data = await response.json();
  //     const organizations = data.suggestions.map((s) => ({
  //       name: s.data.name.full,
  //       inn: s.data.inn,
  //       kpp: s.data.kpp || '—',
  //       address: s.data.address?.unrestricted_value || s.data.address?.value || 'Адрес не указан',
  //     }));
  //
  //     displayOrganizations(organizations);
  //   } catch (error) {
  //     dropdown.innerHTML = '<div class="inn-form__dropdown-empty">⚠️ Ошибка загрузки</div>';
  //     console.error('API error:', error);
  //   }
  // }

  function handleInput() {
    if (isSelecting) return; // 👈 ЕСЛИ ВЫБИРАЕМ ИЗ СПИСКА - ИГНОРИРУЕМ

    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      searchOrganizations(input.value);
    }, 300);
  }

  function handleClickOutside(event) {
    if (
      dropdown &&
      input &&
      !input.contains(event.target) &&
      !dropdown.contains(event.target)
    ) {
      dropdown.style.display = 'none';
    }
  }

  input.addEventListener('input', handleInput);
  document.addEventListener('click', handleClickOutside);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('innInput');

  if (!input) return;

  const inn = input.value.replace(/\s/g, '');

  if (inn && inn.length >= 10) {
    alert('Выбран ИНН: ' + inn);
  } else {
    alert('Пожалуйста, выберите организацию из списка');
  }
}

// Убираем автоматическую инициализацию, т.к. теперь всё через loadPage
// initInnSearch() больше не вызывается автоматически
//* ----------------------------------------------------------------------------

//* ----------------------------------------------------------------------------
function maskPhone() {
  if ($('.mask-phone').length) {
    $('.mask-phone').mask('+7 (999) 999-99-99');
  }
}

$(document).ready(function () {
  maskPhone();
});
//* ------------------- [ ИНН С МАСКОЙ И ПОИСКОМ ] -----------------------------
function maskInn() {
  const innInputs = document.querySelectorAll('.mask-inn-organization');

  innInputs.forEach((input) => {
    if (input.hasAttribute('data-mask-initialized')) return;
    input.setAttribute('data-mask-initialized', 'true');

    // Своя простая маска, которая не конфликтует с поиском
    input.addEventListener('input', function (e) {
      let value = this.value.replace(/\D/g, ''); // Убираем все не-цифры
      if (value.length > 10) value = value.slice(0, 10);

      // Форматируем как 123 456 7890
      let formatted = '';
      if (value.length > 0) {
        formatted = value.slice(0, 3);
        if (value.length > 3) {
          formatted += ' ' + value.slice(3, 6);
          if (value.length > 6) {
            formatted += ' ' + value.slice(6, 10);
          }
        }
      }

      // Временно отключаем событие, чтобы избежать зацикливания
      const cursorPos = this.selectionStart;
      this.value = formatted;

      // Восстанавливаем позицию курсора
      const newPos = cursorPos + (formatted.length - value.length);
      this.setSelectionRange(newPos, newPos);
    });
  });
}
