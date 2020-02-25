import { Geohash4 } from './Geohash4'

describe('Geohash4', () => {

  it('encodes Jutland', () => {
    // expect(Geohash4.encode(0.0000001, 0.0000001, 1)).toStrictEqual('3')
    // expect(Geohash4.encode(0.0000001, 0.0000001, 2)).toStrictEqual('30')
    // expect(Geohash4.encode(0.0000001, 0.0000001, 3)).toStrictEqual('300')
    // expect(Geohash4.encode(0.0000001, 0.0000001, 4)).toStrictEqual('3000')
    expect(Geohash4.encode(0.0000001, 0.0000001, 20)).toStrictEqual('30000000000000000000')

    expect(Geohash4.encode(52.185, 0.11, 10)).toStrictEqual('320020200')
    //a - 0
    //b - 1
    //c - 2
    //d - 3
    //"dcaacacaaa"
  })

  // it('encodes Jutland with undefined precision', () => {
  //   expect(Geohash.encode(57.648, 10.410, undefined)).toStrictEqual('u4pruy')
  // })

  // it('encodes Jutland with undefined precision 2', () => {
  //   expect(Geohash.encode(57.6488888888888888888888, 10.4108888888888888888, undefined)).toStrictEqual('u4pruysvp7c3')
  // })

  // it('decodes Jutland', () => {
  //   expect(Geohash.decode('u4pruy')).toStrictEqual({ lat: 57.648, lng: 10.410 })
  // })

  // it('doesn\'t decode empty geohash', () => {
  //   expect(() => Geohash.decode('')).toThrow('Invalid geohash')
  // })

  // it('encodes Curitiba', () => {
  //   expect(Geohash.encode(-25.38262, -49.26561, 8)).toStrictEqual('6gkzwgjz')
  // })

  // it('decodes Curitiba', () => {
  //   expect(Geohash.decode('6gkzwgjz')).toStrictEqual({ lat: -25.38262, lng: -49.26561 })
  // })

  // it('fetches neighbours', () => {
  //   expect(Geohash.neighbours('ezzz')).toStrictEqual({ n:'gbpb', ne:'u000', e:'spbp', se:'spbn', s:'ezzy', sw:'ezzw', w:'ezzx', nw:'gbp8' })
  // })

  // it('matches geohash.org', () => {
  //   expect(Geohash.encode(37.25, 123.75, 12)).toStrictEqual('wy85bj0hbp21')
  // })

  // it('matches encode_bounds', () => {
  //   expect(Geohash.encode_bounds(30, 120, 30.0001, 120.0001, 8)).toStrictEqual(["wtm6dtm6", "wtm6dtm7"])
  //   expect(() => Geohash.encode_bounds(30, 120, 30.0001, 120.0001, 0)).toThrow('precision must be strictly positive')
  // })

})