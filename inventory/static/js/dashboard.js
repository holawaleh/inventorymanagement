document.addEventListener('DOMContentLoaded', function () {
  fetchItems();
});

function fetchItems() {
  fetch('/api/items/')
    .then(response => {
      if (response.status === 403) {
        window.location.href = '/login/';
        return;
      }
      return response.json();
    })
    .then(data => {
      const list = document.getElementById('item-list');
      list.innerHTML = '';

      data.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item';
        li.innerHTML = `
          <div>
            <strong>${item.name}</strong>: ${item.description || 'No description'}
            <br>
            <small>Qty: ${item.quantity} | ₦${item.price} | ${item.category || 'Uncategorized'}</small>
          </div>
          <button onclick="deleteItem(${item.id})">Delete</button>
        `;
        list.appendChild(li);
      });
    })
    .catch(err => console.error('Error:', err));
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