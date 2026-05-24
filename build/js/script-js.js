//todo ---------------------[ Date and time ]-----------------------------------
//todo 👇 (Для Виктора)
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
//todo 👇 (Для Виктора) - скрытие панелей в "Личном кабинете"
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
  }
}
document.addEventListener('DOMContentLoaded', function () {
  leftMenuOpenClose();
});
//todo -------------------- [ Открытие модалок ]--------------------------------
//todo 👇 (Для Виктора)
document.addEventListener('DOMContentLoaded', () => {
  //* Элементы модальных окон
  const modalLogin = document.querySelector('.modal-login');
  const modalRegistration = document.querySelector('.modal-registration');
  const modalAuthorized = document.querySelector('.modal-authorized');

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

  //todo Функция проверки авторизации пользователя (настройте под свою логику)
  //todo 👇 (Для Виктора)
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
    document.body.classList.add('no-scroll');
  };
  const closeModal = (modal) => {
    if (modal) modal.classList.remove('open-modal');
    document.body.classList.remove('no-scroll');
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
      // openModal(modalAuthorized);
    }
  };

  // Открытие окна логина (старая логика - можно оставить или заменить)
  if (loginButton && modalLogin) {
    // Если нужно, чтобы кнопка login-btn всегда открывала логин (без проверки)
    // loginButton.addEventListener('click', () => openModal(modalLogin));

    // ИЛИ если нужно, чтобы та же кнопка проверяла авторизацию:
    loginButton.addEventListener('click', handleMainAction);
  }

  //* Если у вас есть другая кнопка, которая должна проверять авторизацию
  const actionButton = document.querySelector('.action-button');
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

// function autoResizeTextarea(textarea) {
//   textarea.style.height = 'auto'; // Сбрасываем высоту
//   textarea.style.height = textarea.scrollHeight + 'px'; // Устанавливаем по содержимому
// }

//todo Применяем ко всем textarea с классом select__input

function autoResizeText() {
  // Функция автоматической подстройки высоты
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  // Применяем ко всем textarea с классом select__input
  document.querySelectorAll('.select__input').forEach((textarea) => {
    autoResizeTextarea(textarea);

    textarea.addEventListener('input', function () {
      autoResizeTextarea(this);
    });

    const observer = new MutationObserver(function () {
      autoResizeTextarea(textarea);
    });
    observer.observe(textarea, {
      attributes: true,
      attributeFilter: ['value'],
    });
  });
}

// Запускаем один раз после загрузки DOM
document.addEventListener('DOMContentLoaded', autoResizeText);

//todo ------- выпадающий список в личный кабинет (плкупатель -> ) -------------
//todo 👇 (Для Виктора)
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
document.addEventListener('DOMContentLoaded', function () {
  selectDropByer();
});
//* ----------------------------------------------------------------------------
function handleSubmit(event) {
  event.preventDefault(); // Отменяем перезагрузку страницы
  const inn = document.getElementById('innInput').value;
  console.log('Выбран ИНН:', inn);
  // Дальше ваша логика
}
//* ----------------------------------------------------------------------------
// todo 👇 Основная функция инициализации формы поиска по ИНН
function initInnSearch() {
  const input = document.getElementById('innInput');
  const dropdown = document.getElementById('innDropdown');

  //* 👇 Проверка наличия элементов на странице
  if (!input || !dropdown) return;

  //* 👇 Защита от повторной инициализации
  if (input.hasAttribute('data-inn-search-initialized')) return;
  input.setAttribute('data-inn-search-initialized', 'true');

  //* 👇 Таймер для debounce и флаг блокировки при выборе из списка
  let timeoutId = null;
  let isSelecting = false;

  //* 👇 Очищает ИНН от пробелов и нецифровых символов, оставляет максимум 12 цифр
  function getCleanInn(value) {
    if (!value) return '';
    return value.replace(/\s/g, '').replace(/\D/g, '').substring(0, 12);
  }

  //* 👇 Функция для замены формы на форму с данными организации
  async function replaceFormWithOrganizationData(org) {
    // Находим контейнер
    const targetContainer = document.getElementById('innForm')?.parentNode;

    if (!targetContainer) {
      console.error('Контейнер для формы не найден');
      return;
    }

    try {
      //* 👇 Загружаем контент ТОЛЬКО из файла
      const response = await fetch('./user/organizations/form-content.html');
      editBankingDetails();
      if (!response.ok) {
        throw new Error(`Ошибка загрузки файла: ${response.status}`);
      }

      let htmlContent = await response.text();

      //* 👇 Заменяем плейсхолдеры на данные организации
      htmlContent = htmlContent
        .replace(/\{\{org\.name\}\}/g, escapeHtml(org.name))
        .replace(/\{\{org\.inn\}\}/g, org.inn)
        .replace(/\{\{org\.kpp\}\}/g, org.kpp)
        .replace(
          /\{\{org\.address\}\}/g,
          escapeHtml(org.address || 'Адрес не указан')
        );

      // Создаем новую форму
      const newForm = document.createElement('form');
      newForm.id = 'organizationDataForm';
      newForm.className = 'org-form org-form__section';
      newForm.innerHTML = htmlContent;

      // Очищаем контейнер и добавляем новую форму
      targetContainer.innerHTML = '';
      targetContainer.appendChild(newForm);

      //* 👇 Вызываем функции после загрузки
      if (typeof collapseBlock === 'function') {
        collapseBlock();
      }

      // Добавляем обработчик для кнопки
      const addBtn = document.getElementById('addOrganizationBtn');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.preventDefault();
          submitOrganizationData(org);
        });
      }

      const container = document.querySelector('.org-form__name');
      if (container) {
        const popUp = container.querySelector('.pop-up');
        const button = container.querySelector('.org-form__button-edit');
        console.log(container);

        if (button && popUp) {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            popUp.classList.toggle('_show');
            //* 👇 Добавляем обработчик для закрытия по клику
            document.addEventListener('click', closeOnClick);
          });
        }

        //* 👇 Функция для закрытия модалки
        function closeModal() {
          popUp.classList.remove('_show');
          document.removeEventListener('click', closeOnClick);
        }

        //* 👇 Закрытие по клику в любом месте
        function closeOnClick(e) {
          //* 👇 Не закрываем, если клик был по кнопке или внутри popUp
          if (!popUp.contains(event.target)) {
            closeModal();
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке контента из файла:', error);
      //* 👇 Показываем сообщение об ошибке, но НЕ вставляем встроенный HTML
      targetContainer.innerHTML = `
      <div class="error-message">
        <p>Ошибка загрузки формы. Пожалуйста, обновите страницу.</p>
        <button onclick="window.backToSearch()">Вернуться к поиску</button>
      </div>
    `;
    }
  }

  //* 👇 Функция для отправки данных на сервер (временная симуляция) - удалить
  async function submitOrganizationData(org) {
    const submitBtn = document.getElementById('addOrganizationBtn');
    const orgformHeader = document.querySelector('.org-form__header');
    if (!submitBtn) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    //* 👇 СИМУЛЯЦИЯ УСПЕШНОЙ ОТПРАВКИ
    setTimeout(() => {
      console.log('Отправлены данные (симуляция):', {
        inn: org.inn,
        kpp: org.kpp,
        name: org.name,
        address: org.address,
      });

      showNotification(); //* 👇 Показываем модалку

      //* 👇 МЕНЯЕМ ТЕКСТ КНОПКИ С "Вернуться к поиску" НА "Добавить организацию"
      const backBtn = document.querySelector('.org-form__back-btn');
      if (backBtn) {
        const span = backBtn.querySelector('span');
        span.textContent = 'Добавить организацию';
        orgformHeader.classList.add('active');
      }
      //* 👇 СКРЫВАЕМ СТАРУЮ КНОПКУ "Добавить организацию" ВНИЗУ
      submitBtn.style.display = 'none';
      submitBtn.textContent = originalText;
    }, 1500); // Имитируем задержку сервера 1,5 секунду
  }

  //*todo 👇 Функция для отправки данных на сервер (раскоментировать)
  /*
  async function submitOrganizationData(org) {
    const submitBtn = document.getElementById('addOrganizationBtn');
    const orgformHeader = document.querySelector('.org-form__header');
    if (!submitBtn) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/organizations/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN':
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          inn: org.inn,
          kpp: org.kpp,
          name: org.name,
          address: org.address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(); //* 👇 Показываем модалку при успехе

        //* МЕНЯЕМ ТЕКСТ КНОПКИ С "Вернуться к поиску" НА "Добавить организацию"
        const backBtn = document.querySelector('.org-form__back-btn');
        if (backBtn) {
          const span = backBtn.querySelector('span');
          span.textContent = 'Добавить организацию';
          orgformHeader.classList.add('active');
        }
        //* СКРЫВАЕМ СТАРУЮ КНОПКУ "Добавить организацию" ВНИЗУ
        submitBtn.style.display = 'none';
        submitBtn.textContent = originalText;
      } else {
        showNotification(); //* 👇 Показываем модалку при ошибке от сервера
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      showNotification(); //* 👇 Показываем модалку при ошибке соединения
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  */

  //* 👇 Функция для возврата к поиску (глобальная)
  window.backToSearch = function () {
    const targetContainer = document.getElementById(
      'organizationDataForm'
    )?.parentNode;

    if (!targetContainer) {
      console.error('Контейнер для восстановления формы не найден');
      return;
    }

    //* 👇 Восстанавливаем форму поиска
    targetContainer.innerHTML = `
      <div class="inn-form__title">Укажите ИНН организации или ИП</div>
      <form id="innForm" onsubmit="handleSubmit(event)">
        <div class="inn-form__field">
          <div class="inn-form__wrapper">
            <div class="inn-form__input">
              <input type="text" name="innForm"     class="mask-inn-organization" id="innInput" placeholder=" "
                autocomplete="off">
              <label for="innInput" class="inn-form__label">
                <span>ИНН</span>
              </label>
            </div>
            <div class="inn-form__dropdown" id="innDropdown">
            </div>
          </div>
        </div>
      </form>
    `;
    //* 👇 Перезапускаем маску
    maskInn();

    //* Переинициализируем поиск
    initInnSearch();
  };

  //* 👇 Показывает модальное окно с уведомлением
  function showNotification(message, type = 'info') {
    const modal = document.getElementById('show-notification');
    if (!modal) return;

    const messageElement = modal.querySelector('.modal__message');
    if (messageElement) {
      messageElement.textContent = message;
    }

    modal.classList.add('active');

    //* 👇 Функция для закрытия модалки
    function closeModal() {
      modal.classList.remove('active');
      document.removeEventListener('click', closeOnClick);
    }

    //* 👇 Закрытие по клику в любом месте
    function closeOnClick() {
      closeModal();
    }

    //* 👇 Добавляем обработчик клика
    setTimeout(() => {
      document.addEventListener('click', closeOnClick);
    }, 0);

    //* 👇 Автоматическое закрытие через 7 секунд
    setTimeout(() => {
      closeModal();
    }, 8000);
  }

  //* 👇 Экранирует HTML-символы для защиты от XSS
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  //* 👇 Отображает выпадающий список с найденными организациями
  function displayOrganizations(organizationsList) {
    dropdown.innerHTML = '';

    //* 👇 Если есть результаты поиска - отображаем их
    if (organizationsList.length > 0) {
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

        //* 👇 Обработчик выбора организации из списка
        item.addEventListener('click', (event) => {
          event.stopPropagation();
          isSelecting = true;
          replaceFormWithOrganizationData(org);
          dropdown.style.display = 'none';
          setTimeout(() => {
            isSelecting = false;
          }, 100);
        });

        dropdown.appendChild(item);
      });
    }

    //* 👇 Блок "Другой филиал" - всегда внизу списка
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
      setTimeout(() => {
        isSelecting = false;
      }, 100);
    });

    const descSpan = document.createElement('div');
    descSpan.className = 'inn-form__dropdown-empty-desc';
    descSpan.textContent =
      'Выберите, если ИНН введен правильно, но вашего филиала нет в списке';

    emptyDiv.appendChild(titleLink);
    emptyDiv.appendChild(descSpan);
    dropdown.appendChild(emptyDiv);

    //* 👇 Показываем выпадающий список
    dropdown.style.display = 'block';
  }

  //* 👇  ВРЕМЕННЫЙ МОК-ДАННЫЕ ДЛЯ ПРИМЕРА
  //todo 👇 (Для Виктора) Удали эту секцию при подключении реального API DaData
  const MOCK_DATA = [
    {
      name: 'Индивидуальный предприниматель Сергеев Семён Петрович',
      inn: '402705563022',
      kpp: '772701001',
      address: '120056 г. Москва, пр. Мира, ул. Бориса Галушкина, д. 11, корп.',
    },
    {
      name: 'Общество с ограниченной ответственностью "ЯНДЕКС"',
      inn: '7736207543',
      kpp: '772701001',
      address: 'г Москва, ул Льва Толстого, д 16',
    },
    {
      name: 'Публичное акционерное общество "СБЕРБАНК РОССИИ"',
      inn: '7707083893',
      kpp: '773601001',
      address: 'г Москва, ул Вавилова, д 19',
    },
    {
      name: 'Публичное акционерное общество "ГАЗПРОМ"',
      inn: '7736050003',
      kpp: '997950001',
      address: 'г Санкт-Петербург, ул Набережная реки Мойки, д 16',
    },
    {
      name: 'Общество с ограниченной ответственностью "ОЗОН ТЕХНОЛОГИИ"',
      inn: '7708503727',
      kpp: '770801001',
      address: 'г Москва, пр-кт Вернадского, д 29',
    },
    {
      name: 'Акционерное общество "АЛЬФА-БАНК"',
      inn: '7702079183',
      kpp: '770801001',
      address: 'г Москва, ул Каланчевская, д 27',
    },
  ];

  //* 👇 Функция поиска (использует мок-данные для тестирования)
  //todo 👇 (Для Виктора) УДАЛИТЬ ЭТУ ФУНКЦИЮ ПРИ ПОДКЛЮЧЕНИИ РЕАЛЬНОГО API DaData
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

  //todo 👇 (Для виктора) РЕАЛЬНАЯ ФУНКЦИЯ ДЛЯ API DADATA
  //* 👇 Раскомментируй и вставь свой токен при подключении к реальному API
  /*
  async function searchOrganizations(searchValue) {
    const cleanInn = getCleanInn(searchValue);
    if (cleanInn.length < 3) {
      dropdown.style.display = 'none';
      return;
    }

    dropdown.innerHTML = '<div class="inn-form__dropdown-empty">⏳ Поиск...</div>';
    dropdown.style.display = 'block';

    try {
      const response = await fetch(
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ВАШ_ТОКЕН_СЮДА',
          },
          body: JSON.stringify({ query: cleanInn, count: 10 }),
        }
      );

      const data = await response.json();
      const organizations = data.suggestions.map((s) => ({
        name: s.data.name.full,
        inn: s.data.inn,
        kpp: s.data.kpp || '—',
        address: s.data.address?.unrestricted_value || s.data.address?.value || 'Адрес не указан',
      }));

      displayOrganizations(organizations);
    } catch (error) {
      dropdown.innerHTML = '<div class="inn-form__dropdown-empty">⚠️ Ошибка загрузки</div>';
      console.error('API error:', error);
    }
  }
  */

  //* 👇 Обработчик ввода текста (с debounce 300мс)
  function handleInput() {
    if (isSelecting) return;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      searchOrganizations(input.value);
    }, 300);
  }

  //* 👇 Закрывает выпадающий список при клике вне его
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
initInnSearch();
//* 👇 Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initInnSearch);
//* ----------------------------------------------------------------------------
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

//* ---------------------- [ МАСКА И ТЕЛЕФОНА ] --------------------------------
function maskPhone() {
  if ($('.mask-phone').length) {
    $('.mask-phone').mask('+7 (999) 999-99-99');
  }
}
document.addEventListener('DOMContentLoaded', maskPhone);

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

      //* Временно отключаем событие, чтобы избежать зацикливания
      const cursorPos = this.selectionStart;
      this.value = formatted;

      //* Восстанавливаем позицию курсора
      const newPos = cursorPos + (formatted.length - value.length);
      this.setSelectionRange(newPos, newPos);
    });
  });
}
document.addEventListener('DOMContentLoaded', maskInn);
function collapseBlock() {
  const formCollapseBlocks = document.querySelectorAll(
    '.org-form__bank-requisites'
  );

  formCollapseBlocks.forEach((formCollapseBlock) => {
    const regButton = formCollapseBlock.querySelector('.org-form__reg-button');

    regButton.addEventListener('click', () => {
      formCollapseBlock.classList.toggle('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', collapseBlock);
//* ----------------------------------------------------------------------------

function repairStatus() {
  const statusBlocks = document.querySelectorAll('.toggle-box');

  if (statusBlocks.length) {
    statusBlocks.forEach((statusBlock) => {
      const button = statusBlock.querySelector('.collapse-button');
      if (button) {
        button.addEventListener('click', (event) => {
          const currentButton = event.currentTarget;
          const collapseElement = currentButton
            .closest('.toggle-box')
            .querySelector('._collapse');

          if (collapseElement) {
            const collapse = new ItcCollapse(collapseElement);
            collapse.toggle();
            currentButton.classList.toggle('_active-collapse');
          }
        });
      }
    });
  }
}
document.addEventListener('DOMContentLoaded', repairStatus);
//todo ------------ [Choice Block (стр. Возврат обмен)] ------------------------

function checkBoxVisible() {
  const orderBlocks = document.querySelectorAll('.product-order');
  orderBlocks.forEach((orderBlock) => {
    if (orderBlock) {
      const checkBox = orderBlock.querySelector('.check-box__input');
      console.log('Начальное состояние:', checkBox.checked);

      checkBox.addEventListener('change', function () {
        if (checkBox.checked) {
          orderBlock.classList.add('_checked');
        } else {
          orderBlock.classList.remove('_checked');
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', checkBoxVisible);
//todo -------------- [Check Box (стр. Возврат обмен)] -------------------------
function choiceBlock() {
  const choiceBlocks = document.querySelectorAll('.choice-block');

  choiceBlocks.forEach((choiceBlock) => {
    const returnCheckbox = choiceBlock.querySelector('input[value="return"]');
    const exchangeCheckbox = choiceBlock.querySelector(
      'input[value="exchange"]'
    );
    const defaultTab = choiceBlock.querySelector('.choice-block__tab--default');
    const refundTab = choiceBlock.querySelector('.choice-block__tab--refund');
    const exchangeTab = choiceBlock.querySelector(
      '.choice-block__tab--exchange'
    );

    function hideAllTabs() {
      if (defaultTab) defaultTab.style.display = 'none';
      if (refundTab) refundTab.style.display = 'none';
      if (exchangeTab) exchangeTab.style.display = 'none';
    }

    function showDefaultTab() {
      hideAllTabs();
      if (defaultTab) defaultTab.style.display = 'block';
    }

    function showRefundTab() {
      hideAllTabs();
      if (refundTab) refundTab.style.display = 'block';
    }

    function showExchangeTab() {
      hideAllTabs();
      if (exchangeTab) exchangeTab.style.display = 'block';
    }

    // По умолчанию показываем текст
    showDefaultTab();

    if (returnCheckbox) {
      returnCheckbox.addEventListener('change', function () {
        if (this.checked) {
          if (exchangeCheckbox) exchangeCheckbox.checked = false;
          showRefundTab();
        } else {
          showDefaultTab();
        }
      });
    }

    if (exchangeCheckbox) {
      exchangeCheckbox.addEventListener('change', function () {
        if (this.checked) {
          if (returnCheckbox) returnCheckbox.checked = false;
          showExchangeTab();
        } else {
          showDefaultTab();
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', choiceBlock);

//* ----------------------------------------------------------------------------
//todo Реализация drag-and-drop загрузку фото (.load-block ) с возможностью выбора до 5 фото, превью и кнопкой удаления
//todo 👇 (Для Виктора)
function dragAndDrop() {
  const MAX_FILES = 5;

  // Находим ВСЕ блоки
  const loadBlocks = document.querySelectorAll('.load-block');

  loadBlocks.forEach((loadBlock) => {
    const uploadArea = loadBlock.querySelector('.load-block__upload-area');
    const uploadBtn = loadBlock.querySelector('.load-block__upload-btn');
    const fileInput = loadBlock.querySelector('.load-block__file-input');
    const preview = loadBlock.querySelector('.load-block__preview');

    if (!uploadArea || !uploadBtn || !fileInput || !preview) return;

    fileInput.setAttribute('multiple', '');

    function getCurrentFilesCount() {
      return preview.querySelectorAll('.load-block__preview-item').length;
    }

    function showError(message) {
      const existingError = uploadArea.querySelector('.load-block__error');
      if (existingError) existingError.remove();

      const error = document.createElement('div');
      error.className = 'load-block__error';
      error.textContent = message;
      uploadArea.appendChild(error);
      setTimeout(() => error.remove(), 3000);
    }

    function addFile(file) {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const item = document.createElement('div');
        item.className = 'load-block__preview-item';
        item.innerHTML = `
          <img class="load-block__preview-image" src="${e.target.result}" alt="preview">
          <button class="load-block__preview-remove">×</button>
        `;
        item.querySelector('.load-block__preview-remove').onclick = () => {
          item.remove();
        };
        preview.appendChild(item);
      };
      reader.readAsDataURL(file);
    }

    function handleFiles(files) {
      const currentCount = getCurrentFilesCount();
      const validFiles = files.filter((f) => f.type.startsWith('image/'));

      if (currentCount + validFiles.length > MAX_FILES) {
        showError(
          `Можно загрузить не более ${MAX_FILES} фото. Сейчас загружено ${currentCount} из ${MAX_FILES}`
        );
        return;
      }

      validFiles.forEach((file) => addFile(file));
      fileInput.value = '';
    }

    // Клик по кнопке
    uploadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });

    // Выбор файлов
    fileInput.addEventListener('change', (e) => {
      handleFiles(Array.from(e.target.files));
    });

    // Drag & Drop на всю область
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('load-block__upload-area--drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('load-block__upload-area--drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('load-block__upload-area--drag-over');
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    });
  });
}

document.addEventListener('DOMContentLoaded', dragAndDrop);
// todo  ---------------- [MODAL: Ваша заявка принята] -------------------------

function modalAccepted() {
  const button = document.querySelector('.order-doc');

  button.addEventListener('click', () => {
    const modal = document.querySelector('.modal-accepted');
    modal.classList.add('open-modal');
    setTimeout(() => {
      modal.classList.remove('open-modal');
    }, 2000);
  });
}
document.addEventListener('DOMContentLoaded', modalAccepted);
