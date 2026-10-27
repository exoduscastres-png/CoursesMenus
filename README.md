# MenuSaison 🥗

Application web autonome qui propose des menus équilibrés et de saison à partir de vos courses.

## Utilisation

Ouvrir simplement `index.html` dans un navigateur (aucun serveur ni installation requis).

## Fonctionnalités

- **Mes courses** : saisie manuelle + photo/scan du ticket de caisse (OCR via Tesseract.js, reconnaissance des produits en français)
- **Produits de saison** : liste pré-établie des fruits et légumes du mois courant (cliquer pour ajouter aux courses)
- **Mon profil** : cuisine traditionnelle (française, algérienne, marocaine, mixte), régime flexitarien ou végétarien, contre-indications (gluten, lactose, arachide, fruits à coque, hypertension, diabète)
- **Mes menus** : génération de menus sur 1 à 14 jours — chaque jour combine protéines + féculents + légumes + dessert, priorise les recettes de saison et les ingrédients déjà achetés, et liste les ingrédients manquants à acheter
- **Recettes du web** : enrichissement optionnel via l'API gratuite TheMealDB (avec lien vers la recette en ligne)
- **Widget** : `widget.html` — version compacte intégrable dans n'importe quelle page via `<iframe src="widget.html">`, partageant les mêmes courses et profil (localStorage)

## Fichiers

- `index.html` — application principale
- `widget.html` — widget compact intégrable
- `css/style.css`, `css/widget.css` — styles
- `js/app.js` — logique (OCR, filtrage profil, scoring saison/courses, génération de menus)
- `js/data/season.js` — fruits & légumes par mois + classification nutritionnelle
- `js/data/recipes.js` — base de recettes locale (extensible)

## Notes

- Les courses et le profil sont stockés localement (localStorage) — aucune donnée envoyée.
- L'OCR du ticket nécessite une connexion Internet (bibliothèque Tesseract.js chargée via CDN) ; la saisie manuelle et la liste de saison fonctionnent hors ligne.
