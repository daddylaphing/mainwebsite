// Fix: Get order_items schema and insert items properly
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

console.log('=== Fixing order_items insert ===\n');

// Use Supabase RPC to query information_schema
console.log('Querying information_schema for order_items columns...');
const sqlRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'order_items' ORDER BY ordinal_position" }),
});
console.log('RPC exec_sql status:', sqlRes.status);

// Try direct SQL via the pg connection - use a simpler approach
// Let's look at the migration files to understand the schema
// Try inserting with different column names
const attempts = [
  // Attempt 1: Just required fields
  { order_id: ORDER_ID, product_id: PRODUCT_ID, quantity: 1, price: 50 },
  // Attempt 2: With unit_price
  { order_id: ORDER_ID, product_id: PRODUCT_ID, quantity: 1, unit_price: 50 },
  // Attempt 3: With name field
  { order_id: ORDER_ID, product_id: PRODUCT_ID, product_name: 'Laphing Kit', quantity: 1, price: 50, total: 50 },
];

for (let i = 0; i < attempts.length; i++) {
  console.log(`\nAttempt ${i+1}:`, JSON.stringify(attempts[i]));
  const res = await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
    method: 'POST',
    headers,
    body: JSON.stringify(attempts[i]),
  });
  const result = await res.json();
  console.log(`Status: ${res.status}`);
  if (res.status === 201) {
    console.log('✅ SUCCESS! Columns used:', Object.keys(attempts[i]));
    console.log('Result:', JSON.stringify(result, null, 2));
    
    // Insert 2 more items
    for (let j = 0; j < 2; j++) {
      const r2 = await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
        method: 'POST',
        headers,
        body: JSON.stringify(attempts[i]),
      });
      console.log(`Item ${j+2} insert status:`, r2.status);
    }
    break;
  } else {
    console.log('❌ Error:', result.message);
  }
}

// Verify order items in DB
console.log('\nVerifying order items...');
const verifyRes = await fetch(`${SUPABASE_URL}/rest/v1/order_items?order_id=eq.${ORDER_ID}&select=*`, {
  headers,
});
const items = await verifyRes.json();
console.log(`Order items count: ${Array.isArray(items) ? items.length : 'error'}`);
console.log('Items:', JSON.stringify(items, null, 2));
