import { Router } from 'express';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAnthenticated';

const ProfileRouter = Router();

const profileController = new ProfileController();

ProfileRouter.use(ensureAuthenticated);

ProfileRouter.get('/show', profileController.show);

ProfileRouter.put('/update', profileController.update);

export default ProfileRouter;
