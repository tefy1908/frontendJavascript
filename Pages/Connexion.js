class ConnexionForm {
    constructor() {
      this.emailField = document.querySelector('.email');
      this.passwordField = document.querySelector('.password');
      this.submitButton = document.querySelector('.btnConnexion');
  
      if (this.submitButton) {
        // Attacher un événement de soumission au bouton
        this.submitButton.addEventListener('click', (event) => this.submitForm(event));
      }
    }
  
    validateForm() {
      const email = this.emailField.value.trim();
      const password = this.passwordField.value.trim();
  
      // Vérification si les champs sont vides
      if (!email || !password) {
        alert('Tous les champs doivent être remplis');
        return false;
      }
  
      // Vérification de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('L\'email n\'est pas valide');
        return false;
      }
  
      return true;
    }
  
    // Fonction pour soumettre le formulaire
    submitForm(event) {
      event.preventDefault(); 
  
      if (!this.validateForm()) {
        return; 
      }
  
      const data = {
        email: this.emailField.value.trim(),
        password: this.passwordField.value.trim(),
      };
  
      this.sendRequest(data);
    }
  
    // Fonction pour envoyer la requête AJAX
    sendRequest(data) {
      const xhr = new XMLHttpRequest();
      const url = 'http://localhost:8000/api/login_check';  
  
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
  
      // Gérer la réponse du serveur
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const token = response.token; 
  
            // Stocker le token dans le localStorage
            localStorage.setItem('auth_token', token);
  
            if (token) {
              console.log('Token:', token);
            } else {
              console.log('Aucun token trouvé');
            }
            console.log('Token enregistré:', localStorage.getItem('auth_token'));

  
            alert('Connexion réussie');
            window.location.href = 'Private/Home.html';
          } else {
            alert('Erreur lors de la connexion : ' + xhr.responseText);
          }
        }
      };
  
      xhr.send(JSON.stringify(data));
    }
  }
  
  // Initialiser la classe ConnexionForm quand le DOM est prêt
  document.addEventListener('DOMContentLoaded', () => {
    new ConnexionForm();
  });
  