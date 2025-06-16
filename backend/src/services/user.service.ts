

class UserService {

    constructor(dbInst : any){
        console.log("UserService initialized");
    }

    getUsers() {
        return [{ id: 1, name: "John Doe" }];
    }
} 

export { UserService };