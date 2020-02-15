import { Request, Response } from 'express'
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core'
import { getManager } from 'typeorm'
import { Point } from '../entities/Points'

@Controller('api')
export class APIController {

  pointsRepository = getManager().getRepository(Point);

  @Get()
  private async get(req: Request, res: Response) {
    const out = await this.pointsRepository
      .createQueryBuilder('point')
      .select([
        'AVG(point.lat) as lat',
        'AVG(point.lng) as lng',

        'MIN(point.lat) as latmin',
        'MAX(point.lat) as latmax',

        'MIN(point.lng) as lngmin',
        'MAX(point.lng) as lngmax',

        'SUBSTR(point.geohash, 1, :cluster_precision) as cluster_geohash',
        'SUBSTR(point.geohash, 1, :tile_precision) as tile_geohash',
        'COUNT(*) as count'
      ])
      .where('tile_geohash = :tile_geohash')
      .groupBy('cluster_geohash')
      .setParameter('cluster_precision', 4)
      .setParameter('tile_geohash', 'v7')
      .setParameter('tile_precision', 2)
      // .getSql()
      .getRawMany()


    res.status(200).json(out)
  }
}