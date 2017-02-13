var restify = require('restify'),
    port = process.env.PORT || 3000;
var mysql = require('mysql');
var server = restify.createServer({
    name : 'restify api'

});

var pool = mysql.createPool({
    host:'198.211.127.189',
    user:'Aaron',
    password:'ahmad',
    database:'mydb'


});


server.use(function (req, rest, next) {
    console.log(req.method +''+req.url);
    return next();
});

server.use(restify.bodyParser());
server.use(restify.urlEncodedBodyParser());





server.get('/allegasten', function allegasten1(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type: application/json");
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM table1 ORDER BY aanwezig', function(err, rows) {
            if (err) throw err;

            connection.release();

            res.send(rows);

            next();
        });
    });
});

server.get('/huishoudid/:name', function allegasten2(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type: application/json");
    var test = req.params.name;
    console.log(test);
    pool.getConnection(function(err, connection) {
        connection.query('SELECT huishouden FROM table1 WHERE naam =?',[test], function(err, rows) {
            if (err) throw err;

            connection.release();

            res.send(rows);

            next();
        });
    });
});

server.get('/huishoudgasten/:huishoudid', function allegasten3(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type: application/json");
    var test = req.params.huishoudid;
    console.log(test);
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM table1 WHERE huishouden =?',[test], function(err, rows) {
            if (err) throw err;

            connection.release();

            res.send(rows);

            next();
        });
    });
});




//Hier verstuur ik de als req naar de db om vervolgens de huishoudid terug te krijgen
server.post('/gethuishouden', function gethuishouden1(req, res, next) {
    console.log("1");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type: application/json");
    //console.log(req.body.naam);
    //hier vang ik de verstuurde naam op
    var user = req.body.naam;
    //hier maar ik verbinding met het database
    pool.getConnection(function(err, connection) {
        var test = String(user);
        console.log("2");
        //hier voer ik de query uit met test als geparsde user value;
        connection.query('SELECT huishouden,gastID FROM table1 WHERE naam =?',[test], function(err, rows) {

            if (err){throw err}else console.log(user);

            connection.release();
            //hier return ik de result
            res.send(rows);


            next();
        });
    });
});


server.get('/userkomt/:id', function gethuishouden2(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type: application/json");
    var userkomt =  "1";
    var id = req.params.id;
    console.log(id);
    pool.getConnection(function(err, connection) {
        connection.query(' update table1 set aanwezig =? where gastID =?  ', [userkomt,id], function(err, rows) {
            if (err) throw err;

            connection.release();

            res.send(rows);


            next();
        });
    });
});

server.get('/userkomtniet/:id', function gethuishouden3(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type: application/json");
    var userkomtniet = "0";
    var id = req.params.id;
    console.log(id);
    pool.getConnection(function(err, connection) {
        connection.query(' update table1 set aanwezig =? where gastID =?  ', [userkomtniet,id], function(err, rows) {
            if (err) throw err;

            connection.release();

            res.send(rows);


            next();
        });
    });
});








// server.get('/allegasten', function authenticate(req, res, next) {
//     pool.getConnection(function(err, connection) {
//         connection.query('SELECT * FROM table1 WHERE gastID = 1', function(err, rows) {
//             if (err) throw err;
//
//             connection.release();
//
//             res.send(rows);
//
//             next();
//         });
//     });
// });






// server.get('api/gasten', gasten.get);
// server.get('api/gasten/:id', gasten.getById);
// server.post('api/gasten', gasten.post);
// server.put('api/gasten/:id', gasten.put);
//server.del('api/gasten/:id', gasten.delete);

server.listen(port, function(){
    console.log('api running at ' + port)

});