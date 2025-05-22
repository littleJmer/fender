import { Sequelize } from "sequelize";

import User from "../models/user.js";
import Session from "../models/session.js";

class Database {
    static _instance = null;

    _sequelize = undefined;
    _models = {};

    constructor() {

        this._sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: "mysql",
                logging: true
            },
        );

        this.loadModels();

        Database._instance = this;
    }

    static getInstance() {
        if (!Database._instance) {
            new Database();
        }
        return Database._instance;
    }

    async loadModels() {
        try {
            await this._sequelize.authenticate();
            console.log('Connection has been established successfully.');

            this.performanceLoadModels([
                [User, "User"],
                [Session, "Session"],
            ]);

            // Sync
            this._sequelize.sync({
                // This creates the table, dropping it first if it already existed
                force: false,
                // This checks what is the current state of the table in the database 
                // (which columns it has, what are their data types, etc), and then performs
                // the necessary changes in the table to make it match the model.
                alter: true
            });

        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    performanceLoadModels(arrayOfModels) {
        for (const options of arrayOfModels) {
            const [ModelDefinition, ModelAccessor] = options;
            this._models[ModelAccessor] = ModelDefinition(this._sequelize);
        }
        for (const options of arrayOfModels) {
            const [_, ModelAccessor] = options;
            this._models[ModelAccessor].associate(this._models);
        }
    }

    getConnection() {
        return this._sequelize;
    }

    getModel(modelName) {
        return this._models[modelName];
    }
};

export default Database;