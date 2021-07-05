const mongoose = require('mongoose');
const Todoscema = new mongoose.Schema({
    title: {
        type: String,
    },
    desc: {
        type: String
    },
    date: {
        type: Date,
        default: new Date
    }

})
const TodoModel = new mongoose.model('TodoModel', Todoscema);

module.exports = TodoModel;