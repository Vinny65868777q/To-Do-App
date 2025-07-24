const axios = require('axios');
const express = require('express');
const router = express.Router();
const oauth2Client = require('../utils/googleAuth');
const { google } = require('googleapis');
const Task = require('../Models/Todo'); // adjust path if needed
const createCalendarEvent =require('../utils/Calender');


router.get('/google', (req, res) => {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
    });
    res.redirect(url); // Send user to Google's login page

});


router.get('/google/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        req.session.tokens = tokens; // Save tokens in user's session
        const taskData = req.session.taskToAdd;
           console.log("⚠️ Task from session:", taskData);
        if (taskData) {
            // 1. Save task to DB
            const newTask = new Task({
                task: taskData.task,
                dueDate: taskData.dueDate,
                isCalendar: true,
            });
            const savedTask = await newTask.save();

            await createCalendarEvent(savedTask, tokens);
            // Clear task from session
            delete req.session.taskToAdd;
        }

        //edirect back to frontend
        res.redirect('http://localhost:5173?auth=success');
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        res.status(500).send('Authentication failed');
    }
});

router.get('/get-temp-task', (req, res) => {
    if (req.session.taskToAdd) {
        const task = req.session.taskToAdd;
        delete req.session.taskToAdd; // Clear it after sending
        res.json({ task });
    } else {
        res.json({ task: null });
    }
});

router.post('/save-temp-task', (req, res) => {
    const { task, dueDate, isCalendar } = req.body;
    if (!task || !dueDate) {
        return res.status(400).json({ error: 'Task and due date required' });
    }

    req.session.taskToAdd = { task, dueDate, isCalendar };
    res.status(200).json({ message: 'Task temporarily saved' });
});

module.exports = router;
