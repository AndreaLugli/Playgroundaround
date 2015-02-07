var newURI;
var img_size;
var arrayId = [];

/************************PARCO.HTML*O*INSERISCI*DATI.HTML*/
//Link di aggiunta foto (nuove o mancanti)
function goPhotoUpload(provenienza)
{
	sessionStorage.provenienza = provenienza;
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

	$('#containerFoto form').attr('action', indirizzo+'/upload_parco');

	/*if(sessionStorage.provenienza == 'nuovo')
	{}
	else if(sessionStorage.provenienza == 'vecchio')
	{}*/
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
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
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
function onFail(message){
	modalGenerico();
}

/***********************************UPLOAD*/
function uploadPhoto(imageData)
{
	$('#cortina').fadeIn();

	var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageData.substr(imageData.lastIndexOf('/')+1);
    options.mimeType="image/png";
    var params = new Object();
    params.name = "file";
    options.params = params;
    options.chunkedMode = false;
    var ft = new FileTransfer();

    ft.upload(imageData, indirizzo+"/upload_parco", successo_upload_foto, fail, options);  
}
function fail(xhr, textStatus, thrownError)
{
	$('#cortina').fadeOut();

	ciccia = JSON.stringify(xhr);
	alert(ciccia);

	alert(xhr);
	alert(textStatus);
   	alert(thrownError);

	modalGenerico();
}

function successo_upload_foto(data)
{
	alert(data.response);
	alert(data.id);
	alert(data.small_path);
	/*id_parco = data[0].id;
	arrayId.push(id_parco);
	alert(arrayId);*/

	//mostro anteprima
	$('#containerFoto .upload').attr('src', sessionStorage.photo);
	$('#containerFoto img').removeClass('upload');

	//aggiorno contatore
	sessionStorage.fotoMancanti = sessionStorage.fotoMancanti-1;
	//controllo se posso aggiungere altre foto
	if(sessionStorage.fotoMancanti != 0){
		$('#containerFoto').append('<img class="upload" src="img/7_photo.png" />');
	}

	openCaricaFoto();

	$('#completa').show();
	$('#cortina').fadeOut();
}