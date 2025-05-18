/**
 * Cookie-Verwaltung für Köz Kebap Website
 * Diese Datei wird von allen Seiten eingebunden, um das Cookie-Banner konsistent zu verwalten
 */

// Funktion zum Setzen eines Cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
}

// Funktion zum Lesen eines Cookies
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Funktion zum Löschen eines Cookies
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Cookie-Banner initialisieren und prüfen, ob Cookies bereits akzeptiert wurden
document.addEventListener('DOMContentLoaded', function() {
    var cookieBanner = document.getElementById('cookie-banner');
    var cookieAcceptButton = document.getElementById('accept-cookies');
    
    // Prüfen, ob Cookie vorhanden ist
    if (cookieBanner) {
        var cookiesAccepted = getCookie('cookies_accepted');
        
        // Banner ausblenden, wenn Cookies bereits akzeptiert oder abgelehnt wurden
        if (cookiesAccepted === 'true' || cookiesAccepted === 'false') {
            cookieBanner.style.display = 'none';
        } else {
            cookieBanner.style.display = 'flex';
        }
        
        // Event-Listener für den Akzeptieren-Button
        if (cookieAcceptButton) {
            cookieAcceptButton.addEventListener('click', function() {
                setCookie('cookies_accepted', 'true', 365); // Cookie für ein Jahr setzen
                cookieBanner.style.display = 'none';
            });
        }
        
        // Option zum Ablehnen von Cookies hinzufügen
        var declineButton = document.getElementById('decline-cookies');
        if (declineButton) {
            declineButton.addEventListener('click', function() {
                setCookie('cookies_accepted', 'false', 365); // Cookie mit Ablehnung speichern
                cookieBanner.style.display = 'none';
            });
        }
    }
}); 