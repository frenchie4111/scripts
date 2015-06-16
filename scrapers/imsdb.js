var request = require( 'request' ),
    cheerio = require( 'cheerio' ),
    q = require( 'q' );

var homepage_link = 'http://www.imsdb.com/all%20scripts/';

var get = function( url ) {
    return q.Promise( function( resolve, reject ) {
        request
            .get( url, function( e, n, body ) {
                var $ = cheerio.load( body );
                resolve( $ );
            } );
    } );
};

q
    .async( function *() {
        var homepage = yield get( homepage_link );
        console.log( homepage.html() )
    } )();