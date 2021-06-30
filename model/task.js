const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    scheduledHours: {
      type: Number,
      required: true,
    },

    spentHours: {
      type: Number,
      default: 0,
    },

    // if needed, may be deleted
    isDone: {
      type: Boolean,
      default: false,
    },

    allHours: {
      type: Number,
      ref: 'sprint',
      default: this.spentHours,
    },

    project: {
      type: SchemaTypes.ObjectId,
      ref: 'project',
    },

    sprint: {
      type: SchemaTypes.ObjectId,
      ref: 'sprint',
      // features: 'duration',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Task = mongoose.model('task', taskSchema);

module.exports = Task;
