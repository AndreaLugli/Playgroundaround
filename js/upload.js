var newURI;
var arrayUri = [];
var img_size;


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
	quanteForm();

	//foto mancanti - parco esistente
	$('h3 span').html(sessionStorage.fotoMancanti);

	if(sessionStorage.provenienza == 'nuovo')
	{}
	else if(sessionStorage.provenienza == 'vecchio')
	{}
}

//genero dinamicamente i bottoni/foto di aggiunta
function quanteForm()
{
	for ( var i = 0; i < sessionStorage.fotoMancanti; i++ )
	{
    	/*$('#containerFoto').append('<form method="post" enctype="multipart/form-data" action="'+indirizzo+'/upload_parco">'+
									'<input id="'+i+'" name="file" type="file" />'+
                        			'<a style="display:none;" type="submit" name="submit" value="COMPLETA" class="btn btn-lg btn-success" ><img src="5_credits.png"/></a>'+
                    			'</form>');*/
		
		$('#containerFoto').append('<a class="addPhoto" href="javascript:openCaricaFoto();"><img src="img/7_photo.png" /></a>');

	}
}
//modale carica o scatta
function openCaricaFoto()
{
	$('#caricaFoto').modal();
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
	arrayUri.push(sessionStorage.photo);
	
	$('#containerFoto .addPhoto img').attr('class', imageURI);
	$('#completa').show();
	
	alert('Camera ok: '+arrayUri);
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

	$('#containerFoto .addPhoto img').attr('class', imageURI);
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


/*CODICE RIC*/
/*$(document).on('submit','#foto_per_parco10', function(event) { 
                 event.preventDefault();
                 var data = new window.FormData($('#foto_per_parco10')[0]);
                 uploader_foto_singola(data, 10);
                });

                function uploader_foto_singola(data, indice) {
                 $.ajax({
                        url : "upload_parco", 
                        type : "POST", 
                        data: data,
                        contentType: false,
                        processData: false,
                        success : function(data) {
                         //chiudi_spinner();
                         id_parco = data[0].id;
                         array_foto.push(id_parco);
                         path = data[0].small_path;
                         $("#foto_per_parco"+indice).html("");
                         $("#foto_"+indice).attr("src","media/"+path).attr("width","150");
                        },
                        error : function(data) {
                         alert("Errore! "+data.responseText);   
                        }
                    }); 
                }*/