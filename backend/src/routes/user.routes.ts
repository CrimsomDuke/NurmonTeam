import { Express } from 'express';
import { container } from '../injection/container';
import { UserController } from '../controllers/user.controller';

module.exports = (app : Express) => {
    const userController = new UserController(container.UserService);

    app.get('/users', (req, res) => {
        res.json(userController.getUsers());
    });
}