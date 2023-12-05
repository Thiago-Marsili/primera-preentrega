import { Router } from 'express';
import fs from 'fs/promises'

const cartsRouter = Router();
const cartsFilePath = 'carrito.json';
let nextCartId = 1;

cartsRouter.post('/', async (req, res) => {
    const cart = {
      id: nextCartId++,
      products: [],
    };

    const data = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(data);
    carts.push(cart);

    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    res.json(cart);
});

cartsRouter.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const data = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id == cid);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).send('Cart not found');
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;

    const data = await fs.readFile(cartsFilePath, 'utf8');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex((c) => c.id == cid);

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(
        (p) => p.product == pid
      );

      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += quantity;
      } else {
        carts[cartIndex].products.push({ product: pid, quantity });
      }

      await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

      res.json(carts[cartIndex]);
    } else {
      res.status(404).send('Cart not found');
    }
});

export default cartsRouter;
