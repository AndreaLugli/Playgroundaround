/*****************************************RICERCA*TITOLO*/
function getTitolo()
{
	sessionStorage.titleSearch = $('#titleSearch').val();
	window.location='trovati_nome.html';
}
//on load ricerca per nome (trovati.html) 
function searchTitolo()
{
	pop('back');

	//get lista parchi trovati
	$.ajaxSetup({ cache: false });
	$.ajax({
		type: 'GET',
		url: indirizzo+'/ricerca_titolo?testo='+sessionStorage.titleSearch,		
		success: appendVicini,
		error: errorHandler
	});
}

/******************************************RICERCA*LUOGO*/
function autocompletamento()
{	
	//quando ricarico la pagina azzero
	$('input').val('');

	var input = (document.getElementById('positionSearch')); 
	var autocomplete = new google.maps.places.Autocomplete(input);

	$('#cortina').hide();
	 
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		
		var place = autocomplete.getPlace();
		
		sessionStorage.latiSearch = place.geometry.location.lat();
		sessionStorage.longiSearch = place.geometry.location.lng();
		//alert(sessionStorage.latitudine_nuova+' '+sessionStorage.longitudine_nuova);
	});
}
//on load ricerca per posizione (trovati.html) 
function searchPosizione()
{
	pop('back');

	distanza = 10;

	//get lista parchi trovati
	$.ajaxSetup({ cache: false });
	$.ajax({
		type: 'GET',
		url: indirizzo+'/search_near?lat='+sessionStorage.latiSearch+'&lng='+sessionStorage.longiSearch+'&distanza='+distanza,		
		success: appendVicini,
		error: errorHandler
	});
}


/********************GET*PARCHI*VICINI*(VICINI.HTML)*/
//onload pagina
function openVicini()
{
	pop('back');
	listaVicini(3);
}
function listaVicini(distanza)
{
	//get lista parchi vicini
	$.ajaxSetup({ cache: false });
	$.ajax({
		type: 'GET',
		url: indirizzo+'/search_near?lat='+sessionStorage.lat+'&lng='+sessionStorage.longi+'&distanza='+distanza,		
		success: appendVicini,
		error: errorHandler
	});
}
function appendVicini(data)
{
	jsonVicini = data;

	quantiParchi = jsonVicini.length;
	
	listaParchiVicini = '';

	for( i=0; i < quantiParchi; i++ ){

		servizi = getServizi(jsonVicini[i].picnic, jsonVicini[i].parking, jsonVicini[i].cleaning, jsonVicini[i].fenced_area, jsonVicini[i].toilette, jsonVicini[i].caffe, jsonVicini[i].universally_accessible);
		voto = getStelline(jsonVicini[i].evaluation);

		if(jsonVicini[i].anteprima_path === null){
			anteprima = "img/not_available.png";
		}
		else{
			anteprima = indirizzo+'/media/'+jsonVicini[i].anteprima_path;
		}
		
		//target = jsonVicini[i].age_min+' - '+jsonVicini[i].age_max+' years';
		target = jsonVicini[i].age_min+'-'+jsonVicini[i].age_max+' anni';
		if(jsonVicini[i].age_min == 0 && jsonVicini[i].age_max == 0){
			//target = 'not available';
			target = '0-99 anni';
		}

		opening = jsonVicini[i].opening_hours;
		if(opening.length < 2){
			//opening = 'not available';
			opening = '0-24';
		}

		listaParchiVicini += '<a class="parco" href="javascript:apriParco('+jsonVicini[i].id+');">'+
			                    '<img src="'+anteprima+'" onError="this.onerror=null;this.src=\'img/logo.jpg\';"/>'+
			                   '<span class="desc">'+
			                        '<p class="titolo">«'+jsonVicini[i].name+'»</p>'+
			                        //'<span class="eta">TARGET: '+target+'</span>'+
			                        //'<span class="orario">OPENING: '+opening+'</span>'+
			                        '<span class="eta">ETÀ: '+target+'</span>'+
			                        '<span class="orario">ORARIO: '+opening+'</span>'+
			                        '<span class="voto">'+voto+'</span>'+
			                        '<span class="servizi">'+servizi+'</span>'+
			                    '</span>'+
			                '</a>';
	}

	//se nessun parco nelle vicinanze
	if(listaParchiVicini == '')
	{
		//listaParchiVicini = '<div class="alert">Ooooops! Seems you\'re in a desert area, there are no parks near you :( </div>';
		listaParchiVicini = '<div class="warning"><h3>Ooooops!</h3> Nessun parco all\'orizzonte<center><img src="img/8_nothing.png"/></center></div>';
		
	}
	$('#parchiVicini').html(listaParchiVicini);
	$('#contatoreParchi').html(quantiParchi+' parchi trovati');

	$('#loader').hide();

	$('#interruttore').show();
}
//bottone modifica distanza
function allargaRaggio()
{
	$('#interruttore').hide();
	$('#interruttore button').html('Restringi la ricerca');
	$('#interruttore button').attr('onClick', 'restringiRaggio();');
	listaVicini(10);
}
function restringiRaggio()
{
	$('#interruttore').hide();
	$('#interruttore button').html('Allarga la ricerca');
	$('#interruttore button').attr('onClick', 'allargaRaggio();');
	listaVicini(3);
}

//onclick parco
function apriParco(id)
{
	sessionStorage.idParco = id;
	window.location='parco.html';
}


/**********************OPEN*PARCO*(PARCO.HTML)*/
//onload pagina
function getParco(){
	getImgParco();
	getInfoParco();
}

//get immagini parco
function getImgParco(){
	url = indirizzo+'/get_immagini?id='+sessionStorage.idParco;
		
	$.ajaxSetup({ cache: false });
	$.getJSON(url, function(json){

		//alert(json.length);
		   
		$.each(json, function(i, val)	//i: numero, val: valore
		{
			pathImgParcoAperto = indirizzo+'/media/'+val;
			$('#galleria').append('<img src="'+pathImgParcoAperto+'" onError="this.onerror=null;this.src=\'img/logo.jpg\';" />');
		});
		  
	})
	.error(errorHandler)
	.done(function() {
		$('#galleria img:first').addClass("big");

		$('#galleria img:nth-of-type(2)').addClass("small");
		$('#galleria img:nth-of-type(3)').addClass("small");
		$('#galleria img:nth-of-type(4)').addClass("small");
		$('#galleria img:nth-of-type(5)').addClass("small");

		$('#galleria img:nth-of-type(6)').before('<div class="spacing"></div>');

		$('#galleria img:nth-of-type(6)').addClass("tiny");
		$('#galleria img:nth-of-type(7)').addClass("tiny");
		$('#galleria img:nth-of-type(8)').addClass("tiny");
		$('#galleria img:nth-of-type(9)').addClass("tiny");
		$('#galleria img:nth-of-type(10)').addClass("tiny");

		$('#galleria img:last-of-type').after('<div class="spacing"></div>');

		$('#galleria').append("<a href='#'><i class='fa fa-2x fa-photo purple'></i></a>");

		modalImg();

	});
}

//rende cliccabili le immagini
function modalImg(){
	$("#galleria img").click(function() {

		imgUrl = $(this).attr("src");

		$("#modalImg .modal-body").html('<a data-dismiss="modal"><img src="'+imgUrl+'" onError="this.onerror=null;this.src=\'img/logo.jpg\';" /></a>');
		scrollAlto();
		
		$('#modalImg').modal();

	});
}

//get informazioni parco
function getInfoParco(){
	$.ajax({
		type: 'GET',
		url: indirizzo+'/get_playground?id='+sessionStorage.idParco,
		success: appendParco,
		error: errorHandler
	});
}
function appendParco(data){
	getMappaParco(data.latitude.toFixed(3), data.longitude.toFixed(3));

	$('#parcoAperto h3').html('«'+data.name+'»');

	servizi2 = getServizi(data.picnic, data.parking, data.cleaning, data.fenced_area, data.toilette, data.caffe, data.universally_accessible);
	voto2 = getStelline(data.evaluation);

	target2 = data.age_min+'-'+data.age_max+' anni';
	if(data.age_min == 0 && data.age_max == 0){
		//target2 = 'not available';
		target2 = '0-99 anni';
	}
	opening2 = data.opening_hours;
	if(opening2.length < 2){
		//opening2 = 'not available';
		opening2 = '0-24';
	}
	
	//servizi
	$('#parcoInfo div:first-of-type').html('<button class="btn btn-block btn-default" onClick="modalServizi();">'+servizi2+'</button>');
	//età | orario
	//$('#parcoInfo div:nth-of-type(2)').html('<span>TARGET: '+target2+'</span><span>OPENING: '+opening2+'</span>');
	$('#parcoInfo div:nth-of-type(2)').html('<span>ETÀ: '+target2+'</span><span>ORARI: '+opening2+'</span>');
	//rating
	$('#parcoInfo div:nth-of-type(3)').html(voto2);

	//nascosto - lo faccio apparire per estetica del caricamento
	$('#parcoInfo').show();

	$('#articolo').html('<p id="descIta"><img class="flag" src="img/flag_ita.png" />'+data.description+'</p><p id="descEng" style="display:none;"><img class="flag" src="img/flag_eng.png" />'+data.description_en+'</p>');
	if(data.description_en.length > 2){
		$('#articolo').append('<button id="clickEng" class="btn bnt-sm btn-success" onClick="clickEng();">English version</button><button id="clickIta" class="btn bnt-sm btn-success" style="display:none;" onClick="clickIta();">Versione italiana</button>');
	}
	
	$('#articolo').append("<a href='#'><i class='fa fa-2x fa-comment purple'></i></a>");
	$('#articolo').append("<a href='#'><i class='fa fa-2x fa-suitcase purple'></i></a>");


	$('#address').html(data.address);
	$('#address').append("<button class='btn btn-block btn-lg btn-success' onClick='location.href=\"geo:"+sessionStorage.lat+","+sessionStorage.longi+"?q="+data.latitude+","+data.longitude+"\";'>Come arrivare</button>");

	$('#loader').hide();
}
//traduzione descrizione
function clickEng(){
	$('#descIta, #clickEng').hide();
	$('#descEng, #clickIta').show();
}
function clickIta(){
	$('#descEng, #clickIta').hide();
	$('#descIta, #clickEng').show();
}

//rende cliccabili le icone
function modalServizi(){
	$("#modalServizi .modal-body ul").html(sessionStorage.descServizi);

	scrollAlto();
	$('#modalServizi').modal();
}


//formattazione servizi
function getServizi(picnic, parking, cleaning, fenced_area, toilette, caffe, universally_accessible)
{
	//icone colorate
	listaServizi = '';
	//descrizione servizi per il modale
	sessionStorage.descServizi = '';

	if(picnic){
		listaServizi += '<i class="fa fa-cutlery fa-2x true"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-cutlery true"></i> Picnic area available</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-cutlery true"></i> Dispone di area picnic</li>';
	}else{
		listaServizi += '<i class="fa fa-cutlery fa-2x false"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-cutlery false"></i> Picnic area NOT available</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-cutlery false"></i> NON dispone di area picnic</li>';
	}
	if(parking){
		listaServizi += '<i class="fa fa-car fa-2x true"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-car true"></i> Parking area available</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-car true"></i> Dispone di area parcheggio</li>';
	}else{
		listaServizi += '<i class="fa fa-car fa-2x false"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-car false"></i> Parking area NOT available</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-car false"></i> NON dispone di area parcheggio</li>';
	}
	if(cleaning){
		listaServizi += '<i class="fa fa-recycle fa-2x true"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-recycle true"></i> Cleaning service available</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-recycle true"></i> Con servizio di pulizia</li>';
	}else{
		listaServizi += '<i class="fa fa-recycle fa-2x false"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-recycle false"></i> Cleaning service NOT available</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-recycle false"></i> SENZA servizio di pulizia</li>';
	}
	if(fenced_area){
		listaServizi += '<i class="fa fa-signal fa-2x true"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-signal true"></i> This park is fenced</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-signal true"></i> Recintato</li>';
	}else{
		listaServizi += '<i class="fa fa-signal fa-2x false"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-signal false"></i> This park is NOT fenced</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-signal false"></i> NON recintato</li>';
	}
	if(toilette){
		listaServizi += '<i class="fa fa-female fa-2x true"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-female true"></i> Toilettes available</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-female true"></i> Con toilettes</li>';
	}else{
		listaServizi += '<i class="fa fa-female fa-2x false"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-female false"></i> Toilettes NOT available</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-female false"></i> SENZA toilettes</li>';
	}
	if(caffe){
		listaServizi += '<i class="fa fa-beer fa-2x true"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-beer true"></i> Snack area available</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-beer true"></i> Dispone di area snack</li>';
	}else{
		listaServizi += '<i class="fa fa-beer fa-2x false"></i> ';
		//sessionStorage.descServizi += '<li><i class="fa fa-beer false"></i> Snack area NOT available</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-beer false"></i> NON dispone di area snack</li>';
	}
	if(universally_accessible){
		listaServizi += '<i class="fa fa-wheelchair fa-2x true"></i>';
		//sessionStorage.descServizi += '<li><i class="fa fa-wheelchair true"></i> Handicap accessible</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-wheelchair true"></i> Accessibile a portatori di handicap</li>';
	}else{
		listaServizi += '<i class="fa fa-wheelchair fa-2x false"></i>';
		//sessionStorage.descServizi += '<li><i class="fa fa-wheelchair false"></i> Physical obstacles - Handicap NOT accessible</li>';
		sessionStorage.descServizi += '<li><i class="fa fa-wheelchair false"></i> Con barriere architettoniche - NON accessibile a portatori di handicap</li>';
	}

	return listaServizi;
}

//formattazione rating
function getStelline(evaluation){

	stelline = '';	

	switch(evaluation) {
	    case '1':
	        stelline = '<b>1/5</b> <i class="fa fa-star fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i>';
	        break;
	    case '1.5':
	        stelline = '<b>1.5/5</b> <i class="fa fa-star fa-2x"></i><i class="fa fa-star-half fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i>';
	        break;
	    case '2':
	        stelline = '<b>2/5</b> <i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i>';
	        break;
	    case '2.5':
	        stelline = '<b>2.5/5</b> <i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star-half fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i>';
	        break;
	    case '3':
	        stelline = '<b>3/5</b> <i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i>';
	        break;
	    case '3.5':
	        stelline = '<b>3.5/5</b> <i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star-half fa-2x"></i><i class="fa fa-star-o fa-2x"></i>';
	        break;
	    case '4':
	        stelline = '<b>4/5</b> <i class="fa fa-star fa-2x fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star-o fa-2x"></i>';
	        break;
	    case '4.5':
	        stelline = '<b>4.5/5</b> <i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star-half fa-2x"></i>';
	        break;
	    case '5':
	        stelline = '<b>5/5</b> <i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i><i class="fa fa-star fa-2x"></i>';
	        break;
	    default:
	    	//stelline = 'Rate not available';
	    	stelline = '<i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i><i class="fa fa-star-o fa-2x"></i>';
	}

	return stelline;
}