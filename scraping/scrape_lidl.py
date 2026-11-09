#!/usr/bin/env python3
"""
Collecte des recettes de https://recettes.lidl.fr vers js/data/lidl-db.json

Usage :
    python3 scrape_lidl.py                # collecte complète (reprenable)
    python3 scrape_lidl.py --limite 100   # test sur 100 recettes

Prérequis : Python 3.8+ (aucune bibliothèque exterre requise, urllib inclus).
Durée : ~4700 recettes à ~1,5 s d'intervalle ≈ 2 à 3 heures. Le script est
reprenable : relancez-le, il reprend là où il s'était arrêté (fichier lidl-db.json).

Le résultat remplace js/data/lidl-db.json, chargé automatiquement par l'application.
"""

import json
import re
import sys
import time
import urllib.request
from pathlib import Path

SITEMAP = "https://recettes.lidl.fr/sitemap.xml"
LECTEUR = "https://r.jina.ai/"          # convertit les pages en markdown lisible
SORTIE = Path(__file__).resolve().parent.parent / "js" / "data" / "lidl-db.json"
PAUSE = 1.5                             # secondes entre chaque recette (poli)

SAISON_VERS_MOIS = {
    "hiver": [11, 0, 1], "printemps": [2, 3, 4],
    "été": [5, 6, 7], "ete": [5, 6, 7], "automne": [8, 9, 10],
    "noël": [11, 0], "noel": [11, 0],
    "printemps/été": [2, 3, 4, 5, 6, 7],
}

def telecharger(url, essais=3):
    for i in range(essais):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (recettes-menus personnel)"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode("utf-8", errors="replace")
        except Exception as e:
            if i == essais - 1:
                print(f"  ! échec: {e}")
                return None
            time.sleep(5 * (i + 1))
    return None

def nettoyer_ingredient(ligne):
    s = re.sub(r"^\s*\d+([.,]\d+)?\s*", "", ligne)
    s = re.sub(r"^(g|kg|cl|ml|l)\b\s*", "", s, flags=re.I)
    s = re.sub(r"^c\.?\s*à\s*c\.?\s*", "", s, flags=re.I)
    s = re.sub(r"^c\.?\s*à\s*s\.?\s*", "", s, flags=re.I)
    return re.sub(r"\s+", " ", s).strip()

def extraire_recette(url, texte):
    m = re.search(r"^# (.+)$", texte, re.M)
    if not m:
        return None
    nom = m.group(1).strip()
    section = texte.split("## Ingrédients")[1] if "## Ingrédients" in texte else ""
    fin = section.split("## Préparation")[0] if "## Préparation" in section else section.split("## Mots clés")[0]
    ingredients = [nettoyer_ingredient(m2.group(1)) for m2 in re.finditer(r"-\s*\[x\]\s+(.+)$", fin, re.M)]
    ingredients = [i for i in ingredients if len(i) > 1]
    if not ingredients:
        return None
    mc = [m3.group(1).lower() for m3 in re.finditer(r"\[([^\]]+)\]\(https://recettes\.lidl\.fr/selection", texte)]
    rtype = "plat"
    if any("dessert" in m for m in mc):
        rtype = "dessert"
    elif any(("entrée" in m) or ("entree" in m) or ("apéritif" in m) or ("aperitif" in m) for m in mc):
        rtype = "entree"
    saisons = [SAISON_VERS_MOIS[m] for m in mc if m in SAISON_VERS_MOIS]
    mois = sorted(set(x for s in saisons for x in s)) if saisons else "toute"
    chair = re.compile(r"(poulet|bœuf|boeuf|veau|agneau|porc|dinde|jambon|lardons|bacon|steak|côtelette|cotelette|saucisse|merguez|poisson|cabillaud|saumon|thon|crevette|maquereau|colin|gigot|cerf|canard|magret|chapon|pintade|gambas)", re.I)
    regime = "flexitarien" if any(chair.search(i) for i in ingredients) else "vegetarien"
    return {
        "nom": nom, "cuisine": "mixte", "regime": regime,
        "categorie": "proteines" if regime == "flexitarien" else "legumes",
        "type": rtype, "mois": mois, "lidl": True, "lien": url,
        "ingredients": ingredients, "eviter": []
    }

def main():
    limite = None
    if "--limite" in sys.argv:
        limite = int(sys.argv[sys.argv.index("--limite") + 1])

    print("1) Lecture du sitemap Lidl Recettes…")
    sm = telecharger(LECTEUR + SITEMAP)
    if not sm:
        sys.exit("Sitemap inaccessible.")
    urls = sorted(set(re.findall(r"https://recettes\.lidl\.fr/recettes/[a-z0-9\-]+", sm)))
    print(f"   {len(urls)} recettes trouvées.")

    base = []
    connus = set()
    if SORTIE.exists():
        base = json.loads(SORTIE.read_text(encoding="utf-8"))
        connus = {r["lien"] for r in base}
        print(f"2) Reprise : {len(base)} recettes déjà collectées.")

    a_faire = [u for u in urls if u not in connus]
    if limite:
        a_faire = a_faire[:limite]
    print(f"3) Collecte de {len(a_faire)} recettes (pause {PAUSE}s entre chaque)…")

    ok = echecs = 0
    for n, url in enumerate(a_faire, 1):
        texte = telecharger(LECTEUR + url)
        rec = extraire_recette(url, texte) if texte else None
        if rec:
            base.append(rec)
            ok += 1
        else:
            echecs += 1
        if n % 10 == 0 or n == len(a_faire):
            print(f"   {n}/{len(a_faire)} — {ok} ok, {echecs} échecs")
            SORTIE.write_text(json.dumps(base, ensure_ascii=False, indent=2), encoding="utf-8")
        time.sleep(PAUSE)

    SORTIE.write_text(json.dumps(base, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ Terminé : {len(base)} recettes dans {SORTIE}")
    print("   Placez ce fichier dans le dossier js/data/ de l'application (déjà fait si non déplacé).")

if __name__ == "__main__":
    main()
