# Collecte des recettes Lidl sur un NAS UGREEN (UGOS Pro)

Objectif : exécuter `scraping/scrape_lidl.py` sur votre NAS pour constituer la base des ~4 700 recettes Lidl (`js/data/lidl-db.json`), sans occuper votre ordinateur.

**Deux méthodes : SSH (simple) ou Docker (propre).** Dans les deux cas, la collecte complète dure 2 à 3 heures et **est reprenable** : en cas d'interruption, relancez la commande, elle reprend là où elle s'était arrêtée.

---

## Préparation commune (5 minutes)

1. **Récupérez le dépôt sur le NAS.** Deux façons :
   - Téléchargez le ZIP sur votre ordinateur : https://github.com/exoduscastres-png/CoursesMenus → bouton **Code → Download ZIP**, puis dézippez-le dans un dossier partagé du NAS (ex. via l'Explorateur de fichiers de UGOS) ;
   - Ou, si votre NAS a accès à Internet : `git clone https://github.com/exoduscastres-png/CoursesMenus.git`
2. Repérez le **chemin du dossier sur le NAS**, par exemple : `/volume1/MesDocuments/CoursesMenus` (le chemin exact dépend de votre configuration — visible dans UGOS, application « Fichiers », clic droit sur le dossier → Informations).

---

## Méthode A — SSH (recommandée si vous n'utilisez pas Docker)

### A1. Activer SSH sur le NAS
1. UGOS Pro → **Panneau de configuration → Terminal & SNMP** (ou « Terminal ») ;
2. Activez le **service SSH** (port 22 par défaut) ;
3. Notez l'adresse IP du NAS (Panneau de configuration → Réseau, ex. `192.168.1.50`).

### A2. Se connecter en SSH
Sur votre ordinateur (Windows : PowerShell ; Mac/Linux : Terminal) :
```bash
ssh VotreUtilisateur@192.168.1.50
```
(remplacez par votre nom d'utilisateur UGOS et l'IP du NAS ; le mot de passe est celui de votre compte NAS)

### A3. Vérifier Python 3
```bash
python3 --version
```
- Si une version s'affiche (3.8 ou plus) : parfait, continuez ;
- Si « commande introuvable » : installez-le via le **Centre d'applications UGOS** (cherchez « Python ») ou passez à la méthode Docker.

### A4. Lancer la collecte
```bash
cd /volume1/MesDocuments/CoursesMenus        # adaptez le chemin

# Test rapide sur 50 recettes (~2 minutes) :
python3 scraping/scrape_lidl.py --limite 50

# Collecte complète (~2-3 heures) :
python3 scraping/scrape_lidl.py
```

### A5. Laisser tourner sans garder la fenêtre ouverte
Pour que la collecte survive à la fermeture de votre session SSH :
```bash
nohup python3 scraping/scrape_lidl.py > collecte.log 2>&1 &
```
- Suivre la progression : `tail -f collecte.log` (Ctrl+C pour quitter l'affichage, la collecte continue) ;
- Vérifier que c'est terminé : le log se termine par « ✅ Terminé : NNNN recettes ».

---

## Méthode B — Docker (si SSH/Python indisponible)

1. UGOS Pro → **Centre d'applications** → installez **Docker** (docker-compose) ;
2. Ouvrez Docker → **Image** → **Rechercher** → `python` → téléchargez le tag `3-alpine` (petite image) ;
3. Ouvrez un terminal sur votre ordinateur et connectez-vous au NAS (SSH, comme en A2), puis :

```bash
cd /volume1/MesDocuments/CoursesMenus       # adaptez le chemin

docker run --rm -it \
  -v "$PWD":/app \
  python:3-alpine \
  sh -c "cd /app && python3 scraping/scrape_lidl.py"
```

Variante « arrière-plan » (sans rester connecté) :
```bash
docker run --rm -d --name collecte-lidl \
  -v "$PWD":/app \
  python:3-alpine \
  sh -c "cd /app && python3 scraping/scrape_lidl.py"

docker logs -f collecte-lidl     # suivre la progression
```

> Le script écrit `js/data/lidl-db.json` **dans le dossier partagé du NAS** : le fichier reste accessible depuis votre ordinateur via le partage réseau, même après la collecte.

---

## Après la collecte : activer la base dans l'application

Le fichier produit est : `js/data/lidl-db.json` (quelques Mo).

**Option 1 — Dépôt en ligne (recommandé, profite à tous vos appareils) :**
1. Sur votre ordinateur, récupérez `js/data/lidl-db.json` depuis le partage du NAS ;
2. Sur https://github.com/exoduscastres-png/CoursesMenus :
   - Ouvrez le dossier `js/data/` → **Add file → Upload files** ;
   - Glissez `lidl-db.json` (il remplace la version de démarrage) ;
   - Cliquez **Commit changes**.
3. 1-2 minutes plus tard, rechargez l'application : les menus puisent désormais dans des milliers de recettes Lidl.

**Option 2 — M'envoyer le fichier** : transmettez-moi `lidl-db.json` dans cette conversation et je le publie pour vous.

**Option 3 — Usage local uniquement** : ouvrez `index.html` depuis le dossier du NAS/d de votre ordinateur (pas via GitHub Pages) — le fichier local est utilisé directement.

---

## Vérification et dépannage

| Symptôme | Solution |
|---|---|
| « Sitemap inaccessible » | Le service de lecture (r.jina.ai) est momentanément saturé : attendez 5 min et relancez — la reprise est automatique |
| Beaucoup d'« échecs » dans le log | Normal à ~5-10 % (recettes supprimées, formats atypiques) ; relancez une fois, les échecs seront retentés |
| Collecte interrompue (NAS redémarré, coupure) | Relancez simplement la même commande : les recettes déjà collectées sont conservées |
| Vérifier le contenu | Ouvrez `js/data/lidl-db.json` : cherchez `"nom"` — chaque recette doit avoir nom, ingredients, lien |
| L'application ne voit pas la nouvelle base | Rechargez avec Ctrl+F5 (cache navigateur) et vérifiez que le fichier est bien dans `js/data/` du dépôt en ligne |

## Bon à savoir

- **Légalité** : le script lit des pages publiques du site Lidl Recettes, à un rythme poli (1 requête toutes les 1,5 s), pour un usage strictement personnel. Ne rediffusez pas la base de données publiquement ;
- **Mise à jour** : relancez le script de temps en temps (ex. chaque mois) pour récupérer les nouvelles recettes — seules les recettes non déjà collectées sont téléchargées ;
- **Planification possible** : sur le NAS, vous pouvez planifier la collecte mensuelle via le planificateur de tâches UGOS (tâche planifiée → commande : `python3 /volume1/MesDocuments/CoursesMenus/scraping/scrape_lidl.py`).
