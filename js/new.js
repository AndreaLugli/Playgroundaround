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

/***********************INFO*PARCO*/
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

//check dei dati required
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
		getDati();
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

//get di tutti i dati
function getDati()
{
	//get checkbox
	if($('#fenced').is(':checked'))
	{
		sessionStorage.fenced = true;
	}else
	{
		sessionStorage.fenced = false
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
	if($('#park').is(':checked'))
	{
		sessionStorage.park = true;
	}else
	{
		sessionStorage.park = false
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

	inviaDati();	

}

//invio dati al server
function inviaDati()
{
	alert(sessionStorage.newLati+' '+sessionStorage.newLongi+' '+sessionStorage.newAddress+' '+sessionStorage.newTitle+' '+sessionStorage.newOpening+' '+sessionStorage.newTarget_min+' '+sessionStorage.newTarget_max+' '+sessionStorage.newDesc+' '+sessionStorage.email+' '+sessionStorage.fenced+' '+sessionStorage.picnic+' '+sessionStorage.snack+' '+sessionStorage.park+' '+sessionStorage.toilette+' '+sessionStorage.handicap);

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
			'other' : '',
			'evaluation' : '',
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
	idParco = data;
	alert(idParco);

	window.location='inserisci_ok.html';
}
