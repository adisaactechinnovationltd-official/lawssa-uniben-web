// Minimal admin client-side helpers for store/resource management (uses Supabase where available)
async function saveResource() {
  const title = document.getElementById('resTitle').value;
  const level = document.getElementById('resLevel').value;
  const link = document.getElementById('resLink').value;
  if (!title || !link) return alert('Title and link required');
  if (!window.supabase) return alert('Supabase not configured');
  const { error } = await supabase.from('resources').insert([{ title, academic_level: level, drive_link: link }]);
  if (error) return alert(error.message);
  alert('Resource saved'); loadDashboardData();
}

async function saveStoreItem() {
  const title = document.getElementById('itemTitle').value;
  const price = parseInt(document.getElementById('itemPrice').value || 0, 10);
  const image = document.getElementById('itemImage').value;
  const sku = document.getElementById('itemSku').value;
  if (!title || !price) return alert('Title and price required');
  if (!window.supabase) return alert('Supabase not configured');
  const { error } = await supabase.from('store_items').insert([{ title, price, image_url: image, sku }]);
  if (error) return alert(error.message);
  alert('Store item saved'); loadDashboardData();
}

// We'll also populate the store table when loading dashboard data
const originalLoadDashboard = window.loadDashboardData;
window.loadDashboardData = async function() {
  if (originalLoadDashboard) await originalLoadDashboard();
  if (!window.supabase) return;
  const { data: items } = await supabase.from('store_items').select('*');
  if (items) {
    document.querySelector('#storeTable tbody').innerHTML = items.map(i => `<tr><td>${i.title}</td><td>₦${i.price}</td><td>${i.sku}</td><td><button onclick="deleteStoreItem('${i.id}')">Del</button></td></tr>`).join('');
    window.SUPABASE_STORE_ITEMS = items; // cache
  }
}

async function deleteStoreItem(id) {
  if (!confirm('Delete item?')) return;
  const { error } = await supabase.from('store_items').delete().eq('id', id);
  if (error) return alert(error.message);
  loadDashboardData();
}

window.saveResource = saveResource;
window.saveStoreItem = saveStoreItem;
window.deleteStoreItem = deleteStoreItem;