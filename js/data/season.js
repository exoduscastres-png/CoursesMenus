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
