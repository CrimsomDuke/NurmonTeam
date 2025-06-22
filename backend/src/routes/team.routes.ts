import { Application } from "express";
import Container from "../injection/container";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import TeamController from "../controllers/team.controller";


module.exports = (app : Application, container : Container, middlewareProvider : MiddlewareProvider) => {
    const controller = new TeamController(container.TeamService);

    app.get("/teams", controller.getAllTeams);
    app.post('/teams/create', middlewareProvider.authMiddleware, controller.createTeam);

    app.get("/teams/:id", controller.getTeamById);
    app.get("/teams/user/:userId", middlewareProvider.authMiddleware, controller.getTeamByUserId);
    app.put("/teams/update/:id", middlewareProvider.authMiddleware, controller.updateTeam);
    app.delete("/teams/delete/:id", middlewareProvider.authMiddleware, controller.deleteTeam);

}