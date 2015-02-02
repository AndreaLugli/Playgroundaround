var newURI;
var listaURI = [];
var img_size;

function capturePhoto_camera()
{
	//alert(listaUri.length);

	if(jQuery.isEmptyObject(listaURI) || listaUri.length < 11){
		$('#caricaFoto').modal();

		navigator.camera.getPicture(onSuccessCamera, onFail, { quality: 75,
		destinationType: Camera.DestinationType.FILE_URI,
	    sourceType: Camera.PictureSourceType.CAMERA,
	    correctOrientation: true});
	}
	else
	{
		scrollAlto();
		$('#modalErrore').modal();
	}
}

//camera - non controllo grandezza immagine
function onSuccessCamera(imageURI)
{
	sessionStorage.photo = imageURI;	
	sessionStorage.photoPreview = imageURI;
	
	if(sessionStorage.photo)
	{
		$('#containerBottoni div').append('<img src="'+imageURI+'" />');
		$('#containerBottoni div').show();
	}
}

function capturePhoto()
{
	//alert(listaUri.length);

	if(jQuery.isEmptyObject(listaURI) || listaUri.length < 11){
		$('#caricaFoto').modal();

		navigator.camera.getPicture(onSuccess, onFail, { quality: 75,
		destinationType: Camera.DestinationType.FILE_URI,
	    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	    correctOrientation: true});
	}
	else
	{
		scrollAlto();
		$('#modalErrore').modal();
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
							scrollAlto();
							$('#modalErrore').modal();
					});
				},
				function(error){ 
					scrollAlto();
					$('#modalErrore').modal();
				}
		);
					
	}).then(function () {
		controlloSize(img_size, imageData);
	});
	
}

function controlloSize(img_size, imageData)
{
	//controllo la dimensione dell'immagine
	if(img_size > 2621440){
		//Immagine troppo grande (> 2,5MB)
		$('#modalErrore .modal-body').html('<p>L\'immagine che hai selezionato è troppo grande.<br /> Scegline un\'altra di dimensioni minori.</p>');
		scrollAlto();
		$('#modalErrore').modal();
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
	$('#containerBottoni div').append('<img src="'+newURI+'" />');
	$('#containerBottoni div').show();
	
	//sessionStorage.photo = newURI;
	listaUri.push(newUri);
	alert(listaUri.length);

	//sessionStorage.photoPreview = newURI;	
}

function onFail(message){}

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
    	ft.upload(imageData, indirizzo+"/django/upload_avatar", successo_upload_avatar, fail, options);
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