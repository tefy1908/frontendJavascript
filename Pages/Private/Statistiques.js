class Statistiques {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.token = localStorage.getItem("auth_token"); // Récupération du token
    this.afficheGraphiqueDepenses()
    this.afficheGraphiqueRevenu()

    if (!this.token) {
      console.error("Erreur : aucun token d'authentification trouvé.");
      alert("Veuillez vous connecter pour voir vos statistiques.");
      return;
    }
  }

  // Fonction pour récupérer les dépenses
  async fetchDepenses() {
    return this.fetchData("depenses");
  }

  // Fonction pour récupérer les revenus
  async fetchRevenus() {
    return this.fetchData("revenus");
  }

  // Fonction  recup des données
  async fetchData(type) {
    try {
      const response = await fetch(`${this.apiUrl}/${type}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
      }

      const data = await response.json();
      console.log(
        `${type.charAt(0).toUpperCase() + type.slice(1)} récupérés :`,
        data
      );
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des ${type} :`, error);
      alert(`Impossible de récupérer les ${type}. Vérifiez votre connexion.`);
      return [];
    }
  }

  // afficher le donénes recus dans le ficheir html
  afficherStatistiques(depenses, revenus) {
    console.log("Dépenses :", depenses);
    console.log("Revenus :", revenus);

    const depenseContainer = document.querySelector(".liste-depenses");
    const revenuContainer = document.querySelector(".liste-revenus");

    if (!depenseContainer || !revenuContainer) {
      console.warn(
        "erreurs lors de la récupération des containers"
      );
      return;
    }

    // Réinitialiser les listes
    depenseContainer.innerHTML = "<h2>Dépenses</h2>";
    revenuContainer.innerHTML = "<h2>Revenus</h2>";

    // Afficher les dépenses
    depenses.forEach((depense) => {
      const depenseItem = document.createElement("div");
      depenseItem.classList.add("depense-item");
      depenseItem.innerHTML = `
                <p><strong>Montant:</strong> ${depense.montant}€</p>
                <p><strong>Catégorie:</strong> ${depense.categorie}</p>
                <p><strong>Date:</strong> ${new Date(
                  depense.date
                ).toLocaleDateString()}</p>
                <p><strong>Commentaire:</strong> ${
                  depense.commentaire || "Aucun commentaire"
                }</p>
                <hr>
            `;
      depenseContainer.appendChild(depenseItem);
    });

    // Afficher les revenus
    revenus.forEach((revenu) => {
      const revenuItem = document.createElement("div");
      revenuItem.classList.add("revenu-item");
      revenuItem.innerHTML = `
                <p><strong>Montant:</strong> ${revenu.montant}€</p>
                <p><strong>Catégorie:</strong> ${revenu.categorie}</p>
                <p><strong>Date:</strong> ${new Date(
                  revenu.date
                ).toLocaleDateString()}</p>
                <p><strong>Commentaire:</strong> ${
                  revenu.commentaire || "Aucun commentaire"
                }</p>
            `;
      revenuContainer.appendChild(revenuItem);
    });
    // permet de calculer les totals des comptes
    const totalDepenses = depenses.reduce((total, d) => total + d.montant, 0);
    const totalRevenus = revenus.reduce((total, r) => total + r.montant, 0);

    // Aaffiche les totales
    const totalContainer = document.querySelector(".total-stats");
    if (totalContainer) {
      totalContainer.innerHTML = `
        <h3>Total Dépenses: <span style="color: red;">${totalDepenses}€</span></h3>
        <h3>Total Revenus: <span style="color: green;">${totalRevenus}€</span></h3>
        <h3>Solde Net: <strong style="color: ${
          totalRevenus - totalDepenses >= 0 ? "green" : "red"
        };">
            ${totalRevenus - totalDepenses}€
        </strong></h3>
    `;
    } else {
      console.warn("erreur lors de la recherche dans le DOM.");
    }
  }

  async afficheGraphiqueDepenses() {
    const depenses = await this.fetchDepenses(); // Récupérer les dépenses via l'API

    if (!depenses.length) {
        console.warn("Aucune dépense trouvée !");
        return;
    }

    // Regrouper les dépenses par catégorie et calculer le total par catégorie
    const depensesParCategorie = {};
    depenses.forEach(depense => {
        if (depensesParCategorie[depense.categorie]) {
            depensesParCategorie[depense.categorie] += depense.montant;
        } else {
            depensesParCategorie[depense.categorie] = depense.montant;
        }
    });

    // Extraire les catégories (X) et les montants (Y)
    const categories = Object.keys(depensesParCategorie);
    const montants = Object.values(depensesParCategorie);

    // Sélectionner le canvas pour le graphique
    const ctx = document.getElementById('myChart');

    // Vérifier si un ancien graphique existe et le détruire
    if (this.chart) {
        this.chart.destroy();
    }

    // Créer le graphique avec Chart.js
    this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories, // Catégories sur l'axe X
            datasets: [{
                label: 'Dépenses par catégorie (€)',
                data: montants, // Montants sur l'axe Y
                backgroundColor: '#2980b9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
async afficheGraphiqueRevenu() {
    const revenus = await this.fetchRevenus(); // Récupérer les revenus via l'API

    if (!revenus.length) {
        console.warn("Aucun revenu trouvé !");
        return;
    }

    // Regrouper les revenus par catégorie et calculer le total par catégorie
    const revenusParCategorie = {};
    revenus.forEach(revenu => {
        if (revenusParCategorie[revenu.categorie]) {
            revenusParCategorie[revenu.categorie] += revenu.montant;
        } else {
            revenusParCategorie[revenu.categorie] = revenu.montant;
        }
    });

    // Extraire les catégories (X) et les montants (Y)
    const categories = Object.keys(revenusParCategorie);
    const montants = Object.values(revenusParCategorie);

    // Sélectionner le canvas pour le graphique des revenus
    const ctx = document.getElementById('myChartRevenu');

    if (!ctx) {
        console.error("Erreur : L'élément <canvas id='myChartRevenu'> est introuvable !");
        return;
    }

    // Vérifier si un ancien graphique existe et le détruire
    if (this.chartRevenu) {
        this.chartRevenu.destroy();
    }

    // Créer le graphique avec Chart.js
    this.chartRevenu = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories, // Catégories sur l'axe X
            datasets: [{
                label: 'Revenus par catégorie (€)',
                data: montants, // Montants sur l'axe Y
                backgroundColor: '#2980b9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}



  // Fonction pour charger et afficher toutes les statistiques
  async chargerStatistiques() {
    const [depenses, revenus] = await Promise.all([
      this.fetchDepenses(),
      this.fetchRevenus(),
    ]);
    this.afficherStatistiques(depenses, revenus);
  }
}

// requete vers l'api
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:8000/api"; 
  const stats = new Statistiques(apiUrl);
  stats.chargerStatistiques();
});
