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
        
        // Telegram-Nachricht im Hintergrund senden (ohne auf Antwort zu warten)
        const script = document.createElement('script');
        const callbackName = 'tgCallback_' + Math.floor(Math.random() * 1000000);
        
        // Callback definieren (wird aufgerufen, wenn Telegram antwortet)
        window[callbackName] = function(response) {
            // Erfolgreiche Telegram-Antwort
            console.log('Telegram-Antwort erhalten:', response);
            delete window[callbackName]; // Callback aufräumen
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
        script.src = `https://api.telegram.org/bot7350523052:AAFw8H0WNTpdqrqQk9fQXAM92U7mcNhdK5g/sendMessage?chat_id=7318873309&text=${encodeURIComponent(telegramMessage)}&parse_mode=Markdown&callback=${callbackName}`;
        document.head.appendChild(script);
    });

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