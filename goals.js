// Minimal single-file app: storage, utils, rendering, events
(() => {
  const STORAGE_KEY = 'minimal:goals:v1';

  // storage
  const load = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  };
  const save = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

  // utils
  const $ = s => document.querySelector(s);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const fmtCurrency = v => Number(v).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[c]));

  // refs
  const refs = {
    toggle: $('#toggleGoalForm'),
    formSection: $('#goalFormSection'),
    form: $('#goalForm'),
    name: $('#goalName'),
    category: $('#goalCategory'),
    amount: $('#targetAmount'),
    date: $('#targetDate'),
    cancel: $('#cancelCreate'),
    limitError: $('#limitError'),
    activeCount: $('#activeCount'),
    completedCount: $('#completedCount'),
    activeList: $('#activeGoals'),
    completedList: $('#completedGoals'),
    themeToggle: $('#themeToggle'),
  };

  // state
  let goals = load();

  // validation
  function validate({ name, amount, date }) {
    const errors = {};
    if (!name || !name.trim()) errors.name = 'Name is required.';
    if (!amount || Number(amount) <= 0) errors.amount = 'Enter a positive amount.';
    if (!date || date < todayISO()) errors.date = 'Date must be today or later.';
    return errors;
  }

  // render helpers
  function cardHtml(g) {
    const currentSavings = g.currentSavings || 0;
    const progressPercentage = Math.min((currentSavings / g.target) * 100, 100);

    return `
    
      <article class="card p-6 bg-white shadow-sm rounded-lg" data-id="${g.id}">
        <div class="flex justify-between items-center">
          <div class="text-s font-semibold">${fmtCurrency(currentSavings)}</div>
          <div class="text-s font-regular text-gray-400">${progressPercentage}%</div>
        </div>  
        <div id="progressBarContainer" style="width: 100%; background-color: var(--bg-tertiary); border-radius: 5px; margin-bottom: 8px;">
            <div id="progressBarFill" style="width: ${progressPercentage}%; background-color: var(--blue-60); height: 4px; border-radius: 5px;"></div>
        </div>
        <div class="flex justify-between items-start">
          <div>
            <div class="text-2xl font-semibold text-gray-900">${esc(g.name)}${esc(g.category)}</div>
            <div class="text-xs text-gray-400">Goal:${fmtCurrency(g.target)}</div> 
            <div class="text-xs text-gray-400">${g.date}</div>
          </div>
          <div class="flex flex-col items-end gap-2">
            ${g.saved
        ? `<button data-action="delete" class="text-red-600 text-sm">Delete</button>`
        : `<button data-action="complete" class="text-green-600 text-sm">Complete</button>`}
            <button data-action="addSavings" class="btn btn-primary-subtle">Add Savings</button>
          </div>
        </div>
      </article>
    `;
  }

  function render() {
    const active = goals.filter(g => !g.saved);
    const done = goals.filter(g => g.saved);
    refs.activeList.innerHTML = active.map(cardHtml).join('');
    refs.completedList.innerHTML = done.map(cardHtml).join('');
    refs.activeCount.textContent = active.length;
    refs.completedCount.textContent = done.length;
  }

  // event handlers (use delegation)
  function onListClick(e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const article = btn.closest('article');
    if (!article) return;
    const id = article.dataset.id;
    const action = btn.dataset.action;
    if (action === 'complete') {
      goals = goals.map(g => g.id === id ? { ...g, saved: true } : g);
      save(goals); render();
    } else if (action === 'delete') {
      goals = goals.filter(g => g.id !== id);
      save(goals); render();
      // Add Savings button action
    } else if (action === 'addSavings') {
      const goal = goals.find(g => g.id === id);
      if (!goal) return;
      // User prompt to enter the amount to add to savings
      const amountStr = prompt('Enter the amount to add to your savings:');
      if (amountStr === null) return; // User cancelled

      const amount = parseFloat(amountStr); //converts to number
      if (isNaN(amount) || amount <= 0) { //checks if a number or less than 0
        alert('Please enter a valid positive number.');
        return;
      }

      // Update the goal's current savings
      goals = goals.map(g =>
        g.id === id
          ? { ...g, currentSavings: (g.currentSavings || 0) + amount }
          : g
      );

      save(goals);
      render();
    }
  }

  // form submit
  refs.form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    refs.limitError.textContent = '';
    const vals = {
      name: refs.name.value.trim(),
      category: refs.category.value,
      amount: refs.amount.value,
      date: refs.date.value,
    };
    const errs = validate({ name: vals.name, amount: vals.amount, date: vals.date });
    $('#goalNameError').textContent = errs.name || '';
    $('#targetAmountError').textContent = errs.amount || '';
    $('#targetDateError').textContent = errs.date || '';
    if (Object.keys(errs).length) return;
    const goal = {
      id: uid(),
      name: vals.name,
      category: vals.category,
      target: Number(vals.amount),
      date: vals.date,
      saved: false,
      currentSavings: 0,
    };
    // Save goal action
    goals.push(goal);
    save(goals);
    refs.form.reset();
    refs.formSection.classList.add('hidden');
    render();
  });

  // UI toggles
  refs.toggle.addEventListener('click', () => refs.formSection.classList.toggle('hidden'));
  refs.cancel.addEventListener('click', () => { refs.form.reset(); refs.formSection.classList.add('hidden'); });

  // attach delegation listeners
  refs.activeList.addEventListener('click', onListClick);
  refs.completedList.addEventListener('click', onListClick);

  // init
  refs.date.value = todayISO();
  render();
})();