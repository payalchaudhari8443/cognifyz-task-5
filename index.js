const express = require('express');
const app = express();
const port = 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let items = [
    { id: 1, name: 'Learn Node.js' },
    { id: 2, name: 'Build an API' }
];
let nextId = 3;

app.get('/', (req, res) => {
    res.render('index'); // No message variable needed
});

app.get('/api/items', (req, res) => {
    res.json(items);
});

app.post('/api/items', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    const newItem = { id: nextId++, name };
    items.push(newItem);
    res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const item = items.find(i => i.id === id);
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    item.name = name;
    res.json(item);
});

app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    items.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});