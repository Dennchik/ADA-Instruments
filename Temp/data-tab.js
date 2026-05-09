/**
 * Скрипт для работы табов
 *
 * Ожидается структура:
 * - Кнопки с классом "tab-button" и атрибутом data-tab="имя_таба"
 * - Блоки с классом "tab-content" и атрибутом data-tab="имя_таба"
 *
 * При клике на кнопку:
 * - у всех кнопок удаляется класс "active"
 * - у всех блоков удаляется класс "active"
 * - выбранной кнопке и соответствующему блоку добавляется класс "active"
 */

document.addEventListener('DOMContentLoaded', function () {
  // Находим все кнопки табов
  const tabButtons = document.querySelectorAll('.tab-button');
  const asideMenu = document.querySelector('.aside-menu-l');

  // Находим все блоки контента
  const tabContents = document.querySelectorAll('.inner-content');

  // Функция для показа конкретного таба
  function showTab(tabId) {
    // Удаляем активный класс у всех кнопок
    tabButtons.forEach((button) => {
      button.classList.remove('active-link');
    });

    // Удаляем активный класс у всех блоков контента
    tabContents.forEach((content) => {
      content.classList.remove('active');
    });

    // Находим кнопку с нужным data-tab и добавляем ей active
    const activeButton = document.querySelector(
      `.tab-button[data-tab="${tabId}"]`
    );
    if (activeButton) {
      activeButton.classList.add('active-link');
    }

    // Находим блок контента с нужным data-tab и добавляем ему active
    const activeContent = document.querySelector(
      `.inner-content[data-tab="${tabId}"]`
    );
    if (activeContent) {
      activeContent.classList.add('active');
    }
  }

  // Вешаем обработчики на каждую кнопку
  tabButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');
      if (tabId) {
        showTab(tabId);
      }

      if (asideMenu.classList.contains('open')) {
        asideMenu.classList.remove('open');
      }
    });
  });

  // Опционально: показать первый таб по умолчанию
  // Раскомментируйте, если нужно, чтобы первый таб был активен при загрузке

  if (tabButtons.length > 0) {
    const firstTabId = tabButtons[0].getAttribute('data-tab');
    if (firstTabId) {
      showTab(firstTabId);
    }
  }
});
