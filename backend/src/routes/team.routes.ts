import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import TeamController from "../controllers/team.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new TeamController(container.TeamService, container.UserService);

    app.get("/api/teams", middlewareProvider.authMiddleware, controller.getAllTeams);
    app.post('/api/teams/create', middlewareProvider.authMiddleware, controller.createTeam);
    app.get('/api/teams/my', middlewareProvider.authMiddleware, middlewareProvider.authMiddleware, controller.getMyTeams);

    app.get("/api/teams/:id", middlewareProvider.authMiddleware, controller.getTeamById);
    app.get("/api/teams/user/:userId", middlewareProvider.authMiddleware, controller.getTeamByUserId);
    app.put("/api/teams/update/:id", middlewareProvider.authMiddleware, controller.updateTeam);
    app.delete("/api/teams/delete/:id", middlewareProvider.authMiddleware, controller.deleteTeam);

}