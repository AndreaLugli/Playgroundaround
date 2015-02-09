/**********************POSIZIONE*PARCO*/
function openGeo()
{
	popBack();
	//mostra mappa e indirizzo
	localizzaMap(sessionStorage.lat, sessionStorage.longi);
	codeLatLng(sessionStorage.lat, sessionStorage.longi);
}
//mostra bottone conferma modifica indirizzo
function correggi()
{
	$('input').focus(function()
	{	
		$('#continua').hide();
		$('#correggi').show();
	});
}

/*****************************************INFO*PARCO*/
//avvio della pagina
function openNew()
{
	popBack();
	dataExists();
	valuta();
	checkAll();
}

/*CONTROLLI*E*ATTIVAZIONI*CAMPI*/

//se ho già inserito dei dati, li mostro a video
function dataExists()
{
	//se ho già caricato delle foto
	if(sessionStorage.listaPathFoto)
	{	
		//mostro anteprime
		$('#uploadedPhoto').html(sessionStorage.listaPathFoto);
		//nascondo bottone caricamento
		$('#addPhoto').hide();
	}
	else
	{
		//posso caricare al massimo 10 foto
		sessionStorage.fotoMancanti = 10;
	}

	//se ho già inserito dei dati
	if(sessionStorage.newTitle)
	{
		$('#title').val(sessionStorage.newTitle);
		$('#opening').val(sessionStorage.newOpening);
		$('#target_min').val(sessionStorage.newTarget_min);
		$('#target_max').val(sessionStorage.newTarget_max);
		$('#description').val(sessionStorage.newDesc);
		$('#note').val(sessionStorage.note);
		$('#email').val(sessionStorage.email);

		switch (sessionStorage.valutazione)
		{
			case 1:
				$('#rate i:first-of-type').attr('class', 'fa fa fa-3x fa-star');

				break;
			case 2:
				$('#rate i:first-of-type').attr('class', 'fa fa fa-3x fa-star');
				$('#rate i:nth-of-type(2)').attr('class', 'fa fa fa-3x fa-star');
				break;
			case 3:
				$('#rate i:first-of-type').attr('class', 'fa fa fa-3x fa-star');
				$('#rate i:nth-of-type(2)').attr('class', 'fa fa fa-3x fa-star');
				$('#rate i:nth-of-type(3)').attr('class', 'fa fa fa-3x fa-star');
				break;
			case 4:
				$('#rate i:first-of-type').attr('class', 'fa fa fa-3x fa-star');
				$('#rate i:nth-of-type(2)').attr('class', 'fa fa fa-3x fa-star');
				$('#rate i:nth-of-type(3)').attr('class', 'fa fa fa-3x fa-star');
				$('#rate i:nth-of-type(4)').attr('class', 'fa fa fa-3x fa-star');
				break;
			case 5:
				$('#rate i:first-of-type').attr('class', 'fa fa fa-3x fa-star');
				$('#rate i:nth-of-type(2)').attr('class', 'fa fa fa-3x fa-star');
				$('#rate i:nth-of-type(3)').attr('class', 'fa fa fa-3x fa-star');
				$('#rate i:nth-of-type(4)').attr('class', 'fa fa fa-3x fa-star');
				$('#rate i:nth-of-type(5)').attr('class', 'fa fa fa-3x fa-star');
				break;
		}

		if(sessionStorage.fenced)
		{
			$('.alert:first-of-type input').prop('checked', true);
			$('.alert:first-of-type input').attr('class', 'alert alert-success input-lg');
		}
		if(sessionStorage.park)
		{
			$('.alert:nth-of-type(2) input').prop('checked', true);
			$('.alert:nth-of-type(2) input').attr('class', 'alert alert-success input-lg');
		}
		if(sessionStorage.picnic)
		{
			$('.alert:nth-of-type(3) input').prop('checked', true);
			$('.alert:nth-of-type(3) input').attr('class', 'alert alert-success input-lg');
		}
		if(sessionStorage.snack)
		{
			$('.alert:nth-of-type(4) input').prop('checked', true);
			$('.alert:nth-of-type(4) input').attr('class', 'alert alert-success input-lg');
		}
		if(sessionStorage.toilette)
		{
			$('.alert:nth-of-type(5) input').prop('checked', true);
			$('.alert:nth-of-type(5) input').attr('class', 'alert alert-success input-lg');
		}
		if(sessionStorage.cleaning)
		{
			$('.alert:nth-of-type(6) input').prop('checked', true);
			$('.alert:nth-of-type(6) input').attr('class', 'alert alert-success input-lg');
		}
		if(sessionStorage.handicap)
		{
			$('.alert:nth-of-type(7) input').prop('checked', true);
			$('.alert:nth-of-type(7) input').attr('class', 'alert alert-success input-lg');
		}
	}

}

//abilito rating parco
function valuta()
{
	$('#rate i:first-of-type').click(function() {

		sessionStorage.valutazione = 1;

		//accesi
		$(this).attr('class', 'fa fa fa-3x fa-star');
		//spenti
		$('#rate i:nth-of-type(2)').attr('class', 'fa fa fa-3x fa-star-o');
		$('#rate i:nth-of-type(3)').attr('class', 'fa fa fa-3x fa-star-o');
		$('#rate i:nth-of-type(4)').attr('class', 'fa fa fa-3x fa-star-o');
		$('#rate i:nth-of-type(5)').attr('class', 'fa fa fa-3x fa-star-o');
	});

	$('#rate i:nth-of-type(2)').click(function() {

		sessionStorage.valutazione = 2;

		//accesi
		$('#rate i:first-of-type').attr('class', 'fa fa fa-3x fa-star'); 
		$(this).attr('class', 'fa fa fa-3x fa-star');
		//spenti
		$('#rate i:nth-of-type(3)').attr('class', 'fa fa fa-3x fa-star-o');
		$('#rate i:nth-of-type(4)').attr('class', 'fa fa fa-3x fa-star-o');
		$('#rate i:nth-of-type(5)').attr('class', 'fa fa fa-3x fa-star-o');
	});

	$('#rate i:nth-of-type(3)').click(function() {

		sessionStorage.valutazione = 3;

		//accesi
		$('#rate i:first-of-type').attr('class', 'fa fa fa-3x fa-star');
		$('#rate i:nth-of-type(2)').attr('class', 'fa fa fa-3x fa-star'); 
		$(this).attr('class', 'fa fa fa-3x fa-star'); 
		//spenti
		$('#rate i:nth-of-type(4)').attr('class', 'fa fa fa-3x fa-star-o');
		$('#rate i:nth-of-type(5)').attr('class', 'fa fa fa-3x fa-star-o');
	});

	$('#rate i:nth-of-type(4)').click(function() {

		sessionStorage.valutazione = 4;

		//accesi
		$('#rate i:first-of-type').attr('class', 'fa fa fa-3x fa-star');
		$('#rate i:nth-of-type(2)').attr('class', 'fa fa fa-3x fa-star');
		$('#rate i:nth-of-type(3)').attr('class', 'fa fa fa-3x fa-star'); 
		$(this).attr('class', 'fa fa fa-3x fa-star');
		//spenti
		$('#rate i:nth-of-type(5)').attr('class', 'fa fa fa-3x fa-star-o');
	});

	$('#rate i:nth-of-type(5)').click(function() {

		sessionStorage.valutazione = 5;

		//accesi
		$('#rate i:first-of-type').attr('class', 'fa fa fa-3x fa-star');
		$('#rate i:nth-of-type(2)').attr('class', 'fa fa fa-3x fa-star');
		$('#rate i:nth-of-type(3)').attr('class', 'fa fa fa-3x fa-star');
		$('#rate i:nth-of-type(4)').attr('class', 'fa fa fa-3x fa-star'); 
		$(this).attr('class', 'fa fa fa-3x fa-star'); 
	});
}

//rende pannelli servizi cliccabili
function checkAll()
{
	$(".alert").click(function()
	{
		var tocheck = $(this).find('input');

		if(tocheck.is(':checked'))
		{
			//$(this).find('input').prop('checked', true);
			tocheck.prop('checked', false);
			$(this).attr('class', 'alert alert-danger input-lg');
		}else
		{
			tocheck.prop('checked', true);
			$(this).attr('class', 'alert alert-success input-lg');
		}
	});
}

/*CAMPI*REQUIRED*/
function checkRequired()
{
	//evidenzio required mancanti (nome, descrizione)
	$('.required').each(function() {
	    if($(this).val().length < 5)
	    { 
	    	$(this).addClass("error");
	    }
	});

	$('#email').each(function()
	{
	    if($(this).val().length < 5 || $(this).val().indexOf('@') === -1 || $(this).val().indexOf('.') === -1)
	    { 
	    	$(this).addClass("error");
	    }
	});

	//se mancanti blocco
	if( $("#formInsParco .error").length > 0)
	{
		//mostro alert dati mancanti
   		scrollAlto();
    	$('#datiMancanti').modal();

    	noErrorOnClick();
	}
	else
	{
		confermaParco();
	}
}
//on click tolgo evidenziazione
function noErrorOnClick()
{
	$('.required').focus(function()
	{	
		$(this).removeClass("error");
	});
	$('#email').focus(function()
	{	
		$(this).removeClass("error");
	});
}

/*INVIO*PARCO*/
function confermaParco()
{
	$.when(getDati)
     .then(function () {
		inviaDati();
	});

}
//get di tutti i dati
function getDati()
{
	alert('get');

	//get checkbox
	if($('#fenced').is(':checked'))
	{
		sessionStorage.fenced = true;
	}else
	{
		sessionStorage.fenced = false
	}

	if($('#park').is(':checked'))
	{
		sessionStorage.park = true;
	}else
	{
		sessionStorage.park = false
	}

	if($('#picnic').is(':checked'))
	{
		sessionStorage.picnic = true;
	}else
	{
		sessionStorage.picnic = false
	}

	if($('#snack').is(':checked'))
	{
		sessionStorage.snack = true;
	}else
	{
		sessionStorage.snack = false
	}

	if($('#toilette').is(':checked'))
	{
		sessionStorage.toilette = true;
	}else
	{
		sessionStorage.toilette = false
	}

	if($('#cleaning').is(':checked'))
	{
		sessionStorage.cleaning = true;
	}else
	{
		sessionStorage.cleaning = false
	}

	if($('#handicap').is(':checked'))
	{
		sessionStorage.handicap = true;
	}else
	{
		sessionStorage.handicap = false
	}

	//get input
	sessionStorage.newTitle = $('#title').val();
	sessionStorage.newOpening = $('#opening').val();
	sessionStorage.newTarget_min = $('#target_min').val();
	sessionStorage.newTarget_max = $('#target_max').val();
	sessionStorage.newDesc = $('#description').val();
	sessionStorage.note = $('#note').val();
	sessionStorage.email = $('#email').val();

	//completo se dati mancanti
	if(sessionStorage.newOpening == '')
	{
		sessionStorage.newOpening = '0-24';
	}
	if(sessionStorage.newTarget_min == '')
	{
		sessionStorage.newTarget_min = 0;
	}
	if(sessionStorage.newTarget_max == '')
	{
		sessionStorage.newTarget_max = 99;
	}

}

//invio dati al server
function inviaDati()
{
	alert('invia');
	alert(sessionStorage.newLati+' '+sessionStorage.newLongi+' '+sessionStorage.newAddress+' '+sessionStorage.newTitle+' '+sessionStorage.newOpening+' '+sessionStorage.newTarget_min+' '+sessionStorage.newTarget_max+' '+sessionStorage.newDesc+' '+sessionStorage.note+' '+sessionStorage.valutazione+' '+sessionStorage.email+' '+sessionStorage.fenced+' '+sessionStorage.picnic+' '+sessionStorage.snack+' '+sessionStorage.park+' '+sessionStorage.toilette+' '+sessionStorage.cleaning+' '+sessionStorage.handicap);

	$.ajax({
		type: 'POST',
		url: indirizzo+'/inserimento_parco',
		data: {
			'name' : sessionStorage.newTitle,
			'indirizzo' : sessionStorage.newAddress,
			'longitude' : sessionStorage.newLongi,
			'latitude' : sessionStorage.newLati,
			'descrizione_it_parco' : sessionStorage.newDesc,
			'descrizione_en_parco' : '',
			'age_min' : sessionStorage.newTarget_min,
			'age_max' : sessionStorage.newTarget_max,
			'opening_hours' : sessionStorage.newOpening,
			'picnic' : sessionStorage.picnic,
			'parking' : sessionStorage.park,
			'fenced_area' : sessionStorage.fenced,
			'toilette' : sessionStorage.toilette,
			'caffe' : sessionStorage.snack,
			'cleaning' :sessionStorage.cleaning,
			'universally_accessible' : sessionStorage.handicap,
			'other' : sessionStorage.note,
			'evaluation' : sessionStorage.valutazione,
			'email' : sessionStorage.email,
			'promozionale' : 'false'
		},
		contentType: 'application/x-www-form-urlencoded',
		error: errorHandler,
		success: datiInviati
	})

}
function datiInviati(data)
{
	sessionStorage.idParco = data;
	alert(sessionStorage.idParco);

	associaFotoParco();

}
//associo foto al parco appena creato
function associaFotoParco()
{
	$.ajax({
		type: 'POST',
		url: indirizzo+'/associa_parco_foto',
		data: {
			'id_parco' : sessionStorage.idParco,
			'foto' : sessionStorage.listaIdFoto
		},
		contentType: 'application/x-www-form-urlencoded',
		error: errorHandler,
		success: associaOk
	})
}

function associaOk()
{
	sessionStorage.clear();
	window.location='inserisci_ok.html';
}

/**************************************INSERISCI*OK*/
function openInserisciOk()
{
	popHome();

	if(sessionStorage.provenienza == 'nuovo')
	{
		$('#parcoInserito').show();
	}
	else if(sessionStorage.provenienza == 'vecchio')
	{
		$('#fotoInserite').show();	
	}
}
function goHomeInserisciOk()
{
	dataClear();
	window.location='index.html';
}
//cancella sessionStorage dopo creazione parco/aggiunta foto
function dataClear()
{
	sessionStorage.clear();
}