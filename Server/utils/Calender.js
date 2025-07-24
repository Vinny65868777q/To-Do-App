const { google } = require('googleapis');
const oauth2Client = require('./googleAuth');

const createCalendarEvent = async (task, tokens) => {
    //Use this user's credentials to make authorized Google Calendar API calls.
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });


    const startDate = new Date(task.dueDate)

    const event = {
        summary: task.task, //Title of the calendar event —  the task's name.
        start: {
            dateTime: startDate.toISOString(), // NOT just dueDate
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: new Date(startDate.getTime() + 30 * 60 * 1000).toISOString(), // +1 hour //Event ends 30 minutes after the start. 
            timeZone: 'Asia/Kolkata',
        },
        reminders: {
            useDefault: false, // Override default calendar settings
            overrides: [
                { method: 'email', minutes: 30 },
                { method: 'popup', minutes: 10 },
            ],
        },
    };

    try {
        const response = await calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',//“Insert this event into the authenticated user’s primary calendar.
            resource: event,
        });

        return response.data;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error;
    }
};

module.exports = createCalendarEvent;
