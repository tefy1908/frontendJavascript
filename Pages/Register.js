class RegisterForm {
    constructor() {
      this.usernameField = document.querySelector('.username');
      this.emailField = document.querySelector('.email');
      this.passwordField = document.querySelector('.password');
      this.addressField = document.querySelector('#adresse');
      this.submitButton = document.querySelector('.btnRegister');
  
      if (this.submitButton) {
        // Attacher un événement de soumission au bouton
        this.submitButton.addEventListener('click', (event) => this.submitForm(event));
      }
    }
  
    // Fonction de validation des champs du formulaire
    validateForm() {
      const username = this.usernameField.value.trim();
      const email = this.emailField.value.trim();
      const password = this.passwordField.value.trim();
      const address = this.addressField.value.trim();
  
      // Vérification si les champs sont vides
      if (!username || !email || !password || !address) {
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
  
    submitForm(event) {
      event.preventDefault(); 
  
      if (!this.validateForm()) {
        return; 
      }
  
      const data = {
        username: this.usernameField.value.trim(),
        email: this.emailField.value.trim(),
        password: this.passwordField.value.trim(),
        address: this.addressField.value.trim(),
      };
  
      this.sendRequest(data);
    }
  
    // Fonction pour envoyer la requête AJAX
    sendRequest(data) {
      const xhr = new XMLHttpRequest();
      const url = 'http://localhost:8000/api/register';  
  
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      // Gérer la réponse du serveur
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 201) {
            const response = JSON.parse(xhr.responseText);
            const token = response.token; 
  
            // Stocker le token dans le localStorage
            localStorage.setItem('auth_token', token);
            if (token) {
                console.log('Token:', token);
              } else {
                console.log('Aucun token trouvé');
              }
  
            alert('Inscription réussie');
            window.location.href = 'Connexion.html'; 
          } else {
            alert('Erreur lors de l\'inscription : ' + xhr.responseText);
          }
        }
      };
  
      // Envoyer les données du formulaire au backend
      xhr.send(JSON.stringify(data));
    }
  }
  
  // Initialiser la classe RegisterForm quand le DOM est prêt
  document.addEventListener('DOMContentLoaded', () => {
    new RegisterForm();
  });
  