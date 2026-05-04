//* ================== ИНИЦИАЛИЗАЦИЯ КАСТОМНЫХ СЕЛЕКТОВ ========================
document.querySelectorAll('[data-select]').forEach(function (selectGroup) {
  //* ПОЛУЧАЕМ ВСЕ СЕЛЕКТЫ В ГРУППЕ
  const itsSelects = selectGroup.querySelectorAll('.select');

  if (itsSelects) {
    itsSelects.forEach((itsSelect, selectIndex) => {
      const listItems = itsSelect.querySelectorAll('.select__list-item');
      const selectButton = itsSelect.querySelector('.select__button');
      const closeButton = itsSelect.querySelector('.close-button');
      //* ----------------------------------------------------------------------
      const datePicker = document.querySelector('#deliveryDate');
      const timePicker = document.querySelector('#deliveryTime');

      let start = listItems[0];

      //* ✅ НОВОЕ: Выбор Даты и времени обновления значения input и атрибута value
      if (datePicker) {
        datePicker.addEventListener('click', (e) => {
          e.stopPropagation(); // Останавливаем всплытие
        });

        datePicker.addEventListener('change', (e) => {
          e.stopPropagation();
          console.log('Дата выбрана:', e.target.value);
          //* Не закрываем дропдаун
        });
      }

      if (timePicker) {
        timePicker.addEventListener('click', (e) => {
          e.stopPropagation();
        });

        timePicker.addEventListener('change', (e) => {
          e.stopPropagation();
          console.log('Время выбрано:', e.target.value);
          //* Не закрываем дропдаун
        });
      }
      //* ✅ НОВОЕ: Функция обновления значения input и атрибута value
      const updateInputValue = (inputElement, newValue) => {
        if (inputElement) {
          inputElement.value = newValue;
          inputElement.setAttribute('value', newValue); //* <- ВАЖНО: обновляем атрибут

          //* ✅ НОВОЕ: Обновляем скрытый input если есть
          const hiddenInput = inputElement
            .closest('.select')
            ?.querySelector('.select__hidden-input');
          if (hiddenInput) {
            const selectedItem = Array.from(listItems).find(
              (item) => item.textContent === newValue
            );
            const dataValue =
              selectedItem?.getAttribute('data-value') || newValue;
            hiddenInput.value = dataValue;
            hiddenInput.setAttribute('value', dataValue);
          }
        }
      };

      //* ✅ ИЗМЕНЕНО: Функция синхронизации всех селектов
      const selectValue = (selectedIndex) => {
        let inputs = selectGroup.getElementsByClassName('select__input');
        const selectedText = start.textContent;

        //* Обновляем все inputs в группе
        for (let i = 0; i < inputs.length; i++) {
          updateInputValue(inputs[i], selectedText); //* <- ИСПОЛЬЗУЕМ НОВУЮ ФУНКЦИЮ
        }

        selectButton?.blur();

        //* Синхронизация выбранных элементов в других селектах
        itsSelects.forEach((otherSelect, otherSelectIndex) => {
          if (otherSelectIndex !== selectIndex) {
            const otherListItems =
              otherSelect.querySelectorAll('.select__list-item');
            const el_selected = otherSelect.querySelector('._selected');

            if (el_selected) {
              el_selected.classList.remove('_selected');
            }

            const correspondingItem = otherListItems[selectedIndex];
            if (correspondingItem) {
              correspondingItem.classList.add('_selected');
            }
          }
        });
      };

      //* ✅ НОВОЕ: Функция для обработки клика по элементу списка
      const handleListItemClick = (listItem, index) => {
        const el_selected = itsSelect.querySelector('._selected');
        start = listItem;
        start.focus();

        //* Убираем выделение с предыдущего
        if (el_selected && el_selected !== listItem) {
          el_selected.classList.remove('_selected');
        }

        //* Выделяем текущий
        listItem.classList.add('_selected');

        //* ✅ ВАЖНО: Обновляем значение во всех inputs
        const inputs = selectGroup.getElementsByClassName('select__input');
        for (let i = 0; i < inputs.length; i++) {
          updateInputValue(inputs[i], listItem.textContent);
        }

        selectValue(index);

        //* ✅ ЗАКРЫТИЕ ДРОПДАУНА: дропдаун после выбора
        if (itsSelect.classList.contains('_active-collapse')) {
          _toggleOpen(itsSelect);
        }
      };

      //* Переключатель классов (без изменений)
      const _toggleOpen = (el) => {
        const collapse = new ItcCollapse(
          el.closest('.select').querySelector('._collapse')
        );
        if (el.classList.contains('_active-collapse')) {
          el.classList.remove('_active-collapse');
          collapse.toggle();
        } else {
          el.classList.add('_active-collapse');
          collapse.toggle();
        }
      };

      //* Закрытие всех дропдаунов (без изменений)
      const closeBos = () => {
        const dropDown = document.querySelectorAll('.select');
        dropDown.forEach((el) => {
          if (el.classList.contains('_active-collapse')) {
            _toggleOpen(el);
          }
        });
      };

      //* Обработчик клика на селект (без изменений)
      itsSelect.addEventListener('click', function (e) {
        let target = e.target;

        if (target.closest('.select__button')) {
          const opened_select = document.querySelector('._active-collapse');
          _toggleOpen(itsSelect);
          start =
            target
              .closest('.select__button')
              .nextElementSibling?.querySelector('._selected') || listItems[0];

          if (opened_select && opened_select !== itsSelect) {
            _toggleOpen(opened_select);
          }
        }

        if (!target.closest('.select').classList.contains('_active-collapse')) {
          selectButton?.blur();
        }
      });

      //* Закрытие по кнопке close-button (без изменений)
      if (closeButton) {
        closeButton.addEventListener('click', function (e) {
          e.stopPropagation();
          closeBos();
        });
      }

      //* Работа с клавишами (без изменений)
      selectGroup.addEventListener('keydown', function (e) {
        if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
          e.preventDefault();
        }

        if (e.key == 'ArrowUp') {
          let sibling =
            start.previousElementSibling || listItems[listItems.length - 1];
          if (sibling) {
            start.classList.remove('_selected');
            sibling.focus();
            sibling.classList.add('_selected');
            start = sibling;
          }
        } else if (e.key == 'ArrowDown') {
          let sibling = start.nextElementSibling || listItems[0];
          if (sibling) {
            start.classList.remove('_selected');
            sibling.focus();
            sibling.classList.add('_selected');
            start = sibling;
          }
        } else if (e.key == 'Enter') {
          const selectedIndex = Array.from(listItems).indexOf(start);
          selectValue(selectedIndex);
        }
      });

      //* Обработчики для элементов списка
      if (listItems.length !== 0) {
        listItems.forEach(function (listItem, index) {
          //* ✅ ИЗМЕНЕНО: используем новую функцию handleListItemClick
          listItem.addEventListener('click', function () {
            handleListItemClick(listItem, index);
          });
        });
      }

      //* Закрыть дропдаун при нажатии Tab или Escape (без изменений)
      document.addEventListener('keydown', function (el) {
        if (el.key === 'Tab' || el.key === 'Escape') {
          selectButton?.blur();
          closeBos();
        }
      });

      //* Закрыть дропдаун при клике снаружи (без изменений)
      document.addEventListener('click', function (e) {
        const isInsideSelect = e.target.closest('.select');
        if (!isInsideSelect) {
          closeBos();
        }
      });
    });
  }
});
