const button = document.getElementById('startButton');
const audio = new Audio('sfx/dream__univ_lyon3.wav');

button.addEventListener('click', () => {
  audio.play(); // Play the sound
  // Add the class to hide the button after 2 seconds
  setTimeout(() => {
    button.style.display = 'none';
    document.body.classList.add('new-background'); // Add the class to set the background
  }, 1000);
});