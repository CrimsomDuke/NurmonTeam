import { Database } from "../models";


class NatureService {
    private readonly db : Database;

    constructor(dbInst : Database) {
        this.db = dbInst;
    }

    async getAllNatures() {
        try {
            const natures = await this.db.Nature.findAll();
            return natures;
        } catch (err) {
            console.error("Error fetching all natures:", err);
            throw err;
        }
    }

    async getNatureById(id: number) {
        try {
            const nature = await this.db.Nature.findByPk(id);
            if (!nature) {
                return null;
            }
            return nature;
        } catch (err) {
            console.error("Error fetching nature by ID:", err);
            throw err;
        }
    }
}

export default NatureService;