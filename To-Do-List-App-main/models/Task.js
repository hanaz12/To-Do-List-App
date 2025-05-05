import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: Boolean, default: false },
});
export const Task = mongoose.model('Task', TaskSchema);