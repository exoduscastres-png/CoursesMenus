// Fruits & légumes de saison par mois (France / Europe)
const SAISON_MOIS = {
  "Janvier": { fruits: ["Clémentine","Orange","Pomme","Poire","Kiwi","Citron"], legumes: ["Poireau","Carotte","Endive","Chou-fleur","Citrouille","Navet","Salsifis","Épinard"] },
  "Février": { fruits: ["Clémentine","Orange","Pomme","Poire","Kiwi"], legumes: ["Poireau","Carotte","Endive","Chou-fleur","Épinard","Navet","Topinambour"] },
  "Mars": { fruits: ["Pomme","Poire","Orange","Kiwi","Citron"], legumes: ["Épinard","Poireau","Carotte","Endive","Asperge (fin mars)","Chou-fleur","Radis"] },
  "Avril": { fruits: ["Pomme","Poire","Fraise (fin avril)","Rhubarbe"], legumes: ["Asperge","Épinard","Radis","Petits pois","Artichaut","Carotte","Chou-fleur"] },
  "Mai": { fruits: ["Fraise","Rhubarbe","Cerise (fin mai)"], legumes: ["Asperge","Radis","Petits pois","Artichaut","Épinard","Fève","Courgette (fin mai)","Laitue"] },
  "Juin": { fruits: ["Fraise","Cerise","Abricot","Melon","Pêche","Groseille","Framboise"], legumes: ["Courgette","Haricot vert","Petit pois","Artichaut","Tomate (fin juin)","Concombre","Radis","Salade","Fenouil","Aubergine (fin juin)"] },
  "Juillet": { fruits: ["Abricot","Melon","Pastèque","Pêche","Nectarine","Cerise","Framboise","Myrtille"], legumes: ["Tomate","Courgette","Aubergine","Poivron","Haricot vert","Concombre","Courge (fin juillet)","Maïs","Salade","Épinard"] },
  "Août": { fruits: ["Melon","Pastèque","Pêche","Nectarine","Poire (fin août)","Prune","Figue","Raisin (fin août)","Mûre"], legumes: ["Tomate","Courgette","Aubergine","Poivron","Haricot vert","Concombre","Épinard","Salade","Courge","Betterave","Carotte"] },
  "Septembre": { fruits: ["Raisin","Pomme","Poire","Prune","Figue","Melon","Mûre","Noix"], legumes: ["Courge","Tomate","Courgette","Aubergine","Poivron","Haricot vert","Betterave","Champignon","Épinard","Salade","Chou-fleur (fin sept.)","Fenouil","Maïs"] },
  "Octobre": { fruits: ["Pomme","Poire","Raisin","Coing","Châtaigne","Noix","Figue"], legumes: ["Citrouille","Courge","Chou-fleur","Chou","Poireau","Betterave","Champignon","Endive","Épinard","Navet","Radis noir","Salsifis"] },
  "Novembre": { fruits: ["Pomme","Poire","Coing","Châtaigne","Clémentine (fin nov.)","Orange (fin nov.)"], legumes: ["Citrouille","Courge","Chou-fleur","Chou","Poireau","Betterave","Champignon","Endive","Navet","Panais","Topinambour"] },
  "Décembre": { fruits: ["Clémentine","Orange","Pomme","Poire","Châtaigne"], legumes: ["Citrouille","Chou-fleur","Chou","Poireau","Endive","Betterave","Navet","Panais","Mâche","Champignon"] }
};

function moisCourant() { return ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"][new Date().getMonth()]; }

// Vue par saison (hémisphère nord) : mois + exemples de fruits et légumes
const SAISON_ANNEE = {
  "Hiver (décembre, janvier, février)": {
    fruits: ["Clémentine", "Orange", "Pomme", "Poire", "Kiwi", "Citron", "Châtaigne"],
    legumes: ["Poireau", "Carotte", "Endive", "Chou-fleur", "Citrouille", "Navet", "Épinard", "Salsifis", "Mâche", "Topinambour", "Panais", "Champignon"]
  },
  "Printemps (mars, avril, mai)": {
    fruits: ["Pomme", "Poire", "Fraise", "Rhubarbe", "Cerise (fin mai)", "Citron"],
    legumes: ["Asperge", "Épinard", "Radis", "Petits pois", "Artichaut", "Fève", "Carotte", "Chou-fleur", "Laitue", "Céleri", "Navet nouveau"]
  },
  "Été (juin, juillet, août)": {
    fruits: ["Abricot", "Melon", "Pastèque", "Pêche", "Nectarine", "Cerise", "Framboise", "Myrtille", "Groseille", "Prune", "Figue (fin août)"],
    legumes: ["Tomate", "Courgette", "Aubergine", "Poivron", "Haricot vert", "Concombre", "Petit pois", "Artichaut", "Salade", "Fenouil", "Épinard", "Maïs", "Betterave"]
  },
  "Automne (septembre, octobre, novembre)": {
    fruits: ["Raisin", "Pomme", "Poire", "Prune", "Coing", "Figue", "Châtaigne", "Noix", "Mûre", "Melon (sept.)"],
    legumes: ["Courge", "Citrouille", "Potimarron", "Chou-fleur", "Chou", "Poireau", "Betterave", "Champignon", "Endive", "Épinard", "Navet", "Radis noir", "Salsifis", "Fenouil", "Salade"]
  }
};

// Traduction anglais -> français des ingrédients (TheMealDB)
const TRADUCTIONS = {
  "chicken":"poulet","beef":"bœuf","lamb":"agneau","pork":"porc","turkey":"dinde","veal":"veau",
  "fish":"poisson","salmon":"saumon","tuna":"thon","cod":"cabillaud","prawns":"crevettes","shrimp":"crevettes",
  "egg":"œuf","eggs":"œufs","cheese":"fromage","butter":"beurre","milk":"lait","cream":"crème","yoghurt":"yaourt","yogurt":"yaourt",
  "tofu":"tofu","chickpeas":"pois chiches","lentils":"lentilles","beans":"haricots secs","kidney beans":"haricots rouges",
  "potatoes":"pommes de terre","potato":"pomme de terre","sweet potato":"patate douce","rice":"riz","pasta":"pâtes","spaghetti":"spaghetti",
  "macaroni":"macaroni","couscous":"semoule","breadcrumbs":"chapelure","flour":"farine","bread":"pain","tortillas":"tortillas","noodles":"nouilles",
  "onion":"oignon","onions":"oignons","garlic":"ail","tomato":"tomate","tomatoes":"tomates","tomato puree":"concentré de tomate",
  "zucchini":"courgette","courgettes":"courgettes","aubergine":"aubergine","eggplant":"aubergine","pepper":"poivron","peppers":"poivrons",
  "carrot":"carotte","carrots":"carottes","leek":"poireau","leeks":"poireaux","spinach":"épinards","mushrooms":"champignons",
  "mushroom":"champignon","broccoli":"brocoli","cauliflower":"chou-fleur","cabbage":"chou","courgette":"courgette","peas":"petits pois",
  "green beans":"haricots verts","cucumber":"concombre","lettuce":"laitue","beetroot":"betterave","pumpkin":"citrouille","squash":"courge",
  "olive oil":"huile d'olive","olives":"olives","olive":"olive","lemon":"citron","lemon juice":"jus de citron","orange":"orange",
  "apple":"pomme","apples":"pommes","banana":"banane","bananas":"bananes","strawberries":"fraises","raspberries":"framboises",
  "blueberries":"myrtilles","honey":"miel","sugar":"sucre","salt":"sel","pepper (spice)":"poivre","cumin":"cumin","paprika":"paprika",
  "cinnamon":"cannelle","ginger":"gingembre","parsley":"persil","coriander":"coriandre","basil":"basilic","thyme":"thym",
  "bay leaf":"feuille de laurier","stock":"bouillon","chicken stock":"bouillon de volaille","vegetable stock":"bouillon de légumes",
  "water":"eau","vinegar":"vinaigre","mayonnaise":"mayonnaise","mustard":"moutarde","sunflower oil":"huile de tournesol","rapeseed oil":"huile de colza",
  "beef stock":"bouillon de bœuf","ham":"jambon","bacon":"lardons","cheddar":"cheddar","parmesan":"parmesan","feta":"feta","mozzarella":"mozzarella",
  "chickpea":"pois chiche","baking powder":"levure","dark soy sauce":"sauce soja","sesame oil":"huile de sésame","cornflour":"fécule de maïs"
};

function traduire(ing) {
  if (!ing) return ing;
  const n = ing.toLowerCase().trim();
  if (TRADUCTIONS[n]) return TRADUCTIONS[n];
  const parts = n.split(/\s+/);
  const traduits = parts.map(m => TRADUCTIONS[m] || m);
  return traduits.join(" ");
}

// Calendrier de saison des fruits & légumes : produit -> mois (0-11) où il est de saison
// Basé sur SAISON_MOIS : si un produit n'est pas de saison au mois m, il est exclu des menus
function produitDeSaison(nomProduit, mois) {
  const n = nomProduit.toLowerCase().trim();
  // mois de disponibilité par produit (les plus courants ; absents = toute l'année)
  const SAISON_PRODUITS = {
    "tomate":[4,5,6,7,8,9,10], "tomates":[4,5,6,7,8,9,10],
    "courgette":[4,5,6,7,8,9,10], "courgettes":[4,5,6,7,8,9,10],
    "aubergine":[4,5,6,7,8,9,10], "aubergines":[4,5,6,7,8,9,10],
    "poivron":[4,5,6,7,8,9,10], "poivrons":[4,5,6,7,8,9,10],
    "concombre":[4,5,6,7,8,9], "haricot vert":[5,6,7,8,9], "haricots verts":[5,6,7,8,9],
    "petit pois":[3,4,5,6], "petits pois":[3,4,5,6], "fève":[3,4,5,6], "fèves":[3,4,5,6],
    "asperge":[2,3,4,5], "asperges":[2,3,4,5], "radis":[2,3,4,5,6,7,8,9],
    "artichaut":[3,4,5,6], "artichauts":[3,4,5,6], "fenouil":[4,5,6,7,8,9,10],
    "fraise":[3,4,5,6,7], "fraises":[3,4,5,6,7], "cerise":[4,5,6,7], "cerises":[4,5,6,7],
    "abricot":[5,6,7,8], "abricots":[5,6,7,8], "pêche":[5,6,7,8], "pêches":[5,6,7,8],
    "nectarine":[5,6,7,8], "nectarines":[5,6,7,8], "melon":[5,6,7,8], "melons":[5,6,7,8],
    "pastèque":[6,7,8], "pastèques":[6,7,8], "prune":[7,8], "prunes":[7,8],
    "figue":[7,8,9,10], "figues":[7,8,9,10], "raisin":[7,8,9,10], "raisins":[7,8,9,10],
    "mûre":[7,8], "mûres":[7,8], "myrtille":[6,7,8], "myrtilles":[6,7,8], "framboise":[5,6,7,8], "framboises":[5,6,7,8],
    "groseille":[5,6,7], "groseilles":[5,6,7], "rhubarbe":[3,4,5],
    "citrouille":[8,9,10,11], "courge":[8,9,10,11,0], "potimarron":[8,9,10,11,0],
    "châtaigne":[9,10,11,0], "châtaignes":[9,10,11,0], "coing":[9,10,11],
    "clémentine":[10,11,0,1], "clémentines":[10,11,0,1], "orange":[11,0,1,2,3], "mandarine":[10,11,0,1],
    "kiwi":[10,11,0,1,2,3], "mâche":[10,11,0,1,2], "endive":[9,10,11,0,1,2,3], "endives":[9,10,11,0,1,2,3],
    "poireau":[0,1,2,3,9,10,11], "poireaux":[0,1,2,3,9,10,11],
    "navet":[0,1,9,10,11,3,4], "navets":[0,1,9,10,11,3,4], "salsifis":[0,1,10,11],
    "topinambour":[0,1,10,11], "panais":[0,1,10,11,2], "céleri":[9,10,11,0,1,2,3,4], "céleri-rave":[9,10,11,0,1,2,3],
    "épinard":[2,3,4,5,9,10,11], "épinards":[2,3,4,5,9,10,11], "betterave":[5,6,7,8,9,10,11], "betteraves":[5,6,7,8,9,10,11],
    "chou-fleur":[2,3,4,5,9,10,11], "chou blanc":[9,10,11,0,1,2], "chou rouge":[9,10,11,0,1,2],
    "salade":[4,5,6,7,8,9,10], "laitue":[4,5,6,7,8,9], "maïs":[6,7,8,9], "pomme":[7,8,9,10,11,0,1,2,3,4], "pommes":[7,8,9,10,11,0,1,2,3,4],
    "poire":[8,9,10,11,0,1,2,3], "poires":[8,9,10,11,0,1,2,3], "citron":[11,0,1,2,3], "citrons":[11,0,1,2,3],
    "champignon":[5,6,7,8,9,10,11], "champignons":[5,6,7,8,9,10,11], "carotte":"toute", "carottes":"toute", "pomme de terre":"toute", "pommes de terre":"toute"
  };
  if (!(n in SAISON_PRODUITS)) return true; // produit non périssable / toute l'année par défaut
  const cal = SAISON_PRODUITS[n];
  if (cal === "toute") return true;
  return cal.includes(mois);
}

// Une recette est de saison si TOUS ses fruits/légumes frais sont de saison au mois donné
function recetteDeSaison(recette, mois) {
  return recette.ingredients.every(i => produitDeSaison(i, mois));
}

// Classification nutritionnelle simplifiée
const CATEGORIES = {
  proteines: ["poulet","dinde","bœuf","agneau","poisson","cabillaud","saumon","thon","crevette","œuf","fromage","yaourt","tofu","lentilles","pois chiches","haricots secs","steak","viande hachée","colin","merlan","sardine","escalope","côtelette","merguez"],
  feculents: ["pâtes","riz","semoule","pommes de terre","patate douce","pain","boulgour","quinoa","pomme de terre","couscous","polenta","tortilla","gnocchis","farfalle","spaghetti","macédoine","orge","pois cassés","châtaigne"],
  legumes: ["courgettes","carottes","tomates","poireau","endive","épinard","brocoli","chou-fleur","chou","navet","courge","citrouille","aubergine","poivron","haricot vert","concombre","salade","laitue","fenouil","betterave","radis","petits pois","champignon","céleri","potimarron","poireaux","aubergines","champignons"],
  fruits: ["pomme","poire","orange","clémentine","banane","kiwi","fraise","abricot","pêche","melon","pastèque","cerise","prune","figue","raisin","citron","mangue","ananas","framboise","myrtille","fruit"],
  matieres_grasses: ["huile","olive","beurre","crème"],
  assaisonnement: ["sel","poivre","herbes","épices","ail","oignon","échalote","vinaigre","cumin","paprika","safran","coriandre","cannelle"]
};

function categoriser(nom) {
  const n = nom.toLowerCase();
  for (const [cat, mots] of Object.entries(CATEGORIES)) {
    if (mots.some(m => n.includes(m))) return cat;
  }
  return "autre";
}
