import { Router } from 'express';
import fs from 'fs/promises'

const productsRouter = Router();
const productsFilePath = 'productos.json';
let nextProductId = 1;

productsRouter.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    let products = JSON.parse(data);

    const limit = parseInt(req.query.limit);
    if (!isNaN(limit) && limit > 0) {
      products = products.slice(0, limit);
    }

    res.json(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const data = await fs.readFile(productsFilePath, 'utf8');
    const products = JSON.parse(data);
    const product = products.find((p) => p.id == pid);

    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post('/', async (req, res) => {
    const product = {
      id: nextProductId++,
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      status: req.body.status || true,
      stock: req.body.stock,
      category: req.body.category,
      thumbnails: req.body.thumbnails || [],
    };

    const data = await fs.readFile(productsFilePath, 'utf8');
    
    const products = JSON.parse(data);

    products.push(product);

    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    res.json(product);
});

productsRouter.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const data = await fs.readFile(productsFilePath, 'utf8');
    let products = JSON.parse(data);
    const index = products.findIndex((p) => p.id == pid);

    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
      res.json(products[index]);
    } else {
      res.status(404).send('Product not found');
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const data = await fs.readFile(productsFilePath, 'utf8');
    let products = JSON.parse(data);
    products = products.filter((p) => p.id != pid);

    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    res.send('Product deleted successfully');
});

export default productsRouter;