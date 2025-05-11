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
            notes: formData.get('notes')
        };
        
        // Diese URL ist der Webhook, den du in n8n konfiguriert hast
        fetch('http://localhost:5678/webhook-test/reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
        })
        .then(data => {
            // Reservierungsdetails im Modal anzeigen
            reservationDetails.innerHTML = `
                <p><strong>Name:</strong> ${reservationData.name}</p>
                <p><strong>Datum:</strong> ${formatDate(reservationData.date)}</p>
                <p><strong>Uhrzeit:</strong> ${reservationData.time} Uhr</p>
                <p><strong>Personen:</strong> ${reservationData.guests}</p>
            `;
            
            // Modal anzeigen
            confirmationModal.style.display = 'block';
            
            // Formular zurücksetzen
            reservationForm.reset();
        })
        .catch(error => {
            alert('Es gab einen Fehler bei der Übermittlung Ihrer Reservierung. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch.');
            console.error('Fehler:', error);
        });
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