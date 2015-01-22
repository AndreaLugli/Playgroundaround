/***************GET MAPPA*(PARCO.HTML)*/
function getMappaParco(lati, longi)
{		
	var map = L.map('map').setView([lati, longi], 15);

	//credits mappa
	/*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);*/
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

	map.dragging.disable();

	//icona personalizzata parchi
	var greenIcon = L.icon({
		iconUrl: 'img/poi.png',
		iconAnchor:   [25, 41], // point of the icon which will correspond to marker's location
		popupAnchor:  [-12.5, -35] // point from which the popup should open relative to the iconAnchor
	});

	//poi parco
	L.marker([lati, longi], {icon: greenIcon}).addTo(map)
	    //.bindPopup('<p style="font-size:small">The park in here</p>');
	    .bindPopup('<p style="font-size:small">Questo è il parco</p>');	

	//poi mia posizione
	L.marker([sessionStorage.lat, sessionStorage.longi]).addTo(map)
	.bindPopup('<p style="font-size:small">Ti trovi qui</p>');	
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
			
	/*var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
		subDomains = ['otile1','otile2','otile3','otile4'],
		cloudmadeAttrib = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';*/
	
	var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
		subDomains = ['otile1','otile2','otile3','otile4'],
		cloudmadeAttrib = '';
	
	var cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttrib, subdomains: subDomains});

	cloudmade.addTo(map1);		

	var marker = L.marker([centroLat, centroLng]).addTo(map1);
	//marker.bindPopup("<p style='font-size:small'>You\'re here</p>")
	marker.bindPopup("<p style='font-size:small'>Ti trovi qui</p>")
			.openPopup();

	//get parchi vicini
	mappaVicini();
}

//parchi vicini su mappa
function mappaVicini()
{
	distanza = 25;

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

    	//alert(item.anteprima_path);

    	if(item.anteprima_path === null){
			anteprimina = "img/not_available_black.png";
		}
		else{
			anteprimina = indirizzo+'/media/'+item.anteprima_path;
		}

    	var parchetto = L.marker([latitude, longitude], {icon: greenIcon}).addTo(map1);
    	parchetto.bindPopup("<center><img class='imgNuvoletta' src='"+anteprimina+"' onError='this.onerror=null;this.src=\"./img/logo.jpg\";' /></center><button class='btn btn-sm around' onClick='apriParco("+item.id+")'>"+item.name+"</button>");
	});
}