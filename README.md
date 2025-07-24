##To-Do List App

A simple and elegant To-Do List application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with real-time task management, browser notifications, and seamless Google Calendar integration.

---

##Features

- Create, update, and delete tasks  
- Beautiful glassmorphic UI  
- Browser push notifications  
- Google Calendar Sync — Add tasks directly to user's calendar with OAuth2 login  
- Session-based state saves task before authentication

---

##  Tech Stack

### Frontend
- React.js  
- Axios  
- Modern CSS (Glassmorphic Design)

### Backend
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- **Google APIs (Calendar API & OAuth 2.0)**  
- Express-session for session handling during OAuth flow

---

## Google Calendar Integration Details

- Uses `googleapis` Node.js SDK  
- Google OAuth2 login to authenticate user  
- Generates tasks on the user’s Google Calendar using the Calendar API (`events.insert`)  
- Stores task temporarily in session before authentication  

