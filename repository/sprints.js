const Sprint = require('../model/sprint');

const addSprint = async body => {
  const result = await Sprint.create(body);
  return result;
};

const getAllSprints = async projectId => {
  const results = await Sprint.find({ project: projectId });
  return results;
};

const removeSprint = async (projectId, sprintId) => {
  const result = await Sprint.findOneAndRemove({
    _id: sprintId,
    project: projectId,
  });
  return result;
};

const updateSprint = async (projectId, sprintId, body) => {
  const result = await Sprint.findOneAndUpdate(
    {
      _id: sprintId,
      project: projectId,
    },
    { ...body },
    { new: true },
  );

  return result;
};

const getById = async (projectId, sprintId) => {
  const result = await Sprint.findOne({
    _id: sprintId,
    project: projectId,
  });
  return result;
};

module.exports = {
  addSprint,
  getById,
  getAllSprints,
  removeSprint,
  updateSprint,
};
