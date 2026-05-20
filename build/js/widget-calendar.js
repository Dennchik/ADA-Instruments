(function () {
  let currentDate = new Date();
  const monthNames = [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ];

  const container = document.querySelector('.widget-calendar');
  if (!container) return;

  const monthYearSpan = container.querySelector('.widget-month-year');
  const daysContainer = container.querySelector('.widget-days');
  const prevBtn = container.querySelector('.widget-prev');
  const nextBtn = container.querySelector('.widget-next');

  function render() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYearSpan.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    let startOffset = firstDay.getDay();
    startOffset = startOffset === 0 ? 6 : startOffset - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    daysContainer.innerHTML = '';

    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement('div');
      empty.style.opacity = '0';
      daysContainer.appendChild(empty);
    }

    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const dayDiv = document.createElement('div');
      dayDiv.textContent = d;
      dayDiv.style.padding = '4px 0';
      dayDiv.style.borderRadius = '4px';
      dayDiv.style.cursor = 'pointer';

      // Суббота и воскресенье – красные
      const currentDay = new Date(year, month, d);
      const weekday = currentDay.getDay();
      const isWeekend = weekday === 0 || weekday === 6;
      if (isWeekend) {
        dayDiv.style.color = 'red';
      }

      // Подсветка текущего дня
      if (isCurrentMonth && d === todayDate) {
        dayDiv.style.backgroundColor = '#dbdbdb';
        dayDiv.style.color = 'red';
        dayDiv.style.fontWeight = 'bold';
      }

      // Прошедшие дни в текущем месяце – полупрозрачные
      if (isCurrentMonth && d < todayDate) {
        dayDiv.style.opacity = '0.6';
      }

      dayDiv.addEventListener('mouseenter', () => {
        if (
          !dayDiv.style.backgroundColor ||
          dayDiv.style.backgroundColor !== 'rgb(74, 144, 226)'
        ) {
          dayDiv.style.backgroundColor = '#f0f0f0';
        }
      });
      dayDiv.addEventListener('mouseleave', () => {
        if (!(isCurrentMonth && d === todayDate)) {
          dayDiv.style.backgroundColor = '';
        }
      });

      daysContainer.appendChild(dayDiv);
    }
  }

  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    render();
  });
  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    render();
  });

  render();
})();
