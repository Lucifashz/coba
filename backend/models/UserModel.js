import mongoose from "mongoose";

// Membuat Schema
const userSchema = new mongoose.Schema(
	{ 
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		partnerId: {
			type: String,
			default: ""
		},
		password: {
			type: String,
			required: true,
		},
		refresh_token: {
			type: String
		}
	}, 
	{ timestamps: true });

const User = mongoose.model('User', userSchema)


export default User;
