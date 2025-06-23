import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import TeamMemberController from "../controllers/team_member.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new TeamMemberController(container.TeamMemberService);

    app.get('/api/team_members', controller.getAllTeamMembers);
    app.post('/api/team_members/create', middlewareProvider.authMiddleware, controller.createTeamMember);

    app.get('/api/team_members/:id', controller.getTeamMemberById);
    app.get('/api/teams/:teamId/team_members', controller.getTeamMembersByTeamId);
    app.get('/api/team_members/team/:teamId', controller.getTeamMembersByTeamId);
    app.put('/api/team_members/update/:id', middlewareProvider.authMiddleware, controller.updateTeamMember);
    app.delete('/api/team_members/delete/:id', middlewareProvider.authMiddleware, controller.deleteTeamMember);
}