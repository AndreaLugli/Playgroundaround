var indirizzo = 'http://app.playgroundaroundthecorner.it';

document.addEventListener('deviceready', partenza, true);

//AL CARICAMENTO DELLA PAGINA
function partenza()
{	
	$.support.cors = true;

	document.addEventListener('backbutton', backButtonCallback, true);
}


/*********************STRUTTURA*/
function pop()
{
	navbarPop();
	footerPop();
}

function navbarPop()
{
	$('body').prepend('<nav class="navbar navbar-inverse navbar-static-top" role="navigation">'+
          '<div class="container">'+
            '<div class="navbar-header">'+
              '<a class="navbar-brand" href="index.html">'+
                '<img alt="brand" src="./img/logo.png">'+
              '</a>'+
              '<button type="button" class="btn navbar-btn" onClick="window.location=\'aggiungi.html\'">Inserisci</button>'+
            '</div>'+
          '</div>'+
        '</nav>');
}

function footerPop()
{
	$('#bottom').html('<nav id="footer" class="navbar-fixed-bottom">'+
          '<div class="container">'+
              '<a href="credits.html">credits</a>'+
          '</div>'+
        '</nav>');
}

function scrollAlto()
{
	$('html, body').animate({scrollTop: 0 }, 'slow');
}

/****************LOCALIZZAZIONE*/

function localize()
{ 
	var wathcID = navigator.geolocation.getCurrentPosition(handle_localize, error_localize, {enableHighAccuracy: false, maximumAge: 300000, timeout: 10000});
}
function handle_localize(position)
{  	
	sessionStorage.lat = position.coords.latitude.toFixed(3);
	sessionStorage.longi = position.coords.longitude.toFixed(3);

	alert('Ti trovi a: LATI:'+sessionStorage.lat+' LONGI:'+sessionStorage.longi);
}
function error_localize(){}


/********************GET*PARCHI*VICINI*/
//pagina vicini.html
function openVicini()
{
	pop();
	
	$.ajax({
			type: 'GET',
			crossDomain: true,
			url: indirizzo+'/search_near?lat=44.482&lng=11.260&distanza=10',
			contentType: 'application/json',
			error: errorHandler,
			success: appendVicini
		});
}
/*function getVicini()
{
	distanza = 10;
	alert(distanza);

	$.ajax({
			type: 'GET',
			crossDomain: true,
			//url: indirizzo+'/search_near?lat='+sessionStorage.lat+'&lng='+sessionStorage.longi+'&distanza='+distanza,
			url: 'http://app.playgroundaroundthecorner.it/search_near?lat=44.482&lng=11.260&distanza=10',
			contentType: 'application/json',
			success: appendVicini,
			error: errorHandler
	});
}*/
function appendVicini(data)
{
	jsonVicini = data;
	
	listaParchiVicini = '';

	for( i=0; i < jsonVicini.length; i++ ){

		servizi = getServizi(jsonVicini[i].picnic, jsonVicini[i].parking, jsonVicini[i].cleaning, jsonVicini[i].fenced_area, jsonVicini[i].toilette, jsonVicini[i].caffe, jsonVicini[i].universally_accessible);
		voto = getStelline(jsonVicini[i].evaluation);

		listaParchiVicini += '<a class="parco" href="javascript:apriParco('+jsonVicini[i].id+');">'+
			                    '<img src="img/logo.png"/>'+
			                   '<span class="desc">'+
			                        '<p class="titolo">'+jsonVicini[i].name+'</p>'+
			                        '<span class="eta">'+jsonVicini[i].age_min+'-'+jsonVicini[i].age_max+'</span>'+
			                        '<span class="orario">'+jsonVicini[i].opening_hours+'</span>'+
			                        '<span class="voto">'+voto+'</span>'+
			                        '<span class="servizi">'+servizi+'</span>'+
			                    '</span>'+
			                '</a>';
	}

	if(listaParchiVicini == '')
	{
		listaParchiVicini = '<div class="alert">Ooooops! Sembra che non siano ancora stati censiti parchi intorno a te!</div>';
	}
	$('#parchiVicini').html(listaParchiVicini);	
}

//colora le icone se i servizi sono disponibili o meno sul parco
function getServizi(picnic, parking, cleaning, fenced_area, toilette, caffe, universally_accessible)
{
	listaServizi = '';

	if(picnic){
		listaServizi += '<i class="fa fa-cutlery true"></i>';
	}else{
		listaServizi += '<i class="fa fa-cutlery false"></i>';
	}
	if(parking){
		listaServizi += '<i class="fa fa-car true"></i>';
	}else{
		listaServizi += '<i class="fa fa-car false"></i>';
	}
	if(cleaning){
		listaServizi += '<i class="fa fa-recycle true"></i>';
	}else{
		listaServizi += '<i class="fa fa-recycle false"></i>';
	}
	if(fenced_area){
		listaServizi += '<i class="fa fa-signal true"></i>';
	}else{
		listaServizi += '<i class="fa fa-signal false"></i>';
	}
	if(toilette){
		listaServizi += '<i class="fa fa-female true"></i>';
	}else{
		listaServizi += '<i class="fa fa-female false"></i>';
	}
	if(caffe){
		listaServizi += '<i class="fa fa-beer true"></i>';
	}else{
		listaServizi += '<i class="fa fa-beer false"></i>';
	}
	if(universally_accessible){
		listaServizi += '<i class="fa fa-wheelchair true"></i>';
	}else{
		listaServizi += '<i class="fa fa-wheelchair false"></i>';
	}

	return listaServizi;
}

//votazione del parco
function getStelline(valore){

	stelline = '';	

	switch(valore) {
		case null:
	        stelline = 'not available';
	        break;
	    case 1:
	        stelline = '<b>1/5</b><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
	        break;
	    case 1.5:
	        stelline = '<b>1.5/5</b><i class="fa fa-star"></i><i class="fa fa-star-half"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
	        break;
	    case 2:
	        stelline = '<b>2/5</b><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
	        break;
	    case 2.5:
	        stelline = '<b>2.5/5</b><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
	        break;
	    case 3:
	        stelline = '<b>3/5</b><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
	        break;
	    case 3.5:
	        stelline = '<b>3.5/5</b><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half"></i><i class="fa fa-star-o"></i>';
	        break;
	    case 4:
	        stelline = '<b>4/5</b><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i>';
	        break;
	    case 4.5:
	        stelline = '<b>4.5/5</b><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half"></i>';
	        break;
	    case 5:
	        stelline = '<b>5/5</b><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>';
	        break;
	}

	return stelline;
}
	


function apriParco(id)
{
	sessionStorage.idParco = id;
	alert(id);
	window.location='parco.html';
}
function getParco(){
	$.ajax({
		type: 'GET',
		url: indirizzo+'/get_playground?id='+sessionStorage.idParco,
		success: appendParco,
		error: errorHandler
	});
}
function appendParco(){
	
	getMappaParco();
}

/***************GET MAPPA*/
function getMappaParco()
{
	initialize_map_parco(sessionStorage.lat, sessionStorage.longi);
}
function initialize_map_parco(lati, longi)
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

/***************GET MAPPA GENERICA*/
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




//GESTIONE ERRORI AJAX E JSON GENERICO
function errorHandler(xhr, textStatus, thrownError)
{
	alert("Errore "+xhr.status+" - "+textStatus);
	/*console.log(xhr.status);
	console.log(xhr.responseText);
	console.log(textStatus);
	console.log(thrownError);*/
}