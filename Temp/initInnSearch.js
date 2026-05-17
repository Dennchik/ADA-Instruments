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
