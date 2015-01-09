/********************GET*PARCHI*VICINI*/
//pagina vicini.html
function openVicini()
{
	pop();
	
	distanza = 10;

	$.ajax({
			type: 'GET',
			crossDomain: true,
			url: indirizzo+'/search_near?lat='+sessionStorage.lat+'&lng='+sessionStorage.longi+'&distanza='+distanza,
			//url: indirizzo+'/search_near?lat=44.482&lng=11.260&distanza=10',
			contentType: 'application/json',
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
			                    '<img src="img/logo.png"/>'+
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
	listaServizi = '';

	if(picnic){
		listaServizi += '<i class="fa fa-cutlery true"></i> ';
	}else{
		listaServizi += '<i class="fa fa-cutlery false"></i> ';
	}
	if(parking){
		listaServizi += '<i class="fa fa-car true"></i> ';
	}else{
		listaServizi += '<i class="fa fa-car false"></i> ';
	}
	if(cleaning){
		listaServizi += '<i class="fa fa-recycle true"></i> ';
	}else{
		listaServizi += '<i class="fa fa-recycle false"></i> ';
	}
	if(fenced_area){
		listaServizi += '<i class="fa fa-signal true"></i> ';
	}else{
		listaServizi += '<i class="fa fa-signal false"></i> ';
	}
	if(toilette){
		listaServizi += '<i class="fa fa-female true"></i> ';
	}else{
		listaServizi += '<i class="fa fa-female false"></i> ';
	}
	if(caffe){
		listaServizi += '<i class="fa fa-beer true"></i> ';
	}else{
		listaServizi += '<i class="fa fa-beer false"></i> ';
	}
	if(universally_accessible){
		listaServizi += '<i class="fa fa-wheelchair true"></i>';
	}else{
		listaServizi += '<i class="fa fa-wheelchair false"></i>';
	}

	return listaServizi;
}

//votazione del parco
function getStelline(evaluation){

	stelline = '';	

	switch(evaluation) {
	    case '1':
	        stelline = '<b>1/5</b> <i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
	        break;
	    case '1.5':
	        stelline = '<b>1.5/5</b> <i class="fa fa-star"></i><i class="fa fa-star-half"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
	        break;
	    case '2':
	        stelline = '<b>2/5</b> <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
	        break;
	    case '2.5':
	        stelline = '<b>2.5/5</b> <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
	        break;
	    case '3':
	        stelline = '<b>3/5</b> <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
	        break;
	    case '3.5':
	        stelline = '<b>3.5/5</b> <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half"></i><i class="fa fa-star-o"></i>';
	        break;
	    case '4':
	        stelline = '<b>4/5</b> <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i>';
	        break;
	    case '4.5':
	        stelline = '<b>4.5/5</b> <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half"></i>';
	        break;
	    case '5':
	        stelline = '<b>5/5</b> <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>';
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
	initialize_map_parco(data.latitude, data.longitude);

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
	$('#parcoInfo div:nth-of-type(2)').html('<span>ETÀ: +'target2'+</span><span>ORARIO: +'opening2'+</span>');
	//rating
	$('#parcoInfo div:nth-of-type(2)').html(voto2);

	//descrizione
	$('#articolo').html('<p>+'data.description'+</p><p>+'data.description_en'+</p>');
	
}

/***************GET MAPPA*(PARCO.HTML)*/
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