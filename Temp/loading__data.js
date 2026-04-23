//todo ------------------- Функция загрузки данных -----------------------------
//* ------------------------------  ↓↓↓  ---------------------------------------
// ========== Функция загрузки данных ==========
function loadFormData() {
  const fullnameInput = document.getElementById('fullname');
  const birthdateInput = document.getElementById('birthdate');
  const cityInput = document.getElementById('city');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const addressInput = document.getElementById('address');
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const deliveryRadios = document.querySelectorAll('input[name="delivery"]');

  const savedData = localStorage.getItem('user_profile_data');

  if (!savedData) return;

  try {
    const data = JSON.parse(savedData);

    if (fullnameInput) fullnameInput.value = data.fullname || '';
    if (birthdateInput) birthdateInput.value = data.birthdate || '';
    if (cityInput) cityInput.value = data.city || '';
    if (emailInput) emailInput.value = data.email || '';
    if (phoneInput) phoneInput.value = data.phone || '';
    if (addressInput) addressInput.value = data.address || '';

    if (data.gender) {
      genderRadios.forEach((radio) => {
        if (radio.value === data.gender) radio.checked = true;
      });
    }

    if (data.delivery) {
      deliveryRadios.forEach((radio) => {
        if (radio.value === data.delivery) radio.checked = true;
      });
    }

    if (data.extraPhones && data.extraPhones.length > 0) {
      loadAllPhones(data.extraPhones);
    }
  } catch (error) {}
}

// ========== Функция сохранения данных ==========
function saveFormData() {
  const fullnameInput = document.getElementById('fullname');
  const birthdateInput = document.getElementById('birthdate');
  const cityInput = document.getElementById('city');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const addressInput = document.getElementById('address');
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const deliveryRadios = document.querySelectorAll('input[name="delivery"]');

  let selectedGender = '';
  genderRadios.forEach((radio) => {
    if (radio.checked) selectedGender = radio.value;
  });

  let selectedDelivery = '';
  deliveryRadios.forEach((radio) => {
    if (radio.checked) selectedDelivery = radio.value;
  });

  const extraPhoneInputs = document.querySelectorAll('.dynamic-phone input');
  const extraPhones = [];
  extraPhoneInputs.forEach((input) => {
    if (input.value.trim()) {
      extraPhones.push(input.value.trim());
    }
  });

  const formData = {
    fullname: fullnameInput?.value || '',
    birthdate: birthdateInput?.value || '',
    city: cityInput?.value || '',
    email: emailInput?.value || '',
    phone: phoneInput?.value || '',
    address: addressInput?.value || '',
    gender: selectedGender,
    delivery: selectedDelivery,
    extraPhones: extraPhones,
  };

  localStorage.setItem('user_profile_data', JSON.stringify(formData));
}

// ========== КОД ДЛЯ ДОБАВЛЕНИЯ ТЕЛЕФОНОВ ==========
let phoneCounter = 1;

function getProfileLine() {
  return document.querySelector('.profile__line');
}

function createPhoneRow(phoneValue = '') {
  const phoneId = `phone_extra_${Date.now()}_${phoneCounter}`;
  const currentNumber = phoneCounter;
  phoneCounter++;

  // Создаём новый profile__line-row
  const row = document.createElement('div');
  row.className = 'profile__line-row dynamic-phone-row';
  row.dataset.phoneId = phoneId;

  // Внутрь кладём поле с телефоном и кнопку удаления
  row.innerHTML = `
    <div class="profile__wrapp" style="display: flex; gap: 10px; align-items: center; width: 100%;">
      <div style="flex: 1;">
        <input class="profile__input dynamic-phone" type="tel" id="${phoneId}" 
          name="phone_extra_${currentNumber}" placeholder="+7 (999) 000-00-00" 
          value="${phoneValue.replace(/"/g, '&quot;')}"
          autocomplete="tel">
      </div>
      <div class="remove-phone-btn">
        Удалить
      </div> =>
      <button type="button" class="remove-phone-btn">
        Добавить
      </button>
      <button type="button" class="remove-phone-btn">
        Удалить
      </button>
    </div>
  `;

  const removeBtn = row.querySelector('.remove-phone-btn');
  removeBtn.addEventListener('click', () => {
    row.remove();
    renumberPhones();
    saveFormData();
  });

  const phoneInput = row.querySelector('.dynamic-phone');
  phoneInput.addEventListener('input', () => {
    saveFormData();
  });

  return row;
}

function renumberPhones() {
  const allRows = document.querySelectorAll('.dynamic-phone-row');
  allRows.forEach((row, i) => {
    const input = row.querySelector('.dynamic-phone');
    const newNumber = i + 1;
    if (input) {
      const newId = `phone_extra_${Date.now()}_${newNumber}`;
      input.id = newId;
      input.name = `phone_extra_${newNumber}`;
    }
  });
  phoneCounter = allRows.length + 1;
}

function loadAllPhones(extraPhones) {
  if (!extraPhones || extraPhones.length === 0) return;

  const profileLine = getProfileLine();
  if (!profileLine) return;

  // Удаляем существующие ряды с телефонами
  const existingRows = profileLine.querySelectorAll('.dynamic-phone-row');
  existingRows.forEach((row) => row.remove());

  phoneCounter = extraPhones.length + 1;

  extraPhones.forEach((phone) => {
    const row = createPhoneRow(phone);
    profileLine.appendChild(row);
  });
}

// ========== НАСТРОЙКА АВТОСОХРАНЕНИЯ ==========
function setupAutoSave() {
  const fullnameInput = document.getElementById('fullname');
  const birthdateInput = document.getElementById('birthdate');
  const cityInput = document.getElementById('city');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const addressInput = document.getElementById('address');
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const deliveryRadios = document.querySelectorAll('input[name="delivery"]');

  const textInputs = [
    fullnameInput,
    birthdateInput,
    cityInput,
    emailInput,
    phoneInput,
    addressInput,
  ];
  textInputs.forEach((input) => {
    if (input) {
      input.addEventListener('input', saveFormData);
      input.addEventListener('change', saveFormData);
    }
  });

  genderRadios.forEach((radio) => {
    radio.addEventListener('change', saveFormData);
  });

  deliveryRadios.forEach((radio) => {
    radio.addEventListener('change', saveFormData);
  });
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function () {
  const addPhoneIcon = document.getElementById('add-tel');

  if (addPhoneIcon) {
    addPhoneIcon.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const profileLine = getProfileLine();
      if (profileLine) {
        const newRow = createPhoneRow('');
        profileLine.appendChild(newRow);
      }
    });
  }

  loadFormData();
  setupAutoSave();

  const submitButton = document.querySelector('.form-user__button');
  const form = document.getElementById('orderForm');

  if (submitButton) {
    submitButton.addEventListener('click', function (event) {
      event.preventDefault();
      saveFormData();
      alert('Данные сохранены!');
    });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      saveFormData();
      alert('Данные сохранены!');
    });
  }
});

window.addEventListener('pageshow', function () {
  loadFormData();
});

document.addEventListener('visibilitychange', function () {
  if (!document.hidden) {
    loadFormData();
  }
});
