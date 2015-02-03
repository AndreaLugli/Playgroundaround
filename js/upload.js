var newURI;
var arrayUri = [];
var img_size;


/*****************modali*errore*/
function modalTroppe()
{
	scrollAlto();
	$('#modalErrore .modal-title').html('Stooooooop! Troppe foto');
	$('#modalErrore .modal-body').html('<p>Puoi caricare al massimo 10 foto.</p>');
	$('#modalErrore').modal();
}
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

/****************scatto*o*carico*/
function capturePhoto_camera()
{
	if(jQuery.isEmptyObject(arrayUri) || arrayUri.length < 10)
	{
		$('#caricaFoto').modal('hide');

		navigator.camera.getPicture(onSuccessCamera, onFail, { quality: 75,
		destinationType: Camera.DestinationType.FILE_URI,
	    sourceType: Camera.PictureSourceType.CAMERA,
	    correctOrientation: true});
	}
	else
	{
		//modal più di 10 foto
		modalTroppe();
	}
}

//camera - non controllo grandezza immagine
function onSuccessCamera(imageURI)
{
	sessionStorage.photo = imageURI;	
	sessionStorage.photoPreview = imageURI;
	arrayUri.push(sessionStorage.photo);
	
	if(sessionStorage.photo)
	{
		$('#containerFoto div').append('<img src="'+imageURI+'" />');
		$('#completa').show();
	}
	alert('Camera ok: '+arrayUri);
}

function capturePhoto()
{
	if(jQuery.isEmptyObject(arrayUri) || arrayUri.length < 11)
	{
		$('#caricaFoto').modal('hide');

		navigator.camera.getPicture(onSuccess, onFail, { quality: 75,
		destinationType: Camera.DestinationType.FILE_URI,
	    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	    correctOrientation: true});
	}
	else
	{
		//modal più di 10 foto
		modalTroppe();
	}
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

function URL_success(fileEntry)
{ 
	append_src_img(fileEntry.toURL());
}

//Prendi l'uri e appendilo nel box
function append_src_img(newURI)
{
	sessionStorage.photo = newURI;
	sessionStorage.photoPreview = newURI;
	arrayUri.push(sessionStorage.photo);

	$('#containerFoto div').append('<img src="'+newURI+'" />');
	$('#completa').show();

	alert('Galleria ok '+arrayUri);
	
}

function onFail(message){}


/**************upload*via*form*/
/*function uploadAvatar(imageData)
{
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
    	scrollAlto();
    	$('#modalErrore').modal();
    }
}
function fail(error)
{
	scrollAlto();
	$('#modalErrore').modal();
}

function successo_upload_avatar(r){}*/