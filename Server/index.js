const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const session = require('express-session');
const mongoose = require('mongoose')
const cors = require('cors')
const { DBConnection } = require('./database/db');

const TodoModel = require('./Models/Todo');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');



DBConnection();



const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // your frontend origin
    credentials: true               // allow cookies to be sent
}));


app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true if using HTTPS
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));



app.use('/auth', authRoutes);
app.use('/api/todo', todoRoutes);

app.get('/get', (req, res) => {
    TodoModel.find()
        .then(result => res.json(result))
        .catch(err => res.json(err))
})

app.post('/add', (req, res) => {
    const { task, dueDate, isCalendar } = req.body.task;
    TodoModel.create({
        task: task,
        dueDate: dueDate || null,
        isCalendar: !!isCalendar,
        done: false
    }).then(result => res.json(result))
        .catch(err => res.json(err))
})

app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
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

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndDelete({ _id: id })
        .then(result => res.json(result))
        .catch(err => res.json(err))
})


app.listen(process.env.PORT, () => {
    console.log("Server is running")
})

app.get('/', (req, res) => {
    res.send('API is running');
});
