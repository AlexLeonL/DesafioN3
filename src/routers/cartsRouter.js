const express = require('express');
const router = express.Router();
const CartManager = require('../data/CartManager');

const cartManager = new CartManager('./data/carts.json');

router.post('/', async (req, res) => {
  try {
    const newCart = {
      id: 0, 
      products: [],
    };

    const createdCart = await cartManager.addCart(newCart);
    res.json(createdCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      res.status(404).json({ error: 'Cart no Encontrado' });
      return;
    }
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      res.status(404).json({ error: 'Cart no Encontrado' });
      return;
    }

    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    if (!productId || isNaN(quantity) || quantity <= 0) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    const existingProduct = cart.products.find((product) => product.id == productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity });
    }

    await cartManager.updateCart(req.params.cid, cart);

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router
