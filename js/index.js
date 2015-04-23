/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
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

        localizeFast();

    },
};


function localizeFast()
{
    navigator.geolocation.getCurrentPosition(
        //Successo
        function(pos) {
            sessionStorage.lat = pos.coords.latitude.toFixed(3);
            sessionStorage.longi = pos.coords.longitude.toFixed(3);
            //latitude = pos.coords.latitude;
            //longitude = pos.coords.longitude;
            alert(sessionStorage.lat);
            alert(sessionStorage.longi);
        },

        //Errore
        function(errMsg) {
            alert(JSON.stringify(errMsg));
            navigator.geolocation.getCurrentPosition(
                //Successo
                function(pos){
                    sessionStorage.lat = pos.coords.latitude;
                    sessionStorage.longi = pos.coords.longitude;
                    alert(sessionStorage.lat);
                    alert(sessionStorage.longi);        
                },

                //Errore 
                function(errMsg){
                    alert(JSON.stringify(errMsg));
                }, 

                //Opzioni
                {
                    enableHighAccuracy: true,
                    timeout: 60*1000*2,
                    maximumAge: 1000*60*10
                }
            );
        },
        
        //Opzioni 
        {
            enableHighAccuracy: false,
            timeout: 60*1000,
            maximumAge: 1000*60*10
        }
    );
}