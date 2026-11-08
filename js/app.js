// ---------- État global ----------
let courses = JSON.parse(localStorage.getItem("menusaison_courses") || "[]");
let profil = JSON.parse(localStorage.getItem("menusaison_profil") || "null");

const CI_MAP = {
  gluten: ["farine", "pâtes", "semoule", "pain", "boulgour", "vermicelle", "couscous"],
  lactose: ["lait", "beurre", "crème", "yaourt", "fromage"],
  arachide: ["arachide", "cacahuète", "huile d'arachide"],
  fruitscoque: ["amande", "noix", "noisette", "pistache", "cajou", "noix de"],
  hypertension: ["sel", "bouillon", "chips", "saucisse", "jambon"],
  diabete: ["sucre", "miel", "confiture", "soda", "bonbon"]
};

// ---------- Navigation onglets ----------
document.querySelectorAll("nav#tabs .tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "saison") afficherSaison();
  });
});

// ---------- Courses ----------
function sauvegarderCourses() { localStorage.setItem("menusaison_courses", JSON.stringify(courses)); }

function afficherCourses() {
  const ul = document.getElementById("ingredientList");
  ul.innerHTML = "";
  courses.forEach((ing, i) => {
    const li = document.createElement("li");
    li.textContent = ing + " ✕";
    li.title = "Cliquer pour retirer";
    li.onclick = () => { courses.splice(i, 1); sauvegarderCourses(); afficherCourses(); };
    ul.appendChild(li);
  });
}

document.getElementById("addIngredient").addEventListener("click", () => {
  const input = document.getElementById("ingredientInput");
  input.value.split(",").map(s => s.trim()).filter(Boolean).forEach(v => {
    if (!courses.some(c => c.toLowerCase() === v.toLowerCase())) courses.push(v);
  });
  input.value = "";
  sauvegarderCourses(); afficherCourses();
});
document.getElementById("ingredientInput").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("addIngredient").click();
});
document.getElementById("clearCourses").addEventListener("click", () => {
  courses = []; sauvegarderCourses(); afficherCourses();
});

// ---------- OCR ticket (Tesseract.js) ----------
document.getElementById("ticketFile").addEventListener("change", async (e) => {
  const fichier = e.target.files[0];
  if (!fichier) return;
  const statut = document.getElementById("ocrStatus");
  statut.textContent = "📄 Lecture du ticket en cours… (peut prendre 20-60 s)";
  try {
    const resultat = await Tesseract.recognize(fichier, "fra");
    const texte = resultat.data.text.toLowerCase();
    const detectes = new Set();
    Object.values(CATEGORIES).flat().forEach(mot => {
      if (texte.includes(mot)) {
        const original = courses.find(c => c.toLowerCase() === mot) || mot;
        detectes.add(original);
      }
    });
    SAISON_MOIS[moisCourant()].legumes.forEach(l => { if (texte.includes(l.toLowerCase())) detectes.add(l); });
    SAISON_MOIS[moisCourant()].fruits.forEach(f => { if (texte.includes(f.toLowerCase())) detectes.add(f); });
    detectes.forEach(d => { if (!courses.some(c => c.toLowerCase() === d.toLowerCase())) courses.push(d); });
    sauvegarderCourses(); afficherCourses();
    statut.textContent = `✅ Ticket analysé — ${detectes.size} produit(s) reconnu(s). Vérifiez et complétez la liste.`;
  } catch (err) {
    statut.textContent = "❌ Erreur de lecture. Essayez une photo plus nette ou saisissez manuellement.";
  }
});

// ---------- Saison ----------
function creerProd(p) {
  const div = document.createElement("div");
  div.className = "prod-saison";
  div.textContent = p;
  div.onclick = () => {
    if (!courses.some(c => c.toLowerCase() === p.toLowerCase())) { courses.push(p); sauvegarderCourses(); }
    afficherCourses();
  };
  return div;
}

function afficherSaison() {
  const m = moisCourant();
  document.getElementById("saisonTitre").textContent = `🌿 En saison — ${m}`;
  const cont = document.getElementById("saisonProduits");
  cont.innerHTML = "";
  ["legumes", "fruits"].forEach(type => {
    const h = document.createElement("h3");
    h.textContent = type === "legumes" ? "🥕 Légumes" : "🍎 Fruits";
    cont.appendChild(h);
    const grid = document.createElement("div");
    grid.className = "saison-grid";
    SAISON_MOIS[m][type].forEach(p => grid.appendChild(creerProd(p)));
    cont.appendChild(grid);
  });

  Object.entries(SAISON_ANNEE).forEach(([nomSaison, data]) => {
    const h = document.createElement("h3");
    h.className = "saison-titre";
    h.textContent = nomSaison;
    cont.appendChild(h);
    ["legumes", "fruits"].forEach(type => {
      const sous = document.createElement("h4");
      sous.textContent = type === "legumes" ? "Légumes :" : "Fruits :";
      cont.appendChild(sous);
      const grid = document.createElement("div");
      grid.className = "saison-grid";
      data[type].forEach(p => grid.appendChild(creerProd(p)));
      cont.appendChild(grid);
    });
  });
}

// ---------- Profil ----------
function lireProfilFormulaire() {
  return {
    nom: document.getElementById("profilNom").value || "Moi",
    cuisine: document.querySelector("input[name=cuisine]:checked").value,
    regime: document.querySelector("input[name=regime]:checked").value,
    contreIndications: [...document.querySelectorAll("input[name=ci]:checked")].map(i => i.value)
  };
}
document.getElementById("saveProfil").addEventListener("click", () => {
  profil = lireProfilFormulaire();
  localStorage.setItem("menusaison_profil", JSON.stringify(profil));
  document.getElementById("profilMsg").textContent = "✅ Profil enregistré.";
});
if (profil) {
  document.getElementById("profilNom").value = profil.nom;
  document.querySelector(`input[name=cuisine][value=${profil.cuisine}]`).checked = true;
  document.querySelector(`input[name=regime][value=${profil.regime}]`).checked = true;
  profil.contreIndications.forEach(ci => { const el = document.querySelector(`input[name=ci][value=${ci}]`); if (el) el.checked = true; });
}

// ---------- Filtrage des recettes ----------
function recetteCompatible(r) {
  if (!profil) return true;
  if (r.regime === "flexitarien" && profil.regime === "vegetarien") return false;
  const cuisinesAutorisees = profil.cuisine === "mixte" ? ["francaise","algerienne","marocaine","mixte"] : [profil.cuisine, "mixte"];
  if (!cuisinesAutorisees.includes(r.cuisine)) return false;
  for (const ci of profil.contreIndications) {
    if ((r.eviter || []).includes(ci)) return false;
    if (ci === "hypertension" && r.ingredients.some(i => CI_MAP.hypertension.includes(i))) return false;
    if (ci === "diabete" && r.ingredients.some(i => CI_MAP.diabete.includes(i))) return false;
    if (["gluten","lactose","arachide","fruitscoque"].includes(ci) &&
        r.ingredients.some(i => CI_MAP[ci].some(mot => i.includes(mot)))) return false;
  }
  return true;
}

function scoreSaison(r) {
  const m = new Date().getMonth();
  if (r.mois === "toute") return 1;
  return r.mois.includes(m) ? 3 : 0;
}

function scoreCourses(r) {
  let possedes = 0;
  r.ingredients.forEach(i => { if (courses.some(c => c.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(c.toLowerCase()))) possedes++; });
  return possedes / r.ingredients.length;
}

// ---------- Recettes web (TheMealDB) ----------
async function recettesWeb() {
  const utilisees = new Set(JSON.parse(localStorage.getItem("menusaison_web") || "[]"));
  let pool = [];
  try {
    const rep = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=" + "abcdrstl"[Math.floor(Math.random()*8)]);
    const data = await rep.json();
    pool = (data.meals || []).filter(m => m.strArea !== "British");
  } catch (e) { return []; }
  const candidates = pool.filter(m => !utilisees.has(m.idMeal)).slice(0, 8);
  candidates.forEach(m => utilisees.add(m.idMeal));
  localStorage.setItem("menusaison_web", JSON.stringify([...utilisees]));
  return candidates.map(m => ({
    nom: m.strMeal, cuisine: "mixte", regime: "flexitarien",
    categorie: (m.strCategory || "").toLowerCase().includes("veget") ? "legumes" : "proteines",
    type: "plat", mois: "toute", web: true,
    ingredients: Object.keys(m).filter(k => k.startsWith("strIngredient") && m[k]).map(k => m[k].toLowerCase()).map(traduire),
    eviter: [], lien: m.strSource || `https://www.themealdb.com/meal/${m.idMeal}`
  }));
}

// ---------- Génération des menus (étape 1 : suggestions cochables) ----------
const STRUCTURE_REPAS = {
  "petitdej":   { label:"☕ Petit déjeuner", cats:["feculents","proteines","fruits"] },
  "dej":       { label:"🍽️ Déjeuner", cats:["entree","proteines","feculents","legumes","dessert"] },
  "diner":     { label:"🌙 Dîner", cats:["proteines","legumes","feculents"] }
};
const JOURS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

// Anti-redondance : recettes déjà proposées récemment
function memoireRecettes() { return new Set(JSON.parse(localStorage.getItem("menusaison_utilisees") || "[]")); }
function mémoriser(nom) {
  const m = JSON.parse(localStorage.getItem("menusaison_utilisees") || "[]");
  m.push(nom);
  // garder seulement les 40 dernières
  localStorage.setItem("menusaison_utilisees", JSON.stringify(m.slice(-40)));
}

// Historique glissant : 3 dernières semaines + semaine courante
function lireSemaines() { return JSON.parse(localStorage.getItem("menusaison_semaines") || "[]"); }
function numeroSemaine(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const jour = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - jour);
  const debutAnnee = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - debutAnnee) / 86400000 + 1) / 7);
}

let suggestions = []; // suggestions courantes : { jour, repas, nom, ingredients, web, lien, coche }
let maSemaine = null;  // semaine en construction : [{ jour, repas, nom, ingredients, perso, lien }]

function lienRecherche(nom) {
  return "https://www.google.com/search?q=" + encodeURIComponent("recette " + nom);
}

// ---------- Lien Monsieur Cuisine ----------
const MC_URL = "https://www.monsieur-cuisine.com/fr/recettes";
function boutonMC(nom) {
  return `<button class="btn-mc" data-nom="${nom.replace(/"/g, '&quot;')}" title="Copier le nom et ouvrir Monsieur Cuisine">🤖 Monsieur Cuisine</button>`;
}
function activerBoutonsMC(conteneur) {
  conteneur.querySelectorAll(".btn-mc").forEach(b => b.addEventListener("click", async () => {
    const nom = b.dataset.nom;
    try { await navigator.clipboard.writeText(nom); } catch (e) {}
    window.open(MC_URL, "_blank");
  }));
}

document.getElementById("genererMenus").addEventListener("click", async () => {
  if (courses.length === 0) { alert("Ajoutez d'abord vos courses (onglet « Mes courses »)."); return; }
  profil = profil || { nom: "Moi", cuisine: "mixte", regime: "flexitarien", contreIndications: [] };
  const nbJours = Math.min(14, Math.max(1, parseInt(document.getElementById("nbJours").value) || 7));
  const repasChoisis = ["petitdej","dej","diner"].filter(r => document.getElementById("repas" + {petitdej:"Pdj",dej:"Dej",diner:"Diner"}[r]).checked);
  if (repasChoisis.length === 0) { alert("Cochez au moins un repas (petit déjeuner, déjeuner ou dîner)."); return; }
  const cont = document.getElementById("menusResultat");
  cont.innerHTML = "<p>Génération en cours…</p>";

  const mois = new Date().getMonth();
  const dejaVues = memoireRecettes();
  let locales = RECETTES.filter(recetteCompatible).filter(r => recetteDeSaison(r, mois));
  let web = document.getElementById("inclureWeb").checked ? (await recettesWeb()).filter(recetteCompatible).filter(r => recetteDeSaison(r, mois)) : [];
  // Anti-redondance : privilégier les recettes jamais/récemment utilisées ; en réserve si pas assez
  const fraiches = [...locales, ...web].filter(r => !dejaVues.has(r.nom));
  const deja = [...locales, ...web].filter(r => dejaVues.has(r.nom));
  const pool = fraiches.length >= 6 ? fraiches : [...fraiches, ...deja];

  if (pool.length === 0) { cont.innerHTML = "<p>Aucune recette de saison ne correspond à votre profil. Décochez « recettes du web », assouplissez vos contre-indications, ou attendez la saison !</p>"; return; }

  const scorees = pool.map(r => ({ r, s: scoreSaison(r) * 2 + scoreCourses(r) * 3 + Math.random() }))
                      .sort((a, b) => b.s - a.s).map(x => x.r);
  const tirage = (liste) => { const copie = [...liste]; return copie.length ? copie.splice(Math.floor(Math.random()*copie.length),1)[0] : null; };

  suggestions = [];
  let html = "";
  for (let j = 0; j < nbJours; j++) {
    const jour = JOURS[j % 7] + (j >= 7 ? " (s2)" : "");
    html += `<div class="jour-menu"><h3>${jour}</h3>`;
    let manquantsJour = new Set();
    repasChoisis.forEach(repas => {
      const structure = STRUCTURE_REPAS[repas];
      html += `<h4 class="repas-titre">${structure.label}</h4>`;
      structure.cats.forEach(cat => {
        let cands;
        if (repas === "petitdej") cands = scorees.filter(r => r.type === "petitdej");
        else if (cat === "entree") cands = scorees.filter(r => r.type === "entree");
        else if (cat === "dessert") cands = scorees.filter(r => r.type === "dessert");
        else cands = scorees.filter(r => r.categorie === cat && !["entree","dessert","petitdej"].includes(r.type));
        if (cands.length === 0) return;
        const recette = tirage(cands);
        recette.ingredients.forEach(i => {
          if (!courses.some(c => c.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(c.toLowerCase()))) manquantsJour.add(i);
        });
        const idx = suggestions.length;
        suggestions.push({ jour, repas, nom: recette.nom, ingredients: recette.ingredients, web: !!recette.web, lien: recette.lien || lienRecherche(recette.nom), coche: true });
        html += `<div class="recette"><label><input type="checkbox" class="coche-suggestion" data-idx="${idx}" checked> <strong>${recette.nom}</strong></label>` +
          `<a class="lien-recette" href="${suggestions[idx].lien}" target="_blank">📖 voir la recette</a> ${boutonMC(recette.nom)}</div>`;
      });
    });
    if (manquantsJour.size) html += `<p class="hint">🛒 À acheter : ${[...manquantsJour].slice(0, 10).join(", ")}</p>`;
    html += "</div>";
  }
  const equi = `Profil : ${profil.nom} — ${profil.cuisine}, ${profil.regime}` +
    (profil.contreIndications.length ? `, sans : ${profil.contreIndications.join(", ")}` : "") +
    ` — Recettes de saison uniquement (${moisCourant()}) — cochez/décochez puis validez`;
  cont.innerHTML = `<p class="hint">${equi}</p>` + html;
  activerBoutonsMC(cont);
  document.getElementById("actionsSuggest").style.display = "block";
});

// ---------- Étape 2 : ma semaine ----------
function basculerEtape(etape) {
  document.querySelectorAll(".etape").forEach(b => b.classList.toggle("active", b.dataset.etape === etape));
  document.getElementById("etapeSuggest").style.display = etape === "suggest" ? "block" : "none";
  document.getElementById("etapeSemaine").style.display = etape === "semaine" ? "block" : "none";
}
document.querySelectorAll(".etapes-menu .etape").forEach(b => b.addEventListener("click", () => basculerEtape(b.dataset.etape)));

document.getElementById("validerSelection").addEventListener("click", () => {
  document.querySelectorAll(".coche-suggestion").forEach(cb => { suggestions[cb.dataset.idx].coche = cb.checked; });
  const gardees = suggestions.filter(s => s.coche);
  gardees.forEach(s => mémoriser(s.nom));
  maSemaine = { cree: new Date().toISOString(), items: gardees.map(s => ({ jour: s.jour, repas: s.repas, nom: s.nom, ingredients: s.ingredients, perso: false, lien: s.lien })) };
  afficherSemaine();
  basculerEtape("semaine");
});

document.getElementById("retourSuggest").addEventListener("click", () => basculerEtape("suggest"));

function afficherSemaine() {
  if (!maSemaine) return;
  const cont = document.getElementById("semaineEditable");
  let html = "";
  JOURS.forEach(jour => {
    const items = maSemaine.items.filter(i => i.jour === jour || i.jour === jour + " (s2)");
    if (!items.length) return;
    html += `<div class="jour-menu"><h3>${jour}</h3>`;
    ["petitdej","dej","diner"].forEach(repas => {
      const r = items.filter(i => i.repas === repas);
      if (!r.length) return;
      html += `<h4 class="repas-titre">${STRUCTURE_REPAS[repas].label}</h4>`;
      r.forEach(i => {
        html += `<div class="recette"><strong>${i.nom}</strong>${i.perso ? '<span class="tag">perso</span>' : ""} ` +
          `<button class="mini-btn suppr-item" data-nom="${i.nom}" data-repas="${repas}">✕</button> ` +
          `<a class="lien-recette" href="${i.lien || lienRecherche(i.nom)}" target="_blank">📖 recette</a> ${boutonMC(i.nom)}</div>`;
      });
    });
    html += "</div>";
  });
  if (!html) html = "<p class='hint'>Aucun repas sélectionné.</p>";
  cont.innerHTML = html;
  // boutons suppression
  cont.querySelectorAll(".suppr-item").forEach(b => b.addEventListener("click", () => {
    maSemaine.items = maSemaine.items.filter(i => !(i.nom === b.dataset.nom && i.repas === b.dataset.repas));
    afficherSemaine();
  }));
  activerBoutonsMC(cont);
}

// Recettes personnelles
document.getElementById("persoJour").innerHTML = JOURS.map(j => `<option value="${j}">${j}</option>`).join("");
document.getElementById("nouvelleRecettePerso").addEventListener("click", () => {
  const f = document.getElementById("recettePersoForm");
  f.style.display = f.style.display === "none" ? "block" : "none";
});
document.getElementById("persoAjouter").addEventListener("click", () => {
  const nom = document.getElementById("persoNom").value.trim();
  const ings = document.getElementById("persoIngredients").value.split(",").map(s => s.trim()).filter(Boolean);
  const repas = document.getElementById("persoRepas").value;
  const jour = document.getElementById("persoJour").value;
  if (!nom) { alert("Donnez un nom à votre recette."); return; }
  if (!maSemaine) maSemaine = { cree: new Date().toISOString(), items: [] };
  maSemaine.items.push({ jour, repas, nom, ingredients: ings, perso: true, lien: null });
  document.getElementById("persoNom").value = "";
  document.getElementById("persoIngredients").value = "";
  afficherSemaine();
});

// Sauvegarde de la semaine + historique glissant (3 semaines passées + courante)
document.getElementById("sauverSemaine").addEventListener("click", () => {
  if (!maSemaine || !maSemaine.items.length) { alert("Votre semaine est vide."); return; }
  const d = new Date();
  const id = d.getFullYear() + "-S" + numeroSemaine(d);
  const semaines = lireSemaines().filter(s => s.id !== id);
  semaines.push({ id, label: "Semaine " + numeroSemaine(d) + " (" + d.toLocaleDateString("fr-FR") + ")", data: maSemaine });
  // garder les 4 dernières (3 passées + courante)
  localStorage.setItem("menusaison_semaines", JSON.stringify(semaines.slice(-4)));
  afficherHistorique();
  alert("Semaine sauvegardée dans l'historique (3 dernières semaines conservées + la courante).");
});

function afficherHistorique() {
  const semaines = lireSemaines();
  const cont = document.getElementById("historiqueSemaines");
  if (!semaines.length) { cont.innerHTML = "<p class='hint'>Aucune semaine sauvegardée pour le moment.</p>"; return; }
  cont.innerHTML = semaines.slice().reverse().map(s => {
    const nb = s.data.items.length;
    return `<details class="hist-semaine"><summary>📅 ${s.label} — ${nb} repas</summary>` +
      s.data.items.map(i => `<div class="recette"><strong>${i.nom}</strong> <span class="hint">${i.jour} · ${STRUCTURE_REPAS[i.repas].label.replace(/^\S+\s/, "")}</span>${i.perso ? '<span class="tag">perso</span>' : ""}</div>`).join("") +
      "</details>";
  }).join("");
}
afficherHistorique();

// ---------- Init ----------
afficherCourses();
