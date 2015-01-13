/***************GET MAPPA*(PARCO.HTML)*/
function getMappaParco(lati, longi)
{		
	var map = L.map('map').setView([lati, longi], 15);

	//credits mappa
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	//poi
	L.marker([lati, longi]).addTo(map)
	    .bindPopup('<p style="font-size:small">The park in here</p>');	
}


/***************GET MAPPA GENERICA*(MAPPA.HTML)*/
function getMappaGenerica()
{
	initialize_map_generica(sessionStorage.lat, sessionStorage.longi);

}
function initialize_map_generica(lati, longi)
{		
	centroLat = lati;
	centroLng = longi;

	map1 = L.map('map1').setView([centroLat, centroLng], 15);
			
	var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
		subDomains = ['otile1','otile2','otile3','otile4'],
		cloudmadeAttrib = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
	 
	var cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttrib, subdomains: subDomains});

	cloudmade.addTo(map1);		

	var marker = L.marker([centroLat, centroLng]).addTo(map1);
	marker.bindPopup("<p style='font-size:small'>You\'re here</p>")
			.openPopup();

	//get parchi vicini
	mappaVicini();
}

//parchi vicini su mappa
function mappaVicini()
{
	distanza = 5;

	$.ajaxSetup({ cache: false });
	$.ajax({
		type: 'GET',
		url: indirizzo+'/search_near?lat='+sessionStorage.lat+'&lng='+sessionStorage.longi+'&distanza='+distanza,		
		success: appendMappa,
		error: errorHandler
	});
}
function appendMappa(data)
{
	//icona personalizzata parchi
	var greenIcon = L.icon({
		iconUrl: 'img/poi.png',
		iconAnchor:   [25, 41], // point of the icon which will correspond to marker's location
		popupAnchor:  [-12.5, -35] // point from which the popup should open relative to the iconAnchor
	});

	//incollo i parchi
	$.each(data, function(i, item) {
    	latitude = item.latitude;
    	longitude = item.longitude;
    	L.marker([latitude, longitude], {icon: greenIcon}).addTo(map1);
	});
}