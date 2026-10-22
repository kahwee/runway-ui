/** Fixed-height virtual inventory. Host supplies items; no HTML strings or game rules. */
export function createInventory(root, {
  items,
  columns = 6,
  rowHeight = 92,
  overscan = 1,
  onSelect = () => {},
}) {
  if (!Number.isInteger(columns) || columns < 1) {
    throw new RangeError('columns must be a positive integer');
  }
  if (!Number.isFinite(rowHeight) || rowHeight < 32) {
    throw new RangeError('rowHeight must be at least 32 pixels');
  }
  if (!Number.isInteger(overscan) || overscan < 0) {
    throw new RangeError('overscan must be a non-negative integer');
  }

  let data = [...items], active = 0, selected = -1;
  let firstRendered = -1, lastRendered = -1, destroyed = false;
  const attributes = ['role', 'tabindex', 'aria-label', 'aria-rowcount', 'aria-colcount'];
  const originalAttributes = new Map(attributes.map(name => [name, root.getAttribute(name)]));
  const properties = ['--rw-columns', '--rw-row-height'];
  const originalProperties = new Map(properties.map(name => [name, {
    value: root.style.getPropertyValue(name),
    priority: root.style.getPropertyPriority(name),
  }]));
  const hadClass = root.classList.contains('rw-virtual');

  root.classList.add('rw-virtual');
  root.style.setProperty('--rw-columns', columns);
  root.style.setProperty('--rw-row-height', `${rowHeight}px`);
  root.setAttribute('role', 'grid');
  root.setAttribute('aria-colcount', columns);
  root.setAttribute('aria-label', originalAttributes.get('aria-label') ?? 'Inventory');

  function spacer(height) {
    const element = document.createElement('div');
    element.style.height = `${height}px`;
    element.setAttribute('aria-hidden', 'true');
    return element;
  }

  function cellFor(item, index, column) {
    const cell = document.createElement('div');
    cell.className = 'rw-virtual__cell';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-colindex', column + 1);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'rw-slot';
    button.dataset.index = index;
    button.tabIndex = index === active ? 0 : -1;
    button.setAttribute('aria-pressed', String(index === selected));

    const icon = document.createElement('span');
    icon.className = 'rw-slot__icon';
    const name = item.icon ?? 'cube';
    // A Phosphor icon name (see styles/icons.css) draws an icon; any other string is shown as text.
    if (/^[a-z][a-z-]*$/.test(name)) { const glyph = document.createElement('span'); glyph.className = 'rw-icon'; glyph.dataset.icon = name; glyph.dataset.weight = 'duotone'; glyph.dataset.size = 'lg'; icon.append(glyph); }
    else icon.textContent = name;
    icon.setAttribute('aria-hidden', 'true');
    const label = document.createElement('small');
    label.textContent = item.label;
    button.append(icon, label);
    cell.append(button);
    return cell;
  }

  function render(force = false, focus = false) {
    if (destroyed) return;
    const totalRows = Math.ceil(data.length / columns);
    const first = Math.min(Math.max(0, totalRows - 1), Math.max(0, Math.floor(root.scrollTop / rowHeight) - overscan));
    const last = Math.min(totalRows, Math.ceil((root.scrollTop + root.clientHeight) / rowHeight) + overscan);
    root.setAttribute('aria-rowcount', totalRows);
    if (!force && first === firstRendered && last === lastRendered) return;
    firstRendered = first;
    lastRendered = last;

    const fragment = document.createDocumentFragment();
    fragment.append(spacer(first * rowHeight));
    for (let row = first; row < last; row++) {
      const line = document.createElement('div');
      line.className = 'rw-virtual__row';
      line.setAttribute('role', 'row');
      line.setAttribute('aria-rowindex', row + 1);
      for (let column = 0; column < columns; column++) {
        const index = row * columns + column;
        if (index >= data.length) break;
        line.append(cellFor(data[index], index, column));
      }
      fragment.append(line);
    }
    fragment.append(spacer((totalRows - last) * rowHeight));
    root.replaceChildren(fragment);
    const target = root.querySelector(`[data-index="${active}"]`);
    root.tabIndex = target ? -1 : 0;
    if (focus) (target ?? root).focus({ preventScroll: true });
  }

  function move(direction) {
    if (destroyed || !data.length) return;
    const page = columns * Math.max(1, Math.floor(root.clientHeight / rowHeight));
    const delta = { left: -1, right: 1, up: -columns, down: columns, pageup: -page, pagedown: page }[direction] ?? 0;
    active = direction === 'first' ? 0 : direction === 'last' ? data.length - 1
      : Math.max(0, Math.min(data.length - 1, active + delta));
    const top = Math.floor(active / columns) * rowHeight;
    if (top < root.scrollTop) root.scrollTop = top;
    else if (top + rowHeight > root.scrollTop + root.clientHeight) root.scrollTop = top + rowHeight - root.clientHeight;
    render(true, true);
  }

  function activate() {
    if (destroyed || !data[active]) return;
    selected = active;
    render(true, true);
    onSelect(data[active], active);
  }
  function clicked(event) {
    const button = event.target.closest('button[data-index]');
    if (!button || !root.contains(button)) return;
    active = Number(button.dataset.index);
    activate();
  }
  function keydown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const action = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', Home: 'first', End: 'last', PageUp: 'pageup', PageDown: 'pagedown' }[event.key];
    if (action) { event.preventDefault(); move(action); }
  }
  function focused(event) {
    const button = event.target.closest('button[data-index]');
    if (!button || !root.contains(button)) return;
    active = Number(button.dataset.index);
    for (const element of root.querySelectorAll('button[data-index]')) {
      element.tabIndex = Number(element.dataset.index) === active ? 0 : -1;
    }
  }
  function scrolled() { render(false, root.contains(document.activeElement)); }
  const observer = new ResizeObserver(() => render(true, root.contains(document.activeElement)));
  observer.observe(root);
  root.addEventListener('scroll', scrolled);
  root.addEventListener('keydown', keydown);
  root.addEventListener('click', clicked);
  root.addEventListener('focusin', focused);
  render(true);

  return {
    move,
    activate,
    setItems(next) {
      if (destroyed) return;
      const preserveFocus = root.contains(document.activeElement);
      data = [...next]; active = 0; selected = -1; root.scrollTop = 0;
      render(true, preserveFocus);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      observer.disconnect();
      root.removeEventListener('scroll', scrolled);
      root.removeEventListener('keydown', keydown);
      root.removeEventListener('click', clicked);
      root.removeEventListener('focusin', focused);
      root.replaceChildren();
      if (!hadClass) root.classList.remove('rw-virtual');
      for (const [name, value] of originalAttributes) {
        if (value === null) root.removeAttribute(name); else root.setAttribute(name, value);
      }
      for (const [name, { value, priority }] of originalProperties) {
        if (value) root.style.setProperty(name, value, priority); else root.style.removeProperty(name);
      }
    },
  };
}
