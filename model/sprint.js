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

    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'project',
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
        return ret;
      },
    },
  },
);

const Sprint = mongoose.model('sprint', sprintSchema);

module.exports = Sprint;
