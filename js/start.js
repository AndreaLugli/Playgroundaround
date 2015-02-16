var indirizzo = 'http://app.playgroundaroundthecorner.it';
var debug = true;

var deviceType;

document.addEventListener('deviceready', partenza, true);

//AL CARICAMENTO DELLA PAGINA
function partenza()
{	
	/**********DEV OR DEPLOY**********/
	if(debug)
	{
		//controllo il tipo di device
		deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iOS" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iOS" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/Windows Phone/i)) == "Windows Phone" ? "Win" : "null";

		window.onerror = function (message, file, line)
		{
	    	alert("Error in Application: " +
		        message + ". Source File: " + file + ", Line: " + line);
		}

		//CSS fixes
		if(deviceType == 'iOS'){
			$('head').append('<link rel="stylesheet" type="text/css" href="css/style_around_ios.css">');		
		}

	}

}


/*********************STRUTTURA*/
function popHome()
{
	//logo normale + refresh pagina
	$('body').prepend('<nav id="navbar" class="navbar navbar-inverse navbar-static-top" role="navigation">'+
      '<div class="container">'+
        '<div class="navbar-header">'+
          '<a id="logoNav" class="navbar-brand" href="index.html">'+
            '<img alt="brand" src="./img/segnaposto_trasp.png">'+
          '</a>'+
          '<button type="button" class="btn navbar-btn btn-sm around" onClick="window.location=\'inserisci_coord.html\'"><i class="fa fa-plus"></i> Nuovo parco</button>'+
        '</div>'+
      '</div>'+
    '</nav>');

	footerPop();
}
function popBack()
{
	//logo con freccia + pagina back
	$('body').prepend('<nav id="navbar" class="navbar navbar-inverse navbar-static-top" role="navigation">'+
      '<div class="container">'+
        '<div class="navbar-header">'+
          '<a id="logoNav" class="navbar-brand" href="javascript:history.go(-1);">'+
            '<img alt="brand" src="./img/segnaposto_trasp_back.png">'+
          '</a>'+
          '<button type="button" class="btn navbar-btn btn-sm around" onClick="window.location=\'inserisci_coord.html\'"><i class="fa fa-plus"></i> Nuovo parco</button>'+
        '</div>'+
      '</div>'+
    '</nav>');

	footerPop();
}

function footerPop()
{
	$('#bottom').html('<nav id="footer" class="navbar-fixed-bottom">'+
          '<div class="container">'+
              '<a href="benvenuto.html">tutorial</a> | <a href="index.html">home</a> | <a href="credits.html">credits</a>'+
          '</div>'+
        '</nav>');
}

function scrollAlto()
{
	$('html, body').animate({scrollTop: 0 }, 'slow');
}

/****************LOCALIZZAZIONE*/
function goHome()
{
	popHome();

	if(sessionStorage.lat && sessionStorage.imgPath)
        {
            $('#header h2').html(sessionStorage.headTitle);
            $('#header .imgCover').css('background-image','url('+indirizzo+sessionStorage.imgPath+')');
            $('#header .imgCover').fadeIn('slow');
        }
        else
        {
            localize();
        }
}

function localize()
{ 
	var wathcID = navigator.geolocation.getCurrentPosition(handle_localize, error_localize, {enableHighAccuracy: false, maximumAge: 300000, timeout: 10000});
}
function handle_localize(position)
{  	
	sessionStorage.lat = position.coords.latitude.toFixed(3);
	sessionStorage.longi = position.coords.longitude.toFixed(3);

	getCover();
	getPromo();

	//alert('Ti trovi a: LATI:'+sessionStorage.lat+' LONGI:'+sessionStorage.longi);
}

function getCover()
{
	resolution();

	$.ajaxSetup({ cache: false });
	$.ajax({
		type:'GET',
		//url: indirizzo+'get_copertina?lat='+sessionStorage.lat+'&lng='+sessionStorage.longi,
		url: indirizzo+'/get_copertina?lat='+sessionStorage.lat+'&lng='+sessionStorage.longi,
		success: appendCover,
		error: errorHandler
	});

}
function appendCover(data)
{
	//se non ho copertine entro 20km
	if(data != 'no_copertina')
	{
		//scelgo risoluzione copertina
		if(sessionStorage.deviceHeight <= 1000)
		{
			sessionStorage.imgPath = indirizzo+data.small_path;
		}
		else
		{
			sessionStorage.imgPath = indirizzo+data.big_path;
		}
		
		sessionStorage.headTitle = data.descrizione_it;
	}

	checkCover();
}
//se abbiamo l'immagine di copertina la facciamo apparire
function checkCover()
{
	if(sessionStorage.imgPath){
		$('#header .imgCover').css('background-image','url('+sessionStorage.imgPath+')');
		
		//gestione caricamento immagine cover
		var img = new Image();
		var imageSrc = sessionStorage.imgPath;
		img.onload = function() {
		    $('#header .imgCover').fadeIn('slow');
		    $('#header h1').html(sessionStorage.headTitle);
		    $('#cortina').fadeOut();
		};
		img.src = imageSrc;
	}else
	{
		$('#cortina').fadeOut();
	}
	
}

/*********************RISOLUZIONE*/
function resolution()
{
	sessionStorage.deviceWidth = screen.width;
	sessionStorage.deviceHeight = screen.height;

	//alert('Risoluzione screen: '+sessionStorage.deviceWidth+' '+sessionStorage.deviceHeight);
}

/*********************CONTENUTI*PROMO*/
function getPromo()
{
	$.ajaxSetup({ cache: false });
	$.ajax({
		type:'GET',
		url: indirizzo+'/get_promo',
		success: appendPromo,
		error: errorHandler
	});	
}
function appendPromo(data)
{
	for( i=0; i < data.length; i++ )
	{
		$('.blo4').attr('href', 'javascript:trackPromo('+data[i].id+',\"'+data[i].url_promo+'\")');

		var img = new Image();
		var imageSrc = indirizzo+'/media/'+data[i].path;
		img.onload = function()
		{
			$('.blo4').css('background-image', 'url(\''+imageSrc+'\')');
		};
		img.src = imageSrc;
	}
}
function trackPromo(id, url)
{
	$.ajax({
		type: 'POST',
		url: indirizzo+'/click_promo',
		data: {
			'id_promo' : id
		},
		contentType: 'application/x-www-form-urlencoded',
		error: errorHandler
		//success: goPromo(id, url)
	})

	goPromo(id, url);
}
function goPromo(id, url)
{
	window.open(url,'_blank','location=yes');
}



/*****************ERRORI*/

function error_localize()
{
	modalGPS();
}
function modalGPS()
{
	scrollAlto();
	$('#attivaGPS').modal();
}

function errorHandler(xhr, textStatus, thrownError)
{
	//alert("Errore "+xhr.status+" - "+textStatus);

	console.log(xhr.status);
	console.log(xhr.responseText);
	console.log(textStatus);
	console.log(thrownError);
}