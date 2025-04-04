document.addEventListener('DOMContentLoaded', () => {
    fetchItems();

    // Add item form submission
    document.getElementById('addForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('itemName').value;
        await addItem(name);
        document.getElementById('itemName').value = '';
        fetchItems();
    });
});

// Fetch and display items
async function fetchItems() {
    const response = await fetch('/api/items');
    const items = await response.json();
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name}</span>
            <div>
                <input type="text" value="${item.name}" id="edit-${item.id}" style="display:none;">
                <button onclick="editItem(${item.id})">Edit</button>
                <button onclick="saveItem(${item.id})" style="display:none;">Save</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        itemList.appendChild(li);
    });
}

// Add a new item
async function addItem(name) {
    await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
}

// Edit an item
function editItem(id) {
    const span = document.querySelector(`#itemList li:nth-child(${id}) span`);
    const editInput = document.getElementById(`edit-${id}`);
    const editBtn = document.querySelector(`#itemList li:nth-child(${id}) button:nth-child(1)`);
    const saveBtn = document.querySelector(`#itemList li:nth-child(${id}) button:nth-child(2)`);

    span.style.display = 'none';
    editInput.style.display = 'inline';
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline';
}

// Save an edited item
async function saveItem(id) {
    const editInput = document.getElementById(`edit-${id}`);
    const newName = editInput.value;
    await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
    });
    fetchItems();
}

// Delete an item
async function deleteItem(id) {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    fetchItems();
}