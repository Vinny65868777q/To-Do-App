import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Create({ onAdd }) {
    const [task, setTask] = useState('');
    const [isCalendar, setIsCalendar] = useState(false);
    const [dueDate, setDueDate] = useState('');

    const handleSimpleAdd = async () => {
        if (!task.trim()) return alert("Task cannot be empty");

        try {
            await axios.post('http://localhost:3031/add', {
                task,
                isCalendar: false
            });

            console.log("Simple task added");

            setTask('');
            setIsCalendar(false);
            setDueDate('');
            onAdd();

        } catch (err) {
            console.log("Error occurred:", err?.response?.data || err.message);
        }
    };

    const handleCalendarAdd = async () => {
        if (!task.trim()) return alert("Task cannot be empty");
        if (!dueDate) return alert("Due date is required");

        try {
            // 1. Save the task to session
            await axios.post('http://localhost:3031/auth/save-temp-task', {
                task,
                dueDate,
                isCalendar: true
            }, {
                withCredentials: true
            });

            // 2. Redirect to Google login
            window.location.href = 'http://localhost:3031/auth/google';

        } catch (err) {
            console.error('Error saving task before auth:', err);
        }
    };


    return (
        <div className='create_form'>
            <input
                type="text"
                value={task}
                placeholder='Enter Task'
                onChange={(e) => setTask(e.target.value)}
            />

            <label>
                <input
                    type="checkbox"
                    checked={isCalendar}
                    onChange={(e) => setIsCalendar(e.target.checked)}
                />
                Add to Google Calendar
            </label>

            {isCalendar && (
                <>
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <button type="button" onClick={handleCalendarAdd}>
                        Connect Google Calendar
                    </button>
                </>
            )}

            {!isCalendar && (
                <button type="button" onClick={handleSimpleAdd}>
                    Add
                </button>
            )}
        </div>
    );
}

export default Create;
