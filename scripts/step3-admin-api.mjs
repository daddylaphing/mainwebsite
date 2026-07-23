// STEP 3: Test admin API endpoints
const SUPABASE_URL = 'https://gyrvdaucaznmastgspvc.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cnZkYXVjYXpubWFzdGdzcHZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjc0NDczMCwiZXhwIjoyMDk4MzIwNzMwfQ.OvXpoO6f62jkW-W8x1iHVUKOfMO_b0xMPLPj2dNflqo';
const ORDER_ID = '03d62eec-f252-4e9a-9423-d81589bb9180';

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
};

async function testEndpoint(label, path, params = '') {
  const url = `${SUPABASE_URL}/rest/v1/${path}${params}`;
  const res = await fetch(url, { headers });
  const data = await res.json();
  const count = Array.isArray(data) ? data.length : (data ? 1 : 0);
  if (res.status === 200) {
    console.log(`✅ ${label}: status=${res.status}, records=${count}`);
    if (count > 0 && Array.isArray(data)) {
      console.log(`   Sample keys: ${Object.keys(data[0]).join(', ')}`);
    } else if (data && !Array.isArray(data) && data.code) {
      console.log(`   ⚠️  Error: ${data.message}`);
    }
  } else {
    console.log(`❌ ${label}: status=${res.status}`);
    console.log(`   Error: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return { status: res.status, data };
}

console.log('=== STEP 3: Admin API Endpoints ===\n');

// 1. GET /rest/v1/orders
console.log('1. Testing orders endpoint...');
const { data: orders } = await testEndpoint('GET /rest/v1/orders', 'orders', '?select=*&order=created_at.desc&limit=5');
if (orders && orders.length > 0) {
  console.log(`   First order: #${orders[0].order_number}, status=${orders[0].status}, total=₹${orders[0].total}`);
}

// 2. GET /rest/v1/products  
console.log('\n2. Testing products endpoint...');
const { data: products } = await testEndpoint('GET /rest/v1/products', 'products', '?select=*&active=eq.true');
if (products && products.length > 0) {
  console.log(`   Products: ${products.map(p => p.name).join(', ')}`);
}

// 3. GET /rest/v1/faqs
console.log('\n3. Testing faqs endpoint...');
const { data: faqs } = await testEndpoint('GET /rest/v1/faqs', 'faqs', '?select=*&order=display_order.asc');

// 4. GET /rest/v1/site_settings
console.log('\n4. Testing site_settings endpoint...');
const { data: settings } = await testEndpoint('GET /rest/v1/site_settings', 'site_settings', '?select=*');

// 5. Additional tables used by admin
console.log('\n5. Testing additional admin tables...');
await testEndpoint('GET /rest/v1/reviews', 'reviews', '?select=*&limit=3');
await testEndpoint('GET /rest/v1/profiles', 'profiles', '?select=*&limit=3');
await testEndpoint('GET /rest/v1/vouchers', 'vouchers', '?select=*&limit=3');
await testEndpoint('GET /rest/v1/recipe_guides', 'recipe_guides', '?select=*&limit=3');
await testEndpoint('GET /rest/v1/categories', 'categories', '?select=*&limit=3');

// 6. Test orders with items join
console.log('\n6. Testing orders join with order_items...');
const joinRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}&select=*,order_items(*)`, { headers });
const joinData = await joinRes.json();
if (joinRes.status === 200 && joinData.length > 0) {
  console.log(`✅ Orders join working: found order with ${joinData[0].order_items?.length} items`);
} else {
  console.log(`❌ Orders join failed: ${joinRes.status}`);
}

// 7. Test orders with profiles join (for admin view)
console.log('\n7. Testing orders join with profiles (admin view)...');
const profJoinRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*,profiles(full_name,role)&limit=3`, { headers });
const profJoinData = await profJoinRes.json();
console.log(`Orders+profiles join status: ${profJoinRes.status}`);
if (profJoinRes.status === 200) {
  console.log(`✅ Orders+profiles join working`);
  if (profJoinData.length > 0) {
    console.log(`   Sample: ${JSON.stringify(profJoinData[0]).slice(0, 150)}`);
  }
} else {
  console.log(`❌ Error: ${JSON.stringify(profJoinData).slice(0, 200)}`);
}

console.log('\n=== STEP 3 COMPLETE ===');
