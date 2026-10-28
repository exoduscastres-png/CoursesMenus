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
  const candidates = pool.filter(m => !utilisees.has(m.idMeal)).slice(0, 5);
  candidates.forEach(m => utilisees.add(m.idMeal));
  localStorage.setItem("menusaison_web", JSON.stringify([...utilisees]));
  return candidates.map(m => ({
    nom: m.strMeal, cuisine: "mixte", regime: "flexitarien",
    categorie: (m.strCategory || "").toLowerCase().includes("veget") ? "legumes" : "proteines",
    type: "plat", mois: "toute", web: true,
    ingredients: Object.keys(m).filter(k => k.startsWith("strIngredient") && m[k]).map(k => m[k].toLowerCase()),
    eviter: [], lien: m.strSource || `https://www.themealdb.com/meal/${m.idMeal}`
  }));
}

// ---------- Génération des menus ----------
document.getElementById("genererMenus").addEventListener("click", async () => {
  if (courses.length === 0) { alert("Ajoutez d'abord vos courses (onglet « Mes courses »)."); return; }
  profil = profil || { nom: "Moi", cuisine: "mixte", regime: "flexitarien", contreIndications: [] };
  const nbJours = Math.min(14, Math.max(1, parseInt(document.getElementById("nbJours").value) || 7));
  const cont = document.getElementById("menusResultat");
  cont.innerHTML = "<p>Génération en cours…</p>";

  let locales = RECETTES.filter(recetteCompatible);
  let web = document.getElementById("inclureWeb").checked ? await recettesWeb() : [];
  web = web.filter(recetteCompatible);
  const pool = [...locales, ...web];

  if (pool.length === 0) { cont.innerHTML = "<p>Aucune recette ne correspond à votre profil. Assouplissez vos contre-indications.</p>"; return; }

  const scorees = pool.map(r => ({ r, s: scoreSaison(r) * 2 + scoreCourses(r) * 3 + Math.random() }))
                       .sort((a, b) => b.s - a.s).map(x => x.r);

  const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
  const prixCategories = ["proteines", "feculents", "legumes"];
  let html = "";
  for (let j = 0; j < nbJours; j++) {
    const jour = jours[j % 7];
    html += `<div class="jour-menu"><h3>${jour}${j >= 7 ? " (semaine 2)" : ""}</h3>`;
    let manquants = new Set();
    prixCategories.forEach(cat => {
      const cands = scorees.filter(r => r.categorie === cat && r.type === "plat");
      const recette = cands[j % Math.max(1, cands.length)] || scorees[j % scorees.length];
      if (recette) {
        recette.ingredients.forEach(i => {
          if (!courses.some(c => c.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(c.toLowerCase()))) manquants.add(i);
        });
        html += `<div class="recette"><strong>${recette.nom}</strong><span class="tag">${cat}</span>${recette.web ? `<span class="tag">web</span> <a href="${recette.lien}" target="_blank">voir la recette</a>` : ""}</div>`;
      }
    });
    const dessert = scorees.filter(r => r.type === "dessert")[j % 2] || scorees.find(r => r.type === "dessert");
    if (dessert) html += `<div class="recette"><strong>${dessert.nom}</strong><span class="tag">dessert</span></div>`;
    if (manquants.size) html += `<p class="hint">🛒 À acheter : ${[...manquants].slice(0, 8).join(", ")}</p>`;
    html += "</div>";
  }
  const equi = `Profil : ${profil.nom} — ${profil.cuisine}, ${profil.regime}` +
    (profil.contreIndications.length ? `, sans : ${profil.contreIndications.join(", ")}` : "");
  cont.innerHTML = `<p class="hint">${equi}</p>` + html;
});

// ---------- Init ----------
afficherCourses();
