
import { Express } from 'express';
import Container from '../injection/container';

module.exports = (app : Express, container : Container) => {
    require('./user.routes')(app, container);
}