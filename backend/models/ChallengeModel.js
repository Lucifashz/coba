import mongoose from "mongoose";

// Membuat Schema
const challengeSchema = new mongoose.Schema(
	{
      challenger: {
         id: {
            type: String,
            required: true,
         },
         partnerId: {
            type: String,
            default: ""
         },
         notificationStatus: {
            type: String,
            enum: {
               values: ["unread", "read"],
            },
            default: "unread"
         }
      },
      challenged: {
         id: {
            type: String,
            required: true,
         },
         partnerId: {
            type: String,
            default: ""
         },
         notificationStatus: {
            type: String,
            enum: {
               values: ["unread", "read"],
            },
            default: "unread"
         }
      },
      matchReferee: {
         type: String,
         required: true,
      },
      matchType: {
         type: String,
         required: true,
         enum: {
            values: ["single", "double"],
         },
      },
      matchDate: {
         type: Date,
         required: true,
      },
      matchStatus: {
         type: String,
         enum: {
            values: ["requested", "accepted", "rejected"],
         },
         default: "requested"
      },
   }, 
	{ timestamps: true });

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;