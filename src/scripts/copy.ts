// Copy buttons on command blocks. The button names what it copied, then
// returns to its label.
for (const button of document.querySelectorAll<HTMLButtonElement>('button[data-copy]')) {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const code = button.closest('.command')?.querySelector('code')?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Copy failed';
    }
    setTimeout(() => (button.textContent = 'Copy'), 1600);
  });
}
