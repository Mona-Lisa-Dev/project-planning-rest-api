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
    // if needed, may be deleted
    isDone: {
      type: Boolean,
      default: false,
    },

    allHoursTask: {
      type: Number,
      default: 0,
    },

    durationSprint: {
      type: Number,
      default: 0,
    },

    hoursSpent: {
      type: Array,
      default: function () {
        return new Array(this.durationSprint).fill(0);
      },
    },

    taskForDays: {
      type: Array,
      default: function () {
        return new Array(this.durationSprint).fill({
          date: new Date(),
          hoursSpent: 0,
        });
      },
    },

    project: {
      type: SchemaTypes.ObjectId,
      ref: 'project',
    },

    sprint: {
      type: SchemaTypes.ObjectId,
      ref: 'sprint',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Task = mongoose.model('task', taskSchema);

module.exports = Task;
