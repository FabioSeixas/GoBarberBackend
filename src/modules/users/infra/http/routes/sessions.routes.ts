import { Router } from 'express';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const SessionsRouter = Router();

const sessionsController = new SessionsController();

SessionsRouter.post('/', sessionsController.create);

export default SessionsRouter;
