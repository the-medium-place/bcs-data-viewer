const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    content: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

})


const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;