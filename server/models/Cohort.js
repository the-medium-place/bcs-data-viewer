const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CohortSchema = new Schema({
    cohortCode: String,
    cohortId: Number,
    enrollmentId: Number,

    studentRoster: [{
        type: String
    }],
    droppedStudents: [{
        type: String
    }]

})


const Cohort = mongoose.model("Cohort", CohortSchema);

module.exports = Cohort;