var newURI;
var img_size;

/************************PARCO.HTML*O*INSERISCI*DATI.HTML*/
//Link di aggiunta foto (nuove o mancanti)
function goPhotoUpload(provenienza)
{
	sessionStorage.provenienza = provenienza;
	
	if(sessionStorage.provenienza == 'nuovo')
	{
		//solo per il nuovo parco, se ho già inserito dati li salvo
		getDati();
	}

	window.location='inserisci_foto.html';
}

/*************************************INSERISCI*FOTO.HTML*/
/*modali*errore*/
function modalGenerico()
{
	scrollAlto();
	$('#modalErrore .modal-title').html('Ooooooops! Errore imprevisto');
	$('#modalErrore .modal-body').html('<p>Qualcosa è andato storto nel caricamento dell\'immagine.<br />Riprova.</p>');
	$('#modalErrore').modal();
}
function modalDimensioni()
{
	scrollAlto();
	$('#modalErrore .modal-title').html('Ooooooops! Errore imprevisto');
	$('#modalErrore .modal-body').html('<p>L\'immagine che hai selezionato è troppo grande.<br /> Scegline una di dimensioni minori.</p>');
	$('#modalErrore').modal();
}

/*apertura*modale*caricamento*o*scatto*/
function openPhotoUpload()
{	
	openCaricaFoto();

	//foto mancanti - parco esistente
	$('h3 span').html(sessionStorage.fotoMancanti);

	if(sessionStorage.provenienza == 'nuovo')
	{
		//tornare alla pagina di inserimento dati
		$('#container').append('<button id="completa" style="display:none;" class="btn btn-lg btn-block btn-success" type="button" onClick="window.location=\'inserisci_dati.html\';"><i class="fa fa-check-circle-o"></i> Completa</button>');
	}
	else if(sessionStorage.provenienza == 'vecchio')
	{
		//fare chiamata di associazione + andare a pagina di conferma
		$('#container').append('<button id="completa" style="display:none;" class="btn btn-lg btn-block btn-success" type="button" onClick="associaFotoParco();"><i class="fa fa-check-circle-o"></i> Completa</button>');
	}
}
function openCaricaFoto()
{
	$("#containerFoto .upload").click(function()
	{
		$('#caricaFoto').modal();

	});
}

/***********************************SCATTO*/
function capturePhoto_camera()
{
	$('#caricaFoto').modal('hide');

	navigator.camera.getPicture(onSuccessCamera, onFail, { quality: 75,
	destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.CAMERA,
    correctOrientation: true});
}
function onSuccessCamera(imageURI)
{	
	//caricamento foto
	sessionStorage.photo = imageURI;
	uploadPhoto(sessionStorage.photo);
}

/******************************CARICAMENTO*/
function capturePhoto()
{
	$('#caricaFoto').modal('hide');

	navigator.camera.getPicture(onSuccess, onFail, { quality: 75,
	destinationType: Camera.DestinationType.FILE_URI,
    //sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
    encodingType: Camera.EncodingType.JPEG,
    correctOrientation: true});
}
function onSuccess(imageData)
{
	$.when(function(){			
		window.resolveLocalFileSystemURL(imageData,
				function(fileEntry) {
					fileEntry.file(function(fileObj) {
						img_size = fileObj.size;
					}, function(error){
							//modal errore generico
							modalGenerico();
					});
				},
				function(error){ 
					//modal errore generico
					modalGenerico();
				}
		);
					
	}).then(function () {
		controlloSize(img_size, imageData);
	});
}
//controllo dimensioni immagine
function controlloSize(img_size, imageData)
{
	//controllo se immagine > 2,5MB
	if(img_size > 2621440)
	{
		modalDimensioni()
	}
	else{	
		controlloOk(imageData);
	}
}
function controlloOk(newURI)
{
	sessionStorage.photo = newURI;

	//caricamento foto
	uploadPhoto(sessionStorage.photo);

}
function onFail(message)
{
	modalGenerico();
}

/***********************************UPLOAD*/
function uploadPhoto(imageData)
{
	$('#cortina').fadeIn();

    //bug galleria - potrebbe non esserci formato foto
    nomeFile = imageData.substr(imageData.lastIndexOf('/')+1);
    controlloFormato = nomeFile.split('.');
    if(controlloFormato.length == 1)
    {	
    	//in caso lo aggiungo
    	nomeFile = nomeFile+ '.jpg';
    }

	var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName = nomeFile;
    options.mimeType="image/png";
    var params = new Object();
    params.name = "file";
    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(imageData, indirizzo+"/upload_parco", win, fail, options);
}

function win(data)
{
	risposta = data.response;
	rispostaJson = JSON.parse(risposta);

	idFoto = rispostaJson[0].id;
	pathFoto = rispostaJson[0].small_path;

	if(sessionStorage.listaIdFoto)
	{
		sessionStorage.listaIdFoto += ','+idFoto;
		sessionStorage.listaPathFoto += '<img src="'+indirizzo+'/media/'+pathFoto+'"/>';
	}
	else
	{
		sessionStorage.listaIdFoto = idFoto;
		sessionStorage.listaPathFoto = '<img src="'+indirizzo+'/media/'+pathFoto+'"/>';
	}

	/*alert(idFoto);
	alert(sessionStorage.listaIdFoto);
	alert(pathFoto);
	alert(sessionStorage.listaPathFoto);*/

	//mostro anteprima
	$('#containerFoto .upload').attr('src', sessionStorage.photo);
	$('#containerFoto img').removeClass('upload');
	$('#containerFoto .uploadButton').prop('disabled', true);

	//aggiorno contatore
	sessionStorage.fotoMancanti = sessionStorage.fotoMancanti-1;
	//controllo se posso aggiungere altre foto
	if(sessionStorage.fotoMancanti != 0)
	{
		$('#containerFoto').append('<img class="upload" src="img/7_photo.png" /><button class="btn btn-md btn-success uploadButton" onClick="$(\'#caricaFoto\').modal();">Scegli</button>');
	}

	$('#completa').show();
	$('#cortina').fadeOut();

	openCaricaFoto();
}

function fail(data)
{
	bodyErrore = data.body;
	//alert(bodyErrore);

	//gestisco errori server
	switch (bodyErrore)
	{
		case 'Form non valido':
			modalGenerico();
			break;

		case 'Peso troppo elevato':
			modalDimensioni();
			break;

		case 'Dimensioni elevate':
			modalDimensioni();
			break;

		default:
			modalGenerico();
	}
	
	$('#cortina').fadeOut();
}

/*******************************CLEANING*/
function clearCache()
{
    navigator.camera.cleanup();
}