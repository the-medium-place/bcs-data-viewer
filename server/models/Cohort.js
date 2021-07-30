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
    }],
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }],
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Groups'
    }]

})


const Cohort = mongoose.model("Cohort", CohortSchema);

module.exports = Cohort;