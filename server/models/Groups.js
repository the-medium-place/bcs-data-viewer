const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GroupsSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    groups: Object,

    notes: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        groupName: String,
        notes: String,
        grade: String
    }]

})


const Groups = mongoose.model("Groups", GroupsSchema);

module.exports = Groups;