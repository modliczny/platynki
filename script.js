// Konfiguracja Firebase (wstaw swoje dane z Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDXoq877dPjsu1I9-fRmrsVYFUCr4kCEtI",
  authDomain: "platynki-f9c18.firebaseapp.com",
  databaseURL: "https://platynki-f9c18-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "platynki-f9c18",
  storageBucket: "platynki-f9c18.firebasestorage.app",
  messagingSenderId: "1090471162008",
  appId: "1:1090471162008:web:ed98ea638ff9b880a960ed"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const gamesRef = db.ref("coopGames");

const gameForm = document.getElementById("gameForm");
const gamesList = document.getElementById("gamesList");
const sortBtn = document.getElementById("sortBtn");

let gamesArray = [];

// Dodawanie gry
gameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("gameName").value.trim();
  const guide = document.getElementById("guideLink").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (name && guide) {
    const newGameRef = gamesRef.push();
    newGameRef.set({ name, guide, comment, completed: false });
    gameForm.reset();
  }
});

// Sortowanie po nazwie
sortBtn.addEventListener("click", () => {
  gamesArray.sort((a, b) => a.name.localeCompare(b.name));
  renderGames(gamesArray);
});

// Renderowanie gier
gamesRef.on("value", (snapshot) => {
  gamesArray = [];
  snapshot.forEach((childSnapshot) => {
    const game = childSnapshot.val();
    game.key = childSnapshot.key;

    if (typeof game.completed === "string") {
      game.completed = game.completed === "true";
    } else {
      game.completed = !!game.completed;
    }

    gamesArray.push(game);
  });
  renderGames(gamesArray);
});

function renderGames(games) {
  gamesList.innerHTML = "";
  games.forEach((game) => {
    const row = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = game.name;

    const guideTd = document.createElement("td");
    const link = document.createElement("a");
    link.href = game.guide;
    link.target = "_blank";
    link.textContent = "Trophy Guide";
    link.classList.add("guide-button");
    guideTd.appendChild(link);

    const commentTd = document.createElement("td");
    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.value = game.comment || "";
    commentInput.style.width = "100%";
    commentInput.addEventListener("change", () => {
      gamesRef.child(game.key).update({ comment: commentInput.value.trim() });
    });
    commentTd.appendChild(commentInput);

    const deleteTd = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", () => {
      if (confirm(`Usunąć grę: ${game.name}?`)) {
        gamesRef.child(game.key).remove();
      }
    });
    deleteTd.appendChild(deleteBtn);

    row.appendChild(nameTd);
    row.appendChild(guideTd);
    row.appendChild(commentTd);
    row.appendChild(deleteTd);

    gamesList.appendChild(row);
  });
}
