const fs = require('fs').promises;

class ProductManager {
  constructor(productFile) {
    this.productFile = productFile;
    this.currentProductId = 1; 
  }

  getAllProducts = async () => {
    const data = await fs.readFile(this.productFile, 'utf-8');
    return JSON.parse(data);
  };

  addProduct = async (product) => {
    const products = await this.getAllProducts();
    product.id = this.generateUniqueID(products);
    product.id = Number(product.id);
    products.push(product);
    await fs.writeFile(this.productFile, JSON.stringify(products, null, 2), 'utf-8');
    return product;
  };

  getProductById = async (productId) => {
    const products = await this.getAllProducts();
    return products.find((product) => product.id == productId);
  };

  updateProduct = async (productId, updatedProduct) => {
    try {
      const products = await this.getAllProducts();
      const productIndex = products.findIndex((product) => product.id == productId);
  
      if (productIndex === -1) {
        throw new Error('Producto no encontrado');
      }
  
      updatedProduct.id = Number(productId);
      products[productIndex] = updatedProduct;
  
      await fs.writeFile(this.productFile, JSON.stringify(products, null, 2), 'utf-8');

      return { success: true, message: 'Producto actualizado correctamente', updatedProduct };
    } catch (error) {
      console.error(error);

      return { success: false, error: 'Error al actualizar el producto' };
    }
  };


  deleteProduct = async (productId) => {
    try {
      const products = await this.getAllProducts();
      const productIndex = products.findIndex((product) => product.id == productId);
  
      if (productIndex === -1) {
        throw new Error('Producto no encontrado');
      }
  
      const deletedProduct = products.splice(productIndex, 1)[0];
      await fs.writeFile(this.productFile, JSON.stringify(products, null, 2), 'utf-8');
  
      return { success: true, message: 'Producto eliminado', product: deletedProduct };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al eliminar el producto' };
    }
  };

  generateUniqueID = (products) => {
    // Generar un nuevo ID único que no exista en la lista de productos
    let newId = this.currentProductId;
    while (products.some((product) => product.id === newId)) {
      newId++;
    }
    return newId;
  };
}

module.exports = ProductManager;