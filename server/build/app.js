"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("./routes");
class App {
    constructor() {
        this.routePrv = new routes_1.Routes();
        this.app = express_1.default();
        this.config();
        this.routePrv.routes(this.app);
    }
    config() {
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTION, PUT, DELETE');
            next();
        });
        this.app.use(helmet_1.default());
        this.app.use(morgan_1.default('combined'));
        // Support application/json type post data
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json({
            limit: '100mb',
        }));
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map