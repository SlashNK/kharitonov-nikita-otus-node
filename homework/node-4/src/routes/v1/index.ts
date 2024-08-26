import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { usersApiRouter } from './users';
import { exercisesApiRouter } from './exercises';
import { workoutBlocksApiRouter } from './workout-blocks';
import { workoutTemplatesApiRouter } from './workout-templates';
import { workoutSessionsApiRouter } from './workout-sessions';
import { registerApiRouter } from './register';
import { authApiRouter } from './auth';
import { refreshTokenApiRouter } from './refresh';
import { logoutApiRouter } from './logout';
import verifyJWT from '../../middleware/jwtVerify';

const router = express.Router();

router.use('/register', registerApiRouter);
router.use('/auth', authApiRouter);
router.use('/refresh', refreshTokenApiRouter);
router.use('/logout', logoutApiRouter);
router.use(verifyJWT);
router.use('/users', usersApiRouter);
router.use('/exercises', exercisesApiRouter);
router.use('/workout-blocks', workoutBlocksApiRouter);
router.use('/workout-templates', workoutTemplatesApiRouter);
router.use('/workout-sessions', workoutSessionsApiRouter);
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

export default router;
