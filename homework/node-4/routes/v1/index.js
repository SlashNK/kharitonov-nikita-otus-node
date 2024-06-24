const express = require("express");
const { usersApiRouter } = require("./users");
const { exercisesApiRouter } = require("./exercises");
const { workoutBlocksApiRouter } = require("./workout-blocks");
const { workoutTemplatesApiRouter } = require("./workout-templates");
const { workoutSessionsApiRouter } = require("./workout-sessions");

const router = express.Router();

router.use("/users", usersApiRouter);
router.use("/exercises", exercisesApiRouter);
router.use("/workout-blocks", workoutBlocksApiRouter);
router.use("/workout-templates", workoutTemplatesApiRouter);
router.use("/workout-sessions", workoutSessionsApiRouter);

module.exports = router;
