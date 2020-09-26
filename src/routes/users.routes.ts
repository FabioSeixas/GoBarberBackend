import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAnthenticated from '../middlewares/ensureAnthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserService();

    const newUser = await createUserService.execute({ name, email, password });

    delete newUser.password;

    return response.json(newUser);
  } catch (err) {
    return response.status(err.statusCode).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAnthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateAvatar = new UpdateUserAvatarService();

      const user = await updateAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      delete user.password;

      return response.json(user);
    } catch (err) {
      return response.status(err.statusCode).json({ error: err.message });
    }
  },
);

export default usersRouter;
