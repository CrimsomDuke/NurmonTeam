
import { Express } from 'express';
import Container from '../injection/container';

module.exports = (app : Express, container : Container) => {
    require('./user.routes')(app, container, container.MiddlewareProvider);
    require('./nurmon.routes')(app, container, container.MiddlewareProvider);
    require('./movement.routes')(app, container, container.MiddlewareProvider);
    require('./item.routes')(app, container, container.MiddlewareProvider);
    require('./nurmon_movement.routes')(app, container, container.MiddlewareProvider);
    require('./team.routes')(app, container, container.MiddlewareProvider);
    require('./type.routes')(app, container, container.MiddlewareProvider);
    require('./ability.routes')(app, container, container.MiddlewareProvider);
    require('./nature.routes')(app, container, container.MiddlewareProvider);
    require('./team_member.routes')(app, container, container.MiddlewareProvider);
    require('./member_nurmon_movement.routes')(app, container, container.MiddlewareProvider);
}