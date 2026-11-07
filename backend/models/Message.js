import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    subject: { type: String, trim: true, maxlength: 160, default: "Recruitment enquiry" },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
