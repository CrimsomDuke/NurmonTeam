import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import ItemController from "../controllers/item.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new ItemController(container.ItemService);

    app.get('/api/items', controller.getAllItem);
    app.post('/api/items/create', middlewareProvider.isAdminMiddleware, controller.createItem);

    app.get('/api/items/:id', controller.getItemById);
    app.get('/api/items/name/:name', controller.getItemByName);
    app.put('/api/items/update/:id', middlewareProvider.isAdminMiddleware, controller.updateItem);
    app.delete('/api/items/delete/:id', middlewareProvider.isAdminMiddleware, controller.deleteItem);
}