import mongoose from "mongoose";

// Membuat Schema
const partnerSchema = new mongoose.Schema(
	{
      sender: {
         id: {
            type: String,
            required: true,
         },
         notificationStatus: {
            type: String,
            enum: {
               values: ["unread", "read"],
            },
            default: "unread"
         }
      },
      receiver: {
         id: {
            type: String,
            required: true,
         },
         notificationStatus: {
            type: String,
            enum: {
               values: ["unread", "read"],
            },
            default: "unread"
         }
      },
      partnerStatus: {
         type: String,
         enum: {
            values: ["requested", "accepted", "rejected"],
         },
         default: "requested"
      },
   }, 
	{ timestamps: true });

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;