import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import NatureController from "../controllers/nature.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new NatureController(container.NatureService);

    app.get("/api/natures", middlewareProvider.authMiddleware, controller.getAllNatures);
    app.get("/api/natures/:id", middlewareProvider.authMiddleware, controller.getNatureById);
}