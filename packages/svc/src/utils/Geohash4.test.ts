import { Geohash4 } from './Geohash4'

describe('Geohash4', () => {

  it('encodes and decodes Jutland', () => {
    expect(Geohash4.encode(57.648, 10.410, 15)).toStrictEqual('320201132332231')
    expect(Geohash4.decode('320201132332231')).toStrictEqual({ lat: 57.648, lng: 10.410 })
  })

  it('encodes Jutland with undefined precision', () => {
    expect(Geohash4.encode(57.648, 10.410, undefined)).toStrictEqual('320201132332231')
  })

  it('encodes Jutland with undefined precision 2', () => {
    expect(Geohash4.encode(57.6488888888888888888888, 10.4108888888888888888, undefined)).toStrictEqual('320201132332231302131112322103')
  })

  it('doesn\'t decode empty geohash', () => {
    expect(() => Geohash4.decode('')).toThrow('Invalid geohash')
  })

  it('encodes Curitiba', () => {
    expect(Geohash4.encode(-25.38262, -49.26561, 20)).toStrictEqual('03033122333103310333')
  })

  it('decodes Curitiba', () => {
    expect(Geohash4.decode('03033122333103310333')).toStrictEqual({ lat: -25.38262, lng: -49.26561 })
  })

  it('fetches neighbours', () => {

    //  22 23 32 33
    //  20 21 30 31
    //  02 03 12 13
    //  00 01 10 11

    expect(Geohash4.adjacent('32', 'e')).toStrictEqual('33')

    expect(Geohash4.adjacent('12', 'n')).toStrictEqual('30')
    expect(Geohash4.adjacent('31', 's')).toStrictEqual('13')

    expect(Geohash4.adjacent('31', 'w')).toStrictEqual('30')

    expect(Geohash4.adjacent('30', 's')).toStrictEqual('12')
    expect(Geohash4.adjacent('30', 'w')).toStrictEqual('21')

    expect(Geohash4.adjacent('30', 'e')).toStrictEqual('31')
    expect(Geohash4.adjacent('30', 'n')).toStrictEqual('32')

    expect(Geohash4.adjacent('2', 'e')).toStrictEqual('3')
    expect(Geohash4.adjacent('2', 's')).toStrictEqual('0')
    expect(Geohash4.adjacent('1', 'n')).toStrictEqual('3')
    expect(Geohash4.adjacent('1', 'w')).toStrictEqual('0')


    expect(Geohash4.adjacent('0', 'w')).toStrictEqual('1')
    expect(Geohash4.adjacent('0', 's')).toStrictEqual('2')
    expect(Geohash4.adjacent('0', 'n')).toStrictEqual('2')
    expect(Geohash4.adjacent('0', 'e')).toStrictEqual('1')

    expect(Geohash4.adjacent('3', 'e')).toStrictEqual('2')
    expect(Geohash4.adjacent('3', 'n')).toStrictEqual('1')
    expect(Geohash4.adjacent('3', 's')).toStrictEqual('1')
    expect(Geohash4.adjacent('3', 'w')).toStrictEqual('2')
    expect(Geohash4.neighbours('30')).toStrictEqual({ n: '32', ne: '33', e: '31', se: '13', s: '12', sw: '03', w: '21', nw: '23' })
  })

  it('matches encode_bounds', () => {
    expect(Geohash4.encode_bounds(-90, -180, 90, 180, 1)).toStrictEqual(['0', '1', '2', '3'])
    expect(Geohash4.encode_bounds(-90, -180, 90, 180, 2)).toStrictEqual([
      '00', '01',
      '10', '11',
      '02', '03',
      '12', '13',
      '20', '21',
      '30', '31',
      '22', '23',
      '32', '33',
    ])
    expect(Geohash4.encode_bounds(30, 120, 30.0001, 120.0001, 20)).toStrictEqual(['31212121212121212121', '31212121212121212123'])
    expect(() => Geohash4.encode_bounds(30, 120, 30.0001, 120.0001, 0)).toThrow('precision must be strictly positive')
  })

})