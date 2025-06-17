import { Application } from 'express';
import { Container } from '../injection/container';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

module.exports = (app : Application, container : Container) => {
    const userController = new UserController(container.UserService);

    app.get('/api/users', (req, res) => userController.getAllUsers(req, res));
    app.post('/api/users/register', userController.registerUser);
    app.post('/api/users/login', userController.loginUser);

    app.get('/api/users/:id', userController.getUserById);
    app.get('/api/users/token/:token', userController.getUserByToken);
}