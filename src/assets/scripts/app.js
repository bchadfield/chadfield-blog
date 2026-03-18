// Responsive navigation based on Manuel Matuzovic's pattern.
const nav = document.querySelector('nav');
const list = nav.querySelector('ul');
const burgerClone = document.querySelector('#burger-template').content.cloneNode(true);

const button = burgerClone.querySelector('button');
button.addEventListener('click', () => {
  const isOpen = button.getAttribute('aria-expanded') === 'false';
  button.setAttribute('aria-expanded', isOpen);
});

const disableMenu = () => {
  button.setAttribute('aria-expanded', false);
  button.focus();
};

nav.addEventListener('keyup', event => {
  if (event.code === 'Escape') {
    disableMenu();
  }
});

document.addEventListener('click', event => {
  if (!nav.contains(event.target)) {
    disableMenu();
  }
});

nav.insertBefore(burgerClone, list);

window.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('#toggle');

  if (!themeToggle) {
    return;
  }

  themeToggle.checked = document.documentElement.hasAttribute('dark');
  themeToggle.addEventListener('change', () => {
    document.documentElement.toggleAttribute('dark');
    const theme = document.documentElement.hasAttribute('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });
});
