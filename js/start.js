var indirizzo = 'http://app.playgroundaroundthecorner.it';

document.addEventListener('deviceready', partenza, true);

//AL CARICAMENTO DELLA PAGINA
function partenza()
{	
	window.onerror = function (message, file, line) {
    	alert("Error in Application: " +
	        message + ". Source File: " + file + ", Line: " + line);
	}

	//document.addEventListener('backbutton', backButtonCallback, true);
}


/*********************STRUTTURA*/
function pop(page)
{
	//page: 'home' per la pagina index.html o 'back' per tutte le altre
	navbarPop(page);
	footerPop();
}

function navbarPop(page)
{
	$('body').prepend('<nav id="navbar" class="navbar navbar-inverse navbar-static-top" role="navigation">'+
          '<div class="container">'+
            '<div class="navbar-header">'+
              '<a id="logoNav" class="navbar-brand" href="index.html">'+
                '<img alt="brand" src="./img/logo.png">'+
              '</a>'+
              //'<button type="button" class="btn navbar-btn play" onClick="window.location=\'aggiungi.html\'">Inserisci</button>'+
              '<button type="button" class="btn navbar-btn play" onClick="alert(\'prossimamente!\');">Inserisci</button>'+
            '</div>'+
          '</div>'+
        '</nav>');

	//se non sono in home-page modifico il tasto della navbar
	if(page != 'home')
	{
		$('#logoNav').attr('href', 'javascript:history.go(-1);');
		$('#logoNav img').attr('src', './img/back2.png');
	}
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

	getCover();
	
	$('#cortina').hide();

	//alert('Ti trovi a: LATI:'+sessionStorage.lat+' LONGI:'+sessionStorage.longi);
}

function getCover()
{
	resolution();

	$.ajaxSetup({ cache: false });
	$.ajax({
		type:'GET',
		//url: indirizzo+'get_copertina?lat='+sessionStorage.lat+'&lng='+sessionStorage.longi,
		url: 'http://app.playgroundaroundthecorner.it/get_copertina?lat='+sessionStorage.lat+'&lng='+sessionStorage.longi,
		success: appendCover,
		error: errorHandler
	});

}
function appendCover(data)
{
	//alert(data.small_path+' '+data.big_path);

	//img e testo di default - da sostiutire
	sessionStorage.imgPath = '../img/bologna.jpg';
	sessionStorage.headTitle = 'benvenuto';

	//se non ho copertine entro 20km
	if(data != 'no_copertina')
	{
		//scelgo risoluzione copertina
		if(sessionStorage.deviceHeight <= 1000)
		{
			//200px × 130px ????
			sessionStorage.imgPath = data.small_path;
		}
		else
		{
			sessionStorage.imgPath = data.big_path;
		}

		sessionStorage.headTitle = data.descrizione_it;
	}

	$('#header').css('background-image','url('+indirizzo+sessionStorage.imgPath+')');
	$('#header h2').html(sessionStorage.headTitle);
	//alert(indirizzo+imgPath);

}

/*********************RISOLUZIONE*/
function resolution(){
	sessionStorage.deviceWidth = screen.width;
	sessionStorage.deviceHeight = screen.height;

	//alert('Risoluzione screen: '+sessionStorage.deviceWidth+' '+sessionStorage.deviceHeight);
}

/*****************ERRORI*/

function error_localize(){}

function errorHandler(xhr, textStatus, thrownError)
{
	alert("Errore "+xhr.status+" - "+textStatus);
	/*console.log(xhr.status);
	console.log(xhr.responseText);
	console.log(textStatus);
	console.log(thrownError);*/
}