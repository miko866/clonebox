// Packages imports
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Custom
import { createConnection } from 'typeorm';
import { handleError } from './middlewares/ErrorMiddleware';
import { notFound } from './middlewares/AuthMiddleware';
import swagger from './swagger';

// Routes
import avatars from './routes/AvatarRouter';
import organizations from './routes/OrganizationRouter';
import users from './routes/UserRouter';
import files from './routes/FileRouter';
import folders from './routes/FolderRouter';

import { Routes } from './routes';

class App {
  public app: express.Application;

  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();

    // Create connection to DB per TypeORM
    this.routePrv.routes(this.app);
    createConnection()
      .then(connection => {
        if (connection.isConnected) {
          this.registerRoutes();
        } else {
          this.app.use(function(req, res) {
            res.status(500).json({
              status: false,
              message: 'Error connection to DB per TypeORM',
            });
          });
        }
      })
      .catch(err => {
        console.error('Error from app constructor for typeorm to DB', err);
        this.app.use(function(req, res) {
          res.status(500).json({
            status: false,
            message: `Error from app constructor for typeorm to DB, ${err}`,
          });
        });
      });

    // Swagger doc
    swagger(this.app);
  }

  // DB TypeORM endpoints
  private registerRoutes() {
    this.app.use('/api/organization', organizations());
    this.app.use('/api/user', users());
    this.app.use('/api/file', files());
    this.app.use('/api/folder', folders());
    this.app.use('/api/avatar', avatars());

    // Not Found fullback
    this.app.use(notFound);

    // Handle all routes errors
    this.app.use((err, req, res, next) => {
      handleError(err, res, next);
    });
  }

  private config(): void {
    // Cors
    this.app.use(cors());
    // Allow OPTIONS for all resources
    this.app.options('*', cors());

    // Security
    this.app.use(helmet());
    // Developing
    this.app.use(morgan('combined'));
    // Support application/json type post data
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      express.json({
        limit: '100mb',
      }),
    );
  }
}

export default new App().app;
