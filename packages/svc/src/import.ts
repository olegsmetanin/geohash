import * as fs from 'fs'
import * as faker from 'faker/locale/en'
import { Geohash } from './Geohash'

async function main () {
  const data = JSON.parse(fs.readFileSync('data.json').toString())

  const points = data.map((rec: any) => ({
    lat: rec.address.lat,
    lng: rec.address.lng,
    address: faker.address.streetAddress(),
    geohash: Geohash.encode(rec.address.lat, rec.address.lng, 12)
  }))

  fs.writeFileSync('points.json', JSON.stringify(points))

}

main().catch(console.error)