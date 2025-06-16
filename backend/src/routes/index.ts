
import { Express } from 'express';
import { container } from '../injection/container';

module.exports = (app : Express) => {
    require('./user.routes')(app);
}