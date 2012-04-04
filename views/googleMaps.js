

	var map;
    var contentString;
	var myposition = new google.maps.LatLng(46.066745, 11.151085);
		var neighborhoods = [
	 new google.maps.LatLng(46.066216, 11.1198),
	new google.maps.LatLng(46.056437, 11.121705),
	    new google.maps.LatLng(46.060859, 11.125824),
	     new google.maps.LatLng(46.05803, 11.132841)
	];
	var markers = [];
	 var iterator = 0;
    function setContent(content){
    contentString=content;
    }
	function inizializeMap(){
      var myOptions = {
        zoom: 13,
        center: myposition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
		map =  new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	}
    function initialize(i) {
	if(i==0)
		inizializeMap();

     if(i==0)
       iterator = 0;
	  function drop() {
	    for (var i = 0; i < neighborhoods.length; i++) {
	      setTimeout(function() {
	        addMarker();
	      }, i * 400);
	    }
	  }

	  function addMarker() {
	    markers.push(new google.maps.Marker({
	      position: neighborhoods[iterator],
	      map: map,
	      draggable: false,
	      animation: google.maps.Animation.DROP

	    }));
	    iterator++;
	  }
drop();


    }
