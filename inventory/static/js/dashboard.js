// =======================
// Helper Functions
// =======================

/**
 * Get CSRF token from browser cookies
 * Required for POST, PUT, DELETE requests
 */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// =======================
// DOM Ready: Load Data on Page Load
// =======================

document.addEventListener('DOMContentLoaded', function () {
  fetchItems();
  fetchLowStock();
});

// =======================
// Fetch & Display Inventory Items
// =======================

function fetchItems() {
  fetch('/api/items/')
    .then(response => {
      if (response.status === 403) {
        alert('Session expired. Redirecting to login.');
        window.location.href = '/login/';
        return;
      }
      return response.json();
    })
    .then(data => {
      const list = document.getElementById('item-list');
      list.innerHTML = '';

      const results = data.results || [];

      if (results.length === 0) {
        list.innerHTML = '<li><em>No items yet. Add one!</em></li>';
      } else {
        results.forEach(item => {
          const li = document.createElement('li');
          li.className = 'item';
          li.innerHTML = `
            <div>
              <strong>${escapeHtml(item.name)}</strong>: ${escapeHtml(item.description || 'No description')}
              <br>
              <small>Qty: ${item.quantity} | ₦${item.price} | ${escapeHtml(item.category || 'Uncategorized')}</small>
            </div>
            <button onclick="deleteItem(${item.id})">Delete</button>
          `;
          list.appendChild(li);
        });
      }
    })
    .catch(err => {
      console.error('Error fetching items:', err);
      document.getElementById('item-list').innerHTML = '<li><em>Error loading items</em></li>';
    });
}

<script src="{% static 'js/dashboard.js' %}"></script>

function addItem(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    quantity: parseInt(formData.get('quantity')) || 0,
    price: parseFloat(formData.get('price')) || 0,
    category: formData.get('category')
  };

  // Validate required fields
  if (!data.name || data.quantity < 0 || data.price < 0) {
    alert('Please fill in all required fields with valid values.');
    return;
  }

  fetch('/api/items/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 403) {
        window.location.href = '/login/';
        throw new Error('Unauthorized');
      }
      return response.json().then(err => { throw err; });
    }
    return response.json();
  })
  .then(item => {
    form.reset();
    fetchItems();
    fetchLowStock();
  })
  .catch(err => {
    console.error('Error adding item:', err);
    alert('Failed to add item. Check console for details.');
  });
}

// =======================
// Delete Item
// =======================

function deleteItem(id) {
  if (!confirm('Delete this item?')) return;

  fetch(`/api/items/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    }
  })
  .then(() => {
    fetchItems();
    fetchLowStock();
  })
  .catch(err => {
    console.error('Error deleting item:', err);
    alert('Failed to delete item.');
  });
}

// =======================
// Fetch Low Stock Items
// =======================

function fetchLowStock() {
  fetch('/api/items/low_stock/?threshold=5')
    .then(response => {
      if (response.status === 403) {
        window.location.href = '/login/';
        return;
      }
      return response.json();
    })
    .then(data => {
      const list = document.getElementById('low-stock-list');
      list.innerHTML = '';

      const results = data.results || [];

      if (results.length === 0) {
        list.innerHTML = '<li><em>No low stock items</em></li>';
      } else {
        results.forEach(item => {
          const li = document.createElement('li');
          li.className = 'item';
          li.style.color = 'red';
          li.innerHTML = `
            <strong>${escapeHtml(item.name)}</strong>: only <strong>${item.quantity}</strong> left!
          `;
          list.appendChild(li);
        });
      }
    })
    .catch(err => {
      console.error('Error fetching low stock:', err);
      document.getElementById('low-stock-list').innerHTML = '<li><em>Error loading low stock</em></li>';
    });
}