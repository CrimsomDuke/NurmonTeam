import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import NurmonMovementController from "../controllers/nurmon_movement.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new NurmonMovementController(container.NurmonMovementService);

    app.get('/api/nurmon_movements', controller.getAllNurmonMovements);
    app.post('/api/nurmon_movements/create', middlewareProvider.isAdminMiddleware, controller.createNurmonMovement);

    app.get('/api/nurmon_movements/:id', controller.getNurmonMovementById);
    app.get('/api/nurmon_movements/nurmon/:nurmonId', controller.getNurmonMovementsByNurmonId);
    app.delete('/api/nurmon_movements/delete/:id', middlewareProvider.isAdminMiddleware, controller.deleteNurmonMovement);
}