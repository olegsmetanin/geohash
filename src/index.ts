import 'reflect-metadata'
import {createConnection} from 'typeorm'
import {Request, Response} from 'express'
import express from 'express'
import * as bodyParser from 'body-parser'
import * as dbconfig from './config/TypeORM'
import { Server } from './Server'

// console.log('dbconfig', dbconfig)

createConnection(dbconfig).then(async connection => {

//   // create express app
  // const app = express()
  // app.use(bodyParser.json())



  const server = new Server()
  server.start(3000)

//   // register all application routes


//   // run app
  // app.listen(3000)

  // console.log("Express application is up and running on port 3000");

}).catch(error => console.log("TypeORM connection error: ", error));