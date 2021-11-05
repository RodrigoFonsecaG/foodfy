function showContent() {
  const btns = document.querySelectorAll('.food-info .title button');
  const contentInfos = document.querySelectorAll('.food-info .info');

  btns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      contentInfos[index].classList.toggle('disabled');
      if (btn.innerHTML == 'Esconder') {
        btn.innerHTML = 'Mostrar';
      } else {
        btn.innerHTML = 'Esconder';
      }
    });
  });
}

showContent();
