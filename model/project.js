const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Set title for project'],
    },
    description: {
      type: String,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
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

const Project = mongoose.model('project', projectSchema);

module.exports = Project;
