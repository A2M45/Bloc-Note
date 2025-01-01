let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editMode = false;
let noteToEdit = null;

document.getElementById("form-note").addEventListener("submit", function (e) {
    e.preventDefault();

    const titre = document.getElementById("titre").value;
    const contenu = document.getElementById("contenu").value;
    const categorie = document.getElementById("note-categorie").value;

    if (editMode) {
        // Modifier la note existante
        noteToEdit.titre = titre;
        noteToEdit.contenu = contenu;
        noteToEdit.categorie = categorie;

        // Quitter le mode édition
        editMode = false;
        noteToEdit = null;
        document.getElementById("ajouter-note").textContent = "Ajouter la note";
        document.getElementById("annuler-edit").style.display = "none";
    } else {
        // Ajouter une nouvelle note
        const note = {
            id: Date.now(),
            titre: titre,
            contenu: contenu,
            categorie: categorie,
            date: new Date().toLocaleString()
        };
        notes.push(note);
    }

    // Sauvegarder et afficher les notes
    sauvegarderNotes();
    afficherNotes();
    document.getElementById("form-note").reset();
});

document.getElementById("annuler-edit").addEventListener("click", function () {
    // Quitter le mode édition
    editMode = false;
    noteToEdit = null;
    document.getElementById("ajouter-note").textContent = "Ajouter la note";
    document.getElementById("annuler-edit").style.display = "none";
    document.getElementById("form-note").reset();
});

document.getElementById("search").addEventListener("input", function () {
    afficherNotes();
});

document.getElementById("categorie").addEventListener("change", function () {
    afficherNotes();
});

document.getElementById("mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("mode-sombre");
    this.textContent = document.body.classList.contains("mode-sombre") ? "Mode Clair" : "Mode Sombre";
});

function afficherNotes() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const categorie = document.getElementById("categorie").value;
    const chronologie = document.getElementById("chronologie");

    chronologie.innerHTML = "";

    notes
        .filter(note => (categorie === "Toutes" || note.categorie === categorie) &&
                        (note.titre.toLowerCase().includes(searchTerm) || note.contenu.toLowerCase().includes(searchTerm)))
        .sort((a, b) => b.id - a.id)
        .forEach(note => {
            const divNote = document.createElement("div");
            divNote.classList.add("note");
            divNote.innerHTML = `
                <h3>${note.titre}</h3>
                <p>${note.contenu}</p>
                <small>${note.date}</small>
                <div class="categorie">${note.categorie}</div>
                <div class="actions">
                    <button onclick="editerNote(${note.id})">✏️</button>
                    <button onclick="supprimerNote(${note.id})">🗑️</button>
                </div>
            `;
            chronologie.appendChild(divNote);
        });
}

function editerNote(id) {
    noteToEdit = notes.find(note => note.id === id);
    document.getElementById("titre").value = noteToEdit.titre;
    document.getElementById("contenu").value = noteToEdit.contenu;
    document.getElementById("note-categorie").value = noteToEdit.categorie;
    editMode = true;
    document.getElementById("ajouter-note").textContent = "Modifier la note";
    document.getElementById("annuler-edit").style.display = "inline-block";
}

function supprimerNote(id) {
    notes = notes.filter(note => note.id !== id);
    sauvegarderNotes();
    afficherNotes();
}

function sauvegarderNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Charger les notes au démarrage
afficherNotes();
