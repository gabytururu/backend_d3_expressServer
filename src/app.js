const express = require('express');
const path = require('path');
const ProductManager = require('./classes/productManager');

const PORT = 8080
const app = express()
const dataFilePath = path.join(__dirname,'..',"src","data","products.json")
const productManager = new ProductManager(dataFilePath)

app.get("/", async(req,res)=>{
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('Bienvenid@ al Desafio 3 - Ve a la ruta /products para hacer el Testing')
})

app.get("/products", async(req,res)=>{
    let products = await productManager.getProducts()
    let queriedProducts = products
    let limit = req.query.limit
    if(limit && limit>0){
        queriedProducts = queriedProducts.slice(0,limit)
    }
    res.setHeader('Content-Type','application/json');
    return res.status(200).json(queriedProducts)
})

app.get("/products/:pid",async(req,res)=>{
    let id = req.params.pid
    id = Number(id)
    try{
        const matchingProduct = await productManager.getProductById(id)
        res.setHeader('Content-Type','application/json');
        res.status(200).json(matchingProduct)
    }catch(err){
        res.status(400).json({
            error:`Error de conexion al intentar obtener el producto con ID#${id} intenta nuevamente`
        })
    }
})

app.get("*",(req,res)=>{
    res.setHeader('Content-Type','application/json');
    res.status(404).json({
        message:"error 404 - La página a la que intentas acceder no existe"
    });
});

const server = app.listen(PORT,()=>{
    console.log(`Product Manager App is now Live on Port ${PORT}`)
})