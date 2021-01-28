const mongoose = require('mongoose');
const { string } = require('prop-types');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstname: {
        type: String
    },
    lastname:{
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    subdomain: {
        type: String
    },
    role: {
        type: String
    },
    permission: {
        type: String
    }
}
, {
    collection: 'users'
})
module.exports = mongoose.model('user', userSchema)