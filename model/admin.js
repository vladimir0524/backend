const mongoose = require('mongoose');
const { string } = require('prop-types');
const Schema = mongoose.Schema;

let adminSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    file_path: {
        type: String,
        required: true
    },
    role: {
        type: String
    }
}, 
{timestamps: true},
{
    collection: 'admin'
})
module.exports = mongoose.model('admin', adminSchema)