// ------------------- responsive accessible nav by Manuel Matuzović: https://web.dev/website-navigation/
const nav = document.querySelector('nav');
const list = nav.querySelector('ul');
const burgerClone = document.querySelector('#burger-template').content.cloneNode(true);
const svg = nav.querySelector('svg');

const button = burgerClone.querySelector('button');
button.addEventListener('click', e => {
  const isOpen = button.getAttribute('aria-expanded') === 'false';
  button.setAttribute('aria-expanded', isOpen);
});

// avoid DRY: disabling menu
const disableMenu = () => {
  button.setAttribute('aria-expanded', false);
  button.focus();
};

//  close on escape
nav.addEventListener('keyup', e => {
  if (e.code === 'Escape') {
    disableMenu();
  }
});

// close if clicked outside of event target
document.addEventListener('click', e => {
  const isClickInsideElement = nav.contains(e.target);
  if (!isClickInsideElement) {
    disableMenu();
  }
});

nav.insertBefore(burgerClone, list);

// ------------------- accessible clickable cards solution by Heydon Pickering: https://inclusive-components.design/cards/

const cards = [...document.querySelectorAll('.card')];
cards.forEach(card => {
  card.style.cursor = 'pointer';
  let down,
    up,
    link = card.querySelector('a');
  card.onmousedown = () => (down = +new Date());
  card.onmouseup = () => {
    up = +new Date();
    if (up - down < 200) {
      link.click();
    }
  };
});

// const darkModeToggle = document.querySelector('#theme-toggle');
// darkModeToggle.addEventListener('click', () => {
//   document.body.classList.toggle('dark-mode');
//   const isDarkMode = document.body.classList.contains('dark-mode');
//   localStorage.setItem('theme', isDarkMode);
// });

/* Test early for local storage color scheme value to avoid FOIT */
const currentColorscheme = localStorage.getItem("theme");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
let isDark;

/* 1. is color preference already saved in local storage? */
if (currentColorscheme == "dark" || !currentColorscheme && prefersDarkScheme.matches) {
  document.documentElement.setAttribute("dark", true);
  isDark = true;
}

window.addEventListener("DOMContentLoaded", (event) => {
  // Header color scheme toggle (light/dark modes)
  const csToggle = document.querySelector(".dark-toggle");

  if (isDark) {
    csToggle.checked = true;
  }

  if (csToggle) {
    csToggle.addEventListener("change", () => {
      document.documentElement.toggleAttribute("dark");
      let cs = "light";
      if (document.documentElement.hasAttribute("dark")) {
        cs = "dark";
      }
      localStorage.setItem("theme", cs);
    });
  }
});