import React, { useState, useEffect } from 'react';
import Create from './Create';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';



function Home() {
    const [todos, setTodos] = useState([]);
    const fetchTodos = () => {
        axios.get('http://localhost:3031/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    };//After adding a new task

    useEffect(() => {
        fetchTodos();// On initial page load
    }, []);

    const handleEdit = (id) => {
        axios.put('http://localhost:3031/update/' + id)
            .then(() => {
                setTodos(prev =>
                    prev.map(todo =>//loop through each todo.
                        todo._id === id//if the todo._id matches the one being edited, 
                            ? { ...todo, done: !todo.done }//Return a new object ({ ...todo }) with done flipped (!todo.done).
                            : todo//if not keep it unchanged
                    )
                );
            })
            .catch(err => console.log(err))
    }
    const handleDelete = (id) => {
        axios.delete('http://localhost:3031/delete/' + id)
            .then(()=> {  setTodos(prev => prev.filter(todo => todo._id !== id));})//For each todo in the list, keep it only if its _id is not equal to the one we just deleted.
            .catch(err => console.log(err))
    }

    return (
        <div className="container">
            <h2 className="heading">Todo List</h2>

            <Create onAdd={fetchTodos} />


            {
                todos.length === 0 ? (
                    <div className="no-record">
                        <h3>No Record</h3>
                    </div>
                ) : (
                    todos.map((todo) => (
                        <div key={todo._id} className="todo-item">
                            <div className='checkbox' onClick={() => handleEdit(todo._id)}>
                                {todo.done ?
                                    <BsFillCheckCircleFill className='icon'></BsFillCheckCircleFill>
                                    : <BsCircleFill className='icon' />
                                }
                                <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
                            </div>
                            <div>
                                <span><BsFillTrashFill className='icon' onClick={() => handleDelete(todo._id)} /></span>
                            </div>
                        </div>
                    ))
                )
            }
        </div>
    );
}

export default Home;
