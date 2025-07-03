import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import { MovementController } from "../controllers/movement.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new MovementController(container.MovementService);

    app.get('/api/movements', middlewareProvider.authMiddleware, controller.getAllMovements);
    app.post('/api/movements/create', middlewareProvider.isAdminMiddleware, controller.createMovement);

    app.get('/api/movements/:id', middlewareProvider.authMiddleware, controller.getMovementById);
    app.get('/api/movements/name/:name', middlewareProvider.authMiddleware, controller.getMovementByName);
    app.get('/api/movements/team_member/:id', middlewareProvider.authMiddleware, controller.getCurrentMovementsByTeamMemberId);
    app.get('/api/movements/search/nurmon/:id', middlewareProvider.authMiddleware, controller.getPossibleMovementsByNurmonIdForSearch);
    app.put('/api/movements/update/:id', middlewareProvider.isAdminMiddleware, controller.updateMovement);
    app.delete('/api/movements/delete/:id', middlewareProvider.isAdminMiddleware, controller.deleteMovement);
}