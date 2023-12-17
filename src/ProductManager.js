const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  getProducts() {
    return this.products;
  }

  addProduct(product) {
    const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
  
    if (!Object.keys(product).every(field => requiredFields.includes(field) && product[field])) {
      throw new Error('Ingrese todos los campos obligatorios');
    }
  
    const id = this.products.length + 1;
    product.id = id;
  
    if (this.products.some(p => p.code === product.code)) {
      throw new Error('El código del producto ya existe');
    }
  
    this.products.push(product);
    this.saveProducts();
    return product;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return product;
  }

  updateProduct(id, updatedFields) {
    const product = this.getProductById(id);
    Object.assign(product, updatedFields);
    this.saveProducts();
    return { message: 'Producto Actualizado correctamente', product };
  }
  
  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
  
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
  
    const deletedProduct = this.products.splice(index, 1)[0];
    this.saveProducts();
    return { message: 'Producto Eliminado correctamente', deletedProduct };
  }
}


module.exports = ProductManager;



