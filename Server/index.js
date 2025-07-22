const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { DBConnection } = require('./database/db');
const dotenv = require('dotenv');
const TodoModel = require('./Models/Todo')

dotenv.config();
DBConnection();


const app = express()
app.use(cors())
app.use(express.json())

app.get('/get',(req,res) =>{
    TodoModel.find()
    .then(result =>res.json(result))
    .catch(err =>res.json(err))
})
app.post('/add',(req,res) =>{
    const task = req.body.task;
    TodoModel.create({
        task:task  
    }).then(result =>res.json(result))
    .catch(err =>res.json(err))
})

app.put('/update/:id',async(req,res) => {
   const {id} =req.params;
   TodoModel.findById(id)
    .then(todo => {
            return TodoModel.findByIdAndUpdate(
                { _id: id },
                { done: !todo.done },
                { new: true }
            );
        })
        .then(updated => {
            res.json(updated);
        })
        .catch(err => {
            res.json(err);
        });
});

app.delete('/delete/:id',(req,res) =>{
    const {id} =req.params;
    TodoModel.findByIdAndDelete({_id:id})
    .then(result =>res.json(result))
   .catch(err => res.json(err))
})

app.listen(process.env.PORT, () =>{
    console.log("Server is running")
})

app.get('/', (req, res) => {
  res.send('API is running');
});
