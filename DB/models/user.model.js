import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/system-roles.utils.js";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryEmail: String,
  DOB: {
    type: Date,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: Object.values(systemRoles),
    required: true,
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  passwordChangeAt: Date,
  otp: String,
});

export default mongoose.models.User || model("User", userSchema);
