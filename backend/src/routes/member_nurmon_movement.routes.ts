import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import MemberNurmonMovementController from "../controllers/member_nurmon_movement.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new MemberNurmonMovementController(container.MemberNurmonMovementService);

    app.get('/api/member_nurmon_movements', controller.getAllMemberNurmonMovements)
    app.post('/api/member_nurmon_movements/create', middlewareProvider.authMiddleware, controller.createMemberNurmonMovement);

    app.get('/api/member_nurmon_movements/:id', controller.getMemberNurmonMovementById);
    app.get('/api/member_nurmon_movements/team_member/:teamMemberId', controller.getAllMemberNurmonMovementsByTeamMemberId);
    app.put('/api/member_nurmon_movements/update/:id', middlewareProvider.authMiddleware, controller.updateMemberNurmonMovement);
    app.delete('/api/member_nurmon_movements/delete/:id', middlewareProvider.authMiddleware, controller.deleteMemberNurmonMovement);
}