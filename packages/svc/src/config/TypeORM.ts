import {ConnectionOptions} from 'typeorm'
// import * as path from 'path'

// import { Point } from '../entity/Points'

// console.log('DIRNAME', path.resolve(__dirname, '../entities/*.{js,ts}'))
// npm run typeorm migration:generate -- -n PostRefactoring
const databaseConfig: ConnectionOptions = {
    type: 'sqlite',
    database: 'data/points.db',
    synchronize: !!process.env.DB_SYNC,
    entities: ['src/entities/*.{js,ts}'],
    migrations: ['src/migrations/*.{js,ts}'],
    cli: {
        migrationsDir: 'src/migrations',
        entitiesDir: 'src/entities',
    },
}

export = databaseConfig // used by CLI