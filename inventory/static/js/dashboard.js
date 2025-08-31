document.addEventListener('DOMContentLoaded', function () {
  fetchItems();
});

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

      // ✅ Only loop over data.results
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

function addItem(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    quantity: parseInt(formData.get('quantity')),
    price: parseFloat(formData.get('price')),
    category: formData.get('category')
  };

  fetch('/api/items/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(() => {
    form.reset();
    fetchItems();
  })
  .catch(err => console.error('Error:', err));
}

// Helper to get CSRF token (required for POST)
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

function deleteItem(id) {
  if (!confirm('Delete this item?')) return;

  fetch(`/api/items/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    }
  })
  .then(() => fetchItems())
  .catch(err => console.error('Error:', err));

}

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

// Call it when page loads
document.addEventListener('DOMContentLoaded', function () {
  fetchItems();
  fetchLowStock();  // ← Add this
});