// Simple client-side store rendering and placeholder checkout (bank transfer + WhatsApp receipt)
let STORE_ITEMS = [
  { id: 's1', title: 'LAWSA Tote Bag', price: 5000, image: 'public/assets/images/merchandise/totebag.webp', sku: 'TOTEBAG-01' },
  { id: 's2', title: 'LAWSA T-Shirt', price: 6000, image: 'public/assets/images/merchandise/tshirt.webp', sku: 'TSHIRT-01' },
  { id: 's3', title: 'LAWSA Lanyard', price: 2500, image: 'public/assets/images/merchandise/lanyard.webp', sku: 'LANYARD-01' }
];

// Load store items from Supabase if available and keep default merch items
async function loadStoreItems() {
  if (!window.supabase) return;
  try {
    const { data, error } = await supabase.from('store_items').select('*');
    if (!error && data && data.length > 0) {
      const remoteItems = data.map((item, i) => ({
        id: item.id || `db${i}`,
        title: item.title,
        price: item.price,
        image: item.image_url || 'https://images.unsplash.com/photo-1520975917650-4e1e0b10b3b0?w=600&q=80',
        sku: item.sku || `DB-${i}`
      }));
      STORE_ITEMS = [
        ...STORE_ITEMS,
        ...remoteItems.filter(remote => !STORE_ITEMS.some(local => local.id === remote.id || local.sku === remote.sku))
      ];
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
        <div><strong>Bank:</strong> Fidelity Bank</div>
        <div><strong>Account Name:</strong> Law Students Association</div>
        <div><strong>Account Number:</strong> 6060197309</div>
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
  const phone = '2347057705284';
  const text = encodeURIComponent(`Hello LAWSA, I have paid for ${title} (₦${price}). Name: [Your Name]. Phone: [Your Phone]. Transaction Reference: [Reference]. Please confirm receipt.`);
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
