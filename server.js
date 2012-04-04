var express = require('express');


var geocoder = require('geocoder');

var fs = require('fs');




var app = express.createServer(
    express.bodyParser()
    , express.static(__dirname + "/views")
    , express.cookieParser()
    , express.session({ secret:'desrever'})
);

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.register('.html', require('jade'));
    app.use(express.compiler({ src:__dirname + '/views', enable:['less'] }));
});

app.get('/', function (req, res) {
    geocoder.geocode("38027+Italy",function ( err, data ){
        var obj= JSON.parse(JSON.stringify(data));

        console.log(obj.results[0].geometry.location.lat);
        console.log(obj.results[0].geometry.location.lng);
    });
    res.render('index');

});


app.listen(3000);
