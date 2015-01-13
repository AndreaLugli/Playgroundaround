/********************GET*PARCHI*VICINI*(VICINI.HTML)*/
//onload pagina
function openVicini(){
	pop();
	listaVicini('min');
	switchOn();
}
function listaVicini(distanza)
{
	distanza = distanza;

	if(distanza == 'min'){
		distanza = 1;
	}
	else if(distanza == 'max'){
		distanza = 10;
	}

	//get lista parchi vicini
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
	
	listaParchiVicini = '';

	for( i=0; i < jsonVicini.length; i++ ){

		servizi = getServizi(jsonVicini[i].picnic, jsonVicini[i].parking, jsonVicini[i].cleaning, jsonVicini[i].fenced_area, jsonVicini[i].toilette, jsonVicini[i].caffe, jsonVicini[i].universally_accessible);
		voto = getStelline(jsonVicini[i].evaluation);

		if(jsonVicini[i].anteprima_path === null){
			anteprima = "img/not_available.png";
		}
		else{
			anteprima = indirizzo+'/'+jsonVicini[i].anteprima_path;
		}
		
		target = jsonVicini[i].age_min+' - '+jsonVicini[i].age_max+' years';
		if(jsonVicini[i].age_min == 0 && jsonVicini[i].age_max == 0){
			target = 'not available';
		}

		opening = jsonVicini[i].opening_hours;
		if(opening.length < 2){
			opening = 'not available';
		}

		listaParchiVicini += '<a class="parco" href="javascript:apriParco('+jsonVicini[i].id+');">'+
			                    '<img src="'+anteprima+'" onError="this.onerror=null;this.src=\'img/logo.jpg\';"/>'+
			                   '<span class="desc">'+
			                        '<p class="titolo">«'+jsonVicini[i].name+'»</p>'+
			                        '<span class="eta">TARGET: '+target+'</span>'+
			                        '<span class="orario">OPENING: '+opening+'</span>'+
			                        '<span class="voto">'+voto+'</span>'+
			                        '<span class="servizi">'+servizi+'</span>'+
			                    '</span>'+
			                '</a>';
	}

	//se nessun parco nelle vicinanze
	if(listaParchiVicini == '')
	{
		listaParchiVicini = '<div class="alert">Ooooops! Sembra che non siano ancora stati censiti parchi intorno a te!</div>';
	}
	$('#parchiVicini').html(listaParchiVicini);
}

//scelta distanza
function switchOn(){

	$('#myonoffswitch').click(function() {

		$('#loader').show();

		if(sessionStorage.switchato == "true")
		{
			listaVicini('min');
			sessionStorage.switchato = "false";
			//alert(sessionStorage.switchato);
		}
		else
		{
			listaVicini('max');
			sessionStorage.switchato = "true";
			//alert(sessionStorage.switchato);
		}

	});
	
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
			$('#galleria').append('<img src="'+val+'" onError="this.onerror=null;this.src=\'img/logo.jpg\';" />');
		});
		  
	})
	.error(errorHandler)
	.done(function() {
		$('#galleria img:first').addClass("big");

		$('#galleria img:nth-of-type(2)').addClass("small");
		$('#galleria img:nth-of-type(3)').addClass("small");
		$('#galleria img:nth-of-type(4)').addClass("small");
		$('#galleria img:nth-of-type(5)').addClass("small");

		$('#galleria img:nth-of-type(6)').prepend('<div id="galleriaTiny">');

		$('#galleria img:nth-of-type(6)').addClass("tiny");
		$('#galleria img:nth-of-type(7)').addClass("tiny");
		$('#galleria img:nth-of-type(8)').addClass("tiny");
		$('#galleria img:nth-of-type(9)').addClass("tiny");
		$('#galleria img:nth-of-type(10)').addClass("tiny");

		$('#galleria img:nth-of-type(10)').append('</div>');

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

	servizi2 = getServizi(data.picnic, data.parking, data.cleaning, data.fenced_area, data.toilette, data.caffe, data.universally_accessible);
	voto2 = getStelline(data.evaluation);

	target2 = data.age_min+' - '+data.age_max+' years';
	if(data.age_min == 0 && data.age_max == 0){
		target2 = 'not available';
	}
	opening2 = data.opening_hours;
	if(opening2.length < 2){
		opening2 = 'not available';
	}
	
	//servizi
	$('#parcoInfo div:first-of-type').html(servizi2);
	//età | orario
	$('#parcoInfo div:nth-of-type(2)').html('<span>TARGET: '+target2+'</span><span>OPENING: '+opening2+'</span>');
	//rating
	$('#parcoInfo div:nth-of-type(3)').html(voto2);

	//descrizione
	descEng = data.description_en;
	if(descEng < 2){
		descEng = 'not available'
	}

	$('#articolo').html('<p><b>ITA</b> '+data.description+'</p><p><b>ENG</b> '+descEng+'</p>');
	
	modalServizi();

	$('#loader').hide();
}
//rende cliccabili le icone
function modalServizi(){
	$("#modalServizi .modal-body ul").html(sessionStorage.descServizi);

	$("#parcoInfo div:first-of-type i").click(function() {
		scrollAlto();
		$('#modalServizi').modal();
	});
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
		sessionStorage.descServizi += '<li><i class="fa fa-cutlery true"></i> Picnic area available</li>';
	}else{
		listaServizi += '<i class="fa fa-cutlery fa-2x false"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-cutlery false"></i> Picnic area NOT available</li>';
	}
	if(parking){
		listaServizi += '<i class="fa fa-car fa-2x true"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-car true"></i> Parking area available</li>';
	}else{
		listaServizi += '<i class="fa fa-car fa-2x false"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-car false"></i> Parking area NOT available</li>';
	}
	if(cleaning){
		listaServizi += '<i class="fa fa-recycle fa-2x true"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-recycle true"></i> Cleaning service available</li>';
	}else{
		listaServizi += '<i class="fa fa-recycle fa-2x false"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-recycle false"></i> Cleaning service NOT available</li>';
	}
	if(fenced_area){
		listaServizi += '<i class="fa fa-signal fa-2x true"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-signal true"></i> This park is fenced</li>';
	}else{
		listaServizi += '<i class="fa fa-signal fa-2x false"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-signal false"></i> This park is NOT fenced</li>';
	}
	if(toilette){
		listaServizi += '<i class="fa fa-female fa-2x true"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-female true"></i> Toilettes available</li>';
	}else{
		listaServizi += '<i class="fa fa-female fa-2x false"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-female false"></i> Toilettes NOT available</li>';
	}
	if(caffe){
		listaServizi += '<i class="fa fa-beer fa-2x true"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-beer true"></i> Snack area available</li>';
	}else{
		listaServizi += '<i class="fa fa-beer fa-2x false"></i> ';
		sessionStorage.descServizi += '<li><i class="fa fa-beer false"></i> Snack area NOT available</li>';
	}
	if(universally_accessible){
		listaServizi += '<i class="fa fa-wheelchair fa-2x true"></i>';
		sessionStorage.descServizi += '<li><i class="fa fa-wheelchair true"></i> Handicap accessible</li>';
	}else{
		listaServizi += '<i class="fa fa-wheelchair fa-2x false"></i>';
		sessionStorage.descServizi += '<li><i class="fa fa-wheelchair false"></i> Physical obstacles - Handicap NOT accessible</li>';
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
	    	stelline = 'Rate not available';
	}

	return stelline;
}