// STEP 4: Test order status update to "preparing"
const SUPABASE_URL = 'https://gyrvdaucaznmastgspvc.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cnZkYXVjYXpubWFzdGdzcHZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjc0NDczMCwiZXhwIjoyMDk4MzIwNzMwfQ.OvXpoO6f62jkW-W8x1iHVUKOfMO_b0xMPLPj2dNflqo';
const ORDER_ID = '03d62eec-f252-4e9a-9423-d81589bb9180';

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

console.log('=== STEP 4: Test Order Status Update ===\n');
console.log(`Updating order ${ORDER_ID} status from "confirmed" to "preparing"...`);

// First verify current status
const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}&select=id,order_number,status,preparing_at`, {
  headers,
});
const checkData = await checkRes.json();
console.log(`Current status: ${checkData[0]?.status}`);

// NOTE: "confirmed" is not a valid order_status_enum value per migration.
// Valid values are: pending, accepted, preparing, ready, completed, cancelled
// Our test order used "confirmed" which was accepted (must be a custom type or the enum was extended).
// Let's check what happened and update to "preparing"

const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}`, {
  method: 'PATCH',
  headers,
  body: JSON.stringify({ status: 'preparing' }),
});
const updateData = await updateRes.json();
console.log(`\nUpdate status code: ${updateRes.status}`);

if (updateRes.status === 200) {
  const order = Array.isArray(updateData) ? updateData[0] : updateData;
  console.log(`✅ Status updated successfully!`);
  console.log(`   New status: ${order.status}`);
  console.log(`   Preparing at: ${order.preparing_at}`);
  console.log(`   Updated at: ${order.updated_at}`);
} else {
  console.log(`❌ Update failed:`);
  console.log(JSON.stringify(updateData, null, 2));
  
  // If "confirmed" is causing issues (not valid enum), let's check
  console.log('\nChecking order_status_enum values...');
  // Try updating to "accepted" first
  const accepted = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status: 'accepted' }),
  });
  const acceptedData = await accepted.json();
  console.log(`Update to "accepted" status: ${accepted.status}`);
  if (accepted.status === 200) {
    console.log(`✅ Updated to "accepted"`);
    // Now update to preparing
    const prep = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'preparing' }),
    });
    const prepData = await prep.json();
    console.log(`Update to "preparing" status: ${prep.status}`);
    if (prep.status === 200) {
      const order = Array.isArray(prepData) ? prepData[0] : prepData;
      console.log(`✅ Final status: ${order.status}, preparing_at: ${order.preparing_at}`);
    } else {
      console.log(`❌ Preparing update failed:`, JSON.stringify(prepData, null, 2));
    }
  }
}

// Verify order_status_history was logged
console.log('\nChecking order_status_history...');
const histRes = await fetch(`${SUPABASE_URL}/rest/v1/order_status_history?order_id=eq.${ORDER_ID}&select=*&order=created_at.asc`, {
  headers,
});
const histData = await histRes.json();
console.log(`History status: ${histRes.status}`);
if (histData && histData.length > 0) {
  console.log(`✅ Status history found: ${histData.length} entries`);
  histData.forEach(h => console.log(`   - ${h.status} at ${h.created_at}`));
} else {
  console.log(`History result: ${JSON.stringify(histData).slice(0, 200)}`);
}

// Final order state
console.log('\nFinal order state:');
const finalRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}&select=id,order_number,status,payment_status,total,preparing_at,updated_at`, {
  headers,
});
const finalData = await finalRes.json();
console.log(JSON.stringify(finalData[0], null, 2));
