import { Request, Response } from 'express'
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core'
import { getManager } from 'typeorm'
import { Point } from '../entities/Points'

@Controller('api')
export class APIController {

  pointsRepository = getManager().getRepository(Point);

  @Get(':id')
  private async get(req: Request, res: Response) {
    const tile_geohash = req.params.id || ''// v7
    var clusters = []
    if (tile_geohash.length < 5) {
    clusters = await this.pointsRepository
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
      .having('COUNT(*) != 1')
      .setParameter('cluster_precision', tile_geohash.length + 1)
      .setParameter('tile_geohash', tile_geohash)
      .setParameter('tile_precision', tile_geohash.length)
      // .getSql()
      .getRawMany()
    }

    const markers = await this.pointsRepository
      .createQueryBuilder('point')
      .select([
        'point.lat as lat',
        'point.lng as lng',
        'point.address as address',

        'SUBSTR(point.geohash, 1, :cluster_precision) as cluster_geohash',
        'SUBSTR(point.geohash, 1, :tile_precision) as tile_geohash',
      ])
      .where('tile_geohash = :tile_geohash')
      .groupBy('cluster_geohash')
      .having('COUNT(*) = 1')
      .setParameter('cluster_precision', tile_geohash.length + 1)
      .setParameter('tile_geohash', tile_geohash)
      .setParameter('tile_precision', tile_geohash.length)
      // .getSql()
      .getRawMany()

      // const points = _points.reduce((obj, item) => {
      //   obj[item.cluster_geohash] = item
      //   return obj
      // }, {})

    res.status(200).json({
      clusters,
      markers
    })
  }
}