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
	$('#modalErrore .modal-body').html('<p>Qualcosa è andato storto nella selezione o nello scatto dell\'immagine.<br />Riprova.</p>');
	$('#modalErrore').modal();
}
function modalDimensioni()
{
	scrollAlto();
	$('#modalErrore .modal-title').html('Ooooooops! Errore imprevisto');
	$('#modalErrore .modal-body').html('<p>L\'immagine che hai selezionato è troppo grande.<br /> Scegline una di dimensioni minori.</p>');
	$('#modalErrore').modal();
}


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


/****************scatto*o*carico*/
function capturePhoto_camera()
{
	$('#caricaFoto').modal('hide');

	navigator.camera.getPicture(onSuccessCamera, onFail, { quality: 75,
	destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.CAMERA,
    correctOrientation: true});
}

//camera - non controllo grandezza immagine
function onSuccessCamera(imageURI)
{
	sessionStorage.photo = imageURI;	
	sessionStorage.photoPreview = imageURI;
	
	$('#containerFoto .upload').attr('src', imageURI);
	$('#containerFoto img').removeClass('upload');

	//caricamento foto
	uploadAvatar(sessionStorage.photo);
	
	//aggiorno contatore
	sessionStorage.fotoMancanti = sessionStorage.fotoMancanti-1;

	if(sessionStorage.fotoMancanti != 0){
		$('#containerFoto').append('<img class="upload" src="img/7_photo.png" />');
	}

	$('#completa').show();
	openCaricaFoto();
	
	alert('Camera ok: '+arrayUri);
	alert('Foto mancanti: '+sessionStorage.fotoMancanti);
}

function capturePhoto()
{
	$('#caricaFoto').modal('hide');

	navigator.camera.getPicture(onSuccess, onFail, { quality: 75,
	destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    correctOrientation: true});
}

//gallaria - controllo grandezza immagine
function onSuccess(imageData)
{
	//salvo dimensioni img nella variabile img_size
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

function controlloSize(img_size, imageData)
{
	//controllo se immagine troppo grande (> 2,5MB)
	if(img_size > 2621440)
	{
		//modal errore dimensioni
		modalDimensioni()
	}
	else{	
		append_src_img(imageData);
	}
}

//Appendi le anteprime
function append_src_img(newURI)
{
	sessionStorage.photo = newURI;
	sessionStorage.photoPreview = newURI;
	arrayUri.push(sessionStorage.photo);

	$('#containerFoto .upload').attr('src', newURI);
	$('#containerFoto img').removeClass('upload');

	//caricamento foto
	uploadAvatar(sessionStorage.photo);

	//aggiorno contatore
	sessionStorage.fotoMancanti = sessionStorage.fotoMancanti-1;

	if(sessionStorage.fotoMancanti != 0){
		$('#containerFoto').append('<img class="upload" src="img/7_photo.png" />');
	}

	$('#completa').show();
	openCaricaFoto();

	alert('Galleria ok '+arrayUri);
	alert('Foto mancanti: '+sessionStorage.fotoMancanti);
	
}
function onFail(message){}


function uploadAvatar(imageData)
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
    try
    {
    	ft.upload(imageData, indirizzo+"/upload_parco", successo_upload_avatar, fail, options);
    }
    catch(e)
    {
    	$('#modalErrore').modal();
    }
}
function fail(error)
{
	$('#cortina').fadeOut();
	$('#modalErrore').modal();
}

function successo_upload_avatar(r)
{
	id_parco = r[0].id;
	arrayId.push(id_parco);
	$('#cortina').fadeOut();
	alert(arrayId);
}