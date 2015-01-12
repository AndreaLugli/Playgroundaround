/********************GET*PARCHI*VICINI*/
//pagina vicini.html
function openVicini()
{
	pop();
	
	distanza = 10;
	
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
			anteprima = "img/logo.png";
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

		//manca solo l'immagine dal server
		listaParchiVicini += '<a class="parco" href="javascript:apriParco('+jsonVicini[i].id+');">'+
			                    '<img src="'+anteprima+'"/>'+
			                   '<span class="desc">'+
			                        '<p class="titolo">«'+jsonVicini[i].name+'»</p>'+
			                        '<span class="eta">TARGET: '+target+'</span>'+
			                        '<span class="orario">OPENING: '+opening+'</span>'+
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
	//icone colorate
	listaServizi = '';
	//descrizione dei servizi per il modale
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

//votazione del parco
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

//on click sul parco
function apriParco(id)
{
	sessionStorage.idParco = id;
	window.location='parco.html';
}

/**********************OPEN*PARCO*/
//pagina parco.html
function getParco(){
	$.ajax({
		type: 'GET',
		url: indirizzo+'/get_playground?id='+sessionStorage.idParco,
		success: appendParco,
		error: errorHandler
	});
}
function appendParco(data){
	getMappaParco(data.latitude, data.longitude);

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
	//span età | span orario
	$('#parcoInfo div:nth-of-type(2)').html('<span>TARGET: '+target2+'</span><span>OPENING: '+opening2+'</span>');
	//rating
	$('#parcoInfo div:nth-of-type(3)').html(voto2);

	//descrizione
	descEng = data.description_en;
	if(descEng < 2){
		descEng = 'not available'
	}

	$('#articolo').html('<p><b>ITA</b> '+data.description+'</p><p><b>ENG</b> '+descEng+'</p>');
	
	//rende cliccabili le icone e le immagini
	modalServizi();
	modalImg();

	$('#loader').hide();
	$('#parcoAperto').show();
}
function modalServizi(){
	$("#modalInfo .modal-body ul").html(sessionStorage.descServizi);

	$("#parcoInfo div:first-of-type i").click(function() {
		$('#modalInfo').modal();
	});
}
function modalImg(){
	$("#galleria img").click(function() {
		alert('weeeeeeeeeee');
	});
}

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
//pagina mappa.html
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