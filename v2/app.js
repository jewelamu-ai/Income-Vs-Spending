(function(){
  const LS_KEY = 'bt2_data';
  const currency = 'GHS';
  let state = { accounts: [], transactions: [] };

  // Elements
  const sumIncomeEl = document.getElementById('sumIncome');
  const sumExpenseEl = document.getElementById('sumExpense');
  const sumBalanceEl = document.getElementById('sumBalance');
  const sumAccountsEl = document.getElementById('sumAccounts');

  const accNameEl = document.getElementById('accName');
  const accTypeEl = document.getElementById('accType');
  const accInitialEl = document.getElementById('accInitial');
  const btnAddAcc = document.getElementById('btnAddAcc');

  const trxTypeEl = document.getElementById('trxType');
  const trxAmountEl = document.getElementById('trxAmount');
  const trxAccountEl = document.getElementById('trxAccount');
  const trxDateEl = document.getElementById('trxDate');
  const trxNoteEl = document.getElementById('trxNote');
  const btnAddTrx = document.getElementById('btnAddTrx');

  const accountsListEl = document.getElementById('accountsList');
  const transactionsListEl = document.getElementById('transactionsList');

  // Utilities
  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  const fmt = (n) => `${currency}${Number(n||0).toFixed(2)}`;

  function load(){
    try {
      const raw = localStorage.getItem(LS_KEY);
      state = raw ? JSON.parse(raw) : { accounts: [], transactions: [] };
    } catch {
      state = { accounts: [], transactions: [] };
    }
    if (state.accounts.length === 0) {
      // Seed with a Cash account
      state.accounts.push({ id: uid(), name: 'Cash', type: 'cash', balance: 0 });
      save();
    }
  }

  function save(){
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  function recalc(){
    // Recalculate balances from scratch
    state.accounts.forEach(a => a.balance = 0);
    state.transactions.forEach(t => {
      const acc = state.accounts.find(a => a.id === t.accountId);
      if (!acc) return;
      const amt = Number(t.amount || 0);
      if (t.type === 'income') acc.balance += amt;
      if (t.type === 'expense') acc.balance -= amt;
    });
  }

  // Actions
  function addAccount(){
    const name = (accNameEl.value||'').trim();
    const type = accTypeEl.value;
    const initial = Number(accInitialEl.value||0);
    if (!name) { alert('Enter account name'); return; }
    const id = uid();
    state.accounts.push({ id, name, type, balance: 0 });
    if (initial !== 0){
      state.transactions.push({ id: uid(), type: (initial>=0?'income':'expense'), amount: Math.abs(initial), accountId: id, date: new Date().toISOString().slice(0,10), note: 'Initial balance' });
    }
    recalc();
    save();
    accNameEl.value=''; accInitialEl.value='';
    render();
  }

  function addTransaction(){
    const type = trxTypeEl.value;
    const amount = Number(trxAmountEl.value||0);
    const accountId = trxAccountEl.value;
    const date = trxDateEl.value || new Date().toISOString().slice(0,10);
    const note = (trxNoteEl.value||'').trim();
    if (!amount || amount<=0) { alert('Enter a valid amount'); return; }
    if (!accountId) { alert('Choose an account'); return; }
    state.transactions.unshift({ id: uid(), type, amount, accountId, date, note });
    recalc();
    save();
    trxAmountEl.value=''; trxNoteEl.value='';
    render();
  }

  function deleteAccount(id){
    // Prevent deleting if it has transactions
    const hasTrx = state.transactions.some(t => t.accountId === id);
    if (hasTrx) { alert('This account has transactions. Remove them first.'); return; }
    state.accounts = state.accounts.filter(a => a.id !== id);
    if (state.accounts.length === 0) {
      state.accounts.push({ id: uid(), name: 'Cash', type: 'cash', balance: 0 });
    }
    recalc();
    save();
    render();
  }

  function deleteTransaction(id){
    state.transactions = state.transactions.filter(t => t.id !== id);
    recalc();
    save();
    render();
  }

  // Render
  function renderAccounts(){
    // selector
    trxAccountEl.innerHTML = state.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
    // list
    accountsListEl.innerHTML = state.accounts.map(a => `
      <div class="py-3 flex items-center justify-between">
        <div>
          <div class="font-medium">${a.name}</div>
          <div class="text-xs text-gray-500 capitalize">${a.type}</div>
        </div>
        <div class="flex items-center gap-3">
          <div class="font-semibold">${fmt(a.balance)}</div>
          <button class="text-red-600 text-sm" onclick="bt2.deleteAccount('${a.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  function renderTransactions(){
    if (state.transactions.length === 0){
      transactionsListEl.innerHTML = '<div class="py-6 text-center text-gray-500">No transactions yet</div>';
      return;
    }
    transactionsListEl.innerHTML = state.transactions.map(t => {
      const acc = state.accounts.find(a => a.id === t.accountId);
      const sign = t.type === 'income' ? '+' : '-';
      const color = t.type === 'income' ? 'text-green-600' : 'text-red-600';
      return `
        <div class="py-3 flex items-center justify-between">
          <div>
            <div class="font-medium">${t.note || (t.type[0].toUpperCase()+t.type.slice(1))}</div>
            <div class="text-xs text-gray-500">${t.date} • ${acc?acc.name:'(deleted account)'} • ${t.type}</div>
          </div>
          <div class="flex items-center gap-3">
            <div class="font-semibold ${color}">${sign}${fmt(t.amount)}</div>
            <button class="text-red-600 text-sm" onclick="bt2.deleteTransaction('${t.id}')">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderSummary(){
    let inc=0, exp=0;
    state.transactions.forEach(t => {
      if (t.type==='income') inc+=Number(t.amount||0);
      else if (t.type==='expense') exp+=Number(t.amount||0);
    });
    const balance = state.accounts.reduce((s,a)=>s+Number(a.balance||0),0);
    sumIncomeEl.textContent = fmt(inc);
    sumExpenseEl.textContent = fmt(exp);
    sumBalanceEl.textContent = fmt(balance);
    sumAccountsEl.textContent = String(state.accounts.length);
  }

  function render(){
    renderAccounts();
    renderTransactions();
    renderSummary();
  }

  // Init
  (function init(){
    // default date today
    trxDateEl.value = new Date().toISOString().slice(0,10);
    load();
    recalc();
    render();
  })();

  // Events
  btnAddAcc.addEventListener('click', addAccount);
  btnAddTrx.addEventListener('click', addTransaction);

  // Expose minimal API for inline handlers
  window.bt2 = { deleteAccount, deleteTransaction };
})();
