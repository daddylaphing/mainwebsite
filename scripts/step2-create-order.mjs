// STEP 2: Create a test order directly in DB
const SUPABASE_URL = 'https://gyrvdaucaznmastgspvc.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cnZkYXVjYXpubWFzdGdzcHZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjc0NDczMCwiZXhwIjoyMDk4MzIwNzMwfQ.OvXpoO6f62jkW-W8x1iHVUKOfMO_b0xMPLPj2dNflqo';

const USER_ID = 'b24df56f-2efe-4851-b91b-c2973f5eaef8';

// Product ID for Laphing Kit (from step 1 query)
// We need to fetch the product ID for "Laphing Kit"
const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

console.log('=== STEP 2: Create Test Order ===\n');

// First get Laphing Kit product ID
console.log('1. Fetching Laphing Kit product ID...');
const prodRes = await fetch(`${SUPABASE_URL}/rest/v1/products?name=eq.Laphing Kit&select=id,name,price`, {
  headers,
});
const products = await prodRes.json();
console.log('Products:', JSON.stringify(products));

let productId = null;
let productPrice = 49;
if (products && products.length > 0) {
  productId = products[0].id;
  productPrice = products[0].price;
  console.log(`✅ Laphing Kit ID: ${productId}, Price: ₹${productPrice}`);
}

// Check orders table schema by trying to get column info
console.log('\n2. Checking orders table schema via RPC...');
// Let's try to insert the order and see what happens
const orderData = {
  user_id: USER_ID,
  status: 'confirmed',
  payment_status: 'paid',
  payment_method: 'razorpay',
  subtotal: 150,
  tax: 8,
  shipping_charge: 0,
  packaging_charge: 30,
  discount: 0,
  total: 188,
  shipping_address: {
    full_name: 'Test User',
    phone: '9999999999',
    line1: '123 Test Street',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
  },
};

console.log('\n3. Inserting test order...');
console.log('Order data:', JSON.stringify(orderData, null, 2));

const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
  method: 'POST',
  headers,
  body: JSON.stringify(orderData),
});
const orderResult = await orderRes.json();
console.log('Insert status:', orderRes.status);
console.log('Insert result:', JSON.stringify(orderResult, null, 2));

let orderId = null;
if (orderRes.status === 201 || (Array.isArray(orderResult) && orderResult.length > 0)) {
  const order = Array.isArray(orderResult) ? orderResult[0] : orderResult;
  orderId = order.id;
  console.log(`\n✅ Order created! Order ID: ${orderId}`);
  console.log(`   Order Number: ${order.order_number}`);
} else if (orderResult.code) {
  console.log(`\n❌ Failed to insert order: ${orderResult.message}`);
  console.log(`   Code: ${orderResult.code}`);
  console.log(`   Details: ${orderResult.details}`);
  console.log(`   Hint: ${orderResult.hint}`);
  
  // Try to see what columns exist
  console.log('\n   Trying minimal order insert to diagnose...');
  const minimalRes = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ user_id: USER_ID, total: 188 }),
  });
  const minimalResult = await minimalRes.json();
  console.log('   Minimal insert status:', minimalRes.status);
  console.log('   Minimal insert result:', JSON.stringify(minimalResult, null, 2));
}

// Insert order_items if we have an order ID
if (orderId && productId) {
  console.log('\n4. Inserting 3 order_items...');
  const orderItems = [1, 2, 3].map(i => ({
    order_id: orderId,
    product_id: productId,
    product_name: 'Laphing Kit',
    quantity: 1,
    price: 50,
    subtotal: 50,
  }));
  
  // Try inserting one item first to check schema
  const singleItem = {
    order_id: orderId,
    product_id: productId,
    product_name: 'Laphing Kit',
    quantity: 1,
    price: 50,
  };
  
  const itemRes = await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
    method: 'POST',
    headers,
    body: JSON.stringify(singleItem),
  });
  const itemResult = await itemRes.json();
  console.log('Single item insert status:', itemRes.status);
  console.log('Single item result:', JSON.stringify(itemResult, null, 2));
  
  if (itemRes.status === 201 || (Array.isArray(itemResult) && itemResult.length > 0)) {
    console.log('✅ Order item inserted');
    // Insert remaining 2
    const item2Res = await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...singleItem }),
    });
    const item3Res = await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...singleItem }),
    });
    console.log('Items 2 & 3 insert status:', item2Res.status, item3Res.status);
  } else if (itemResult.code) {
    console.log(`❌ Order item insert failed: ${itemResult.message}`);
    // Try to get order_items schema
    const schemaRes = await fetch(`${SUPABASE_URL}/rest/v1/order_items?limit=0&select=*`, {
      method: 'GET',
      headers: {
        ...headers,
        'Prefer': 'count=exact',
        'Range-Unit': 'items',
        'Range': '0-0',
      },
    });
    // Let's check what columns exist via information_schema via RPC
    console.log('\n   Checking order_items columns via information_schema...');
    const colRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_column_info`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ table_name: 'order_items' }),
    });
    console.log('Column info RPC status:', colRes.status);
  }
} else if (!productId) {
  console.log('\n⚠️  No product ID found - inserting items without product_id');
  if (orderId) {
    const itemRes = await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        order_id: orderId,
        product_name: 'Laphing Kit',
        quantity: 3,
        price: 50,
      }),
    });
    const itemResult = await itemRes.json();
    console.log('Items insert status:', itemRes.status);
    console.log('Items result:', JSON.stringify(itemResult, null, 2));
  }
}

// Save order ID for next steps
if (orderId) {
  import('fs').then(fs => {
    fs.writeFileSync('./scripts/temp-order-id.txt', orderId);
    console.log(`\n✅ Saved order_id to scripts/temp-order-id.txt: ${orderId}`);
  });
}

console.log('\n=== STEP 2 COMPLETE ===');
