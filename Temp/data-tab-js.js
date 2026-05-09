document.addEventListener('DOMContentLoaded', function () {
  const content = document.querySelector('.personal-data');

  function bindEvents() {
    const links = document.querySelectorAll('.tab-button');
    links.forEach((link) => {
      link.addEventListener('click', function () {
        const page = this.getAttribute('data-page');
        loadPage(page);
      });
    });
  }

  function loadPage(page) {
    fetch(`user/${page}.html`)
      .then((response) => response.text())
      .then((data) => {
        content.innerHTML = data;
        if (page === 'user-account') {
          $(document).ready(function () {
            maskPhone();
          });
        } else if (page === 'order-user') {
          itSelect();
          selectDropByer();
          autoResizeText();
        } else if (page === 'history-user') {
          itSelect();
          selectDropByer();
          autoResizeText();
          initCounter(); // нужно запустить на эиой стр.создай функцию initCounter()
        } else if (page === 'profile-user') {
          maskPhone();
        } else if (page === 'org-user') {
          $(document).ready(function () {
            innReady();
            maskInn();
          });
        }
      })
      .catch((error) => {
        // console.error('Error loading page:', error);
        content.innerHTML = 'Error loading content';
      });
  }

  bindEvents(); // Вызываем в начале, чтобы привязать события к уже существующим ссылкам
});
