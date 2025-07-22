import React,{useState} from 'react';
import axios from 'axios';

function Create({ onAdd }) {
    const [task,setTask] = useState("")
    const handleAdd =() => {
       axios.post('http://localhost:3031/add',{task:task})  
       .then(result => {setTask("");   // clear input
                onAdd();})       //  Call fetchTodos from parent (Home.jsx)
                //This ensures that once a task is added, the parent (Home.jsx) gets a signal to reload the todo list from the server.
       .catch(err => console.log(err))
    } 
    return (
        <div className='create_form'>
            <input type="text"  value={task} placeholder='Enter Task' onChange={(e) => setTask(e.target.value)}/>
            <button type="button" onClick={handleAdd}>Add</button>
        </div>
    )
}

export default Create;