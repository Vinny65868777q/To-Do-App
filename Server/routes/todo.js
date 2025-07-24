const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const Todo = require('../Models/Todo');
const createCalendarEvent = require('../utils/Calender');


router.post('/addWithCalendar', async (req, res) => {
    const taskId = req.body.taskId;
 //extracting the task  incoming request body.

    if (!taskId) {
        return res.status(400).json({ message: 'Task ID required' });
    }
    console.log(taskId)
    const tokens = req.session.tokens;//Check if Google OAuth tokens exist in the session.
    if (!tokens) return res.status(401).send('Google Calendar not connected'); //if not, user hasn’t logged in with Google → reject the request.

    try {
        const existingTask = await Todo.findById(taskId);  // fetch from DB

        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await createCalendarEvent(existingTask, tokens);  // sync to calendar
        res.status(200).json({ message: 'Task synced to Google Calendar' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating task' });
    }
});

module.exports = router;
