// Copy buttons on command blocks. The button names what it copied, then
// returns to its label.

// The code blocks in a post come from Markdown, so they get their button here
for (const pre of document.querySelectorAll('.prose pre')) {
  const box = document.createElement('div');
  box.className = 'command';
  pre.replaceWith(box);
  const button = document.createElement('button');
  button.type = 'button';
  button.hidden = true;
  button.dataset.copy = '';
  button.textContent = 'Copy';
  box.append(pre, button);
}

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
