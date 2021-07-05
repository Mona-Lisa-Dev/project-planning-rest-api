const Sprint = require('../model/sprint');
const Task = require('../model/task');

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
  if (result) {
    await Task.deleteMany({
      project: projectId,
    });
  }
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

// TODO create new task
const updateSprintDays = async (projectId, sprintId, body) => {
  const { days } = await Sprint.findOne({
    _id: sprintId,
    project: projectId,
  }); // (el => el) {"date":"2021-07-05","tasks":[]}
  //  days: days.map(el => console.log(Object.keys(el)[0], Object.keys(el)[1])), // date  tasks
  // days: days.map(el =>  console.log(Object.values(el)[0], Object.values(el)[1]), // 2021-07-05 []
  if (!days) return;
  const arrDays = days.map(el => {
    return {
      [Object.keys(el)[0]]: Object.values(el)[0],
      [Object.keys(el)[1]]: Object.values(el)[1].concat(body),
    };
  });

  const result = await Sprint.findOneAndUpdate(
    {
      _id: sprintId,
      project: projectId,
    },

    {
      days: arrDays,
      // days: days.map(el => el),
    },
    { new: true },
  );
  return result;
};

// TODO deleteTaskSprintDays
const deleteTaskSprintDays = async (projectId, sprintId, taskId) => {
  const { days } = await Sprint.findOne({
    _id: sprintId,
    project: projectId,
  });
  if (!days) return;
  const arrDays = days.map(el => {
    return {
      [Object.keys(el)[0]]: Object.values(el)[0],
      [Object.keys(el)[1]]: Object.values(el)[1].filter(
        el => Object.values(el)[Object.keys(el).length - 1] !== taskId,
      ),
    };
  });

  const result = await Sprint.findOneAndUpdate(
    {
      _id: sprintId,
      project: projectId,
    },
    {
      days: arrDays,
    },
    { new: true },
  );
  return result;
};

module.exports = {
  addSprint,
  getById,
  getAllSprints,
  removeSprint,
  updateSprint,
  updateSprintDays,
  deleteTaskSprintDays,
};
