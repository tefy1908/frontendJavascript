document.getElementById('toggle-link').addEventListener('click', function (event) {
    event.preventDefault();
    const formTitle = document.getElementById('form-title');
    const nameField = document.getElementById('name-field');
    const submitButton = document.querySelector('button');
    const toggleText = document.getElementById('toggle-text');

    if (formTitle.innerText === 'Connexion') {
        formTitle.innerText = 'Inscription';
        nameField.classList.remove('hidden');
        submitButton.innerText = 'S\'inscrire';
        toggleText.innerHTML = 'Déjà un compte ? <a href="#" id="toggle-link">Se connecter</a>';
    } else {
        formTitle.innerText = 'Connexion';
        nameField.classList.add('hidden');
        submitButton.innerText = 'Se connecter';
        toggleText.innerHTML = 'Pas encore de compte ? <a href="#" id="toggle-link">S\'inscrire</a>';
    }
});
