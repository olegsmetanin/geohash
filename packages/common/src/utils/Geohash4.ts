
// Defaults for base4 geohash

const base = '0123'
const nbits = 2
const defEvenBit = false

const neighbour: { [id: string]: string[] } = {
    'n': ['2301', '2301'],
    's': ['2301', '2301'],
    'e': ['1032', '1032'],
    'w': ['1032', '1032'],
}

const border: { [id: string]: string[] } = {
    'n': ['23', '23'],
    's': ['01', '01'],
    'e': ['13', '13'],
    'w': ['02', '02'],
}

export interface IGeoBound {
    sw: {
        lat: number
        lng: number
    }
    ne: {
        lat: number
        lng: number
    }
}

/**
 * Geohash: Gustavo Niemeyer’s geocoding system.
 */
export class Geohash4 {

    /**
     * Encodes latitude/longitude to geohash, either to specified precision or to automatically
     * evaluated precision.
     *
     * @param   {number} lat - Latitude in degrees.
     * @param   {number} lng - Longitude in degrees.
     * @param   {number} [precision] - Number of characters in resulting geohash.
     * @returns {string} Geohash of supplied latitude/longitude.
     * @throws  Invalid geohash.
     *
     * @example
     *     const geohash = Geohash.encode(52.205, 0.119, 7); // => 'u120fxw'
     */
    static encode(lat: number, lng: number, precision: number): string {
        // infer precision?
        if (typeof precision == 'undefined') {
            // refine geohash until it matches precision of supplied lat/lng
            for (let p = 1; p <= 30; p++) {
                const hash = Geohash4.encode(lat, lng, p)
                const posn = Geohash4.decode(hash)
                if (posn.lat == lat && posn.lng == lng) return hash
            }
            precision = 30 // set to maximum
        }

        lat = Number(lat)
        lng = Number(lng)
        precision = Number(precision)

        if (isNaN(lat) || isNaN(lng) || isNaN(precision)) throw new Error('Invalid geohash')

        let idx = 0 // index into base4 map
        let bit = 0 // each char holds 2 bits
        let evenBit = defEvenBit
        let geohash = ''

        let latMin = -90, latMax = 90
        let lngMin = -180, lngMax = 180

        while (geohash.length < precision) {
            if (evenBit) {
                // bisect E-W longitude
                const lngMid = (lngMin + lngMax) / 2
                if (lng >= lngMid) {
                    idx = idx * 2 + 1
                    lngMin = lngMid
                } else {
                    idx = idx * 2
                    lngMax = lngMid
                }
            } else {
                // bisect N-S latitude
                const latMid = (latMin + latMax) / 2
                if (lat >= latMid) {
                    idx = idx * 2 + 1
                    latMin = latMid
                } else {
                    idx = idx * 2;
                    latMax = latMid
                }
            }
            evenBit = !evenBit

            if (++bit == nbits) {
                // 5 bits gives us a character: append it and start over
                geohash += base.charAt(idx)
                bit = 0
                idx = 0
            }
        }

        return geohash
    }


    /**
     * Decode geohash to latitude/longitude (location is approximate centre of geohash cell,
     *     to reasonable precision).
     *
     * @param   {string} geohash - Geohash string to be converted to latitude/longitude.
     * @returns {{lat:number, lng:number}} (Center of) geohashed location.
     * @throws  Invalid geohash.
     *
     * @example
     *     const latlng = Geohash.decode('u120fxw'); // => { lat: 52.205, lng: 0.1188 }
     */
    static decode(geohash: string) {

        const bounds = Geohash4.bounds(geohash) // <-- the hard work
        // now just determine the centre of the cell...

        const latMin = bounds.sw.lat, lngMin = bounds.sw.lng
        const latMax = bounds.ne.lat, lngMax = bounds.ne.lng

        // cell centre
        let lat0 = (latMin + latMax) / 2
        let lng0 = (lngMin + lngMax) / 2

        // round to close to centre without excessive precision: ⌊2-log10(Δ°)⌋ decimal places
        const latPrec = Math.floor(2 - Math.log(latMax - latMin) / Math.LN10)
        const lngPrec = Math.floor(2 - Math.log(lngMax - lngMin) / Math.LN10)
        let lat = lat0.toFixed(latPrec > 0 ? latPrec : 0)
        let lng = lng0.toFixed(lngPrec > 0 ? lngPrec : 0)

        return { lat: Number(lat), lng: Number(lng) }
    }




    /**
     * Returns SW/NE latitude/longitude bounds of specified geohash.
     *
     * @param   {string} geohash - Cell that bounds are required of.
     * @returns {{sw: {lat: number, lng: number}, ne: {lat: number, lng: number}}}
     * @throws  Invalid geohash.
     */
    static bounds(geohash: string): IGeoBound {
        if (geohash.length == 0) throw new Error('Invalid geohash')

        geohash = geohash.toLowerCase()

        let evenBit = defEvenBit
        let latMin = -90, latMax = 90
        let lngMin = -180, lngMax = 180

        for (let i = 0; i < geohash.length; i++) {
            const chr = geohash.charAt(i)
            const idx = base.indexOf(chr)
            if (idx == -1) throw new Error('Invalid geohash')

            for (let n = nbits - 1; n >= 0; n--) {
                const bitN = idx >> n & 1
                if (evenBit) {
                    // longitude
                    const lngMid = (lngMin + lngMax) / 2
                    if (bitN == 1) {
                        lngMin = lngMid
                    } else {
                        lngMax = lngMid
                    }
                } else {
                    // latitude
                    const latMid = (latMin + latMax) / 2
                    if (bitN == 1) {
                        latMin = latMid
                    } else {
                        latMax = latMid
                    }
                }
                evenBit = !evenBit
            }
        }

        const bounds: {
            sw: { lat: number, lng: number },
            ne: { lat: number, lng: number },
        }  = {
            sw: { lat: latMin, lng: lngMin },
            ne: { lat: latMax, lng: lngMax },
        }

        return bounds
    }

    /**
     * Determines adjacent cell in given direction.
     *
     * @param   {string} geohash - Cell to which adjacent cell is required.
     * @param   {string} direction - Direction from geohash (N/S/E/W).
     * @returns {string} Geocode of adjacent cell.
     * @throws  Invalid geohash.
     */
    static adjacent(geohash: string, direction: string) {
        // based on github.com/davetroy/geohash-js

        geohash = geohash.toLowerCase()
        direction = direction.toLowerCase()

        if (geohash.length == 0) throw new Error('Invalid geohash')
        if ('nsew'.indexOf(direction) == -1) throw new Error('Invalid direction')

        const lastCh = geohash.slice(-1)    // last character of hash
        let parent = geohash.slice(0, -1) // hash without last character

        const type = geohash.length % 2

        // check for edge-cases which don't share common prefix
        if (border[direction][type].indexOf(lastCh) != -1 && parent != '') {
            parent = Geohash4.adjacent(parent, direction)
        }

        // append letter for direction to parent
        return parent + base.charAt(neighbour[direction][type].indexOf(lastCh))
    }


    /**
     * Returns all 8 adjacent cells to specified geohash.
     *
     * @param   {string} geohash - Geohash neighbours are required of.
     * @returns {{n,ne,e,se,s,sw,w,nw: string}}
     * @throws  Invalid geohash.
     */
    static neighbours(geohash: string) {
        return {
            'n': Geohash4.adjacent(geohash, 'n'),
            'ne': Geohash4.adjacent(Geohash4.adjacent(geohash, 'n'), 'e'),
            'e': Geohash4.adjacent(geohash, 'e'),
            'se': Geohash4.adjacent(Geohash4.adjacent(geohash, 's'), 'e'),
            's': Geohash4.adjacent(geohash, 's'),
            'sw': Geohash4.adjacent(Geohash4.adjacent(geohash, 's'), 'w'),
            'w': Geohash4.adjacent(geohash, 'w'),
            'nw': Geohash4.adjacent(Geohash4.adjacent(geohash, 'n'), 'w'),
        }
    }

    /**
     * Bounding Boxes
     *
     * Return all the hashString between minLat, minLng, maxLat, maxLng in numberOfChars
     * @param {number} minLat
     * @param {number} minLng
     * @param {number} maxLat
     * @param {number} maxLng
     * @param {number} [precision] - Number of characters in resulting geohash.
     * @returns {Array<string>}
     * @throws Precision must be strictly positive.
     */
    static encode_bounds(
        minLat: number,
        minLng: number,
        maxLat: number,
        maxLng: number,
        precision: number) {
        if (precision <= 0) {
            throw new Error('precision must be strictly positive')
        }
        precision = precision || 30

        var hashSouthWest = Geohash4.encode(minLat, minLng, precision)
        var hashNorthEast = Geohash4.encode(maxLat, maxLng, precision)

        var boxSouthWest = Geohash4.bounds(hashSouthWest)
        var boxNorthEast = Geohash4.bounds(hashNorthEast)

        var perLat = boxSouthWest.ne.lat - boxSouthWest.sw.lat
        var perLng = boxSouthWest.ne.lng - boxSouthWest.sw.lng

        var latStep = Math.round((boxNorthEast.sw.lat - boxSouthWest.sw.lat) / perLat)
        var lngStep = Math.round((boxNorthEast.sw.lng - boxSouthWest.sw.lng) / perLng)

        var hashList = []

        var lat = 0
        var poilatgeohash = hashSouthWest
        while (lat <= latStep) {
            var lng = 0
            var poigeohash = poilatgeohash
            while (lng <= lngStep) {
                hashList.push(poigeohash)
                poigeohash = Geohash4.adjacent(poigeohash, 'e')
                lng++
            }
            poilatgeohash = Geohash4.adjacent(poilatgeohash, 'n')
            lat++
        }

        return hashList
    }

    /**
     * Caclulate geohash precision for given map zoom
     *
     * Return geohash precision for given map zoom
     * @param {number} zoom
     * @returns {precision}
     */
    static zoom2precision(zoom: number): number {
        const z2p = [
            2,  // 0
            2,  // 1
            2,  // 2
            2,  // 3
            2,  // 4
            2,  // 5
            2,  // 6
            3,  // 7
            3,  // 8
            4,  // 9
            4,  // 10
            4,  // 11
            5,  // 12
            5,  // 13
            5,  // 14
            5,  // 15
            6,  // 16
            6,  // 17
            6,  // 18
            7,  // 19
            7,  // 20
            8,  // 21
            8,  // 22
            8,  // 23
            9,  // 24
            9,  // 24
            9,  // 25
            10, // 26
            10, // 27
            10, // 28
            11, // 29
            11, // 30
            12, // 31
        ]
        return z2p[zoom]
    }

}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */