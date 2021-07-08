const Tasks = require('../repository/tasks');
const Sprints = require('../repository/sprints');
const { HttpCode } = require('../helpers/constants');

const createTask = async (req, res, next) => {
  const { projectId, sprintId } = req.params;
  const incomingScheduledTime = parseInt(req.body.scheduledTime);
  const findSprint = await Sprints.getById(projectId, sprintId);

  if (!findSprint) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  }

  const currentScheduledTime = findSprint.allScheduledTime;
  const sprint = await Sprints.updateSprint(projectId, sprintId, {
    allScheduledTime: incomingScheduledTime + currentScheduledTime || 0,
  });

  try {
    const task = await Tasks.createTask({
      ...req.body,
      sprint: sprintId,
      project: projectId,
      durationSprint: sprint.duration,
      startDate: sprint.startDate,
    });

    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { task } });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  const { sprintId, taskId } = req.params;
  try {
    const task = await Tasks.getTaskById(sprintId, taskId);
    if (task) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { task } });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  const { sprintId, taskId, day, value } = req.params;

  try {
    const findTask = await Tasks.getTaskById(sprintId, taskId);

    const planedTime = findTask.scheduledTime; // получаем запланированое время

    if (!findTask) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Task is not found',
      });
    }

    const taskByDaysUpd = findTask.taskByDays.map(el =>
      Object.keys(el)[0] === day
        ? { [Object.keys(el)[0]]: parseInt(value) }
        : el,
    ); // тута я передаю значение таски за день

    const totalTime = await findTask.taskByDays.reduce(
      (acc, el) =>
        Object.keys(el)[0] === day
          ? acc + parseInt(value)
          : acc + Object.values(el)[0],
      0,
    ); //   высчитываю все время потраченое на таску

    const task = await Tasks.updateTask(
      sprintId,
      taskId,
      taskByDaysUpd,
      totalTime,
    );

    //  этот блок скорее всего не понадобится
    const findTasks = await Tasks.allTasks(sprintId);

    const tasksTimeSum = findTasks
      .map(task =>
        task.taskByDays.reduce((acc, days) => {
          if (Object.keys(days)[0] === day) {
            return acc + Object.values(days)[0];
          } else {
            return acc;
          }
        }, 0),
      )
      .reduce((acc, el) => acc + el, 0); //     это пипец какой то, ну пусть будет=) считаю все потраченое время на таску что бы записать его в спринт

    const projectId = findTask.project;
    const findSprint = await Sprints.getById(projectId, sprintId);
    const oldTotalDaly = findSprint.totalDaly;
    const newTotalDaly = oldTotalDaly.map(el =>
      Object.keys(el)[0] === day ? { [day]: tasksTimeSum } : el,
    ); //  перебераю и и дописаваю в totalDaly спринта новое значение tasksTimeSum
    // то что передать в tasksTimeSum пойдет в поле значение по дню в спринте

    //  этот блок скорее всего не понадобится

    Sprints.updateSprintTotalDaly(projectId, sprintId, newTotalDaly);

    if (task) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { task },
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Task is not found',
    });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  const sprintId = req.params.sprintId;
  try {
    const tasks = await Tasks.allTasks(sprintId);
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { tasks } });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  const { sprintId, taskId } = req.params;
  try {
    const foundTask = await Tasks.getTaskById(sprintId, taskId);
    const projectId = foundTask.project;
    const foundSprint = await Sprints.getById(projectId, sprintId);

    Sprints.updateSprint(projectId, sprintId, {
      allScheduledTime: foundSprint.allScheduledTime - foundTask.scheduledTime,
    });

    const task = await Tasks.removeTask(sprintId, taskId);
    if (task) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Task is deleted',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'The task is not found',
    });
  } catch (error) {
    next(error);
  }
};

const getTaskByDay = async (req, res, next) => {
  const { sprintId, day } = req.params;

  try {
    const tasks = await Tasks.allTasks(sprintId);

    if (tasks.length === 0) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Tasks is not found',
      });
    }

    const tasksByDay = tasks.map(task => {
      return {
        name: task.name,
        totalTime: task.totalTime,
        scheduledTime: task.scheduledTime,
        sprint: task.sprint,
        project: task.project,
        byDay: task.taskByDays.find(days => Object.keys(days)[0] === day),
        id: task.id,
      };
    });

    if (tasks) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { tasksByDay } });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Tasks is not found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTaskById,
  updateTask,
  getAllTasks,
  deleteTask,
  getTaskByDay,
};
