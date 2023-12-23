const express = require('express');
const router = express.Router();
const ProductManager = require('../data/ProductManager');

const productManager = new ProductManager('./data/products.json');

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    const limit = req.query.limit;
    const limitedProducts = limit ? products.slice(0, parseInt(limit)) : products;
    res.json(limitedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = {
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      status: true,
      stock: req.body.stock,
      category: req.body.category,
      thumbnails: req.body.thumbnails || [],
    };

    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock) {
      res.status(400).json({ error: 'Todos los campos son requeridos' });
      return;
    }

    const createdProduct = await productManager.addProduct(newProduct);
    res.json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const existingProduct = await productManager.getProductById(req.params.pid);

    if (!existingProduct) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    const updatedProduct = {
      ...existingProduct,
      ...req.body,
      id: Number(req.params.pid), 
    };

    const result = await productManager.updateProduct(req.params.pid, updatedProduct);

    if (!result.success) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
      return;
    }

    res.json({ message: 'Producto Actualizado correctamente', updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const result = await productManager.deleteProduct(req.params.pid);
    if (!result.success) {
      res.status(404).json({ error: 'El producto se Elimino o No se encuentra' });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;