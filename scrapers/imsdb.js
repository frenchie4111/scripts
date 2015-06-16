var request = require( 'request' ),
    cheerio = require( 'cheerio' ),
    q = require( 'q' ),
    assert = require( 'chai' ).assert,
    path = require( 'path' ),
    fs = require( 'fs' );

var base_url = 'http://www.imsdb.com';
var homepage_link = base_url + '/all%20scripts/';
var save_path = path.resolve( __dirname, '..', 'scraped' );

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
 * @method retrieveScript
 * @description Returns promise that queries this.url, pulls the script page, and parses
 * out the script text, then sets this.script to the script text
 * @returns {Promise} Promise that sends http request to download script
 */
Movie.prototype.retrieveScript = function() {
    var _this = this;

    return q
        .async( function *() {
            var $ = yield get( _this.url );
            assert.isDefined( $ );

            // Gets all as with href, the last one if our script link
            var script_url_path = $( 'td>a[href]' ).last().attr( 'href' );
            assert.isDefined( script_url_path );
            _this.url = base_url + script_url_path;
            assert.isDefined( _this.url );

            // Gets the actual script page
            $ = yield get( _this.url );
            assert.isDefined( $ );

            _this.script = $( 'pre' ).text();
            assert.isDefined( _this.script );
        } )();
};

Movie.prototype.getEscapedName = function() {
    var escaped_name = this.name.replace( / /g, '-' );
    return escaped_name;
};

/**
 * @method saveToFile
 * @description Returns a promise that saves the movie to the specified path
 * file will be saved as path/Movie Name.txt
 * @returns {Promise} That saves the movie script to the specified path
 */
Movie.prototype.saveToFile = function( save_path ) {
    var file_name = path.resolve( save_path, this.getEscapedName() + '.txt' );
    var file_contents = this.script;

    return q
        .Promise( function( resolve ) {
            console.log( 'Saving to', file_name );
            fs.writeFile( file_name, file_contents, resolve );
        } );
};

/**
 * @function getMovieList
 * @description Takes page selector for movie listing page, and returns a list
 * of movies
 * @param $ {Cheerio Dom Object} Takes cheerio dom selector, uses it to parse movie list
 */
Movie.getMovieList = function( $ ) {
    var td_match = $( 'td[valign=top]' );

    assert.isDefined( td_match, 'Td Should have match' );
    assert.equal( td_match.length, 3, 'Td Should have 3 matches' );

    var links_container = td_match[ 2 ];

    // Every movie is a <p>
    var p_match = $( links_container ).children( 'p' );

    assert.isDefined( p_match, 'P Should have match' )

    // Contains list of movies to return
    var movies = [];

    p_match
        .each( function() {
            var p = $( this );
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

    return movies;
};

q
    .async( function *() {
        var homepage_selector = yield get( homepage_link );

        var movie_list = Movie.getMovieList( homepage_selector );

        yield movie_list
            .reduce( ( promise, current, i ) => {
                return promise
                    .then( function() {
                        console.log( i, movie_list.length );
                        return current.retrieveScript();
                    } )
                    .then( function() {
                        return current.saveToFile( save_path );
                    } );
            }, q.try( function() {} ) );
    } )()
    .catch( function( err ) {
        console.error( err );
        console.error( err.stack );
    } );