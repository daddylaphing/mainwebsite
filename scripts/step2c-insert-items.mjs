// Insert order_items with correct schema: id, order_id, product_id, variant_id, name, price, quantity, image_url, kit_config
const SUPABASE_URL = 'https://gyrvdaucaznmastgspvc.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cnZkYXVjYXpubWFzdGdzcHZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjc0NDczMCwiZXhwIjoyMDk4MzIwNzMwfQ.OvXpoO6f62jkW-W8x1iHVUKOfMO_b0xMPLPj2dNflqo';

const ORDER_ID = '03d62eec-f252-4e9a-9423-d81589bb9180';
const PRODUCT_ID = 'f26da13a-a2c4-4a9f-aad1-27c658a85973';

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

console.log('=== Inserting 3 order_items (correct schema) ===\n');

// Schema: id, order_id, product_id, variant_id, name, price, quantity, image_url, kit_config
const items = [
  { order_id: ORDER_ID, product_id: PRODUCT_ID, name: 'Laphing Kit', price: 50, quantity: 1 },
  { order_id: ORDER_ID, product_id: PRODUCT_ID, name: 'Laphing Kit', price: 50, quantity: 1 },
  { order_id: ORDER_ID, product_id: PRODUCT_ID, name: 'Laphing Kit', price: 50, quantity: 1 },
];

for (let i = 0; i < items.length; i++) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
    method: 'POST',
    headers,
    body: JSON.stringify(items[i]),
  });
  const result = await res.json();
  if (res.status === 201) {
    const item = Array.isArray(result) ? result[0] : result;
    console.log(`✅ Item ${i+1} inserted: ID ${item.id}`);
  } else {
    console.log(`❌ Item ${i+1} failed:`, result.message);
  }
}

// Verify
console.log('\nVerifying order with items...');
const verifyRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}&select=*,order_items(*)`, {
  headers,
});
const orders = await verifyRes.json();
if (orders && orders.length > 0) {
  const order = orders[0];
  console.log(`\n✅ Order verified:`);
  console.log(`   ID: ${order.id}`);
  console.log(`   Order Number: ${order.order_number}`);
  console.log(`   Status: ${order.status}`);
  console.log(`   Payment Status: ${order.payment_status}`);
  console.log(`   Total: ₹${order.total}`);
  console.log(`   Items: ${order.order_items?.length || 0}`);
  if (order.order_items) {
    order.order_items.forEach((item, i) => {
      console.log(`   Item ${i+1}: ${item.name} x${item.quantity} @ ₹${item.price}`);
    });
  }
}
