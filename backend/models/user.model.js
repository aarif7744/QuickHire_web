import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // To ensure unique emails
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String, default: "" }, // Corrected `string` to `String`
      skills: [{ type: String }], // Corrected `string` to `String`
      resume: { type: String, default: "" },
      resumeOriginalName: { type: String, default: "" },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "", // Set default profile photo if none provided by user
      },
    },
  },
  { timestamps: true }
);

// Exporting the User model
export const User = mongoose.model("User", userSchema);
