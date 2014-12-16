document.addEventListener('deviceready', partenza, true);

//AL CARICAMENTO DELLA PAGINA
function partenza()
{	
	jQuery.support.cors = true;

	$('body').append('<!-- MODAL ERRORI CONNESSIONE RETE -->'+
		'<div id="modal_connection_error" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'+
			'<div class="modal-dialog modal-sm">'+
				'<div class="modal-content">'+
					'<div class="modal-header">'+
						'<h4 class="modal-title">Errore di rete</h4>'+
					'</div>'+
					'<div class="modal-body">'+
						'<p>Connessione dati non trovata</p>'+
						'<p><div class="progress progress-striped active">'+
							'<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>'+
						'</div></p>'+
					'</div>'+
				'</div><!-- /.modal-content -->'+
			'</div><!-- /.modal-dialog -->'+
		'</div><!-- /.modal -->');

	document.addEventListener('backbutton', backButtonCallback, true);
	document.addEventListener("offline", offlineCallback, false);
	document.addEventListener("online", onlineCallback, false);
}


//quando da online passi ad offline (perdi la rete) fai qualcosa
function offlineCallback(){
	if(window.location.href.indexOf("index") > -1 || window.location.href.indexOf("connection_error.html") > -1) {		
	}
	else{
		scrollAlto();
		$('#modal_connection_error').modal({"backdrop": "static"});
	}
}
//quando da offline la rete torna, sblocca la situazione
function onlineCallback(){
	if(window.location.href.indexOf("index") > -1 || window.location.href.indexOf("connection_error.html") > -1) {		
	}
	else{
		$('#modal_connection_error').modal('hide');
	}
}


/****************************/
function pop(){
	navbarPop();
	footerPop();
}

function navbarPop(){
	$('body').prepend('<nav class="navbar navbar-inverse navbar-static-top" role="navigation">'+
          '<div class="container">'+
            '<div class="navbar-header">'+
              '<a class="navbar-brand" href="#">'+
                '<img alt="brand" src="./img/logo.png">'+
              '</a>'+
              '<button type="button" class="btn navbar-btn">Inserisci</button>'+
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