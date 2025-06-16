import { Database } from "../models";


class UserService {

    constructor(dbInst : Database){
        console.log("UserService initialized");
        console.log(dbInst.User);
    }

    getUsers() {
        return [{ id: 1, name: "John Doe" }];
    }
} 

export { UserService };