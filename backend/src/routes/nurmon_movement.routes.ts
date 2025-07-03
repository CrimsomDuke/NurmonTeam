import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import NurmonMovementController from "../controllers/nurmon_movement.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new NurmonMovementController(container.NurmonMovementService);

    app.get('/api/nurmon_movements', middlewareProvider.authMiddleware, controller.getAllNurmonMovements);
    app.post('/api/nurmon_movements/create', middlewareProvider.isAdminMiddleware, controller.createNurmonMovement);

    app.get('/api/nurmon_movements/:id', middlewareProvider.authMiddleware, controller.getNurmonMovementById);
    app.get('/api/nurmon_movements/nurmon/:nurmonId', middlewareProvider.authMiddleware, controller.getNurmonMovementsByNurmonId);
    app.get('/api/nurmon_movements/search/nurmon/:id', middlewareProvider.authMiddleware, controller.getNurmonMovementsByNurmonIdForSearch);
    app.delete('/api/nurmon_movements/delete/:id', middlewareProvider.isAdminMiddleware, controller.deleteNurmonMovement);
}