// Helper to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

// Handle form submission (Create item)
document.getElementById("add-item-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    quantity: document.getElementById("quantity").value,
    price: document.getElementById("price").value,
    category: document.getElementById("category").value,
  };

  const response = await fetch("/api/items/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    document.getElementById("add-item-form").reset();
    loadItems(); // refresh list
  } else {
    const error = await response.json();
    alert("Error: " + JSON.stringify(error));
  }
});

// Delete item
async function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  const response = await fetch(`/api/items/${id}/`, {
    method: "DELETE",
    headers: {
      "X-CSRFToken": csrftoken,
    },
  });

  if (response.ok) {
    loadItems();
  } else {
    alert("Failed to delete item");
  }
}

// Edit item
async function editItem(item) {
  const newName = prompt("Update item name:", item.name);
  if (newName === null) return;

  const newQty = prompt("Update quantity:", item.quantity);
  if (newQty === null) return;

  const newPrice = prompt("Update price:", item.price);
  if (newPrice === null) return;

  const response = await fetch(`/api/items/${item.id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      name: newName,
      quantity: newQty,
      price: newPrice,
    }),
  });

  if (response.ok) {
    loadItems();
  } else {
    alert("Failed to update item");
  }
}

// Load items (main + low stock)
async function loadItems() {
  // All items
  const response = await fetch("/api/items/");
  const data = await response.json();
  const items = data.results || data;
  const list = document.getElementById("item-list");
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}: ${item.description} | Qty: ${item.quantity} | ₦${item.price} | ${item.category}</span>
      <button onclick='editItem(${JSON.stringify(item)})'>✏️ Edit</button>
      <button onclick="deleteItem(${item.id})">🗑 Delete</button>
    `;
    list.appendChild(li);
  });

  // Low stock items
  const lowStockRes = await fetch("/api/items/low_stock/?threshold=5");
  const lowStockData = await lowStockRes.json();
  const lowStock = lowStockData.results || lowStockData;
  const lowList = document.getElementById("low-stock-list");
  lowList.innerHTML = "";
  if (lowStock.length === 0) {
    lowList.innerHTML = "<li>No low stock items 🎉</li>";
  } else {
    lowStock.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} — only ${item.quantity} left!`;
      lowList.appendChild(li);
    });
  }
}

// Load items when page loads
window.onload = loadItems;
