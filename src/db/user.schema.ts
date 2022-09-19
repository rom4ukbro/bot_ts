import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, default: null },
    last_name: { type: String, default: null },
    username: { type: String, default: null },
    default_value: { type: String, default: null },
    default_role: { type: String, default: null },
    last_activity: { type: Date, default: new Date() }
  },
  { timestamps: true }
);

const Users = mongoose.model('users', UserSchema);

export { Users };
