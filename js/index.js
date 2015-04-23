/*var app = {
    initialize: function()
    {
        this.bindEvents();

        //se non è il primo avvio, non mostro il tutorial
        if(localStorage.primoAvvio)
        {
            window.location='index_home.html';
        }
        else
        {
            localStorage.primoAvvio = 'no';

            //quale OS ho in uso?
            localStorage.dispositivo = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iOS" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iOS" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/Windows Phone/i)) == "Windows Phone" ? "Win" : "null";
   
            window.location='benvenuto.html';
        }
    },
    
    bindEvents: function()
    {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function()
    {
        $.support.cors = true;
    },
};*/

document.addEventListener("deviceready", avvio, false);

function avvio()
{
    $.support.cors = true;

    //se non è il primo avvio, non mostro il tutorial
    if(localStorage.primoAvvio)
    {
        window.location='index_home.html';
    }
    else
    {
        localStorage.primoAvvio = 'no';

        //quale OS ho in uso?
        localStorage.dispositivo = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iOS" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iOS" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/Windows Phone/i)) == "Windows Phone" ? "Win" : "null";

        window.location='benvenuto.html';
    }
}


function localizzami()
{
    alert('partenza');

    navigator.geolocation.getCurrentPosition(
        //Successo
        function(pos)
        {
            alert('primo');
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
            alert(latitude);
            alert(longitude);
        },
        //Errore
        function(errMsg)
        {
            alert(JSON.stringify(errMsg));
            navigator.geolocation.getCurrentPosition(
                //Successo
                function(pos)
                {
                    alert('secondo');
                    latitude = pos.coords.latitude;
                    longitude = pos.coords.longitude;
                    alert(latitude);
                    alert(longitude);        
                },
                //Errore 
                function(errMsg)
                {
                    alert(JSON.stringify(errMsg));
                }, 
                //Opzioni
                {
                    enableHighAccuracy: true,
                    timeout: 60*1000*2,
                    maximumAge: 1000*60*10
                });
        },
        //Opzioni 
        {
            enableHighAccuracy: false,
            timeout: 60*1000,
            maximumAge: 1000*60*10
        }
    );

}

