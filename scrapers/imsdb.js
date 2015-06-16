var request = require( 'request' ),
    cheerio = require( 'cheerio' ),
    q = require( 'q' ),
    assert = require( 'chai' ).assert;

var base_url = 'http://www.imsdb.com';
var homepage_link = base_url + '/all%20scripts/';

var get = function( url ) {
    return q.Promise( function( resolve, reject ) {
        request
            .get( url, function( e, n, body ) {
                var $ = cheerio.load( body );
                resolve( $ );
            } );
    } );
};

/**
 * @class Movie
 * @description Contains information about a movie, used as a variable to be
 * passed around while scraping for movie script
 * @constructor
 * @param name {String} The name of the Movie
 * @param url {String} the The name url of the movie script
 */
var Movie = function( name, url ) {
    this.name = name;
    this.url = url;
    this.script = null;
};

/**
 * @function setScript
 * @description sets the movie script text
 * @param script new script text
 */
Movie.prototype.setScript = function( script ) {
    assert.isString( script, 'Script should be string' );
    this.script = script;
};

Movie.getMovieList = function( homepage_selector ) {
    var td_match = homepage_selector( 'td[valign=top]' );

    assert.isDefined( td_match, 'Td Should have match' );
    assert.equal( td_match.length, 3, 'Td Should have 3 matches' );

    var links_container = td_match[ 2 ];

    // Every movie is a <p>
    var p_match = homepage_selector( links_container ).children( 'p' );

    assert.isDefined( p_match, 'P Should have match' )

    // Contains list of movies to return
    var movies = [];

    p_match
        .each( function() {
            var p = homepage_selector( this );
            assert.isDefined( p, 'P for movie should exist' );

            // A is the anchor tag that contains the href and movie title
            // <a href="/path/to/movie.html">Movie Title</a>
            var a = p.children( 'a' );
            assert.isDefined( a, 'a For movie should have match' );

            var url_path = a.attr( 'href' );
            assert.isDefined( url_path, 'url_path for movie should exist' );
            var url = base_url + url_path;

            var movie_title = a.text();
            assert.isDefined( movie_title, 'movie_title for movie should exist' );

            var movie = new Movie( movie_title, url );
            movies.push( movie );
        } );

    console.log( movies );
};

q
    .async( function *() {
        var homepage_selector = yield get( homepage_link );

        var movie_list = Movie.getMovieList( homepage_selector );
    } )()
    .catch( function( err ) {
        console.error( err );
        console.error( err.stack );
    } );