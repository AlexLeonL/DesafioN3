const fs = require('fs').promises;

class CartManager {
  constructor(cartFile) {
    this.cartFile = cartFile;
    this.currentCartId = 1;
  }

  getAllCarts = async () => {
    const data = await fs.readFile(this.cartFile, 'utf-8');
    return JSON.parse(data);
  };

  addCart = async (cart) => {
    const carts = await this.getAllCarts();
    cart.id = this.generateUniqueID(carts); 
    carts.push(cart);
    await fs.writeFile(this.cartFile, JSON.stringify(carts, null, 2), 'utf-8');
    return cart;
  };

  getCartById = async (cartId) => {
    const carts = await this.getAllCarts();
    return carts.find((cart) => cart.id == cartId);
  };

  updateCart = async (cartId, updatedCart) => {
    const carts = await this.getAllCarts();
    const cartIndex = carts.findIndex((cart) => cart.id == cartId);

    if (cartIndex === -1) {
      throw new Error('Cart no Econtrado');
    }

    updatedCart.id = cartId;
    carts[cartIndex] = updatedCart;

    await fs.writeFile(this.cartFile, JSON.stringify(carts, null, 2), 'utf-8');
    return { success: true };
  };

  addProductToCart = async (cartId, productId, quantity) => {
    const carts = await this.getAllCarts()
    const cartIndex = carts.findIndex((cart) => cart.id == cartId)

    if (cartIndex === -1) {
      throw new Error('Cart no Econtrado')
    }

    const existingProduct = carts[cartIndex].products.find((product) => product.id == productId)

    if (existingProduct) {
      existingProduct.quantity += quantity
    } else {
      carts[cartIndex].products.push({ id: productId, quantity })
    }

    await fs.writeFile(this.cartFile, JSON.stringify(carts, null, 2), 'utf-8')
    return { message: 'Producto agregado al carrito exitosamente' }
  }

  generateUniqueID = (carts) => {
    let newId = this.currentCartId;
    while (carts.some((cart) => cart.id === newId)) {
      newId++;
    }
    this.currentCartId = newId + 1; 
    return newId;
  };
}

module.exports = CartManager
