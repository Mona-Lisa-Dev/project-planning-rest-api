const express = require('express');
const router = express.Router();

const guard = require('../../helpers/guard');

const ctrl = require('../../controllers/sprints');

router.post('/', guard, ctrl.createSprint);

router.get('/getAllSprints', guard, ctrl.getAllSprints); //  пересекался с projects, пришлось изменить ендпоинт с "/:projectId'"

router.patch('/:sprintId', guard, ctrl.updateSprint);

router.delete('/:sprintId', guard, ctrl.deleteSprint);

router.get('/:sprintId', guard, ctrl.getSprintById);

module.exports = router;
