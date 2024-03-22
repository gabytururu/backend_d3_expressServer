// ENTREGABLE - DESAFIO 2: FILESSYSTEM (FS)//
const fs = require('fs');
const path = require('path')

class ProductManager {
    static counter = 1

    constructor(filePath){
        this.path = filePath
    }

    async getProducts(){
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path,'utf-8'))
        }else{
            return []
        }
    }

    async addProduct(productObj){         
            const product = {
                id: 'tbd',
                title: productObj.title, 
                description: productObj.description,
                price: productObj.price,
                thumbnail: productObj.thumbnail,
                code: productObj.code,
                stock: productObj.stock
            }
    
            for(const property in product){
                if(product[property] === undefined){
                    return `ERROR: Producto no agregado - Te faltó proporcionar la propiedad "${property.toUpperCase()}" del producto. Intenta Nuevamente`
                }            
            }   

            let existentProducts =[]
            if(fs.existsSync(this.path)){
                existentProducts = JSON.parse(await fs.promises.readFile(this.path,'utf-8'))
                product.id = existentProducts[existentProducts.length - 1].id + 1
            }else{
                product.id = 1
            }

            if(existentProducts.some(prod=>prod.code === product.code)){
                return `ERROR: Producto no agregado - El CÓDIGO(CODE) de producto ya fue usado antes, intenta nuevamente`
            }
            
            existentProducts.push(product)
            await fs.promises.writeFile(this.path,JSON.stringify(existentProducts, null, 2))           
    
            return `El producto con id#${product.id} y código #${product.code} fue agregado correctamente, Ahora hay ${existentProducts.length} productos en total`
    }
    
    async getProductById(id){   
        const products = await this.getProducts()
        const matchingProduct = products.find(prod=> prod.id===id)
        if(matchingProduct){
            return matchingProduct
        }else{
            return `ERROR: Producto no encontrado - el Id#${id} no está asociado a ningún producto. Intenta nuevamente`
        }
    }

    async updateProductById(id, updatedPropsObj) {
        let allProducts = await this.getProducts()
        const updateProductIndex = allProducts.findIndex(prod => prod.id === id)

        if(updateProductIndex === -1){
            console.log(`ERROR: El producto que deseas actualizar con el id#${id} no fue encontrado. Intenta nuevamente`)
            return
        }

        for(let prop in updatedPropsObj){
            if(prop !== 'id'){
                allProducts[updateProductIndex][prop] = updatedPropsObj[prop]
            }
        }        
        await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, 2))
        return `El producto con el id#${id} fue actualizado correctamente`
    }

    async deleteProductById(id) {
        let allProducts = await this.getProducts()
        const productDeleteIndex = allProducts.findIndex(prod => prod.id === id)

        if(productDeleteIndex === -1){
            return `ERROR: El producto que deseas borrar con el id#${id} no fue encontrado. Intenta nuevamente`
        }
        
        allProducts.splice(productDeleteIndex,1)
        await fs.promises.writeFile(this.path, JSON.stringify(allProducts,null,2))
    
        return `El Producto con Id#${id} fue borrado correctamente en del archivo`
    }
}

module.exports=ProductManager
