var express = require('express');
var io = require('socket.io');
var csv = require('ya-csv');
var geocoder = require('geocoder');
var $ =require('jquery');
var fs = require('fs');
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.SchemaTypes.ObjectId;
var geo= new Schema({
     lat: Number
    ,lon: Number
    ,cap: Number
})
mongoose.connect('mongodb://localhost/milkplease');
var geoModel = mongoose.model('geo', geo);

var reader = csv.createCsvFileReader('members_list_4.4.csv');

var dati=[];
var j=0;
var MailChimp=require('mailchimp');
var MailChimpExportAPI = MailChimp.MailChimpExportAPI;
var MailChimpWebhook = MailChimp.MailChimpWebhook;
var webhook = new MailChimpWebhook();


var apiKey = 'ad35e8926f0c786cc82e302c3134f786-us4';

try {
    var exportApi = new MailChimpExportAPI(apiKey, { version : '1.0', secure: false });
} catch (error) {
    console.log('Error: ' + error);
}

exportApi.list({ id : '2091439f7f'  }, function (data) {
    if (data.error)
        console.log('Error: '+data.error+' ('+data.code+')');
    else{
        var i=1;


        while(data[i]!=null){

            if(data[i][1]!=null && data[i][1]!=""){

                dati[j]=data[i][1];

                j++;

            }
            i++;
        }
        populate(0);
    }

});

function populate(j){

            if(j<dati.length)
                geoModel.findOne({'cap':dati[j]},function (err,doc){

                    if(doc==null){

                        var geoInstance= new geoModel();
                        geoInstance.cap=dati[j];
                        geoInstance.save(function(err,docs){

                            populate(++j);});


                    }
                    else{

                        populate(++j);
                    }


                });
            else

                    gohead();
}

webhook.on('subscribe', function (data, meta) {
    console.log(data+"/SUB");
    if(data[1]=""){
        dati[j]=data[1];
        populate(j);
        j++;
    }
});
/*reader.addListener('data', function(data) {
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
 */

var app = express.createServer(
    express.bodyParser()
    , express.static(__dirname + "/public")
    , express.cookieParser()
    , express.session({ secret:'desrever'})
),io = io.listen(app);
io.set('log level', 1);


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
var socdone=false;
function gohead(){
    z++;
    find(z);
}


function soc(){

     if(!socdone){
            io.sockets.on('connection', function (socket) {
                var p=0;

                while(p<cord.length){

                    socket.emit('cord', cord[p]);

                    p++;
                }
                socdone=true;
            });
     }
    else{
         io.sockets.emit('cord', { will: cord[cord.length-2]});
     }

}

function find(x){
    geoModel.findOne({'cap':dati[x]},function (err,doc){

       if(doc==null ||doc.lat==null){


           code(x);

       }
        else{

           cord[ci]=[[doc.lat],[doc.lon]];

           ci++;
           gohead();
       }
    });
}
function code(x){

    var lat1="";
    var lon1="";


    if(x<dati.length){


            geocoder.geocode(dati[x]+"+Italy",function ( err, data ){
                var obj= JSON.parse(JSON.stringify(data));

                if(obj.status=="OVER_QUERY_LIMIT"){
                    console.log(JSON.stringify("OVER_QUERY_LIMIT"));

                    soc();
                }
                else if(obj.results[0]!=null){
                    lat1=obj.results[0].geometry.location.lat;
                    lon1=obj.results[0].geometry.location.lng;
                    cord[ci]=[[lat1],[lon1]];

                    ci++;
                    var conditions = { cap: dati[x]}
                        , update = { $set:{lat:lat1,lon:lon1 }}
                        , options = { multi: true };
                    geoModel.update(conditions,update,options,callback);
                    function callback (err, numAffected) {
                        if(err!=null)
                            console.log(err);
                    };
                        gohead();
                }


            });



    }
    else{
        soc();

    }

}




app.listen(3000);
