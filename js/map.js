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
	    .bindPopup('<p style="font-size:small">Ecco il parco!</p>')
	    .openPopup();	
}


/***************GET MAPPA GENERICA*(MAPPA.HTML)*/
function getMappaGenerica()
{
	initialize_map_generica(sessionStorage.lat, sessionStorage.longi);
}
function initialize_map_generica(lati, longi)
{		
	var map1 = L.map('map1').setView([lati, longi], 15);

	//credits mappa
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map1);

	//poi
	L.marker([lati, longi]).addTo(map1)
	    .bindPopup('<p style="font-size:small">Ciao!</p>');	
}