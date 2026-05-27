//* ============ ГЛОБАЛЬНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ СЧЁТЧИКА КОРЗИНЫ ================
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
    cartQuantity.style.display = totalQuantity > 0 ? 'block' : 'none';
  }

  const sideMenuTovara = document.querySelector('.side-menu__col-tovara');
  if (sideMenuTovara) {
    sideMenuTovara.textContent = totalQuantity;
    sideMenuTovara.style.display = totalQuantity > 0 ? 'block' : 'none';
  }
};

//* ================= ИНИЦИАЛИЗАЦИЯ СЧЁТЧИКОВ В КАТАЛОГЕ =======================
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

//* =============== ИНИЦИАЛИЗАЦИЯ ВСЕХ ОСТАЛЬНЫХ СЧЁТЧИКОВ =====================
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

//* ==================== ЛОГИКА ДЛЯ СТРАНИЦЫ КОРЗИНЫ ===========================
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

//* =============== ЕДИНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ СЧЁТЧИКА ======================
function initCounter() {
  initCatalogCounters();
  initOtherCounters();
  if (document.querySelector('.cart-page')) {
    initCartPageSpecific();
  }
}

//* Запускаем после загрузки страницы
document.addEventListener('DOMContentLoaded', function () {
  initCounter();
});

//todo ============== ОБЩИЙ ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =======================
//* ----------------- Личный кабинет (загрузка контента) -----------------------

//todo -------- Показ модального окна (мои заказы - отмена заказа) -------------
function showRejectModal() {
  const buttons = document.querySelectorAll('.cancel-order');
  const modal = document.querySelector('.modal-rejection');
  const closeModal = document.getElementById('closeModalBtn');
  const submitBtn = document.getElementById('submitBtn');
  const form = document.getElementById('rejectForm');

  if (!modal) return;

  // 👇 Закрытие по крестику
  if (closeModal) {
    closeModal.onclick = () => modal.classList.remove('open');
  }

  // 👇 Закрытие по клику на фон
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('open');
  };

  // 👇 Открытие по кнопкам отмены
  buttons.forEach((button) => {
    button.onclick = () => modal.classList.add('open');
  });

  // 👇 Симуляция отправки формы
  if (submitBtn && form) {
    submitBtn.onclick = () => {
      // Получаем выбранную причину
      const selectedReason = form.querySelector('input[name="reason"]:checked');
      const otherReasonText =
        document.getElementById('otherReason')?.value || '';

      let reasonValue = '';
      if (selectedReason) {
        reasonValue = selectedReason.value;
      }

      // 👇 Показываем состояние загрузки (опционально)
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';

      // 👇 Симуляция задержки сервера
      setTimeout(() => {
        // Сбрасываем форму
        form.reset();

        // 👇 Закрываем модалку
        modal.classList.remove('open');

        // 👇 Возвращаем кнопку в исходное состояние
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отменить заказ';
      }, 2000);
    };
  }
}

document.addEventListener('DOMContentLoaded', function () {
  showRejectModal();
});

//todo ----------- Показ pop-up окна (Редактировать реквизиты) -----------------
function editBankingDetails() {}
//todo ----------------- Показ pop-up окна (Сроки работ) -----------------------
function timeWorks() {
  const button = document.querySelector('.categiries-content__info');
  const popUp = document.querySelector('.categiries-content__pop-up');
  const closeButton = document.querySelector('.categiries-content__button');
  let closeTimeout;

  if (!button || !popUp) return;

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    clearTimeout(closeTimeout);
    popUp.classList.toggle('_show');
  });

  closeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    closePopup();
  });

  function closePopup() {
    popUp.classList.remove('_show');
  }

  //* Закрытие при клике вне
  document.addEventListener('click', (event) => {
    if (popUp.classList.contains('_show')) {
      if (!popUp.contains(event.target) && !button.contains(event.target)) {
        closePopup();
      }
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popUp.classList.contains('_show')) {
      closePopup();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  timeWorks();
});

//todo ------ КЛАСС ДЛЯ УПРАВЛЕНИЯ ПРОГРЕСС-БАРОМ СТАТУСОВ ЗАКАЗА --------------
//* КОНСТРУКТОР - ИНИЦИАЛИЗАЦИЯ ПРИ СОЗДАНИИ ОБЪЕКТА
class ProgressBarManager {
  constructor() {
    //* Словарь соответствия статусов и индексов (позиция в прогресс-баре)
    //* Индексы: 0 - первый этап, 1 - второй, 2 - третий, 3 - четвёртый, 4 - пятый
    this.statusMap = {
      Приём: 0, // Начальный статус (0%)
      'Принято СЦ': 1, // Сервисный центр принял (25%)
      'В ремонте': 2, // Ремонт в процессе (50%)
      'Готово к выдаче': 3, // Ремонт завершён (75%)
      'Выдано СЦ': 4, // Заказ выдан клиенту (100%)
    };
    //* Поиск всех DOM-элементов прогресс-бара на странице
    this.elements = {
      fill: document.querySelector('.progress-bar__fill'),
      labels: document.querySelectorAll('.progress-bar__label'),
      stages: document.querySelectorAll('.progress-bar__stage'),
      percent: document.querySelector('.progress-bar__percent'),
    };

    //* ========== НАСТРОЙКИ (меняй здесь) ==========
    this.useRealServer = false; // TODO (Для Виктора): true - реальный сервер, false - тестовый режим (без API)
    this.testStatus = 'Готово к выдаче'; // TODO (Для Виктора): это временно, для тестов,(не удалять)
  }
  //* ==========================================================================
  //* ОСНОВНОЙ МЕТОД ОБНОВЛЕНИЯ СТАТУСА
  //* Вызывается при получении нового статуса с сервера или из тестового режима
  //* @param {string} status - текст статуса ('Приём', 'В ремонте' и т.д.)
  //* ==========================================================================

  updateStatus(status) {
    const index = this.statusMap[status];

    if (index === undefined) {
      throw new Error(`Неизвестный статус: ${status}`);
    }

    // Проценты: 10%, 30%, 50%, 70%, 100%
    const percentMap = [10, 30, 50, 70, 100];
    const percent = percentMap[index];

    setTimeout(() => {
      //* Анимированное обновление прогресса
      this.animateProgress(percent);
    }, 500);
    //* Обновляем активные классы
    this.updateActiveElements(index);

    //* Обновляем отображение процента
    if (this.elements.percent) {
      this.elements.percent.textContent = `${percent}%`;
    }
  }
  //* ==========================================================================
  //* АНИМАЦИЯ ЗАПОЛНЕНИЯ ПОЛОСКИ ПРОГРЕССА
  //* @param {number} targetPercent - целевой процент (0-100)
  //* ==========================================================================
  animateProgress(targetPercent) {
    if (!this.elements.fill) return;

    const currentPercent = parseFloat(this.elements.fill.style.width) || 0;
    const duration = 500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const newPercent =
        currentPercent + (targetPercent - currentPercent) * easeOutCubic;

      this.elements.fill.style.width = `${newPercent}%`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
  //* ==========================================================================
  //* ПОДСВЕТКА АКТИВНЫХ ЭЛЕМЕНТОВ ПРОГРЕСС-БАРА
  //* Добавляет класс 'active' к текущему этапу и убирает с остальных
  //* @param {number} activeIndex - индекс активного этапа (0-4)
  //* ==========================================================================
  updateActiveElements(activeIndex) {
    //* Обрабатываем метки дат (progress-bar__label)
    this.elements.labels.forEach((label, index) => {
      if (index === activeIndex) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });
    //* Обрабатываем названия этапов (progress-bar__stage)
    this.elements.stages.forEach((stage, index) => {
      if (index === activeIndex) {
        stage.classList.add('active'); // Добавляем активный класс
      } else {
        stage.classList.remove('active'); // Убираем с остальных
      }
    });
  }

  // TODO (Для Виктора): метод для получения статуса с сервера - нужно реализовать API endpoint
  async fetchStatus(endpoint) {
    try {
      // TODO (Для Виктора): ожидается ответ от сервера в формате:
      // {
      //   "status": "Приём" | "Принято СЦ" | "В ремонте" | "Готово к выдаче" | "Выдано СЦ"
      // }
      //* Отправляем GET-запрос на сервер
      const response = await fetch(endpoint);
      //* Проверяем, успешно ли завершился запрос
      if (!response.ok) throw new Error('Ошибка сети');
      //* Преобразуем ответ в JSON
      const data = await response.json();
      //* Обновляем прогресс-бар полученным статусом
      this.updateStatus(data.status);
      return data;
    } catch (error) {
      //* Логируем ошибку в консоль для отладки
      console.error('Ошибка при получении статуса:', error);
      throw error;
    }
  }
  //* ==========================================================================
  //* ПЕРИОДИЧЕСКИЙ ОПРОС СЕРВЕРА (ПОЛЛИНГ)
  //* Автоматически запрашивает статус каждые N секунд
  //* @param {string} endpoint - URL API
  //* @param {number} interval - интервал опроса в миллисекундах (по умолчанию 5000 = 5 сек)
  //* ==========================================================================
  startPolling(endpoint, interval = 5000) {
    //* Сразу получаем статус при запуске
    this.fetchStatus(endpoint);

    //* Запускаем интервал для периодических запросов
    this.pollingInterval = setInterval(() => {
      this.fetchStatus(endpoint);
    }, interval);
  }
  //* ==========================================================================
  //* ОСТАНОВКА ПЕРИОДИЧЕСКОГО ОПРОСА
  //* Вызывается, когда нужно прекратить обновление статуса
  //* ==========================================================================
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null; // Очищаем переменную
    }
  }

  //* ==========================================================================
  //* ЗАПУСК ПРОГРЕСС-БАРА С АВТООПРЕДЕЛЕНИЕМ РЕЖИМА
  //* Самый главный метод - его нужно вызвать для инициализации
  //* @param {string} endpoint - URL API (используется только в реальном режиме)
  //* ==========================================================================
  async start(endpoint = '/api/order/status/123') {
    if (this.useRealServer) {
      //* Режим реального сервера
      console.log('🟢 Режим: Реальный сервер');
      await this.fetchStatus(endpoint);
    } else {
      //* Тестовый режим
      console.log('🟡 Режим: Тестовый (без сервера)');
      //* Просто показываем тестовый статус без запросов к API
      this.updateStatus(this.testStatus);
    }
  }
}

//* ============================================================================
//* ИНИЦИАЛИЗАЦИЯ И ЗАПУСК ПРОГРЕСС-БАРА
//* ============================================================================

//* Создаём экземпляр менеджера прогресс-бара
const progressBar = new ProgressBarManager();

//* Запускаем при загрузке страницы
//* Ждём полной загрузки DOM-дерева страницы
document.addEventListener('DOMContentLoaded', () => {
  // TODO (Для Виктора): заменить '/api/order/status/123' на реальный endpoint бэкэнда
  progressBar.start('/api/order/status/123');
});
