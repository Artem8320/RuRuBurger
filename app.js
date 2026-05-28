/* ==============================================
   RuRuBurger — app.js
   ============================================== */

/* ╔══════════════════════════════════════════════╗
   ║       ★  НАСТРОЙКИ — меняй только здесь  ★  ║
   ╚══════════════════════════════════════════════╝ */

// Google Apps Script — вставь ссылку после деплоя
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZcktegKKrcMDP2XrMHm0SkKo2el0yEHUDozDtULKGgKTR7KcdQ2QMc6A_lPh-Dj4CXQ/exec';

// Контакты для заказа и поддержки
const CONTACTS = {
  phone:    'tel:+79181623145',
  whatsapp: 'https://wa.me/79181623145',      // номер WhatsApp
  telegram: 'https://t.me/RuRuBurgerBot',     // username Telegram-бота
  max:      'https://vk.me/ruruburger',        // ссылка на MAX / ВК Мессенджер
};

// Адрес заведения (подставляется при самовывозе и питании в зале)
const RESTAURANT_ADDRESS = 'ст. Отрадная, ул. Ленина, 15Б';

// Станицы доставки и стоимость
const DELIVERY_OPTIONS = [
  { name: 'Отрадная',  price: 200 },
  { name: 'Спокойная', price: 500 },
  { name: 'Удобная',   price: 500 },
  { name: 'Попутная',  price: 500 },
];

/* ╔══════════════════════════════════════════════════════╗
   ║  ★  ФОТО — замени '' на URL своей фотографии  ★     ║
   ║  Пример: 'https://мойсайт.ru/img/burger.jpg'        ║
   ╚══════════════════════════════════════════════════════╝ */
const MENU_PHOTOS = {
  // Бургеры
  'Двойной Биг Бургер с говядиной': '',
  'Двойной Биг Бургер с курицей':   '',
  'Биг Бургер с говядиной':         '',
  'Биг Бургер с курицей':           '',
  'Двойной Бургер с говядиной':     '',
  'Двойной Бургер с курицей':       '',
  'Бургер с говядиной':             '',
  'Бургер с курицей':               '',
  'Чикенбургер':                    '',
  // Хот-доги
  'Хот-Дог говяжий':   '',
  'Хот-Дог куриный':   '',
  'Френч-Дог говяжий': '',
  'Френч-Дог куриный': '',
  // Снеки
  'Картофель Фри':           '',
  'Картофель по-деревенски': '',
  'Наггетсы':                '',
  'Сырные палочки':          '',
  'Крылышки':                '',
  'Стрипсы':                 '',
  'Креветки в панировке':    '',
  // Фастфуд
  'Гирос в лепешке': '',
  'Клаб-Сэндвич':    '',
  'Тортилья':        '',
  'Кесадилья':       '',
  // Десерты
  'Чизкейк Арахис-карамель': '',
  'Чизкейк Шоколадный':      '',
  'Чизкейк Клубничный':      '',
};

// Эмодзи-заглушка по категории (когда нет фото)
const CATEGORY_EMOJI = {
  burgers:'🍔', hotdogs:'🌭', snacks:'🍟',
  fastfood:'🫓', sauces:'🥣', drinks:'🥤', hot:'☕', desserts:'🍰',
};

/* ╔═══════════════════════════════════════════════════════════╗
   ║  ★  ДОБАВКИ — категории и список  ★                      ║
   ║  TOPPING_CATEGORIES — в каких разделах показывать кнопки  ║
   ╚═══════════════════════════════════════════════════════════╝ */
const TOPPING_CATEGORIES = ['burgers', 'hotdogs', 'fastfood'];

const TOPPINGS = [
  { id:'onion',  label:'+ Маринованный лук', price:40 },
  { id:'pepper', label:'+ Халапеньо',        price:40 },
  { id:'cheese', label:'+ Доп. сыр',         price:50 },
];

/* ==============================
   MENU DATA
============================== */
const menuData = {
  burgers: [
    { name:'Двойной Биг Бургер с говядиной', desc:'Большая булочка, двойная котлета, сыр, помидор, малосольный огурец, соус 1000 островов, соус барбекю', price:490 },
    { name:'Двойной Биг Бургер с курицей',   desc:'Большая булочка, двойная котлета, сыр, помидор, малосольный огурец, кетчуп, майонез, сырный соус',    price:470 },
    { name:'Биг Бургер с говядиной',          desc:'Большая булочка, одна котлета, сыр, помидор, малосольный огурец, соус 1000 островов, соус барбекю',   price:370 },
    { name:'Биг Бургер с курицей',            desc:'Большая булочка, одна котлета, сыр, помидор, малосольный огурец, кетчуп, майонез, сырный соус',       price:360 },
    { name:'Двойной Бургер с говядиной',      desc:'Маленькая булочка, двойная котлета, сыр, помидор, малосольный огурец, соус 1000 островов, барбекю',   price:380 },
    { name:'Двойной Бургер с курицей',        desc:'Маленькая булочка, двойная котлета, сыр, помидор, малосольный огурец, кетчуп, майонез, сырный соус',  price:360 },
    { name:'Бургер с говядиной',              desc:'Маленькая булочка, одна котлета, сыр, помидор, малосольный огурец, соус 1000 островов, барбекю',       price:260 },
    { name:'Бургер с курицей',                desc:'Маленькая булочка, одна котлета, сыр, помидор, малосольный огурец, кетчуп, майонез, сырный соус',     price:240 },
    { name:'Чикенбургер',                     desc:'Большая булочка, куриные стрипсы, сыр, помидор, лист салата, кисло-сладкий соус, сырный соус',        price:320 },
  ],
  hotdogs: [
    { name:'Хот-Дог говяжий',   desc:'Булочка, говяжья колбаска, сыр, карамелизированный лук, кетчуп, майонез, горчичный соус', price:270 },
    { name:'Хот-Дог куриный',   desc:'Булочка, куриная колбаска, сыр, карамелизированный лук, кетчуп, майонез, горчичный соус', price:250 },
    { name:'Френч-Дог говяжий', desc:'Булочка, говяжья колбаска, кетчуп, майонез, горчичный соус',                              price:220 },
    { name:'Френч-Дог куриный', desc:'Булочка, куриная колбаска, кетчуп, майонез, горчичный соус',                              price:190 },
  ],
  snacks: [
    { name:'Картофель Фри',           desc:'Золотистые хрустящие ломтики',           variants:[{label:'150г',price:170},{label:'300г',price:300}] },
    { name:'Картофель по-деревенски', desc:'Кусочки с кожурой, фирменная приправа',  variants:[{label:'150г',price:180},{label:'300г',price:320}] },
    { name:'Наггетсы',                desc:'Сочные куриные наггетсы',                variants:[{label:'3 шт',price:130},{label:'6 шт',price:240},{label:'9 шт',price:330}] },
    { name:'Сырные палочки',          desc:'Хрустящие, тянущийся сыр',              variants:[{label:'3 шт',price:150},{label:'6 шт',price:270},{label:'9 шт',price:360}] },
    { name:'Крылышки',                desc:'Сочные куриные крылышки',               variants:[{label:'3 шт',price:240},{label:'6 шт',price:420},{label:'9 шт',price:560}] },
    { name:'Стрипсы',                 desc:'В хрустящей панировке',                 variants:[{label:'3 шт',price:140},{label:'6 шт',price:250},{label:'9 шт',price:340}] },
    { name:'Креветки в панировке',    desc:'Тигровые креветки в хрустящей корочке', variants:[{label:'3 шт',price:170},{label:'6 шт',price:290},{label:'9 шт',price:380}] },
  ],
  fastfood: [
    { name:'Гирос в лепешке', desc:'Пита, куриное филе, помидор, картошка фри, маринованный лук, красный соус, белый соус', price:380 },
    { name:'Клаб-Сэндвич',    desc:'Тостовый хлеб, куриное филе, яйцо, помидор, салат, бекон, майонез, горчица',           price:360 },
    { name:'Тортилья',        desc:'Пшеничная лепёшка, куриное филе, свежие овощи, соус',                                   price:360 },
    { name:'Кесадилья',       desc:'Лепёшка, плавленый сыр, курица, томаты',                                                price:320 },
  ],
  sauces: [
    { name:'Кисло-сладкий соус',  desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Сырный соус',         desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Кетчуп',              desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Соус Барбекю',        desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Соус 1000 островов',  desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Красный соус',        desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Белый соус',          desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Маринованный лук',    desc:'Добавка к блюду', price:40 },
    { name:'Перец халапеньо',     desc:'Добавка, острый',  price:40 },
    { name:'Дополнительный сыр',  desc:'Добавка',          price:50 },
  ],
  drinks: [
    { name:'Добрый Кола',           desc:'', variants:[{label:'0.33 л',price:120},{label:'0.5 л',price:130}] },
    { name:'Добрый Фанта',          desc:'', variants:[{label:'0.33 л',price:120},{label:'0.5 л',price:130}] },
    { name:'Добрый Спрайт',         desc:'0.33 л', price:120 },
    { name:'Добрый Киви-виноград',  desc:'0.33 л', price:120 },
    { name:'Добрый Манго-маракуйя', desc:'0.5 л',  price:130 },
    { name:'Адреналин',             desc:'Энергетик', variants:[{label:'0.25 л',price:120},{label:'0.5 л',price:160}] },
    { name:'Сок Добрый Яблоко',     desc:'0.3 л', price:100 },
    { name:'Сок Добрый Мультифрукт',desc:'0.3 л', price:100 },
    { name:'Сок Ричи Вишня',        desc:'0.3 л', price:110 },
    { name:'Сок Ричи Апельсин',     desc:'0.3 л', price:110 },
    { name:'Чай Ричи Лимон',        desc:'0.5 л', price:130 },
    { name:'Чай Ричи Персик',       desc:'0.5 л', price:130 },
    { name:'Чай Ричи Зелёный',      desc:'0.5 л', price:130 },
    { name:'Палпи',                 desc:'0.5 л, апельсиновый', price:120 },
    { name:'Вода газированная',     desc:'0.5 л', price:60 },
    { name:'Вода негазированная',   desc:'0.5 л', price:60 },
  ],
  hot: [
    { name:'Чай чёрный',      desc:'Горячий',     price:50 },
    { name:'Кофе',            desc:'Растворимый', price:50 },
    { name:'MacCoffee 3 в 1', desc:'',            price:50 },
  ],
  desserts: [
    { name:'Чизкейк Арахис-карамель', desc:'Нежный сливочный чизкейк с карамелью и арахисом', price:230 },
    { name:'Чизкейк Шоколадный',      desc:'Насыщенный шоколадный чизкейк',                    price:230 },
    { name:'Чизкейк Клубничный',      desc:'Чизкейк с ароматной клубникой',                    price:230 },
  ],
};

/* ==============================
   CART STATE
============================== */
let cart = [];

function makeKey(name, variant, tops) { return name + '|' + (variant||'') + '|' + (tops||[]).slice().sort().join(','); }

function cartSum() { return cart.reduce((s,i) => s + i.price * i.qty, 0); }

/* ==============================
   RENDER CARDS
============================== */
const allCards = [];

function createCard(item, category) {
  const card = document.createElement('div');
  card.className = 'menu-card';

  const hasVariants    = item.variants && item.variants.length > 0;
  const hasToppings    = TOPPING_CATEGORIES.includes(category);
  const defaultPrice   = hasVariants ? item.variants[0].price : item.price;
  const defaultVariant = hasVariants ? item.variants[0].label : '';
  const photoUrl       = MENU_PHOTOS[item.name] || '';
  const emoji          = CATEGORY_EMOJI[category] || '🍽️';

  const photoHTML = photoUrl
    ? `<div class="card-photo"><img src="${photoUrl}" alt="${item.name}" loading="lazy"></div>`
    : `<div class="card-photo"><div class="card-photo-placeholder">${emoji}</div></div>`;

  const varHTML = hasVariants
    ? '<div class="variants">' +
      item.variants.map((v,i) =>
        `<button class="variant-btn${i===0?' selected':''}" data-price="${v.price}" data-label="${v.label}">${v.label} — ${v.price}₽</button>`
      ).join('') + '</div>'
    : '';

  // Добавки — аккуратные кнопки-пилюли (без галочек)
  const toppingHTML = hasToppings
    ? `<div class="topping-pills">
        ${TOPPINGS.map(t =>
          `<button class="topping-pill" data-id="${t.id}" data-price="${t.price}">${t.label} <span>${t.price}₽</span></button>`
        ).join('')}
      </div>`
    : '';

  card.innerHTML = `
    ${photoHTML}
    <div class="card-body">
      <div class="card-header">
        <span class="card-name">${item.name}</span>
        <span class="card-price">${defaultPrice}₽</span>
      </div>
      ${item.desc ? `<p class="card-desc">${item.desc}</p>` : ''}
      ${varHTML}
      ${toppingHTML}
      <button class="add-btn">+ В корзину</button>
      <div class="card-qty-control">
        <button class="card-qty-btn card-minus">−</button>
        <span class="card-qty-num">1</span>
        <button class="card-qty-btn card-plus">+</button>
      </div>
    </div>`;

  let curPrice   = defaultPrice;
  let curVariant = defaultVariant;
  let selTops    = []; // выбранные добавки [{id, price, label}]

  const priceEl = card.querySelector('.card-price');
  const addBtn  = card.querySelector('.add-btn');
  const qtyCtrl = card.querySelector('.card-qty-control');
  const qtyNum  = card.querySelector('.card-qty-num');

  function totalPrice() {
    return curPrice + selTops.reduce((s,t) => s + t.price, 0);
  }

  function updatePrice() {
    priceEl.textContent = totalPrice() + '₽';
  }

  // Variant switching
  if (hasVariants) {
    card.querySelectorAll('.variant-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        card.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        curPrice   = parseInt(btn.dataset.price);
        curVariant = btn.dataset.label;
        updatePrice();
        syncCard();
      });
    });
  }

  // Topping pills
  if (hasToppings) {
    card.querySelectorAll('.topping-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        pill.classList.toggle('active');
        const id    = pill.dataset.id;
        const price = parseInt(pill.dataset.price);
        const label = TOPPINGS.find(t => t.id === id)?.label.replace(/^\+\s*/, '') || id;
        if (pill.classList.contains('active')) {
          selTops.push({ id, price, label });
        } else {
          selTops = selTops.filter(t => t.id !== id);
        }
        updatePrice();
        syncCard();
      });
    });
  }

  function curKey() {
    return makeKey(item.name, curVariant, selTops.map(t => t.id));
  }

  function getQty() {
    const e = cart.find(i => i.key === curKey());
    return e ? e.qty : 0;
  }

  function syncCard() {
    const qty = getQty();
    addBtn.style.display = qty > 0 ? 'none' : '';
    qtyCtrl.classList.toggle('visible', qty > 0);
    if (qty > 0) qtyNum.textContent = qty;
  }

  addBtn.addEventListener('click', () => {
    addToCart(curKey(), item.name, totalPrice(), curVariant, [...selTops]);
    syncCard();
  });

  card.querySelector('.card-minus').addEventListener('click', () => {
    changeQtyByKey(curKey(), -1); syncCard();
  });
  card.querySelector('.card-plus').addEventListener('click', () => {
    changeQtyByKey(curKey(), 1); syncCard();
  });

  card._sync = syncCard;
  return card;
}

function renderGrid(id, items, category) {
  const el = document.getElementById(id);
  if (!el) return;
  items.forEach(item => {
    const card = createCard(item, category);
    allCards.push(card);
    el.appendChild(card);
  });
}

renderGrid('grid-burgers',  menuData.burgers,  'burgers');
renderGrid('grid-hotdogs',  menuData.hotdogs,  'hotdogs');
renderGrid('grid-snacks',   menuData.snacks,   'snacks');
renderGrid('grid-fastfood', menuData.fastfood, 'fastfood');
renderGrid('grid-sauces',   menuData.sauces,   'sauces');
renderGrid('grid-drinks',   menuData.drinks,   'drinks');
renderGrid('grid-hot',      menuData.hot,      'hot');
renderGrid('grid-desserts', menuData.desserts, 'desserts');

/* ==============================
   CART OPERATIONS
============================== */
function addToCart(key, name, price, variant, tops) {
  const ex = cart.find(i => i.key === key);
  if (ex) { ex.qty++; } else { cart.push({ key, name, price, variant, tops: tops||[], qty:1 }); }
  renderCart();
  showToast(`<span class="gold">+1</span> ${name}${variant ? ' ('+variant+')' : ''}`);
}

function changeQtyByKey(key, delta) {
  const idx = cart.findIndex(i => i.key === key);
  if (idx === -1) { if (delta > 0) return; return; }
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}

function syncAllCards() { allCards.forEach(c => c._sync && c._sync()); }

function renderCart() {
  const itemsEl   = document.getElementById('cartItems');
  const badgeEl   = document.getElementById('cartBadge');
  const totalEl   = document.getElementById('cartTotal');
  const bar       = document.getElementById('bottomBar');
  const bQty      = document.getElementById('bottomQty');
  const bTotal    = document.getElementById('bottomTotal');

  const totalQty = cart.reduce((s,i) => s + i.qty, 0);
  const total    = cartSum();

  badgeEl.textContent = totalQty;
  badgeEl.classList.toggle('visible', totalQty > 0);
  totalEl.textContent  = total.toLocaleString('ru') + ' ₽';
  bQty.textContent     = totalQty;
  bTotal.textContent   = total.toLocaleString('ru') + ' ₽';
  bar.classList.toggle('has-items', totalQty > 0);

  syncAllCards();

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">
      <span class="cart-empty-icon">🛒</span>
      <p>Корзина пуста<br><span style="font-size:12px;color:var(--text-muted)">Добавьте что-нибудь вкусное</span></p>
    </div>`;
    return;
  }

  itemsEl.innerHTML = cart.map((item,idx) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        ${(item.variant || (item.tops&&item.tops.length)) ? `<div class="cart-item-meta">${[item.variant,...(item.tops||[]).map(t=>t.label)].filter(Boolean).join(' · ')}</div>` : ''}
      </div>
      <div class="qty-control">
        <button class="qty-btn delete" data-idx="${idx}">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" data-idx="${idx}" data-add="1">+</button>
      </div>
      <span class="cart-item-price">${(item.price * item.qty).toLocaleString('ru')}₽</span>
    </div>`).join('');

  itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.idx);
      cart[i].qty += btn.dataset.add ? 1 : -1;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      renderCart();
    });
  });
}

/* ==============================
   CART DRAWER
============================== */
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer  = document.getElementById('cartDrawer');

function openCart()  { cartOverlay.classList.add('open'); cartDrawer.classList.add('open'); document.body.style.overflow='hidden'; }
function closeCart() { cartOverlay.classList.remove('open'); cartDrawer.classList.remove('open'); document.body.style.overflow=''; }

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('bottomCartBtn').addEventListener('click', openCart);
cartOverlay.addEventListener('click', closeCart);

/* ==============================
   TABS + AUTO-SWITCH ON SCROLL
============================== */
const tabs      = document.querySelectorAll('.tab');
const indicator = document.getElementById('tabIndicator');

function moveIndicator(t) {
  indicator.style.cssText = `width:${t.offsetWidth}px;height:${t.offsetHeight}px;left:${t.offsetLeft}px;top:${t.offsetTop}px;`;
}

setTimeout(() => { const a = document.querySelector('.tab.active'); if (a) moveIndicator(a); }, 60);
window.addEventListener('resize', () => { const a = document.querySelector('.tab.active'); if (a) moveIndicator(a); });

let scrollLock = false;

const panelObserver = new IntersectionObserver(entries => {
  if (scrollLock) return;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id  = entry.target.id.replace('panel-', '');
      const tab = document.querySelector(`.tab[data-tab="${id}"]`);
      if (tab && !tab.classList.contains('active')) {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        moveIndicator(tab);
        tab.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
      }
    }
  });
}, { rootMargin:'-35% 0px -55% 0px', threshold:0 });

document.querySelectorAll('.menu-panel').forEach(p => panelObserver.observe(p));

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    scrollLock = true;
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    moveIndicator(tab);
    tab.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
    const panel = document.getElementById('panel-' + tab.dataset.tab);
    if (panel) panel.scrollIntoView({ behavior:'smooth', block:'start' });
    setTimeout(() => { scrollLock = false; }, 900);
  });
});

/* ==============================
   DELIVERY VILLAGE SELECTOR
============================== */
const villageSelect = document.getElementById('villageSelect');
DELIVERY_OPTIONS.forEach((opt, i) => {
  const o = document.createElement('option');
  o.value = opt.name;
  o.textContent = `${opt.name}  (+${opt.price} ₽)`;
  if (i === 0) o.selected = true;
  villageSelect.appendChild(o);
});

function getDeliveryFee() {
  const act = document.querySelector('.toggle-option.active');
  if (!act || act.dataset.value !== 'delivery') return 0;
  return DELIVERY_OPTIONS[villageSelect.selectedIndex]?.price || 0;
}

function updateDeliveryNote() {
  const fee  = getDeliveryFee();
  const note = document.getElementById('deliveryPriceNote');
  note.textContent = fee > 0 ? `Стоимость доставки: ${fee} ₽` : '';
  refreshModalPreview();
}
villageSelect.addEventListener('change', updateDeliveryNote);

/* ==============================
   ORDER MODAL
============================== */
const modalOverlay    = document.getElementById('modalOverlay');
const deliveryOptions = document.querySelectorAll('.toggle-option');
const deliveryBlock   = document.getElementById('deliveryBlock');

deliveryOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    deliveryOptions.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    deliveryBlock.classList.toggle('visible', opt.dataset.value === 'delivery');
    updateDeliveryNote();
  });
});

document.getElementById('btnOrder').addEventListener('click', () => {
  if (cart.length === 0) { showToast('Добавьте товары в корзину'); return; }
  refreshModalPreview();
  modalOverlay.classList.add('open');
  closeCart();
});

function refreshModalPreview() {
  const fee   = getDeliveryFee();
  const items = cartSum();
  const total = items + fee;

  document.getElementById('modalCartPreview').innerHTML =
    cart.map(i => `${i.name}${i.variant?' ('+i.variant+')':''} × ${i.qty} = ${(i.price*i.qty).toLocaleString('ru')}₽`).join('<br>') +
    (fee > 0 ? `<br><span style="color:var(--gold)">Доставка: ${fee} ₽</span>` : '');

  document.getElementById('modalTotalLine').innerHTML =
    `Итого: <span>${total.toLocaleString('ru')} ₽</span>`;
}

function closeModal() { modalOverlay.classList.remove('open'); }
document.getElementById('modalClose').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

/* ==============================
   VALIDATE FORM
============================== */
function validateForm() {
  const name  = document.getElementById('inputName').value.trim();
  const phone = document.getElementById('inputPhone').value.trim();
  const addr  = document.getElementById('inputAddress')?.value.trim() || '';
  const act   = document.querySelector('.toggle-option.active');
  const type  = act ? act.dataset.value : 'pickup';

  if (!name)            { document.getElementById('inputName').focus();  showToast('Введите ваше имя');        return null; }
  if (phone.length < 7) { document.getElementById('inputPhone').focus(); showToast('Введите телефон');         return null; }
  if (type === 'delivery' && !addr) {
    document.getElementById('inputAddress').focus(); showToast('Введите адрес доставки'); return null;
  }
  return { name, phone, addr, type };
}

function clearForm() {
  document.getElementById('inputName').value  = '';
  document.getElementById('inputPhone').value = '';
  const a = document.getElementById('inputAddress'); if (a) a.value = '';
}

function clearCart() { cart = []; renderCart(); }

/* ==============================
   BUILD ORDER TEXT
============================== */
function buildOrderText(f) {
  const fee   = getDeliveryFee();
  const total = cartSum() + fee;
  const typeLabel = { pickup:'Самовывоз', hall:'Питание в зале', delivery:'Доставка' }[f.type] || f.type;
  const addrLine  = f.type === 'delivery'
    ? `${f.addr} (${villageSelect.value})`
    : RESTAURANT_ADDRESS;
  const sep = '------------------------';

  const items = cart.map((item, idx) => {
    const meta = [item.variant, ...(item.tops||[]).map(t=>t.label)].filter(Boolean).join(', ');
    return `${idx+1}. ${item.name}${meta?' ('+meta+')':''} — ${item.qty} шт. х ${item.price} ₽`;
  }).join('\n');

  const lines = [
    '🍔 НОВЫЙ ЗАКАЗ RuRuBurger', sep,
    `👤 Клиент: ${f.name}`,
    `📞 Телефон: ${f.phone}`,
    `🚗 Способ: ${typeLabel}`,
    `📍 Адрес: ${addrLine}`,
    sep, '🧾 СОСТАВ ЗАКАЗА:', items, sep,
  ];
  if (fee > 0) lines.push(`🚚 Доставка: ${fee} ₽`);
  lines.push(`💰 ИТОГО К ОПЛАТЕ: ${total.toLocaleString('ru')} ₽`);
  return lines.join('\n');
}

/* ==============================
   SEND — GOOGLE APPS SCRIPT (авто)
   Заказ летит на Google Script → Telegram.
   Клиент никуда не переходит.
============================== */
document.getElementById('btnSendScript').addEventListener('click', async () => {
  const f = validateForm();
  if (!f) return;

  const fee   = getDeliveryFee();
  const total = cartSum() + fee;
  const typeLabel = { pickup:'Самовывоз', hall:'Питание в зале', delivery:'Доставка' }[f.type];
  const addrLine  = f.type === 'delivery' ? `${f.addr} (${villageSelect.value})` : RESTAURANT_ADDRESS;

  const orderList = cart.map(i =>
    `${i.qty}х ${i.name}${i.variant?' ('+i.variant+')':''} — ${i.price} ₽`
  ).join('\n') + (fee>0 ? `\n🚚 Доставка: ${fee} ₽` : '') + `\n\n💰 ИТОГО: ${total.toLocaleString('ru')} ₽`;

  const btn = document.getElementById('btnSendScript');
  btn.disabled = true; btn.textContent = '⏳ Отправляем...';

  try {
    const res    = await fetch(GOOGLE_SCRIPT_URL, { method:'POST', body: JSON.stringify({
      name: f.name, phone: f.phone, address: addrLine,
      comment: typeLabel, order_list: orderList,
    })});
    const result = await res.json();
    if (result.status === 'success') {
      closeModal(); clearForm(); clearCart();
      showSuccessModal(f.name);
    } else { throw new Error(result.message); }
  } catch(e) {
    console.error(e);
    showToast('Ошибка. Попробуйте другой способ отправки');
  } finally {
    btn.disabled = false; btn.textContent = '⚡ Авто (рекомендуем)';
  }
});

/* ==============================
   COPY MODAL (WhatsApp / MAX / Telegram)
   Показывает текст заказа, кнопки «Скопировать» и «Открыть мессенджер»
============================== */
const copyModalOverlay = document.getElementById('copyModalOverlay');
let copyTargetUrl = '';

function openCopyModal(icon, title, messengerUrl) {
  const f = validateForm();
  if (!f) return;

  document.getElementById('copyIcon').textContent  = icon;
  document.getElementById('copyTitle').textContent = title;
  document.getElementById('orderTextarea').value   = buildOrderText(f);
  document.getElementById('copySuccess').classList.remove('show');

  copyTargetUrl = messengerUrl;
  copyModalOverlay._formData = f;

  closeModal();
  copyModalOverlay.classList.add('open');
}

// Кнопки открытия copy-modal
document.getElementById('btnSendWa').addEventListener('click',  () =>
  openCopyModal('📱', 'Отправить в WhatsApp', CONTACTS.whatsapp));
document.getElementById('btnSendMax').addEventListener('click', () =>
  openCopyModal('💬', 'Отправить в MAX',       CONTACTS.max));
document.getElementById('btnSendTg').addEventListener('click',  () =>
  openCopyModal('✈️', 'Отправить в Telegram',  CONTACTS.telegram));

// Скопировать заказ
document.getElementById('btnCopy').addEventListener('click', async () => {
  const text = document.getElementById('orderTextarea').value;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
  }
  const ok = document.getElementById('copySuccess');
  ok.classList.add('show');
  setTimeout(() => ok.classList.remove('show'), 2500);
  showToast('📋 Заказ скопирован!');
});

// Открыть мессенджер
document.getElementById('btnOpenApp').addEventListener('click', () => {
  window.open(copyTargetUrl, '_blank');
  copyModalOverlay.classList.remove('open');
  const f = copyModalOverlay._formData;
  if (f) { clearForm(); clearCart(); showSuccessModal(f.name); }
});

document.getElementById('copyModalClose').addEventListener('click', () => copyModalOverlay.classList.remove('open'));
copyModalOverlay.addEventListener('click', e => { if (e.target === copyModalOverlay) copyModalOverlay.classList.remove('open'); });

/* ==============================
   SUCCESS MODAL
============================== */
const successModalOverlay = document.getElementById('successModalOverlay');

function showSuccessModal(clientName) {
  const sum  = document.getElementById('successOrderSummary');
  sum.innerHTML = `<b style="color:var(--gold)">${clientName}</b>, ваш заказ отправлен!`;

  document.getElementById('successTg').href  = CONTACTS.telegram;
  document.getElementById('successWa').href  = CONTACTS.whatsapp;
  document.getElementById('successMax').href = CONTACTS.max;

  successModalOverlay.classList.add('open');
  showSuccessBanner();
}

document.getElementById('successClose').addEventListener('click', () => successModalOverlay.classList.remove('open'));
successModalOverlay.addEventListener('click', e => { if (e.target === successModalOverlay) successModalOverlay.classList.remove('open'); });

/* ==============================
   SUPPORT SECTION links
============================== */
document.getElementById('supportTg').href  = CONTACTS.telegram;
document.getElementById('supportWa').href  = CONTACTS.whatsapp;
document.getElementById('supportMax').href = CONTACTS.max;

/* ==============================
   SUCCESS BANNER
============================== */
function showSuccessBanner() {
  const b = document.getElementById('successBanner');
  b.classList.add('show');
  setTimeout(() => b.classList.remove('show'), 4000);
}

/* ==============================
   TOAST
============================== */
function showToast(msg) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast'; t.innerHTML = msg; c.appendChild(t);
  setTimeout(() => t.remove(), 2100);
}

/* ==============================
   INIT
============================== */
renderCart();
