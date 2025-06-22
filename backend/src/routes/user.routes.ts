import { Application } from 'express';
import { Container } from '../injection/container';
import { UserController } from '../controllers/user.controller';
import { MiddlewareProvider } from '../middlewares/middleware.provider';

module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const userController = new UserController(container.UserService);

    app.get('/api/users', middlewareProvider.authMiddleware, (req, res) => userController.getAllUsers(req, res));
    app.post('/api/users/register', userController.registerUser);
    app.post('/api/users/login', userController.loginUser);
    app.get('/api/users/me',middlewareProvider.authMiddleware , userController.getMe);

    app.get('/api/users/:id', userController.getUserById);
    app.put('/api/users/update/:id', middlewareProvider.isAdminMiddleware, userController.updateUser);
}