const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    studentName: String,

    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]

})


const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;