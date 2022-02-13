const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const UserSchema = new Schema({
	firstName: String,
	lastName: String,
	deactivated: Boolean,
	password: String,
	email: String,
	createdDate: { type: Date, default: Date.now },
});
const User = mongoose.model('User', UserSchema);

module.exports = User;
