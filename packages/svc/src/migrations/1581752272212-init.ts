import * as fs from 'fs'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class init1581752272212 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createDatabase("points", true);
        await queryRunner.query(`CREATE TABLE point (id integer primary key autoincrement, lat double, lng double, address varchar(400), geohash varchar(20))`)
        await queryRunner.query(`CREATE INDEX point_id_pk ON point(id)`)
        await queryRunner.query(`CREATE INDEX point_lat_idx ON point(lat)`)
        await queryRunner.query(`CREATE INDEX point_lng_idx ON point(lng)`)
        await queryRunner.query(`CREATE INDEX point_geohash_idx ON point(geohash)`)

        const data = JSON.parse(fs.readFileSync('data/points.json').toString())

        for (const item of data) {
            await queryRunner.query(`INSERT INTO point (lat, lng, address, geohash) VALUES (${item.lat}, ${item.lng}, "${item.address}", '${item.geohash}')`)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
