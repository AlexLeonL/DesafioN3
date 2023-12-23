const express = require('express')
const app = express()
const cartsRouter = require('./routers/cartsRouter')
const productsRouter = require('./routers/productsRouter')

app.use(express.json())

app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

const port = 8080

app.listen(port, () => {
  console.log(`Escuchando en el puerto 8080`);
})  