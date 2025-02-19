class BudgetForm {
  constructor() {
    // Sélection des éléments du DOM pour la dépense et le revenu
    this.montantDepense = document.querySelector(".montantValeur");
    this.categorieDepense = document.querySelectorAll(".categorieChoix .choix");
    this.dateDepense = document.querySelector(".date-time-input");
    this.commentaireDepense = document.querySelector(".commentaireValue");
    this.btnValiderDepense = document.querySelector(".btnValiderDepense");

    this.montantRevenu = document.querySelector(".montantRevenuValeur");
    this.categorieRevenu = document.querySelectorAll(".categorieChoix .choix"); 
    this.dateRevenu = document.querySelector(".date-time-inputRevenu");
    this.commentaireRevenu = document.querySelector(".commentaireValue");
    this.btnValiderRevenu = document.querySelector(".btnValiderRevenu");

    // Ajout des événements de sélection de catégorie
    this.categorieDepense.forEach((categorie) => {
      categorie.addEventListener("click", () =>
        this.selectCategorie(categorie, "depense")
      );
    });
    this.categorieRevenu.forEach((categorie) => {
      categorie.addEventListener("click", () =>
        this.selectCategorie(categorie, "revenu")
      );
    });

    // Ajout des événements sur les boutons de validation
    if (this.btnValiderDepense) {
      this.btnValiderDepense.addEventListener("click", (event) =>
        this.submitDepense(event)
      );
    }

    if (this.btnValiderRevenu) {
      this.btnValiderRevenu.addEventListener("click", (event) =>
        this.submitRevenu(event)
      );
    }
  }
  

  // Fonction pour gérer la sélection d'une catégorie
  selectCategorie(categorie, type) {
    const categories =
      type === "depense" ? this.categorieDepense : this.categorieRevenu;
    categories.forEach((cat) => cat.classList.remove("selected"));

    categorie.classList.add("selected");
  }

   

  // Fonction de validation des champs du formulaire de dépense
  validateDepenseForm() {
    const montant = this.montantDepense.value.trim();
    const categorie = this.getCategorieSelectionnee("depense");
    const date = this.dateDepense.value.trim();
    //commentaire facultatif
    const commentaire = this.commentaireDepense.value.trim();

    // Vérification si les champs sont vides
    if (!montant || !categorie || !date) {
      alert("Tous les champs doivent être remplis pour la dépense");
      return false;
    }

    return true;
  }

  // Fonction de validation des champs du formulaire de revenu
  validateRevenuForm() {
    const montant = this.montantRevenu.value.trim();
    const categorie = this.getCategorieSelectionnee("revenu");
    const date = this.dateRevenu.value.trim();
    const commentaire = this.commentaireRevenu.value.trim();

    // Vérification si les champs sont vides
    if (!montant || !categorie || !date) {
      alert("Tous les champs doivent être remplis pour le revenu");
      return false;
    }

    return true;
  }

  // Fonction pour récupérer la catégorie sélectionnée
  getCategorieSelectionnee(type) {
    const categories =
      type === "depense" ? this.categorieDepense : this.categorieRevenu;
    const categorieSelectionnee = Array.from(categories).find((cat) =>
      cat.classList.contains("selected")
    );
    return categorieSelectionnee ? categorieSelectionnee.innerText.trim() : "";
  }
  // Fonction pour formater la date au bon format 
  formatDate(dateTimeValue) {
    const date = new Date(dateTimeValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


  // Fonction pour soumettre le formulaire de dépense
  submitDepense(event) {
    event.preventDefault();

    if (this.validateDepenseForm()) {
        const dateTimeValue = this.dateDepense.value.trim(); 
        // Formater la date
        const formattedDate = this.formatDate(dateTimeValue);

        const data = {
            montant: parseFloat(this.montantDepense.value.trim()),
            categorie: this.getCategorieSelectionnee("depense"),
            date: formattedDate,
            commentaire: this.commentaireDepense.value.trim(),
        };
        console.log(data)


        this.sendRequest("depense", data);
    }
}

  // Fonction pour soumettre le formulaire de revenu
  submitRevenu(event) {
    event.preventDefault();

    if (this.validateRevenuForm()) {

        const dateTimeValueRevenu = this.dateRevenu.value.trim(); // Cela contient la date et l'heure sélectionnées
        // Formater la date
        const formattedDateRevenu = this.formatDate(dateTimeValueRevenu);
      const data = {
        montant: this.montantRevenu.value.trim(),
        categorie: this.getCategorieSelectionnee("revenu"), // La catégorie sélectionnée
        date: formattedDateRevenu,
        commentaire: this.commentaireRevenu.value.trim(),
      };

      this.sendRequest("revenu", data);
    }
  }
  // Fonction pour réinitialiser les champs
 
  

  // Fonction pour envoyer la requête AJAX pour la dépense ou le revenu
  sendRequest(type, data) {
    const xhr = new XMLHttpRequest();
    const url = `http://localhost:8000/api/${type}`; // URL de ton endpoint pour les dépenses ou revenus
    console.log(url)

    xhr.open("POST", url, true);
    //on récupère le token de l'utilisateur pour pouvoir l'identifier
    // le token est donné par le abckend 

    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Erreur : utilisateur non connecté.");
      return;
    }
    console.log(token)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Gérer la réponse du serveur
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 201) {
          alert(
            `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } ajouté avec succès !`
          );
          resetFields();

        } else {
          alert(`Erreur lors de l'ajout de la ${type}: ` + xhr.responseText);
        }
      }
    };

    // Envoyer les données du formulaire
    xhr.send(JSON.stringify(data));
  }
  resetFields() {
    // Réinitialiser les champs de montant
    document.querySelector('.montantValeur').value = '';  
    // Réinitialiser les catégories sélectionnées
    const items = document.querySelectorAll('.categorieChoix .choix');
    items.forEach(item => item.classList.remove('selected'));
  
    // Réinitialiser les champs de commentaire
    document.querySelector('.commentaireValue').value = '';
  
    // Réinitialiser la date
    const dateInput = document.querySelector('.date-time-input');
    if (dateInput) {
      dateInput.value = '';  // Réinitialise la date
    }
  }
}
document.addEventListener('DOMContentLoaded', function () {
    const dateTimeInput = document.querySelector('.date-time-input');
    //pour la date des revenus
    const dateTimeInputRevenu = document.querySelector('.date-time-inputRevenu')
    const dateTimePicker = document.getElementById('dateTimePicker');
    const dateTimePickerRevenu = document.getElementById('dateTimePickerRevenu');
    const dateTimePickerContainer = document.querySelector('.date-time-picker-container');
    const dateTimePickerContainerRevenu = document.querySelector('.date-time-picker-containerRevenu');

    // Fonction pour afficher le calendrier et l'heure
    function showDateTimePicker() {
        console.log("fonction marche")
        const now = new Date();
        const dateString = now.toISOString().slice(0, 10); // Date au format YYYY-MM-DD
        const timeString = now.toISOString().slice(11, 16); // Heure au format HH:MM

        const dateHTML = `
            <input type="date" id="dateInput" value="${dateString}" />
            <input type="time" id="timeInput" value="${timeString}" />
            <button id="confirmDateTime">Valider</button>
        `;

        dateTimePicker.innerHTML = dateHTML;
        dateTimePicker.style.display = 'block'; // Afficher le sélecteur

        const confirmButton = document.getElementById('confirmDateTime');
        confirmButton.addEventListener('click', function () {
            const selectedDate = document.getElementById('dateInput').value;
            const selectedTime = document.getElementById('timeInput').value;

            // Mettre à jour l'input avec la date et l'heure sélectionnées
            dateTimeInput.value = `${selectedDate} ${selectedTime}`;

            // Masquer le sélecteur après la sélection
            dateTimePicker.style.display = 'none';
        });
    }

    function showDateTimePickerRevenu() {
        const now = new Date();
        const dateString = now.toISOString().slice(0, 10); // Date au format YYYY-MM-DD
        const timeString = now.toISOString().slice(11, 16); // Heure au format HH:MM

        const dateHTMLRevenu = `
            <input type="date" id="dateInputRevenu" value="${dateString}" />
            <input type="time" id="timeInputRevenu" value="${timeString}" />
            <button id="confirmDateTimeRevenu">Valider</button>
        `;

        dateTimePickerRevenu.innerHTML = dateHTMLRevenu;
        dateTimePickerRevenu.style.display = 'block'; // Afficher le sélecteur

        const confirmButton = document.getElementById('confirmDateTimeRevenu');
        confirmButton.addEventListener('click', function () {
            const selectedDate = document.getElementById('dateInputRevenu').value;
            const selectedTime = document.getElementById('timeInputRevenu').value;

            // Mettre à jour l'input avec la date et l'heure sélectionnées
            dateTimeInputRevenu.value = `${selectedDate} ${selectedTime}`;

            // Masquer le sélecteur après la sélection
            dateTimePickerRevenu.style.display = 'none';
        });
    }

    // Afficher le sélecteur de date et heure quand on clique sur l'input
    dateTimeInput.addEventListener('click', function () {
        const isVisible = dateTimePicker.style.display === 'block';
        dateTimePicker.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            showDateTimePicker();
        }
    });
        // Afficher le sélecteur de date et heure quand on clique sur l'input
    dateTimeInputRevenu.addEventListener('click', function () {
            const isVisibleRevenu = dateTimePickerRevenu.style.display === 'block';
            dateTimePickerRevenu.style.display = isVisibleRevenu ? 'none' : 'block';
            if (!isVisibleRevenu) {
                showDateTimePickerRevenu();
            }
        });

        window.addEventListener('click', function (e) {
            if (dateTimePickerContainer && !dateTimePickerContainer.contains(e.target)) {
                dateTimePicker.style.display = 'none';
            }
            if (dateTimePickerContainerRevenu && !dateTimePickerContainerRevenu.contains(e.target)) {
                dateTimePickerRevenu.style.display = 'none';
            }
        });
});


// Initialiser la classe BudgetForm quand le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
  new BudgetForm();
});
