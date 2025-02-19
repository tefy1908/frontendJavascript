class Profile {
    constructor() {
        this.apiUrl = "http://localhost:8000/api/user"; // URL de l'API utilisateur
        this.token = localStorage.getItem("auth_token");

        this.nameContainer = document.querySelector(".Name");
        this.emailContainer = document.querySelector(".Email");

        this.btnDeconnexion = document.querySelector(".btnDeconnexion");
        this.verifierConnexion();
        this.initEvents();



        emailjs.init("keyApi");

        // Vérifier si l'utilisateur est connecté
        if (!this.token) {
            alert("Utilisateur non connecté !");
            return;
        }

        // Charger les informations de l'utilisateur
        this.fetchProfile();

        // Ajouter la validation du formulaire de contact
        this.setupContactForm();
    }
        // Vérifie si l'utilisateur est connecté, sinon redirige vers login.html
    verifierConnexion() {
            if (!this.token) {
                window.location.href = "../Connexion.html";
            }
        }
    
        // Initialise les événements (ex: déconnexion)
    initEvents() {
            if (this.btnDeconnexion) {
                this.btnDeconnexion.addEventListener("click", () => this.deconnexion());
            }
        }

    async deconnexion() {
            try {
                const response = await fetch("http://localhost:8000/api/logout", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${this.token}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error("Erreur lors de la déconnexion.");
                }
    
                const data = await response.json();
                alert(data.message); // Afficher un message de confirmation
    
                // Supprimer le token JWT stocké
                localStorage.removeItem("auth_token");
    
                // Rediriger l'utilisateur vers la page de connexion
                window.location.href = "../Home.html";
            } catch (error) {
                console.error("Erreur lors de la déconnexion :", error);
                alert("Une erreur est survenue lors de la déconnexion.");
            }
        }

    // Récupérer les informations du profil utilisateur
    async fetchProfile() {
        try {
            const response = await fetch(this.apiUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Échec de la récupération du profil !");
            }

            const userData = await response.json();
            console.log(userData)
            this.displayProfile(userData);
            this.setupContactForm(userData);
        } catch (error) {
            console.error("Erreur:", error);
            alert("données non recuperer.");
        }
    }

    displayProfile(userData) {
        if (this.nameContainer) {
            this.nameContainer.innerHTML = `Nom : ${userData.username || "Inconnu"}`;
            
        }
        if (this.emailContainer) {
            this.emailContainer.innerHTML = `Email : ${userData.email || "Inconnu"}`;
        }
        
    }

    // Ajouter la validation et l'envoi du formulaire de contact
    setupContactForm(userData) {
        const form = document.getElementById("contact-form");

        if (!form) return; // Vérifier si le formulaire existe

        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Empêche le rechargement de la page
            let message = document.getElementById("message").value;

            // Vérification des champs
            if ( message === "") {
                alert("Veuillez remplir tous les champs !");
                return;
            }

            console.log("Nom:",userData.username);
            console.log("E-mail:", userData.email);
            console.log("Message:", message);

            // Réinitialisation du formulaire
            form.reset();
              // Préparer les données à envoyer via EmailJS
              const templateParams = {
                from_name: userData.username,
                from_email:  userData.email,
                message: message,
            };

            // Envoyer l'email via EmailJS
            //j'ai enlevé les infos de service et key pour l'envoi de mail parce que j'ai mon repo en public sur git
            emailjs.send("servicekey", "templatekey", templateParams)
                .then((response) => {
                    console.log("Email envoyé !", response);
                    alert("✅ Votre message a été envoyé avec succès !");
                    form.reset(); // Réinitialiser le formulaire
                })
                .catch((error) => {
                    console.error("Erreur lors de l'envoi :", error);
                    alert("Échec de l'envoi du message. Veuillez réessayer.");
                });
        });
    }
}


// Initialisation de la classe 
document.addEventListener("DOMContentLoaded", () => {
    new Profile();
});
