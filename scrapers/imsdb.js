var request = require( 'request' ),
    cheerio = require( 'cheerio' ),
    q = require( 'q' );

var get = function( url ) {
    return q.Promise( function( resolve, reject ) {
        request
            .get( url, function( e, n, body ) {
                var $ = cheerio.load( body );
                resolve( $ );
            } );
    } );
};