// Fehlerbehandlung hinzufügen
window.onerror = function(message, source, lineno, colno, error) {
    console.error('JavaScript-Fehler:', message, 'in', source, 'Zeile:', lineno);
    return true;
};

document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservationForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalX = document.querySelector('.close-modal');
    const reservationDetails = document.getElementById('reservationDetails');

    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Formular-Daten sammeln
        const formData = new FormData(reservationForm);
        const reservationData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            guests: formData.get('guests'),
            date: formData.get('date'),
            time: formData.get('time'),
            notes: formData.get('notes') || 'Keine'
        };
        
        // Telegram-Nachricht formatieren
        const telegramMessage = `
🍽️ *Neue Reservierung eingegangen!*

📋 *Details:*
Name: ${reservationData.name}
Datum: ${formatDate(reservationData.date)}
Zeit: ${reservationData.time} Uhr
Personen: ${reservationData.guests}
Telefon: ${reservationData.phone}
E-Mail: ${reservationData.email}

📝 *Anmerkungen:* ${reservationData.notes}
        `;
        
        // Reservierungsdetails im Modal vorbereiten
        reservationDetails.innerHTML = `
            <p><strong>Name:</strong> ${reservationData.name}</p>
            <p><strong>Datum:</strong> ${formatDate(reservationData.date)}</p>
            <p><strong>Uhrzeit:</strong> ${reservationData.time} Uhr</p>
            <p><strong>Personen:</strong> ${reservationData.guests}</p>
        `;
        
        // Zeige das Modal sofort an
        confirmationModal.style.display = 'block';
        
        // Formular zurücksetzen
        reservationForm.reset();
        
        // Telegram-Nachricht senden - ZUERST!
        sendTelegramNotification(telegramMessage);
        
        // Nach kurzer Verzögerung E-Mail-Bestätigung senden
        setTimeout(() => {
            sendEmailConfirmation(reservationData);
        }, 1000); // 1 Sekunde warten, damit Telegram zuerst gesendet wird
    });
    
    // Funktion zum Senden der Telegram-Benachrichtigung
    function sendTelegramNotification(message) {
        const script = document.createElement('script');
        const callbackName = 'tgCallback_' + Math.floor(Math.random() * 1000000);
        
        // Callback definieren (wird aufgerufen, wenn Telegram antwortet)
        window[callbackName] = function(response) {
            console.log('Telegram-Antwort erhalten:', response);
            delete window[callbackName];
            document.head.removeChild(script);
        };

        // Zeitüberschreitung für den Callback setzen
        setTimeout(function() {
            if (window[callbackName]) {
                console.log('Telegram-Timeout - keine Antwort erhalten');
                delete window[callbackName];
                if (document.head.contains(script)) {
                    document.head.removeChild(script);
                }
            }
        }, 10000); // 10 Sekunden Timeout

        // Telegram-Anfrage senden
        script.src = `https://api.telegram.org/bot7714528866:AAFsejQYalFHsjrdEwSC8grlnYJC2fecNgk/sendMessage?chat_id=7751846133&text=${encodeURIComponent(message)}&parse_mode=Markdown&callback=${callbackName}`;
        document.head.appendChild(script);
    }
    
    // Funktion zum Senden der E-Mail-Bestätigung via FormSubmit
    function sendEmailConfirmation(reservationData) {
        // E-Mail-Inhalt erstellen
        const emailBody = `
Sehr geehrte(r) ${reservationData.name},

vielen Dank für Ihre Reservierung im Köz Kebap Regensburg.

Ihre Reservierungsdetails:
Datum: ${formatDate(reservationData.date)}
Uhrzeit: ${reservationData.time} Uhr
Anzahl Personen: ${reservationData.guests}

Wir freuen uns auf Ihren Besuch. Bei Fragen erreichen Sie uns unter 0941792122.

Sollten Sie Ihre Reservierung stornieren müssen, bitten wir um frühzeitige Mitteilung.

Mit freundlichen Grüßen,
Ihr Team vom Köz Kebap Regensburg
Hoher-Kreuz-Weg 36, 93055 Regensburg
`;

        // Erstelle einen iFrame für das Formular, um Seitenneuladen zu vermeiden
        const iframe = document.createElement('iframe');
        iframe.name = 'email-submit-frame';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Erstelle ein unsichtbares Formular
        const hiddenForm = document.createElement('form');
        hiddenForm.style.display = 'none';
        hiddenForm.method = 'POST';
        hiddenForm.action = 'https://formsubmit.co/rachimwolf@gmail.com';
        hiddenForm.target = 'email-submit-frame'; // Wichtig! Sende das Formular in den iFrame

        // Füge die FormSubmit-Optionen hinzu
        const optionsEl = document.createElement('input');
        optionsEl.type = 'hidden';
        optionsEl.name = '_template';
        optionsEl.value = 'table';
        hiddenForm.appendChild(optionsEl);

        // Keine Weiterleitung erforderlich, da wir im iFrame sind
        const captchaEl = document.createElement('input');
        captchaEl.type = 'hidden';
        captchaEl.name = '_captcha';
        captchaEl.value = 'false';
        hiddenForm.appendChild(captchaEl);

        // Füge die Reservierungsdaten hinzu
        const nameEl = document.createElement('input');
        nameEl.type = 'hidden';
        nameEl.name = 'Name';
        nameEl.value = reservationData.name;
        hiddenForm.appendChild(nameEl);

        const emailEl = document.createElement('input');
        emailEl.type = 'hidden';
        emailEl.name = 'Email';
        emailEl.value = reservationData.email;
        hiddenForm.appendChild(emailEl);

        const dateEl = document.createElement('input');
        dateEl.type = 'hidden';
        dateEl.name = 'Datum';
        dateEl.value = formatDate(reservationData.date);
        hiddenForm.appendChild(dateEl);

        const timeEl = document.createElement('input');
        timeEl.type = 'hidden';
        timeEl.name = 'Uhrzeit';
        timeEl.value = reservationData.time;
        hiddenForm.appendChild(timeEl);

        const guestsEl = document.createElement('input');
        guestsEl.type = 'hidden';
        guestsEl.name = 'Personen';
        guestsEl.value = reservationData.guests;
        hiddenForm.appendChild(guestsEl);

        const phoneEl = document.createElement('input');
        phoneEl.type = 'hidden';
        phoneEl.name = 'Telefon';
        phoneEl.value = reservationData.phone;
        hiddenForm.appendChild(phoneEl);

        const notesEl = document.createElement('input');
        notesEl.type = 'hidden';
        notesEl.name = 'Anmerkungen';
        notesEl.value = reservationData.notes;
        hiddenForm.appendChild(notesEl);

        const messageEl = document.createElement('input');
        messageEl.type = 'hidden';
        messageEl.name = 'Nachricht';
        messageEl.value = emailBody;
        hiddenForm.appendChild(messageEl);

        // Kopie an den Kunden senden
        const ccToCustomer = document.createElement('input');
        ccToCustomer.type = 'hidden';
        ccToCustomer.name = '_cc';
        ccToCustomer.value = reservationData.email;
        hiddenForm.appendChild(ccToCustomer);

        // Füge das Formular zum Dokument hinzu
        document.body.appendChild(hiddenForm);

        // Sende das Formular in den iFrame
        hiddenForm.submit();

        // Entferne das Formular und den iFrame nach einer Verzögerung
        setTimeout(() => {
            if (document.body.contains(hiddenForm)) {
                document.body.removeChild(hiddenForm);
            }
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
        }, 5000);
    }

    // Modal schließen Funktionalität
    closeModalBtn.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });
    
    closeModalX.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    
    // Hilfsfunktion zur Formatierung des Datums
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('de-DE', options);
    }
}); 

/* 
HINWEIS ZUR E-MAIL-FUNKTION:

Die E-Mail-Funktion verwendet FormSubmit, einen kostenlosen Service zum Versenden von E-Mails.

So funktioniert die Bestätigung:
1. Der Kunde füllt das Reservierungsformular aus und sendet es ab
2. Der Kunde erhält eine Bestätigungs-E-Mail an die von ihm angegebene E-Mail-Adresse
3. Du erhältst auch eine Kopie der Bestätigung an rachimwolf@gmail.com

Beim ersten Absenden des Formulars nach der Änderung erhältst du eine Aktivierungs-E-Mail
von FormSubmit. Du musst den Link in dieser E-Mail anklicken, um den Service zu aktivieren.
Dies ist eine einmalige Aktion.
*/