const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    task: String,
    done: {
        type: Boolean,
        default: false
    },
    isCalendar: {
        type: Boolean,
        default: false,
    },
    dueDate: {
        type: Date,
         required: function () {
      return this.isCalendar; // only required if isCalendar is true
    },
    }
})

const TodoModel = mongoose.model("todos", TodoSchema)
module.exports = TodoModel