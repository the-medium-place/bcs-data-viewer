const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GroupsSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    groups: Object,

})


const Groups = mongoose.model("Groups", GroupsSchema);

module.exports = Groups;