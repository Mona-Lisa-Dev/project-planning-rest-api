const express = require('express');
const router = express.Router();

const guard = require('../../helpers/guard');

const ctrl = require('../../controllers/sprints');

router.post('/:projectId', guard, ctrl.createSprint);

router.get('/:projectId/getAllSprints', guard, ctrl.getAllSprints); //  пересекался с projects, пришлось изменить ендпоинт с "/:projectId'"

router.patch('/:projectId/:sprintId', guard, ctrl.updateSprint);

router.delete('/:projectId/:sprintId', guard, ctrl.deleteSprint);

router.get('/:projectId/:sprintId', guard, ctrl.getSprintById);

module.exports = router;
