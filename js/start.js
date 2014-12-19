document.addEventListener('deviceready', partenza, true);

//AL CARICAMENTO DELLA PAGINA
function partenza()
{	
	jQuery.support.cors = true;

	document.addEventListener('backbutton', backButtonCallback, true);
}


/*********************STRUTTURA*/
function pop(){
	navbarPop();
	footerPop();
}

function navbarPop(){
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

function footerPop(){
	$('#bottom').html('<nav id="footer" class="navbar-fixed-bottom">'+
          '<div class="container">'+
              '<a href="credits.html">credits</a>'+
          '</div>'+
        '</nav>');
}

function scrollAlto(){
	$('html, body').animate({scrollTop: 0 }, 'slow');
}

/****************LOCALIZZAZIONE*/

function localize()
{ 
	var wathcID = navigator.geolocation.getCurrentPosition(handle_localize, error_localize, {enableHighAccuracy: false, maximumAge: 300000, timeout: 10000});
}
function handle_localize(position)
{  	
	sessionStorage.lat = position.coords.latitude;
	sessionStorage.longi = position.coords.longitude;

	alert('Ti trovi a: LATI:'+sessionStorage.lat+' LONGI:'+sessionStorage.longi);
}
function error_localize(){}


/********************GET*PARCHI*VICINI*/
function apriParco(id){
	alert(id);
	window.location='parco.html';
}

/*********************MAPPA*/
function getMappa(){
	initialize_map(sessionStorage.lat, sessionStorage.longi);
}

//Mostra la mappa
function initialize_map(lati, longi)
{		
	var map = L.map('map').setView([lati, longi], 15);

	//credits mappa
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	//poi
	L.marker([lati, longi]).addTo(map)
	    .bindPopup('<b style="font-size:small">Ecco il parco!</b>')
	    .openPopup();	
}