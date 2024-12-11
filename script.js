const button = document.getElementById('startButton');
const image = document.getElementById('image');

button.addEventListener('click', () => {
  image.classList.add('enlarge');
});