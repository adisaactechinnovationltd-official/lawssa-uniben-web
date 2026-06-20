// Simple client-side store rendering and placeholder checkout (bank transfer + WhatsApp receipt)
let STORE_ITEMS = [
  { id: 's1', title: "LAWSA T-Shirt (Navy)", price: 2500, image: 'https://images.unsplash.com/photo-1520975917650-4e1e0b10b3b0?w=600&q=80', sku: 'TSHIRT-NV-01' },
  { id: 's2', title: "LAWSA Cap", price: 1200, image: 'https://images.unsplash.com/photo-1520975917650-4e1e0b10b3b0?w=600&q=80', sku: 'CAP-01' },
  { id: 's3', title: "LAWSA Mug", price: 800, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', sku: 'MUG-01' }
];

// Load store items from Supabase if available
async function loadStoreItems() {
  if (!window.supabase) return;
  try {
    const { data, error } = await supabase.from('store_items').select('*');
    if (!error && data && data.length > 0) {
      STORE_ITEMS = data.map((item, i) => ({
        id: item.id || `s${i}`,
        title: item.title,
        price: item.price,
        image: item.image_url || 'https://images.unsplash.com/photo-1520975917650-4e1e0b10b3b0?w=600&q=80',
        sku: item.sku
      }));
    }
  } catch (e) {
    console.error('Failed to load store items from Supabase:', e);
  }
}

function renderStoreGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = STORE_ITEMS.map(it => `
    <article class="news-card store-card" onclick="openProduct('${it.id}')">
      <div class="news-card__img"><img src="${it.image}" alt="${it.title}" loading="lazy"></div>
      <div class="news-card__body">
        <div class="news-card__cat">Store</div>
        <h3 class="news-card__title display">${it.title}</h3>
        <p class="news-card__excerpt">Price: ₦${it.price.toLocaleString()}</p>
        <div class="news-card__meta"><span>SKU: ${it.sku}</span><span class="news-card__arrow">→</span></div>
      </div>
    </article>
  `).join('');
}

function openProduct(id) {
  const p = STORE_ITEMS.find(s => s.id === id);
  if (!p) return;
  const el = document.getElementById('productModalContent');
  el.innerHTML = `
    <div class="product-modal__img"><img src="${p.image}" alt="${p.title}"></div>
    <div class="product-modal__body">
      <h2>${p.title}</h2>
      <p><strong>Price:</strong> ₦${p.price.toLocaleString()}</p>
      <p><strong>SKU:</strong> ${p.sku}</p>
      <p style="margin-top:var(--s4);font-size:var(--t-xs);">To purchase, make a bank transfer to the account below and send a copy of your transfer receipt via WhatsApp. Include your name, item, amount and phone number.</p>
      <div class="bank-details">
        <div><strong>Bank:</strong> First Bank</div>
        <div><strong>Account Name:</strong> LAWSA UNIBEN</div>
        <div><strong>Account Number:</strong> 1234567890</div>
      </div>
      <div style="margin-top:var(--s4);display:flex;gap:var(--s2);flex-direction:column;">
        <button class="btn btn--gold" onclick="openWhatsApp('${p.title}', ${p.price})" style="width:100%;">Send Receipt via WhatsApp</button>
        <button class="btn btn--outline" onclick="closeModal('productModal')" style="width:100%;">Close</button>
      </div>
    </div>
  `;
  openModal('productModal');
}

function openWhatsApp(title, price){
  const phone = '2348012345678'; // replace with real number
  const text = encodeURIComponent(`Hello, I have paid for ${title} (₦${price}). Name: [Your Name]. Phone: [Your Phone]. TransRef: [Reference].`);
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

window.renderStoreGrid = renderStoreGrid;
window.openProduct = openProduct;
window.openWhatsApp = openWhatsApp;
window.loadStoreItems = loadStoreItems;

// Auto-render preview and full store if sections present
document.addEventListener('DOMContentLoaded', () => {
  // Load items from Supabase first, then render
  loadStoreItems().then(() => {
    renderStoreGrid('storePreviewGrid');
    if (document.getElementById('storeGrid')) renderStoreGrid('storeGrid');
  });
});
