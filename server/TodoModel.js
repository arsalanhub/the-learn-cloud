const mongoose=require("mongoose")

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    date: {
        type: Date
    }
})

module.exports = mongoose.model("Todos", todoSchema)