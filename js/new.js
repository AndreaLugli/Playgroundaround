/**********************POSIZIONE*PARCO*/
function openGeo()
{
	pop('back');
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

	$('#email').click(function()
	{
	    if($(this).val().indexOf('@') === -1 || $(this).val().indexOf('.') === -1)
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
	alert(sessionStorage.newLati+' '+sessionStorage.newLongi+' '+sessionStorage.newAddress+' '+sessionStorage.newTitle+' '+sessionStorage.newOpening+' '+sessionStorage.newTarget_min+' '+sessionStorage.newTarget_max+' '+sessionStorage.newDesc+' '+sessionStorage.fenced+' '+sessionStorage.picnic+' '+sessionStorage.snack+' '+sessionStorage.park+' '+sessionStorage.toilette+' '+sessionStorage.handicap);
	window.location='inserisci_ok.html';
	/*
	sessionStorage.newLati
	sessionStorage.newLongi
	sessionStorage.newAddress
	sessionStorage.newTitle
	sessionStorage.newOpening
	sessionStorage.newTarget_min
	sessionStorage.newTarget_max
	sessionStorage.newDesc

	sessionStorage.fenced
	sessionStorage.picnic
	sessionStorage.snack
	sessionStorage.park
	sessionStorage.toilette
	sessionStorage.handicap
	*/
}
