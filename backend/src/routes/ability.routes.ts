import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import AbilityController from "../controllers/ability.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new AbilityController(container.AbilityService);

    app.get("/api/abilities", controller.getAllAbilities);
    app.get("/api/abilities/:id", controller.getAbilityById);
}