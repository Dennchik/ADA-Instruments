function initInnSearch() {
  const input = document.getElementById('innInput');
  const dropdown = document.getElementById('innDropdown');

  // Проверка наличия элементов на странице
  if (!input || !dropdown) return;

  // ✅ Защита от повторной инициализации
  if (input.hasAttribute('data-inn-search-initialized')) return;
  input.setAttribute('data-inn-search-initialized', 'true');

  let timeoutId = null;

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

      item.addEventListener('click', () => {
        input.value = org.inn;
        dropdown.style.display = 'none';
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
  document.addEventListener('click', handleClickOutside);
}

initInnSearch();
