$(document).ready(function() {
    // Lorsque le formulaire est soumis
    $('#auth-form').on('submit', function(e) {
        e.preventDefault(); // Empêche l'envoi classique du formulaire

        // Récupérer les valeurs des champs du formulaire
        var email = $('#email').val();
        var password = $('#password').val();

        // Vérifier que les champs ne sont pas vides
        if (!email || !password) {
            console.log('Email et mot de passe sont nécessaires');
            return;
        }

        // Requête AJAX
        $.ajax({
            url: 'http://localhost:8000/user_register', // URL de l'API
            method: 'POST',
            contentType: 'application/json', // Envoi des données en JSON
            data: JSON.stringify({
                email: email,
                password: password
            }),
            success: function(response) {
                // Afficher la réponse de la requête dans la console
                console.log('Réponse réussie:', response);
            },
            error: function(xhr, status, error) {
                // Afficher l'erreur dans la console
                console.log('Erreur AJAX:', status, error);
                console.log('Détails de la réponse:', xhr.responseText);
            }
        });
    });
});
