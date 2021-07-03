const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;
const dayjs = require('dayjs');

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    scheduledTime: {
      type: Number,
      required: true,
    },

    // if needed, may be deleted
    // isDone: {
    //   type: Boolean,
    //   default: false,
    // },

    totalTime: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      default: 0,
    }, // не отдается на фронт, нужен для расчета дней

    durationSprint: {
      type: Number,
      default: 0,
    }, // не отдается на фронт, нужен для расчета дней

    taskByDays: {
      type: Array,
      default: function () {
        const arr = new Array(this.durationSprint).fill();

        const day = (startDate, durationSprint, i) =>
          dayjs(startDate)
            .add(durationSprint + i, 'day')
            .format('YYYY-MM-DD');

        return arr.map((_, i) => {
          return {
            [day(this.startDate, this.durationSprint, i)]: 0,
          };
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
    toObject: {
      virtuals: true,
      // transform: function (_doc, ret) {
      //   delete ret._id;
      //   return ret;
      // },
    },
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret._id;
        delete ret.startDate;
        delete ret.durationSprint;
        return ret;
      },
    },
  },
);

const Task = mongoose.model('task', taskSchema);

module.exports = Task;
