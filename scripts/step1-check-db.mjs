// STEP 1: Check DB structure - profiles, orders, products tables
const SUPABASE_URL = 'https://gyrvdaucaznmastgspvc.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cnZkYXVjYXpubWFzdGdzcHZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjc0NDczMCwiZXhwIjoyMDk4MzIwNzMwfQ.OvXpoO6f62jkW-W8x1iHVUKOfMO_b0xMPLPj2dNflqo';

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
};

async function query(path, params = '') {
  const url = `${SUPABASE_URL}/rest/v1/${path}${params}`;
  const res = await fetch(url, { headers });
  const data = await res.json();
  return { status: res.status, data };
}

console.log('=== STEP 1: DB Structure Check ===\n');

// 1. Find user by email
console.log('1. Looking up user: ggambhir1919@gmail.com');
const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=ggambhir1919@gmail.com`, {
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  }
});
const authData = await authRes.json();
console.log('Auth API status:', authRes.status);

let userId = null;
if (authData.users && authData.users.length > 0) {
  userId = authData.users[0].id;
  console.log('✅ Found user in auth.users');
  console.log('   user_id:', userId);
  console.log('   email:', authData.users[0].email);
  console.log('   created_at:', authData.users[0].created_at);
} else {
  console.log('❌ User not found via auth API. Response:', JSON.stringify(authData).slice(0, 200));
}

// 2. Check profiles table
console.log('\n2. Checking profiles table...');
const { status: profStatus, data: profiles } = await query('profiles', `?email=eq.ggambhir1919@gmail.com&select=*`);
console.log('Profiles query status:', profStatus);
if (profiles && profiles.length > 0) {
  console.log('✅ Found in profiles table:', JSON.stringify(profiles[0], null, 2));
  userId = userId || profiles[0].id || profiles[0].user_id;
} else {
  console.log('Profile result:', JSON.stringify(profiles).slice(0, 200));
  // Try fetching all profiles to see schema
  const { data: sampleProfiles } = await query('profiles', '?limit=3&select=*');
  console.log('Sample profiles (to see schema):', JSON.stringify(sampleProfiles, null, 2));
}

// 3. Check orders table schema
console.log('\n3. Checking orders table columns...');
const { status: ordStatus, data: orders } = await query('orders', '?limit=2&select=*');
console.log('Orders query status:', ordStatus);
if (orders && orders.length > 0) {
  console.log('✅ Orders table columns:', Object.keys(orders[0]));
  console.log('Sample order:', JSON.stringify(orders[0], null, 2));
} else {
  console.log('Orders result:', JSON.stringify(orders).slice(0, 300));
}

// 4. Check order_items table schema
console.log('\n4. Checking order_items table columns...');
const { status: oiStatus, data: orderItems } = await query('order_items', '?limit=2&select=*');
console.log('Order items query status:', oiStatus);
if (orderItems && orderItems.length > 0) {
  console.log('✅ Order_items columns:', Object.keys(orderItems[0]));
} else {
  console.log('Order items result:', JSON.stringify(orderItems).slice(0, 300));
}

// 5. List active products with prices
console.log('\n5. Active products...');
const { status: prodStatus, data: products } = await query('products', '?active=eq.true&select=id,name,price,inventory&order=name.asc');
console.log('Products query status:', prodStatus);
if (products && products.length > 0) {
  console.log(`✅ Found ${products.length} active products:`);
  products.forEach(p => console.log(`   - ${p.name}: ₹${p.price} (stock: ${p.inventory})`));
} else {
  console.log('Products result:', JSON.stringify(products).slice(0, 300));
}

// Save userId for next step
console.log('\n=== RESULT SUMMARY ===');
console.log('User ID to use:', userId);
if (userId) {
  // Write userId to a temp file for next steps
  import('fs').then(fs => {
    fs.writeFileSync('./scripts/temp-user-id.txt', userId);
    console.log('✅ Saved user_id to scripts/temp-user-id.txt');
  });
}
