document.querySelectorAll('[data-select]').forEach(function (selectGroup) {
  console.log(selectGroup);

  const itsSelects = selectGroup.querySelectorAll('.select');
  if (itsSelects) {
    itsSelects.forEach((itsSelect, selectIndex) => {
      const listItems = itsSelect.querySelectorAll('.select__list-item');
      const selectButton = itsSelect.querySelector('.select__button');
      const closeButton = itsSelect.querySelector('.close-button'); // Кнопка закрытия
      let start = listItems[0];

      // Функция для переключения активного элемента
      const selectNext = (sibling) => {
        if (sibling !== null) {
          start.classList.remove('_selected');
          sibling.focus();
          sibling.classList.add('_selected');
          start = sibling;
        }
      };

      // Переключатель классов
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

      // Закрытие всех дропдаунов
      const closeBos = () => {
        const dropDown = document.querySelectorAll('.select');
        dropDown.forEach((el) => {
          if (el.classList.contains('_active-collapse')) {
            _toggleOpen(el);
          }
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
              .nextElementSibling.querySelector('._selected') || listItems[0];

          if (opened_select && opened_select !== itsSelect) {
            _toggleOpen(opened_select);
          }
        }

        if (!target.closest('.select').classList.contains('_active-collapse')) {
          selectButton.blur();
        }
      });

      // Закрытие по кнопке close-button
      if (closeButton) {
        closeButton.addEventListener('click', function (e) {
          e.stopPropagation(); // Останавливаем всплытие события
          closeBos();
        });
      }

      // Работа с клавишами
      selectGroup.addEventListener('keydown', function (e) {
        if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key))
          e.preventDefault();

        if (e.key == 'ArrowUp') {
          let sibling =
            start.previousElementSibling || listItems[listItems.length - 1];
          selectNext(sibling);
        } else if (e.key == 'ArrowDown') {
          let sibling = start.nextElementSibling || listItems[0];
          selectNext(sibling);
        } else if (e.key == 'Enter') {
          const selectedIndex = Array.from(listItems).indexOf(start);
          selectValue(selectedIndex);
          // Убираем автоматическое закрытие при Enter
          // closeBos(); - удаляем эту строку
        }
      });

      if (listItems.length !== 0) {
        listItems.forEach(function (listItem, index) {
          listItem.addEventListener('click', function () {
            const el_selected = itsSelect.querySelector('._selected');
            start = this;
            start.focus();
            _listItem(listItem, index);
            if (el_selected && el_selected !== listItem) {
              _listItem(el_selected);
            } else {
              listItem.classList.add('_selected');
            }
            selectValue(index);
            // Убираем автоматическое закрытие при клике на элемент списка
            // список остается открытым
          });
        });

        // Функция для синхронизации
        function selectValue(selectedIndex) {
          let inputs = selectGroup.getElementsByClassName('select__input');

          for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = start.textContent;
            selectButton.blur();
          }

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
        }

        // Переключатель классов (без автоматического закрытия)
        const _listItem = (el) => {
          const collapse = new ItcCollapse(el.closest('._collapse'));
          if (el.classList.contains('_selected')) {
            el.classList.remove('_selected');
            // Убираем collapse.toggle() и удаление класса _active-collapse
            // чтобы список не закрывался
          } else {
            el.classList.add('_selected');
          }
        };
      }

      // Закрыть дропдаун при нажатии Tab или Escape
      document.addEventListener('keydown', function (el) {
        if (el.key === 'Tab' || el.key === 'Escape') {
          selectButton.blur();
          closeBos();
        }
      });

      // Закрыть дропдаун при клике снаружи (опционально, можно закомментировать)
      document.addEventListener('click', function (e) {
        const classList = e.target.classList;
        const isInsideSelect = e.target.closest('.select');

        // Если клик был вне компонента select, закрываем
        if (!isInsideSelect) {
          closeBos();
        }
      });
    });
  }
});
