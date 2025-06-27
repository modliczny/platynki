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

// Dodawanie gry
gameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("gameName").value.trim();
  const guide = document.getElementById("guideLink").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (name && guide) {
    const newGameRef = gamesRef.push();
    newGameRef.set({ name, guide, comment });
    gameForm.reset();
  }
});

// Wyświetlanie gier w tabeli na żywo
gamesRef.on("value", (snapshot) => {
  gamesList.innerHTML = "";
  snapshot.forEach((childSnapshot) => {
    const game = childSnapshot.val();
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
    commentTd.textContent = game.comment || "";

    row.appendChild(nameTd);
    row.appendChild(guideTd);
    row.appendChild(commentTd);
    gamesList.appendChild(row);
  });
});
