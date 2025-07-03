import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import TypeController from "../controllers/type.controller";


module.exports = (app: Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new TypeController(container.TypeService);

    app.get("/api/types", middlewareProvider.authMiddleware, controller.getAllTypes);
    app.get("/api/types/:id", middlewareProvider.authMiddleware, controller.getTypeById);
}