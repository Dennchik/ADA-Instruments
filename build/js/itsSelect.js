//* ================== ИНИЦИАЛИЗАЦИЯ КАСТОМНЫХ СЕЛЕКТОВ ========================

function itSelect() {
  document.querySelectorAll('[data-select]').forEach(function (selectGroup) {
    //? Функция нормализации текста (удаляет лишние пробелы и переносы)
    const normalizeText = (str) => str.replace(/\s+/g, ' ').trim();

    const itsSelects = selectGroup.querySelectorAll('.select');

    if (itsSelects) {
      itsSelects.forEach((itsSelect, selectIndex) => {
        const listItems = itsSelect.querySelectorAll('.select__list-item');
        const selectButton = itsSelect.querySelector('.select__button');
        const closeButton = itsSelect.querySelector('.close-button');
        const datePicker = document.querySelector('#deliveryDate');
        const timePicker = document.querySelector('#deliveryTime');

        let start = listItems[0];

        //* Обработчики datePicker / timePicker (без изменений)
        if (datePicker) {
          datePicker.addEventListener('click', (e) => e.stopPropagation());
          datePicker.addEventListener('change', (e) => {
            e.stopPropagation();
            console.log('Дата выбрана:', e.target.value);
          });
        }
        if (timePicker) {
          timePicker.addEventListener('click', (e) => e.stopPropagation());
          timePicker.addEventListener('change', (e) => {
            e.stopPropagation();
            console.log('Время выбрано:', e.target.value);
          });
        }

        //* ✅ Исправлено: нормализуем текст перед записью в input и атрибут
        const updateInputValue = (inputElement, rawValue) => {
          if (inputElement) {
            const cleanValue = normalizeText(rawValue);
            inputElement.value = cleanValue;
            inputElement.setAttribute('value', cleanValue);

            const hiddenInput = inputElement
              .closest('.select')
              ?.querySelector('.select__hidden-input');
            if (hiddenInput) {
              const selectedItem = Array.from(listItems).find(
                (item) => normalizeText(item.textContent) === cleanValue
              );
              const dataValue =
                selectedItem?.getAttribute('data-value') || cleanValue;
              hiddenInput.value = dataValue;
              hiddenInput.setAttribute('value', dataValue);
            }
          }
        };

        //* ✅ Исправлено: нормализуем текст при синхронизации
        const selectValue = (selectedIndex) => {
          let inputs = selectGroup.getElementsByClassName('select__input');
          const selectedText = normalizeText(start.textContent);

          for (let i = 0; i < inputs.length; i++) {
            updateInputValue(inputs[i], selectedText);
          }

          selectButton?.blur();

          itsSelects.forEach((otherSelect, otherSelectIndex) => {
            if (otherSelectIndex !== selectIndex) {
              const otherListItems =
                otherSelect.querySelectorAll('.select__list-item');
              const el_selected = otherSelect.querySelector('._selected');
              if (el_selected) el_selected.classList.remove('_selected');

              const correspondingItem = otherListItems[selectedIndex];
              if (correspondingItem)
                correspondingItem.classList.add('_selected');
            }
          });
        };

        //* ✅ Исправлено: обработка клика с нормализацией
        const handleListItemClick = (listItem, index) => {
          const el_selected = itsSelect.querySelector('._selected');
          start = listItem;
          start.focus();

          if (el_selected && el_selected !== listItem) {
            el_selected.classList.remove('_selected');
          }
          listItem.classList.add('_selected');

          const inputs = selectGroup.getElementsByClassName('select__input');
          const cleanText = normalizeText(listItem.textContent);
          for (let i = 0; i < inputs.length; i++) {
            updateInputValue(inputs[i], cleanText);
          }

          selectValue(index);

          if (itsSelect.classList.contains('_active-collapse')) {
            _toggleOpen(itsSelect);
          }
        };

        //* Остальные функции (_toggleOpen, closeBos и т.д.) без изменений
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

        const closeBos = () => {
          document.querySelectorAll('.select').forEach((el) => {
            if (el.classList.contains('_active-collapse')) _toggleOpen(el);
          });
        };

        itsSelect.addEventListener('click', function (e) {
          let target = e.target;
          if (target.closest('.select__button')) {
            const opened_select = document.querySelector('._active-collapse');
            _toggleOpen(itsSelect);
            start =
              target
                .closest('.select__button')
                .nextElementSibling?.querySelector('._selected') ||
              listItems[0];
            if (opened_select && opened_select !== itsSelect)
              _toggleOpen(opened_select);
          }
          if (
            !target.closest('.select').classList.contains('_active-collapse')
          ) {
            selectButton?.blur();
          }
        });

        if (closeButton) {
          closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            closeBos();
          });
        }

        selectGroup.addEventListener('keydown', function (e) {
          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key))
            e.preventDefault();
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

        if (listItems.length !== 0) {
          listItems.forEach((listItem, index) => {
            listItem.addEventListener('click', () =>
              handleListItemClick(listItem, index)
            );
          });
        }

        document.addEventListener('keydown', (el) => {
          if (el.key === 'Tab' || el.key === 'Escape') {
            selectButton?.blur();
            closeBos();
          }
        });

        document.addEventListener('click', (e) => {
          if (!e.target.closest('.select')) closeBos();
        });
      });
    }
  });
}
itSelect();
