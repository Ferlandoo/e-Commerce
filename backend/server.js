import express from 'express';
import dotenv from 'dotenv';
import products from './data/products.js';

dotenv.config();

const port = process.env.PORT;

const app = express();

app.get('/', (request, response) => {
    response.send('API is running...')
});


app.get('/api/products', (request, response) => {
    response.json(products);
});

app.get('/api/products/:id', (request, response) => {
    const product = products.find(p => p._id === request.params.id);
    response.json(product);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
