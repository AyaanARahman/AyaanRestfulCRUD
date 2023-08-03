const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productModel')
const app = express()

//How to use middleware
app.use(express.json())

//how to use another thing instead of json in Insomnia
//app.use(express.urlencoded({extended: false}))

//routes
app.get('/', (req, res) => {
    res.send('Hello NODE API')
})

app.get('/blog', (req, res) => {
    res.send('Hello Blog My name is Ayaan')
})

//The curly brace means that it will get all products
app.get('/products', async(req,res) => {
    try{
        const products = await Product.find({});
        res.status(200).json(products);

    } catch(error){
        res.status(500).json({message: error.message})

    }
})

//How to get a single item from ID
//req.params "deconstructs" to parameters to find the ID
app.get('/products/:id', async(req,res) =>{
    try{
        const {id} = req.params;

        const product = await Product.findById(id);
        res.status(200).json(product);

    } catch(error){
        res.status(500).json({message: error.message})
    }
})

//you interact with the DB so make sure to put 'await'. When you put await, you put async in front of the function because you interact with the database
app.post('/products', async(req, res)=> {
    try{
        const product = await Product.create(req.body)
        res.status(200).json(product);

    } catch(error){
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

//To update or edit data in the DB
app.put('/products/:id', async(req, res) =>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        //we cannot find any product in database i.e. if it didn't update either
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);

        //if the product updated successully
        res.status(200).json(updatedProduct);


    } catch(error){
        res.status(500).json({message:error.message})
    }
})

//Delete a product
app.delete('/products/:id', async(req, res) =>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);

        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        //const updatedProduct = await Product.findById(id);
        res.status(200).json(product);
    } catch(error){
        res.status(500).json({message: error.message})
    }
})



//After creating a DB in MongoDB, this is how you connect it (remember to type in the password and add a name)
//The name I did was Node-API
mongoose.
connect('mongodb+srv://Ayaan:july2204@ayaanapi.85nw6mv.mongodb.net/Node-API?retryWrites=true&w=majority')
.then(() => {
    console.log('connected to MongoDB')
    app.listen(3000, ()=> {
        console.log(`Node API app is running on port 3000`)
    });
}).catch((error) => {
    console.log(error)
})
