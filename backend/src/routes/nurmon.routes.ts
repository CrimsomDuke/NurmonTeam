import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import NurmonController from "../controllers/nurmon.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const nurmonController  = new NurmonController(container.NurmonService);

    app.get('/api/nurmons', nurmonController.getAllNurmons);
    app.post('/api/nurmons/create', middlewareProvider.isAdminMiddleware, nurmonController.createNurmon);
    app.get('/api/nurmons/search', nurmonController.getNurmonsBySearch);

    app.get('/api/nurmons/:id', nurmonController.getNurmonById);
    app.put('/api/nurmons/update/:id', middlewareProvider.isAdminMiddleware, nurmonController.updateNurmon);
    app.delete('/api/nurmons/delete/:id', middlewareProvider.isAdminMiddleware, nurmonController.deleteNurmon);
}