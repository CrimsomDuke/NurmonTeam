import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import AbilityController from "../controllers/ability.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new AbilityController(container.AbilityService);

    app.get("/api/abilities", controller.getAllAbilities);
    app.post('/api/abilities/create', middlewareProvider.isAdminMiddleware, controller.createAbility);
    app.get("/api/abilities/search", middlewareProvider.authMiddleware, controller.getAbilitiesBySearch);

    app.put("/api/abilities/update/:id", middlewareProvider.isAdminMiddleware, controller.updateAbility);
    app.delete("/api/abilities/delete/:id", middlewareProvider.isAdminMiddleware, controller.deleteAbility);
    app.get("/api/abilities/:id", middlewareProvider.authMiddleware, controller.getAbilityById);
    app.get("/api/abilities/nurmon/:id", middlewareProvider.authMiddleware, controller.getAbilitiesByNurmonId);
}