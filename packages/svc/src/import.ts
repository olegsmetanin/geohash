import * as fs from 'fs'
import * as faker from 'faker/locale/en'

// import { Geohash, Geohash4 } from '@olegsmetanin/geohash-common'
import { Geohash } from './utils/Geohash'
import { Geohash4 } from './utils/Geohash4'


async function main () {
  console.log('QWE!')
  const data = JSON.parse(fs.readFileSync('./data/points.json').toString())

  const points = data.map((rec: any) => ({
    lat: rec.lat,
    lng: rec.lng,
    address: rec.address,
    // address: faker.address.streetAddress(),
    geohash: Geohash4.encode(rec.lat, rec.lng, 12),
    geohash4: Geohash4.encode(rec.lat, rec.lng, 24)
  }))

  fs.writeFileSync('points.json', JSON.stringify(points))

}

main().catch(console.error)