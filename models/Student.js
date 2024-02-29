const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
    student_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    birth_date: {
        type: Date,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    classIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    }]
});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;
