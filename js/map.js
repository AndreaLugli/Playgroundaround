//Poi personalizzati
var greenPoi = L.icon({
	iconUrl: 'img/greenPoi.png',
	iconAnchor:   [25, 41],
	popupAnchor:  [-12.5, -35]
});
var purplePoi = L.icon({
	iconUrl: 'img/purplePoi.png',
	iconAnchor:   [25, 41],
	popupAnchor:  [-12.5, -35]
});

/***************GET MAPPA*(PARCO.HTML)*/
function getMappaParco(lati, longi)
{	
	$('#parcoAperto').fadeIn();
	$('#map').html('');
	var map = L.map('map').setView([lati, longi], 15);

	var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
		subDomains = ['otile1','otile2','otile3','otile4'],
		cloudmadeAttrib = '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
	 
	var cloudmade = new L.TileLayer(cloudmadeUrl, {minZoom: 12, maxZoom: 18, noWrap:true, reuseTiles: true, attribution: cloudmadeAttrib, subdomains: subDomains});

	cloudmade.addTo(map);

	//scroll mappa e pinch2zoom disattivati
	map.dragging.disable();
	//map.touchZoom.disable();

	//poi parco
	L.marker([lati, longi], {icon: greenPoi}).addTo(map)
	    .bindPopup('<p style="font-size:small">Ecco il parco</p>')
	    .openPopup();	

	//poi mia posizione
	L.marker([sessionStorage.lat, sessionStorage.longi], {icon: purplePoi}).addTo(map)
	.bindPopup('<p style="font-size:small">Tu sei qui</p>');	
}


/***************GET MAPPA GENERICA*(MAPPA.HTML)*/
function getMappaGenerica(back)
{
	popBack(back);
	initialize_map_generica(sessionStorage.lat, sessionStorage.longi);

}
function initialize_map_generica(lati, longi)
{		
	$('#map1').html('');
	map1 = L.map('map1').setView([lati, longi], 15);

	var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
		subDomains = ['otile1','otile2','otile3','otile4'],
		cloudmadeAttrib = '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
	 
	var cloudmade = new L.TileLayer(cloudmadeUrl, {minZoom: 10, maxZoom: 18, noWrap:true, reuseTiles: true, attribution: cloudmadeAttrib, subdomains: subDomains});

	cloudmade.addTo(map1);

	//pinch2zoom disattivato
	//map1.touchZoom.disable();

	var marker = L.marker([lati, longi], {icon: purplePoi}).addTo(map1);
	marker.bindPopup("<p style='font-size:small'>Tu sei qui</p>")
			.openPopup();

	//get lista parchi vicini
	mappaVicini();
}

function mappaVicini()
{
	distanza = 30;

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

    	var parchetto = L.marker([latitude, longitude], {icon: greenPoi}).addTo(map1);
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

	var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
		subDomains = ['otile1','otile2','otile3','otile4'],
		cloudmadeAttrib = '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
	 
	var cloudmade = new L.TileLayer(cloudmadeUrl, {minZoom: 12, maxZoom: 18, noWrap:true, reuseTiles: true, attribution: cloudmadeAttrib, subdomains: subDomains});

	cloudmade.addTo(map);

	//scroll mappa e pinch2zoom disattivati
	//map.dragging.disable();
	//map.touchZoom.disable();

	parchetto = creaPOI(lati,longi,"<p style='font-size:small'>Si trova qui?</p>");
	map.panTo(new L.LatLng(lati, longi));
}

function creaPOI(lat, lng, testo)
{
	var greenPoi = L.icon({
		iconUrl: 'img/greenPoi.png',
		iconAnchor:   [25, 41],
		popupAnchor:  [-12.5, -35]
	});

	punto = L.marker([lat, lng], {icon: greenPoi}).addTo(map).bindPopup(testo)
	.openPopup();

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