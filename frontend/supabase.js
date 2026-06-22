// Supabase helper functions for frontend
// These will communicate with the backend API

const API_BASE = window.API_BASE || 'http://localhost:4000';

// Items API
async function getAllItems() {
  const res = await fetch(`${API_BASE}/api/items`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return await res.json();
}

async function getApprovedItems() {
  const res = await fetch(`${API_BASE}/api/items/approved`);
  if (!res.ok) throw new Error('Failed to fetch approved items');
  return await res.json();
}

async function getItemsByCategory(category) {
  const res = await fetch(`${API_BASE}/api/items/category/${category}`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return await res.json();
}

async function addItem(itemData) {
  const res = await fetch(`${API_BASE}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  if (!res.ok) throw new Error('Failed to add item');
  return await res.json();
}

async function updateItemStatus(id, status) {
  const res = await fetch(`${API_BASE}/api/items/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update item');
  return await res.json();
}

async function deleteItem(id) {
  const res = await fetch(`${API_BASE}/api/items/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete item');
  return await res.json();
}

// Claims API
async function getAllClaims() {
  const res = await fetch(`${API_BASE}/api/claims`);
  if (!res.ok) throw new Error('Failed to fetch claims');
  return await res.json();
}

async function addClaim(claimData) {
  const res = await fetch(`${API_BASE}/api/claims`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(claimData)
  });
  if (!res.ok) throw new Error('Failed to add claim');
  return await res.json();
}

async function updateClaimStatus(id, status) {
  const res = await fetch(`${API_BASE}/api/claims/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update claim');
  return await res.json();
}

async function deleteClaim(id) {
  const res = await fetch(`${API_BASE}/api/claims/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete claim');
  return await res.json();
}

// Upload API
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to upload image');
  const data = await res.json();
  return data.publicUrl;
}
