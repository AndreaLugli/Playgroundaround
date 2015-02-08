/***************GET MAPPA*(PARCO.HTML)*/
function getMappaParco(lati, longi)
{	
	$('#parcoAperto').fadeIn();
	$('#map').html('');
	var map = L.map('map').setView([lati, longi], 15);

	//credits mappa
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	//disabilito scroll mappa
	map.dragging.disable();

	//icona personalizzata poi parco
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

	$('#map1').html('');
	map1 = L.map('map1').setView([centroLat, centroLng], 15);
			
	var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
		subDomains = ['otile1','otile2','otile3','otile4'],
		cloudmadeAttrib = '';
	var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
	subDomains = ['otile1','otile2','otile3','otile4'],
	cloudmadeAttrib = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
	
	var cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 15, attribution: cloudmadeAttrib, subdomains: subDomains});

	cloudmade.addTo(map1);		

	var marker = L.marker([centroLat, centroLng]).addTo(map1);
	//marker.bindPopup("<p style='font-size:small'>You\'re here</p>")
	marker.bindPopup("<p style='font-size:small'>Ti trovi qui</p>")
			.openPopup();

	//get lista parchi vicini
	mappaVicini();
}

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

    	if(item.anteprima_path === null){
			anteprimina = "img/logo.jpg";
		}
		else{
			anteprimina = indirizzo+'/media/'+item.anteprima_path;
		}

    	var parchetto = L.marker([latitude, longitude], {icon: greenIcon}).addTo(map1);
    	parchetto.bindPopup("<center><a href='javascript:apriParco("+item.id+")'><img class='imgNuvoletta' src='"+anteprimina+"' onError='this.onerror=null;this.src=\"./img/logo.jpg\";' /></a></center><button class='btn btn-sm around' onClick='apriParco("+item.id+")'>"+item.name+"</button>");
	});
}

/*******************NUOVO*PARCO*(INSERISCI_COORD)*/
function localizzaMap(lati, longi)
{
	//salvo le coordinate
	sessionStorage.newLati = lati;
	sessionStorage.newLongi = longi;
	//alert(sessionStorage.latiNuovoParco +' '+sessionStorage.longiNuovoParco);

	map = L.map('map').setView([lati, longi], 15);

	//credits mappa
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	//disabilito scroll mappa
	map.dragging.disable();

	parchetto = creaPOI(lati,longi,"<p style='font-size:small'>Questo è il parco</p>");
	map.panTo(new L.LatLng(lati, longi));
}

function creaPOI(lat,lng, testo) {	
	punto = L.marker([lat, lng]).addTo(map).bindPopup(testo);
	return punto
}

//funzione di Reverse Geocoding (con API di Google)
function codeLatLng(position_lat, position_long)
{
	geocoder = new google.maps.Geocoder();

	  var lat = position_lat;
	  var lng = position_long;

	  var latlng = new google.maps.LatLng(lat, lng);
	  geocoder.geocode({'latLng': latlng}, function(results, status){
	    if (status == google.maps.GeocoderStatus.OK)
	    {
	    	for (var i=0; i<results[0].address_components.length; i++)
	    	{ 	
	    		var val_street = results[0].address_components[i].types[0];
	    		
	    		switch (val_street)
	    		{
	    			case "street_number":
	    				var nciv = results[0].address_components[i].long_name;
	    				break;
	    			case "route":
	    				var indirizzo = results[0].address_components[i].long_name;
	    				break;
	    			case "locality":
	    				var citta = results[0].address_components[i].long_name;
	    				break;
	    			case "administrative_area_level_2":
	    				var provincia = results[0].address_components[i].short_name;
	    				break;
	    			case "postal_code":
	    				var cap = results[0].address_components[i].long_name;
	    				break;
	    		}
	    	}
	    	
	    	//Inserisce i valori nella form
	    	$('#via').val(indirizzo);
	    	$('#civico').val(nciv);
	    	$('#citta').val(citta);
	    	$('#cap').val(cap);
	    	$('#prov').val(provincia);

	    	sessionStorage.newAddress = indirizzo+', '+nciv+', '+cap+', '+citta+', '+provincia;
	    	//alert(sessionStorage.newAddress);

	    	//rimuovo blocchi
	    	$('input').attr('placeholder','');
	    	$('input').removeAttr('disabled');

	    	$('#continua').show();
	    	$('#cortina').fadeOut();
	    	correggi();
	    }

	  });
}

//funzione per get indirizzo e ricalcolo coordinate
function new_Geocoding()
{
	$('#continua').fadeOut();
	$('input').attr('disabled','disabled');
	
	new_via = $('#via').val();
	new_civico = $('#civico').val();
	new_citta = $('#citta').val();
	new_cap = $('#cap').val();
	new_prov = $('#prov').val();
	
	query = new_via+", "+new_civico+", "+new_citta+", "+new_cap;

	sessionStorage.newAddress = query+", "+new_prov;
	//alert(sessionStorage.newAddress);
	
	codeAddress(query);
}

function codeAddress(query) {
	address = query;  
	  
	if(!geocoder)
	{
		geocoder = new google.maps.Geocoder(); 
	} 
	geocoder.geocode( { 'address': address}, function(results, status)
	{
		if (status == google.maps.GeocoderStatus.OK)
	    {
	    	coordinate = ""+results[0].geometry.location+"";

	    	//dalle coordinate prendo latitudine e longitudine
	    	var array_split = coordinate.split(',');
	    	
	    	new_lat = $.trim(array_split[0]);
	    	new_lat =new_lat.substr(1);
	    	new_long = $.trim(array_split[1]);
	    	
	    	new_lat = parseFloat(new_lat);
	    	new_long = parseFloat(new_long);

	    	//salvo le coordinate
	    	sessionStorage.newLati = new_lat;
	    	sessionStorage.newLongi = new_long;
			//alert(sessionStorage.latiNuovoParco +' '+sessionStorage.longiNuovoParco);

	    	//distruggo e ricreo mappa
	    	map.removeLayer(parchetto);
		    map.setView([new_lat, new_long], 15);	
		    parchetto = L.marker([new_lat, new_long]).addTo(map);
	    }    	    
	    
	    //rimuove blocchi	
	    $('input').removeAttr('disabled');

	    $('#correggi').hide();
	    $('#continua').show();
	    
	    //on focus cambio bottoni continua/correggi
	    correggi();
	});
}