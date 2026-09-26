(() => {
  const style = document.createElement('style');
  style.textContent = `
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; appearance: none; margin: 0; }
    input[type="number"] { -moz-appearance: textfield; }
    .password-control { position: relative; display: flex; align-items: center; }
    .password-control input { padding-right: 3rem !important; width: 100%; }
    .password-toggle { position: absolute; right: .55rem; top: 50%; transform: translateY(-50%); width: 2rem; height: 2rem; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: currentColor; background: transparent; cursor: pointer; font-size: 1rem; line-height: 1; }
    .password-toggle:hover { background: rgba(212, 175, 55, .14); }
    .password-toggle:focus-visible { outline: 2px solid #d4af37; outline-offset: 2px; }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('input[type="password"]').forEach(input => {
    if (input.parentElement.classList.contains('password-control')) return;
    const wrapper = document.createElement('span');
    wrapper.className = 'password-control';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'password-toggle';
    toggle.textContent = '\ud83d\udc41';
    toggle.setAttribute('aria-label', 'Show password');
    toggle.setAttribute('title', 'Show password');
    toggle.addEventListener('click', () => {
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
      toggle.setAttribute('title', visible ? 'Show password' : 'Hide password');
    });
    wrapper.appendChild(toggle);
  });
})();
