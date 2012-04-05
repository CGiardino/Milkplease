var express = require('express');
var io = require('socket.io');
var csv = require('ya-csv');
var geocoder = require('geocoder');
var $ =require('jquery');
var fs = require('fs');

var reader = csv.createCsvFileReader('members_list_4.4.csv');

var dati=[];
var j=0;

reader.addListener('data', function(data) {
    var i=0;
    while(data[i]!=null ){
        if(i==1 && data[i]!=""){
            dati[j]=data[i];
            j++;

        }

        i++;

    }
});
reader.addListener('end',gohead);


var app = express.createServer(
    express.bodyParser()
    , express.static(__dirname + "/views")
    , express.cookieParser()
    , express.session({ secret:'desrever'})
),io = io.listen(app);
<!--io.set('log level', 1);-->


app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.register('.html', require('jade'));
    app.use(express.compiler({ src:__dirname + '/views', enable:['less'] }));
});

app.get('/', function (req, res) {



    res.render('index');


});
var z=0;
var ci=0;
var cord=[];
function gohead(){
    z++;
    code(z);
}


function soc(){


        io.sockets.on('connection', function (socket) {
            var p=0;
            while(p<cord.length){
                console.log(cord[p]);
                socket.emit('cord', cord[p]);

                p++;
            }
        });


}
function code(x){

    var lat1="";
    var lon1="";


    if(x<dati.length){

        geocoder.geocode(dati[x]+"+Italy",function ( err, data ){
            var obj= JSON.parse(JSON.stringify(data));
            if(obj.results[0]!=null){
                lat1=obj.results[0].geometry.location.lat;
                lon1=obj.results[0].geometry.location.lng;
                cord[ci]=[[lat1],[lon1]];
                ci++;
            }

            gohead();
        });



    }
    else{
        soc();

    }

}




app.listen(3000);
