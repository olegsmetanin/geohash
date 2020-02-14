import { decode } from './index'

describe('App', () => {

  it('geohash', () => {
    expect(decode('c')).toStrictEqual({"lat": 67.5, "lon": -112.5})
  })

})