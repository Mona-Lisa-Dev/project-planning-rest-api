const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const sprintSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      default: function () {
        const endDate = new Date(this.startDate);
        endDate.setDate(this.startDate.getDate() + this.duration);
        endDate.toLocaleDateString(); //  TODO: отрефакторить
        return endDate;
      },
    },

    // owner: {
    //   type: SchemaTypes.ObjectId,
    //   ref: 'user',
    // },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Sprint = mongoose.model('sprint', sprintSchema);

module.exports = Sprint;
