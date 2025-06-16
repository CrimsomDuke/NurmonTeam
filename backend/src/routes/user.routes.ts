import { Express } from 'express';
import { Container } from '../injection/container';
import { UserController } from '../controllers/user.controller';

module.exports = (app : Express, container : Container) => {
    const userController = new UserController(container.UserService);

    app.get('/users', (req, res) => {
        res.json(userController.getUsers());
    });
}