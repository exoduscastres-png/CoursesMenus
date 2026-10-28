// Base locale de recettes (extrait extensible)
// cuisine: francaise | algerienne | marocaine | mixte
// regime: flexitarien (accepte viande), vegetarien
// categorie: proteines | feculents | legumes (ingrédient principal)
// saisons: mois (index 0-11) ou "toute" 
// ci: contre-indications respectées implicitement via "eviter" (ingrédients interdits présents dans la recette)
const RECETTES = [
  { nom:"Tartines beurre-confiture", cuisine:"francaise", regime:"vegetarien", categorie:"feculents", type:"petitdej", mois:"toute", ingredients:["pain","beurre","confiture"], eviter:["gluten","lactose"] },
  { nom:"Tartines de confiture", cuisine:"francaise", regime:"vegetarien", categorie:"feculents", type:"petitdej", mois:"toute", ingredients:["pain","confiture"], eviter:["gluten"] },
  { nom:"Yaourt, céréales et fruits de saison", cuisine:"mixte", regime:"vegetarien", categorie:"feculents", type:"petitdej", mois:"toute", ingredients:["yaourt","céréales","fruit","miel"], eviter:["lactose"] },
  { nom:"Porridge aux fruits de saison", cuisine:"mixte", regime:"vegetarien", categorie:"feculents", type:"petitdej", mois:"toute", ingredients:["avoine","lait","fruit"], eviter:["lactose"] },
  { nom:"Œufs sur le plat et tartines", cuisine:"francaise", regime:"vegetarien", categorie:"proteines", type:"petitdej", mois:"toute", ingredients:["œuf","pain","beurre"], eviter:["gluten","lactose"] },
  { nom:"Fromage frais, miel et pain", cuisine:"mixte", regime:"vegetarien", categorie:"proteines", type:"petitdej", mois:"toute", ingredients:["fromage","miel","pain"], eviter:["gluten","lactose"] },
  { nom:"Pain, huile d'olive et fruits de saison", cuisine:"algerienne", regime:"vegetarien", categorie:"feculents", type:"petitdej", mois:"toute", ingredients:["pain","huile d'olive","fruit"], eviter:["gluten"] },
  { nom:"Chakchouka (œufs à la tomate)", cuisine:"algerienne", regime:"vegetarien", categorie:"proteines", type:"petitdej", mois:[5,6,7,8,9,10], ingredients:["œuf","tomates","poivron","oignon","huile d'olive"], eviter:[] },
  { nom:"Kesra et dattes au miel", cuisine:"algerienne", regime:"vegetarien", categorie:"feculents", type:"petitdej", mois:"toute", ingredients:["semoule","miel","datte"], eviter:["gluten"] },
  { nom:"Baghrir (crêpes mille trous)", cuisine:"algerienne", regime:"vegetarien", categorie:"feculents", type:"petitdej", mois:"toute", ingredients:["semoule","farine","levure","miel","beurre"], eviter:["gluten","lactose"] },
  { nom:"Msemen au miel", cuisine:"marocaine", regime:"vegetarien", categorie:"feculents", type:"petitdej", mois:"toute", ingredients:["farine","semoule","miel","beurre"], eviter:["gluten","lactose"] },
  { nom:"Bissara (soupe de pois cassés)", cuisine:"marocaine", regime:"vegetarien", categorie:"feculents", type:"petitdej", mois:[0,1,2,9,10,11], ingredients:["pois cassés","ail","huile d'olive","cumin"], eviter:[] },
  { nom:"Ratatouille provençale", cuisine:"francaise", regime:"vegetarien", categorie:"legumes", type:"plat", mois:[5,6,7,8,9], ingredients:["courgettes","aubergine","poivron","tomates","oignon","ail","huile d'olive"], eviter:[] },
  { nom:"Potage de légumes d'hiver", cuisine:"francaise", regime:"vegetarien", categorie:"legumes", type:"entree", mois:[0,1,10,11], ingredients:["poireau","carottes","navet","pommes de terre","oignon"], eviter:[] },
  { nom:"Gratin de pommes de terre", cuisine:"francaise", regime:"vegetarien", categorie:"feculents", type:"plat", mois:"toute", ingredients:["pommes de terre","crème","fromage","ail"], eviter:["lactose"] },
  { nom:"Poulet rôti aux herbes", cuisine:"francaise", regime:"flexitarien", categorie:"proteines", type:"plat", mois:"toute", ingredients:["poulet","pommes de terre","carottes","herbes","ail","oignon"], eviter:[] },
  { nom:"Salade de lentilles", cuisine:"francaise", regime:"vegetarien", categorie:"proteines", type:"plat", mois:"toute", ingredients:["lentilles","carottes","oignon","vinaigre","huile"], eviter:[] },
  { nom:"Poisson du marché au four", cuisine:"francaise", regime:"flexitarien", categorie:"proteines", type:"plat", mois:"toute", ingredients:["poisson","pommes de terre","courgettes","tomates","citron","ail"], eviter:[] },
  { nom:"Couscous aux légumes", cuisine:"algerienne", regime:"vegetarien", categorie:"feculents", type:"plat", mois:"toute", ingredients:["semoule","courge","carottes","navet","pois chiches","oignon","épices"], eviter:["gluten"] },
  { nom:"Chorba algérienne", cuisine:"algerienne", regime:"flexitarien", categorie:"proteines", type:"plat", mois:[0,1,9,10,11], ingredients:["agneau","pois chiches","tomates","oignon","vermicelle","épices","coriandre"], eviter:["gluten"] },
  { nom:"Tajine de poulet aux olives", cuisine:"marocaine", regime:"flexitarien", categorie:"proteines", type:"plat", mois:"toute", ingredients:["poulet","olive","citron","oignon","épices"], eviter:[] },
  { nom:"Tajine de légumes d'automne", cuisine:"marocaine", regime:"vegetarien", categorie:"legumes", type:"plat", mois:[8,9,10,11], ingredients:["citrouille","carottes","pois chiches","oignon","tomates","épices"], eviter:[] },
  { nom:"Loubia (haricots blancs)", cuisine:"algerienne", regime:"vegetarien", categorie:"proteines", type:"plat", mois:"toute", ingredients:["haricots secs","tomates","oignon","ail","épices"], eviter:[] },
  { nom:"Salade méchouia", cuisine:"algerienne", regime:"vegetarien", categorie:"legumes", type:"entree", mois:"toute", ingredients:["poivron","tomates","oignon","ail","huile d'olive"], eviter:[] },
  { nom:"Riz aux légumes du printemps", cuisine:"mixte", regime:"vegetarien", categorie:"feculents", type:"plat", mois:[2,3,4,5], ingredients:["riz","petits pois","carottes","fève","oignon"], eviter:[] },
  { nom:"Omelette aux champignons", cuisine:"mixte", regime:"vegetarien", categorie:"proteines", type:"plat", mois:"toute", ingredients:["œuf","champignon","beurre","persil"], eviter:["lactose"] },
  { nom:"Pâtes aux légumes de saison", cuisine:"mixte", regime:"vegetarien", categorie:"feculents", type:"plat", mois:"toute", ingredients:["pâtes","courgettes","tomates","ail","huile d'olive"], eviter:["gluten"] },
  { nom:"Bœuf aux carottes", cuisine:"francaise", regime:"flexitarien", categorie:"proteines", type:"plat", mois:"toute", ingredients:["bœuf","carottes","oignon","pommes de terre"], eviter:[] },
  { nom:"Velouté de courge", cuisine:"mixte", regime:"vegetarien", categorie:"legumes", type:"entree", mois:[8,9,10,11], ingredients:["courge","oignon","crème"], eviter:["lactose"] },
  { nom:"Fruits de saison", cuisine:"mixte", regime:"vegetarien", categorie:"fruits", type:"dessert", mois:"toute", ingredients:["fruit"], eviter:[] },
  { nom:"Salade de fruits frais", cuisine:"mixte", regime:"vegetarien", categorie:"fruits", type:"dessert", mois:"toute", ingredients:["pomme","orange","banane"], eviter:[] },
  { nom:"Tarte aux pommes", cuisine:"francaise", regime:"vegetarien", categorie:"fruits", type:"dessert", mois:[0,8,9,10,11,1,2,3,4], ingredients:["pomme","farine","beurre","sucre"], eviter:["gluten","lactose"] }
];
