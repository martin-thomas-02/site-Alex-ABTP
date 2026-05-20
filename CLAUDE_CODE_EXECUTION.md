# CLAUDE_CODE_EXECUTION — Guide de mise en ligne ABTP

**Objectif** : passer le site `index.html` de maquette locale à un site en ligne sur `abtp77.fr`, conforme LCEN/RGPD, performant (Lighthouse mobile >= 90) et optimisé pour la conversion (formulaire qui livre, tracking, preuves de confiance).

**Repo** : `C:\Alex-ABTP\site-Alex-ABTP\` (Claude Code y est en `cwd`). Tous les chemins dans ce guide sont relatifs à cette racine.

**Pré-requis** : Node.js >= 18, terminal PowerShell ou bash, accès au repo, compte GitHub, futur compte Cloudflare Pages.

**5 infos CLIENT bloquantes** (à obtenir avant go-live ; partout dans le code on utilise des marqueurs `<!-- TODO_CLIENT: <clef> -->` à `grep` puis remplacer en toute fin) :
1. `CAPITAL` — capital social SARL ABTP (ex. `1 000`)
2. `TVA` — `TVA non applicable, art. 293 B du CGI` OU n° TVA intracom `FRxx940605652`
3. `DECENNALE` — compagnie + n° police d'assurance décennale
4. `MEDIATEUR` — nom + adresse + URL du médiateur de la consommation
5. `HEBERGEUR` — coordonnées de l'hébergeur (Cloudflare Pages par défaut)

**Convention** : chaque patch précise fichier + lignes + diff. Les numéros de ligne référencent `index.html` ACTUEL (1588 lignes, non modifié). Garder cohérence avec `PLAN_ACTION_MASTER.md`.

---

## Section 0 — Setup initial

### 0.1 — Vérifier état git et brancher
**Objectif** : isoler le travail dans une branche dédiée.
```bash
# cwd: site-Alex-ABTP/
git status
git checkout -b feat/go-live-sprint-1
```
**Vérification** : `git branch --show-current` retourne `feat/go-live-sprint-1`.

### 0.2 — Initialiser npm
**Objectif** : poser `package.json` pour piloter Tailwind.
```bash
# cwd: site-Alex-ABTP/
npm init -y
```
**Vérification** : `package.json` existe à la racine.

### 0.3 — Installer Tailwind en local
**Objectif** : remplacer le CDN par un build statique.
```bash
# cwd: site-Alex-ABTP/
npm install -D tailwindcss@latest
npx tailwindcss init
```
**Vérification** : `tailwind.config.js` créé, `node_modules/tailwindcss` présent.

### 0.4 — Créer la structure de dossiers
**Objectif** : préparer les emplacements pour assets et build.
```bash
# cwd: site-Alex-ABTP/
mkdir -p src/styles dist assets/fonts assets/photos
```
**Vérification** : les 4 dossiers existent.

### 0.5 — Créer `.gitignore`
**Objectif** : exclure node_modules et fichiers d'OS.
```bash
# cwd: site-Alex-ABTP/
cat > .gitignore << 'EOF'
node_modules/
.DS_Store
Thumbs.db
*.log
.vscode/
.idea/
EOF
```
**Vérification** : `git status` n'affiche pas `node_modules/`.

### 0.6 — Créer le CSS source Tailwind
**Objectif** : point d'entrée du build.
**Fichier** : créer `src/styles/tailwind.css` avec :
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
**Vérification** : fichier 3 lignes présent.

### 0.7 — Ajouter scripts npm
**Objectif** : raccourcis `npm run build` / `npm run dev`.
**Fichier** : `package.json`, dans la clé `scripts`, ajouter :
```json
"build": "tailwindcss -i ./src/styles/tailwind.css -o ./dist/tailwind.css --minify",
"dev":   "tailwindcss -i ./src/styles/tailwind.css -o ./dist/tailwind.css --watch"
```
**Vérification** : `npm run build` produit `dist/tailwind.css`.

---

## Section 1 — P0 (Sprint 1, go-live)

Ordre d'exécution conçu pour minimiser les conflits : on prépare les assets (fonts, photos) avant de toucher au HTML, on règle les imports légers (canonical/meta) avant les patchs lourds, et on garde le formulaire pour la fin (dépend d'un compte Formspree).

### 1.1 — Config Tailwind (P0-4)
**Fichiers** : `tailwind.config.js`
**Action** : déclarer les couleurs ABTP et les familles de polices pour que la purge garde tout ce qui sert.
**Code** :
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./*.html"],
  theme: {
    extend: {
      colors: {
        abtp: {
          yellow:     '#FFC72C',
          yellowSoft: '#FFE066',
          blue:       '#3B82C4',
          charcoal:   '#1A1A1A',
          steel:      '#4A4A4A',
          light:      '#F5F5F5',
          whatsapp:   '#25D366',
        },
      },
      fontFamily: {
        display: ['Oswald', 'Arial Narrow', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```
**Commandes** : `npm run build`
**Vérification** : `dist/tailwind.css` <= 20 ko.
**Source détaillée** : `AUDIT_02_DESIGN_UX_PERF.md` Patch P0.1.

### 1.2 — Auto-héberger les polices (P0-3)
**Fichiers** : `assets/fonts/` + futur bloc `<style>` dans `index.html`
**Action** : télécharger Oswald 500/700 et Inter 400/600/700 en woff2 latin via gwfh.mranftl.com, placer dans `assets/fonts/`. Cela évite tout appel à fonts.googleapis.com et supprime le besoin de bannière cookies pour ce motif.
**Commandes** :
```bash
# cwd: site-Alex-ABTP/
# Télécharger manuellement les 5 woff2 depuis https://gwfh.mranftl.com (Oswald 500/700, Inter 400/600/700, latin uniquement)
# Puis vérifier :
ls assets/fonts/
```
**Vérification** : 5 fichiers `*.woff2` dans `assets/fonts/`.
**Source détaillée** : `AUDIT_01_LEGAL.md` § 3.4 Option A + `AUDIT_02_DESIGN_UX_PERF.md` Patch #7.

### 1.3 — Conversion et renommage des photos (P0-5)
**Fichiers** : `photos/*.jpg` -> `assets/photos/*.webp` + `.avif`
**Action** : renommer en kebab-case ASCII puis générer 3 tailles WebP (640/1024/1600) + 1 AVIF 1024. Critique avant de patcher les `<img>` (sinon double passage).
**Commandes** :
```bash
# cwd: site-Alex-ABTP/photos
# Renommage
mv "photo entête.jpg"        ../assets/photos/hero-chantier.jpg
mv "chemin avant.jpg"        ../assets/photos/chemin-avant.jpg
mv "chemin après.jpg"        ../assets/photos/chemin-apres.jpg
mv "terrasse avant.jpg"      ../assets/photos/terrasse-avant.jpg
mv "terrasse après.jpg"      ../assets/photos/terrasse-apres.jpg
mv "devant maison avant.jpg" ../assets/photos/facade-avant.jpg
mv "devant maison après.jpg" ../assets/photos/facade-apres.jpg

# cwd: site-Alex-ABTP/assets/photos
for f in *.jpg; do
  name="${f%.jpg}"
  cwebp -q 78 -resize 640 0  "$f" -o "${name}-640.webp"
  cwebp -q 80 -resize 1024 0 "$f" -o "${name}-1024.webp"
  cwebp -q 82 -resize 1600 0 "$f" -o "${name}-1600.webp"
  avifenc -q 55 -s 6 "$f" "${name}.avif"
done
```
**Vérification** : 7 photos x (3 webp + 1 avif) = 28 fichiers générés, poids total <= 1 Mo (vs 3,1 Mo JPEG).
**Source détaillée** : `AUDIT_02_DESIGN_UX_PERF.md` Patch P0.2 (tableau de poids attendus).

### 1.4 — Patch `<head>` : remplacer CDN, ajouter canonical/meta/preload (P0-4, P0-10, P0-3)
**Fichiers** : `index.html` lignes 22-53
**Action** : retirer les `<link>` Google Fonts (l. 24-27), retirer `<script src="cdn.tailwindcss.com">` + `tailwind.config = {...}` (l. 30-53), insérer `<link href="dist/tailwind.css">`, le bloc `@font-face` (fonts auto-hébergées), le canonical + meta robots/geo/author, et le preload de l'image hero.
**Code / Diff** :
```html
<!-- À INSÉRER en remplacement des lignes 24-53 (preconnect fonts + CDN Tailwind + config) -->

<!-- Canonical + meta SEO -->
<link rel="canonical" href="https://abtp77.fr/" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="author" content="Alexandre Bossee - ABTP SARL" />
<meta name="geo.region" content="FR-77" />
<meta name="geo.placename" content="Melun" />
<meta name="geo.position" content="48.5409;2.6601" />
<meta name="ICBM" content="48.5409, 2.6601" />

<!-- Tailwind compilé localement -->
<link rel="stylesheet" href="dist/tailwind.css" />

<!-- Polices auto-hébergées (RGPD safe) -->
<style>
  @font-face { font-family:'Inter';  font-style:normal; font-weight:400; font-display:swap;
    src:url('assets/fonts/inter-v18-latin-regular.woff2') format('woff2'); }
  @font-face { font-family:'Inter';  font-style:normal; font-weight:600; font-display:swap;
    src:url('assets/fonts/inter-v18-latin-600.woff2') format('woff2'); }
  @font-face { font-family:'Inter';  font-style:normal; font-weight:700; font-display:swap;
    src:url('assets/fonts/inter-v18-latin-700.woff2') format('woff2'); }
  @font-face { font-family:'Oswald'; font-style:normal; font-weight:500; font-display:swap;
    src:url('assets/fonts/oswald-v53-latin-500.woff2') format('woff2'); }
  @font-face { font-family:'Oswald'; font-style:normal; font-weight:700; font-display:swap;
    src:url('assets/fonts/oswald-v53-latin-700.woff2') format('woff2'); }
</style>

<!-- Preload hero pour LCP -->
<link rel="preload" as="image"
      href="assets/photos/hero-chantier-1024.webp"
      imagesrcset="assets/photos/hero-chantier-640.webp 640w,
                   assets/photos/hero-chantier-1024.webp 1024w,
                   assets/photos/hero-chantier-1600.webp 1600w"
      imagesizes="(max-width: 1024px) 100vw, 42vw"
      type="image/webp" fetchpriority="high" />
```
**Vérification** : ouvrir `index.html` localement, aucune requête vers `fonts.googleapis.com` ni `cdn.tailwindcss.com` dans DevTools Network.
**Source détaillée** : `AUDIT_01_LEGAL.md` § 3.4, `AUDIT_02_DESIGN_UX_PERF.md` Patch P0.1 + #5, `AUDIT_04_SEO.md` § 6.1.

### 1.5 — Schema.org enrichi (P0-11, P0-13)
**Fichiers** : `index.html` lignes 207-250 (bloc JSON-LD existant) + racine `og.jpg`
**Action** : remplacer le `LocalBusiness` simple par le `@graph` complet (GeneralContractor + LocalBusiness + 6 Services dans `hasOfferCatalog` + `sameAs` + `identifier` SIREN + `serviceArea` GeoCircle + WebSite + WebPage). Vérifier que `og.jpg` existe à la racine (1200x630, < 200 ko) ; sinon en générer un à partir de `assets/photos/hero-chantier-1600.webp`.
**Code** : voir bloc complet `AUDIT_04_SEO.md` § 4 (lignes 254-483) - le coller tel quel en remplacement des l. 207-250.
**Commandes** :
```bash
# cwd: site-Alex-ABTP/
ls og.jpg || echo "MANQUANT - generer depuis assets/photos/hero-chantier-1600.webp"
# Si manquant :
# cwebp inverse, ou redimensionner avec ImageMagick :
# magick assets/photos/hero-chantier-1600.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 82 og.jpg
```
**Vérification** : passer le HTML dans https://search.google.com/test/rich-results (3 schemas valides : GeneralContractor, WebSite, WebPage).
**Source détaillée** : `AUDIT_04_SEO.md` § 4 (bloc JSON-LD complet) + PLAN_ACTION P0-13.

### 1.6 — `robots.txt` et `sitemap.xml` (P0-10)
**Fichiers** : nouveaux fichiers à la racine
**Action** : créer les 2 fichiers minimaux. Sitemap ne contient pour l'instant que la home ; sera enrichi en Sprint 3 (pages communes).
**Code** :
```
# robots.txt
User-agent: *
Allow: /
Disallow: /.git/

Sitemap: https://abtp77.fr/sitemap.xml
```
```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://abtp77.fr/</loc>
    <lastmod>2026-05-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```
**Vérification** : ouvrir les 2 URLs après déploiement, doivent renvoyer du texte/xml valide.
**Source détaillée** : `AUDIT_04_SEO.md` § 5.5, § 5.6.

### 1.7 — Patch `<picture>` / srcset partout (P0-5 suite)
**Fichiers** : `index.html` lignes 366-381 (hero), 626-707 (3 cartes avant/apres)
**Action** : remplacer chaque `<img src="photos/...">` par un bloc `<picture>` AVIF + WebP responsive avec `width`/`height`/`decoding="async"`. Le hero reste `loading="eager" fetchpriority="high"`, les 6 photos avant/apres passent en `loading="lazy"`.
**Code** : voir blocs `AUDIT_02_DESIGN_UX_PERF.md` Patch P0.2 (hero ligne 280-315 du doc audit) et bloc Avant/Apres (ligne 319-344 du doc audit). Adapter le `src=` vers `assets/photos/` (au lieu de `photos/`).
**Vérification** : DevTools > Network, recharger en mode mobile, taille totale page <= 1 Mo, LCP <= 2 s.
**Source détaillée** : `AUDIT_02_DESIGN_UX_PERF.md` Patch P0.2 + P1.9.

### 1.8 — Hero mobile reorganisé (P0-6)
**Fichiers** : `index.html` lignes 311-388
**Action** : déplacer le H1 en première position (avec mots-clés SEO "Terrassement Melun"), retirer le bandeau "DISPONIBLE CETTE SEMAINE" du fold, le reformuler en "RAPPEL SOUS 1H OUVRE - DEVIS GRATUIT 48H" et le repositionner sous le CTA. Le H1 cible le choix B de l'audit SEO (mots-cles directement dans le titre).
**Code** : voir bloc complet `AUDIT_02_DESIGN_UX_PERF.md` Patch P0.3 (lignes 352-384 du doc audit). Le bandeau "honnête" est dans `AUDIT_02_DESIGN_UX_PERF.md` Patch P2.8 (anticipe).
**Vérification** : tester sur viewport 375x667 (iPhone SE), le CTA principal doit être visible sous 400 px du top.
**Source détaillée** : `AUDIT_02_DESIGN_UX_PERF.md` Patch P0.3 + Patch P2.8 + `AUDIT_04_SEO.md` § 3.1 choix B.

### 1.9 — Composant Avant/Apres accessible (P0-7)
**Fichiers** : `index.html` lignes 635-690 (3 cartes) + lignes 1533-1549 (JS)
**Action** : remplacer le `<input type="range" opacity-0>` par un `<button role="slider">` focusable, et réécrire le JS avec pointer events + ARIA + clavier (Arrow/Shift+Arrow/Home/End).
**Code** : voir blocs `AUDIT_02_DESIGN_UX_PERF.md` Patch P0.5 (HTML lignes 429-441 du doc audit, JS lignes 446-508).
**Vérification** : tester Tab pour focus jaune visible, fleches gauche/droite, drag souris, tap mobile.
**Source détaillée** : `AUDIT_02_DESIGN_UX_PERF.md` Patch P0.5.

### 1.10 — Contrastes WCAG AA (P0-8)
**Fichiers** : `index.html` lignes 511, 545, 552, 558, 562, 564, 568, 577, 588, 594, 604, 1048, 1452
**Action** : 6 remplacements `text-white/40` -> `text-white/55`, 3 remplacements `text-white/45` -> `text-white/60`, et ajouter `font-semibold` au `#bennes-readout` (l. 589) pour rehausser sa visibilité.
**Code / Diff** :
```diff
- text-white/40
+ text-white/55
```
```diff
- text-white/45
+ text-white/60
```
```diff
- <p id="bennes-readout" class="font-mono text-xs text-abtp-yellow">remplissage : 0 %</p>
+ <p id="bennes-readout" class="font-mono text-xs text-abtp-yellow font-semibold">remplissage : 0 %</p>
```
**Vérification** : Wave (https://wave.webaim.org) - zéro alerte de contraste sur le calculateur et le footer.
**Source détaillée** : `AUDIT_02_DESIGN_UX_PERF.md` Patch P0.4 (lignes exactes).

### 1.11 — Mentions légales + politique confidentialité (P0-2)
**Fichiers** : `index.html` lignes 1114-1148 (bloc `<details id="mentions">`) + lignes 1150-1157 (barre du bas)
**Action** : remplacer le bloc unique par 2 `<details>` séparés (`#mentions` + `#confidentialite`), avec les 8 mentions RGPD art. 13, la loi Hamon (14 j), la médiation conso, garanties parfait achèvement + biennale. Marquer les 5 infos client par `<!-- TODO_CLIENT: CAPITAL -->` etc. Mettre à jour les liens du footer pour pointer chacun vers sa propre ancre.
**Code** : voir blocs complets `AUDIT_01_LEGAL.md` § 3.1 (ligne 184-323 du doc audit) - les coller tels quels et préfixer chaque `{{XXX}}` par `<!-- TODO_CLIENT: XXX -->{{XXX}}`.
**Vérification** : `grep -n "TODO_CLIENT" index.html` retourne au moins 8 occurrences (capital, TVA, hébergeur x4, décennale x2, médiateur x3).
**Source détaillée** : `AUDIT_01_LEGAL.md` § 3.1.

### 1.12 — Consentement RGPD + honeypot dans le formulaire (P0-9)
**Fichiers** : `index.html` lignes 991-1050
**Action** : insérer juste avant le bouton submit (l. 1041) la case `<input type="checkbox" required name="consent_rgpd">` + le honeypot `<input name="website" class="hidden">`, et remplacer le `<p>` ligne 1048-1050 par la mention RGPD enrichie (8 mentions art. 13).
**Code** : voir blocs `AUDIT_01_LEGAL.md` § 3.2 (lignes 338-372 du doc audit).
**Vérification** : tenter de submit sans cocher = blocage natif HTML5.
**Source détaillée** : `AUDIT_01_LEGAL.md` § 3.2.

### 1.13 — Endpoint Formspree + état "merci" (P0-1)
**Fichiers** : `index.html` ligne 991 (balise form) + lignes 1495-1514 (handler JS)
**Action** : créer un compte Formspree (formspree.io), récupérer le `form_id`, modifier l'attribut `action` du `<form>`, et réécrire le handler en `fetch async/await` avec état "merci" pleine carte + canaux secours (tel + WhatsApp). Important : conserver le honeypot + le consent_rgpd check de l'étape 1.12.
**Code** : voir blocs `AUDIT_03_CONVERSION.md` § 8.1 (lignes 352-407 du doc audit). Remplacer `VOTRE_FORM_ID` par l'ID Formspree réel.
**Commandes** :
```bash
# Avant de coder : créer le compte sur formspree.io, créer un form ABTP, copier l'ID (ex. mwpkavbz)
# Puis remplacer VOTRE_FORM_ID dans l'action du <form>
```
**Vérification** : remplir le form en réel, vérifier réception sur `alexandre.bossee.abtp@gmail.com`.
**Source détaillée** : `AUDIT_03_CONVERSION.md` § 8.1 + § 1.2 F1.

---

## Section 2 — Pré go-live : checklist de validation

À cocher avant `git push` final + activation DNS.

- [ ] `npm run build` produit `dist/tailwind.css` <= 20 ko
- [ ] Aucune requête vers `fonts.googleapis.com`, `cdn.tailwindcss.com`, `cloudflare.com` (DevTools Network mobile throttling 4G)
- [ ] Lighthouse mobile : Perf >= 90, A11y >= 90, SEO >= 90, Best Practices >= 90 (Chrome DevTools incognito)
- [ ] Validation HTML W3C : 0 erreur sur https://validator.w3.org/nu/
- [ ] Wave a11y : 0 contraste error sur https://wave.webaim.org
- [ ] Test responsive : 375 px (iPhone SE), 768 px (iPad portrait), 1280 px (laptop) - CTA hero visible sans scroll sur les 3
- [ ] Formulaire : soumission réelle reçue dans `alexandre.bossee.abtp@gmail.com` via Formspree
- [ ] Composant Avant/Apres testé au clavier (Tab + fleches) et au tactile
- [ ] `grep -n "TODO_CLIENT" index.html` retourne 0 occurrence (5 infos client intégrées)
- [ ] Schema validateur : https://search.google.com/test/rich-results -> 3 schemas valides (GeneralContractor, WebSite, WebPage)
- [ ] Rich Results Test : https://search.google.com/test/rich-results?url=https://abtp77.fr/ -> au moins 1 résultat enrichi détecté
- [ ] `og.jpg` existe à la racine, ouvre dans le navigateur, 1200x630 px
- [ ] Capture d'écran finale mobile + desktop dans `/captures/` pour archivage

---

## Section 3 — Déploiement (Cloudflare Pages recommandé)

### 3.1 — Pousser sur GitHub
```bash
# cwd: site-Alex-ABTP/
git add .
git commit -m "feat: sprint 1 P0 - mise en ligne ABTP"
git push origin feat/go-live-sprint-1
# Ouvrir une PR + merger sur main
```

### 3.2 — Connecter Cloudflare Pages à GitHub
Aller sur https://dash.cloudflare.com -> Pages -> Create project -> Connect to Git -> sélectionner le repo `site-Alex-ABTP`.

### 3.3 — Configurer le build
- **Build command** : `npm run build`
- **Build output directory** : `.` (racine - le site est statique, pas de dossier `public/` ou `dist/` complet)
- **Environment variables** : aucune
- **Node version** : 20

### 3.4 — Configurer le DNS
Sur le registrar (OVH, Gandi...), créer :
- `A    abtp77.fr      <IP fournie par Cloudflare>`
- `CNAME www.abtp77.fr  abtp77.fr`
Ou utiliser Cloudflare comme registrar (transfert si besoin).
HTTPS auto via Let's Encrypt - rien à faire côté code.

### 3.5 — Tester `abtp77.fr`
Attendre propagation DNS (5-30 min). Vérifier : `curl -I https://abtp77.fr/` retourne `HTTP/2 200`, `https://abtp77.fr/robots.txt` et `/sitemap.xml` accessibles.

---

## Section 4 — P1 (Sprint 2, J+4 à J+10)

Format condensé : objectif + fichier + lien audit.

### 4.1 — P1-1 Google Business Profile
Alexandre crée le profil sur https://business.google.com (nom: ABTP, adresse: 8 Square de Beauregard 77000 Melun, tel: 07 82 40 88 09, NAP strictement identique). Vérification par carte postale J+7. Upload 10 photos, 4 posts, activer 6 services. Voir `AUDIT_04_SEO.md` § 8.

### 4.2 — P1-2 Plausible analytics + 7 events
Ajouter le snippet `<script defer data-domain="abtp77.fr" src="https://plausible.io/js/script.tagged-events.outbound-links.js">` dans `<head>` + le bloc JS global tracking (clic_tel, clic_whatsapp, ouvre_calculateur, soumet_calculateur, ouvre_formulaire, soumet_formulaire, clic_carte_zone). Voir `AUDIT_03_CONVERSION.md` § 9.2 et § 9.4 (snippet complet).

### 4.3 — P1-3 Loi Hamon + médiateur
Déjà intégré en P0-2 si les TODO_CLIENT MEDIATEUR sont remplacés. Vérifier que le bloc rétractation 14 j est bien dans `#mentions`. Sinon coller depuis `AUDIT_01_LEGAL.md` § 3.1 (sous-bloc "Droit de rétractation" et "Médiation").

### 4.4 — P1-4 Encart Garanties légales
Insérer dans la section `#pourquoi` ou `#processus` le bloc 3 cartes (décennale 10 ans, biennale 2 ans, parfait achèvement 1 an). Voir `AUDIT_01_LEGAL.md` § 3.7.

### 4.5 — P1-5 Encarts "OFFRE LANCEMENT" + "Preuves de sérieux"
Insérer avant le formulaire l'encart jaune OFFRE LANCEMENT (3 premiers chantiers, suivi VIP, -5 %), et dans `#pourquoi` l'encart Preuves de sérieux (SIREN cliquable, décennale, paiement après chantier, camion ampliroll). Voir `AUDIT_03_CONVERSION.md` § 8.4 + § 8.5.

### 4.6 — P1-6 Formulaire enrichi (Email + Date + Upload photos)
Ajouter champ `email` (optionnel, type=email), `urgence` (select 4 options), `photos` (input file multiple, accept=image/*, max 3). Wording bouton : "Recevoir mon devis sous 48h". Bordures inputs `white/30` au lieu de `white/15`. Voir `AUDIT_03_CONVERSION.md` § 8.2 + § 8.3.

### 4.7 — P1-7 Menu hamburger mobile
Lignes 287+ : ajouter bouton hamburger visible `< lg`, drawer `<nav id="mobile-menu">` juste avant `</header>`, JS toggle. Voir `AUDIT_02_DESIGN_UX_PERF.md` Patch P1.2.

### 4.8 — P1-8 Calculateur 2 cols dès `md:` + sticky résultats + indicateur scroll bennes
Ligne 487 : `lg:grid-cols-5` -> `md:grid-cols-5`, wrap résultats dans `<div class="md:sticky md:top-24">`, scroll auto smooth vers `#results` au 1er changement mobile, mask gradient `linear-gradient(to right, #000 90%, transparent 100%)` sur `#bennes-svg-wrap`. Voir `AUDIT_02_DESIGN_UX_PERF.md` Patch P1.4 + P1.5.

### 4.9 — P1-9 Section FAQ + FAQPage schema
Créer une section `<section id="faq">` après `#processus` avec 8 questions (prix, durée, zones, gravats, délai devis, décennale, USP, fosse toutes eaux). Ajouter le JSON-LD `FAQPage` correspondant. Voir `AUDIT_04_SEO.md` § 4.1 (8 Q/R prêtes).

### 4.10 — P1-10 H2 enrichis SEO + alt textes géolocalisés
Patcher les H2 selon `AUDIT_04_SEO.md` § 3.2 (table). Sur chaque `<img>` avant/après, alt = "Chemin d'accès avant terrassement par ABTP à Melun (77)" etc.

### 4.11 — P1-11 Citations Tier 1
Hors site : inscrire ABTP sur PagesJaunes, Yelp.fr, Bing Places, Apple Plans, Hoodspot, AlloVoisins (vérifier fiche existante), LinkedIn Alexandre. NAP STRICTEMENT identique partout. 3 h étalées sur la semaine. Voir `AUDIT_04_SEO.md` § 9.1 Tier 1.

### 4.12 — P1-12 Collecte 5 premiers avis Google
Alexandre envoie SMS post-chantier avec lien court `g.page/r/abtp77/review` + QR code imprimé sur les devis. Continu.

### 4.13 — P1-13 Google Search Console + Bing Webmaster
Inscrire `abtp77.fr` sur GSC (https://search.google.com/search-console) et Bing Webmaster Tools, soumettre `sitemap.xml`. Vérification par fichier HTML ou DNS TXT.

### 4.14 — P1-14 Prix dans estimation-summary + micro-CTA tel sous calculateur
Lignes 1462-1487 : injecter la fourchette de prix dans le textarea de `#estimation-summary`. Sous les résultats du calculateur : `<p>Une question ? <a href="tel:0782408809">07 82 40 88 09</a></p>`. Voir `AUDIT_03_CONVERSION.md` § 3.5 + § 6.2 C1/C2.

### 4.15 — P1-15 Polish a11y (aria-hidden, role=radiogroup, scroll-padding)
- Lignes 1078, 1164 : retirer `aria-label` des SVG décoratifs, ajouter `aria-hidden="true"`.
- Lignes 497, 537 : ajouter `role="radiogroup" aria-label="Type de chantier"` / `"Type de sol"`.
- Ligne 65 : `scroll-padding-top: 64px;` + media `(min-width:768px) { scroll-padding-top: 72px; }`.
Voir `AUDIT_02_DESIGN_UX_PERF.md` Patch P1.1 + § 5.

### 4.16 — P1-16 Téléphone international
`grep -rn "tel:0782408809" index.html` puis ajouter en parallèle `tel:+33782408809` (un des deux selon contexte ; certains sites mettent `+33` partout). 10 min.

### 4.17 — P1-17 Décision Email = optionnel
Confirmer le choix : champ email = `<input type="email">` SANS `required`. Décision tranchée par PLAN_ACTION P1-17.

---

## Section 5 — P2 (Sprint 3, J+11 à J+30)

Très condensé.

- **P2-1** : créer 6 pages communes (terrassement-melun.html, brie-comte-robert, fontainebleau, nangis, provins, chaumes-en-brie), 600+ mots uniques, BreadcrumbList schema, maillage croisé. Template dans `AUDIT_04_SEO.md` § 5.3.
- **P2-2** : 3 articles blog (`/blog/prix-terrassement-2026.html`, `fosse-toutes-eaux.html`, `allee-pave-vs-gravier.html`) + Article schema. Voir `AUDIT_04_SEO.md` § 10 sem 9-10.
- **P2-3** : citations Tier 2 (CMA77, Travaux.com, Houzz, Manageo, Société.com, Kompass, Bobex, Quotatis). 2-3 h.
- **P2-4** : backlinks éditoriaux - pitcher La République de Seine-et-Marne, Magjournal77, Actu.fr Melun, WIAME VRD pour lien retour.
- **P2-5** : sticky mobile bar - afficher numéro complet "APPELER · 07 82 40 88 09". Voir `AUDIT_03_CONVERSION.md` § 8.6.
- **P2-6** : `localStorage` état calculateur + partage WhatsApp estimation + bouton reset. Voir `AUDIT_03_CONVERSION.md` § 6.2.
- **P2-7** : tags "Réalisé en mai 2026" sous photos avant/après + champ "Comment nous avez-vous connus" + badge annuaire-entreprises.
- **P2-8** : rédaction CGV (3-4 h). Mentionné "à venir" actuellement, délai 3 mois.
- **P2-9** : ajuster positions pins SVG carte zone + renommer ancre `#avant-apres` -> `#realisations`.
- **P2-10** : page `/accessibilite.html` "Déclaration d'accessibilité - conformité non requise".
- **P2-11** : Review schema + aggregateRating quand >= 5 avis Google + témoignages vidéo (15 s selfie).
- **P2-12** : A/B tests prioritaires : AB2 wording submit, AB7 form 2 vs 4 champs, AB4 sticky 2 vs 3 boutons, AB1 wording CTA hero. Voir `AUDIT_03_CONVERSION.md` § 10.
- **P2-13** : defer scripts non critiques (`reveal`, `scrollspy`), inline CSS critique above-the-fold.
- **P2-14** : bordures cartes services `border-neutral-200` -> `300` + `font-mono tabular-nums` sur gros numéros tél.
- **P2-15** : inscription Qualibat / RGE si applicable, mention site + GBP.
- **P2-16** : suivi positions sur 30 mots-clés via SE Ranking/Mangools + test Google Ads 200-300 EUR.

---

## Section 6 — Prompts copiables pour Claude Code

Chaque prompt est autosuffisant : objectif + fichiers + référence sections.

### Prompt 1 — Bootstrap projet (Setup 0.1 à 0.7)
> Tu es dans `C:\Alex-ABTP\site-Alex-ABTP\`. Initialise le projet pour passer du CDN Tailwind à un build local. Étapes : git checkout -b feat/go-live-sprint-1 ; npm init -y ; npm install -D tailwindcss ; npx tailwindcss init ; crée dossiers src/styles, dist, assets/fonts, assets/photos ; crée src/styles/tailwind.css avec les 3 directives @tailwind ; configure tailwind.config.js (palette ABTP yellow #FFC72C, blue #3B82C4, charcoal #1A1A1A, steel #4A4A4A, light #F5F5F5, whatsapp #25D366 ; fontFamily display Oswald, sans Inter) ; ajoute scripts npm "build" et "dev" ; crée .gitignore. Lis `CLAUDE_CODE_EXECUTION.md` section 0 pour le détail. Vérifie à la fin que `npm run build` produit `dist/tailwind.css`.

### Prompt 2 — Fonts locales + photos optimisées (Étapes 1.2 et 1.3)
> Objectif : éliminer tous les appels tiers RGPD et réduire le poids des images. (1) Télécharge depuis gwfh.mranftl.com les woff2 latin pour Oswald 500/700 et Inter 400/600/700, place-les dans `assets/fonts/` (noms inter-v18-latin-{400,600,700}.woff2 et oswald-v53-latin-{500,700}.woff2). (2) Renomme les 7 photos de `photos/` en kebab-case ASCII vers `assets/photos/` (hero-chantier, chemin-avant, chemin-apres, terrasse-avant, terrasse-apres, facade-avant, facade-apres). (3) Pour chaque .jpg génère 3 tailles WebP (640, 1024, 1600) avec cwebp -q 78/80/82 et un AVIF 1024 avec avifenc -q 55. Lis `CLAUDE_CODE_EXECUTION.md` sections 1.2 et 1.3. Sortie attendue : 5 woff2 + 28 fichiers d'images.

### Prompt 3 — Patch <head> + Schema enrichi + robots/sitemap (Étapes 1.4, 1.5, 1.6)
> Dans `index.html`, remplace les lignes 24-53 par : canonical https://abtp77.fr/ + meta robots/geo/author/ICBM + `<link rel="stylesheet" href="dist/tailwind.css">` + bloc `<style>` avec 5 @font-face vers assets/fonts/ + preload de assets/photos/hero-chantier-1024.webp. Puis remplace le JSON-LD lignes 207-250 par le bloc complet de `AUDIT_04_SEO.md` § 4 (GeneralContractor + 6 Services + sameAs + identifier SIREN + WebSite + WebPage). Crée à la racine `robots.txt` et `sitemap.xml` (voir section 1.6 du guide). Vérifie que og.jpg existe (1200x630), sinon génère-le depuis hero-chantier-1600.webp. Lis `CLAUDE_CODE_EXECUTION.md` sections 1.4 à 1.6.

### Prompt 4 — Patch images + Hero mobile + Avant/Après + Contrastes (Étapes 1.7 à 1.10)
> Dans `index.html` : (1) remplace tous les `<img src="photos/...">` (l. 369, 629, 632, 656, 659, 680, 683) par des `<picture>` AVIF+WebP responsive avec width/height/decoding="async" pointant vers assets/photos/ (hero en eager+fetchpriority, autres en lazy) ; (2) réorganise le hero l. 311-388 selon Patch P0.3 de `AUDIT_02_DESIGN_UX_PERF.md` (H1 en premier avec "Terrassement à Melun et sud Seine-et-Marne : le patron sur le chantier", bandeau "RAPPEL SOUS 1H OUVRÉ - DEVIS GRATUIT 48H" sous CTA) ; (3) réécris le composant Avant/Après (HTML l. 635-690 + JS l. 1533-1549) selon Patch P0.5 (button role=slider + pointer events + clavier) ; (4) rehausse les contrastes : 6x text-white/40 -> /55, 3x text-white/45 -> /60, font-semibold sur #bennes-readout. Lis `CLAUDE_CODE_EXECUTION.md` sections 1.7 à 1.10.

### Prompt 5 — Mentions légales + Politique confidentialité + Consentement RGPD (Étapes 1.11, 1.12)
> Dans `index.html`, remplace le bloc `<details id="mentions">` (l. 1114-1148) par les 2 blocs `<details>` séparés `#mentions` et `#confidentialite` de `AUDIT_01_LEGAL.md` § 3.1 (incluant loi Hamon 14j, médiation conso, garanties biennale + parfait achèvement, 8 mentions RGPD art. 13). Marque les 5 infos client par `<!-- TODO_CLIENT: CAPITAL -->{{CAPITAL}}` etc. Mets à jour la barre du bas (l. 1150-1157) avec 2 ancres distinctes. Puis dans le formulaire (avant l. 1041) insère la case `<input type="checkbox" required name="consent_rgpd">` + le honeypot caché `<input name="website" class="hidden">`, et remplace le `<p>` l. 1048-1050 par la mention RGPD enrichie de `AUDIT_01_LEGAL.md` § 3.2. Lis `CLAUDE_CODE_EXECUTION.md` sections 1.11 et 1.12.

### Prompt 6 — Endpoint Formspree + état merci (Étape 1.13)
> Crée d'abord un compte sur formspree.io, crée un form "ABTP devis", récupère le form ID. Puis dans `index.html` : (1) modifie la balise `<form id="contact-form">` l. 991 pour ajouter `action="https://formspree.io/f/<FORM_ID>" method="POST"` + 2 inputs cachés `_subject` et `_next` ; (2) remplace le handler submit l. 1495-1514 par le fetch async/await avec état "merci" pleine carte (bouton "Appeler maintenant" + "WhatsApp") de `AUDIT_03_CONVERSION.md` § 8.1 ; (3) conserve impérativement la vérification consent_rgpd + honeypot ajoutés à l'étape précédente. Teste avec une soumission réelle. Lis `CLAUDE_CODE_EXECUTION.md` section 1.13.

### Prompt 7 — Tracking Plausible + Encarts conversion (P1.2, P1-4, P1-5)
> Ajoute le snippet Plausible dans `<head>` puis le bloc JS global tracking (7 events : clic_tel/clic_whatsapp/ouvre_calculateur/soumet_calculateur/ouvre_formulaire/soumet_formulaire/clic_carte_zone) selon `AUDIT_03_CONVERSION.md` § 9.4. Puis insère 3 encarts : (a) "OFFRE LANCEMENT" jaune avant `<form>` (`AUDIT_03_CONVERSION.md` § 8.4) ; (b) "Preuves de sérieux" 4 chips dans `#pourquoi` (`AUDIT_03_CONVERSION.md` § 8.5) ; (c) "Garanties légales" 3 cartes (décennale/biennale/parfait achèvement) dans `#processus` (`AUDIT_01_LEGAL.md` § 3.7). Lis `CLAUDE_CODE_EXECUTION.md` section 4.2, 4.4, 4.5.

### Prompt 8 — Pages communes (P2-1, Sprint 3)
> Crée 6 pages HTML statiques à la racine : terrassement-melun.html, terrassement-brie-comte-robert.html, terrassement-fontainebleau.html, terrassement-nangis.html, terrassement-provins.html, terrassement-chaumes-en-brie.html. Utilise le template de `AUDIT_04_SEO.md` § 5.3 : reprend le header/footer de index.html, custom title/description/canonical/og par commune, ajoute BreadcrumbList schema, écrit 600+ mots uniques par page (pourquoi ABTP dans cette commune, sols typiques, services adaptés, communes voisines maillage interne, FAQ géolocalisée 3 questions). Mets à jour sitemap.xml avec les 6 nouvelles URLs (priority 0.8, lastmod du jour). Lis `CLAUDE_CODE_EXECUTION.md` section 5 (P2-1) et `AUDIT_04_SEO.md` § 5.

---

## Journal des écarts

| Date | Étape | Note |
|---|---|---|
| 2026-05-20 | 0.3 | Tailwind v4 ne supporte plus `npx tailwindcss init` ni `tailwind.config.js` (config via `@theme` dans le CSS). Installé `tailwindcss@3` (v3.4.19) au lieu de `@latest` pour préserver la compatibilité avec le plan. |
| 2026-05-20 | 1.1 | `dist/tailwind.css` minifié = 21,1 ko (vs cible plan ≤ 20 ko). +1,6 ko dû à la richesse de classes dans index.html. Gzip ≈ 5-6 ko sur Cloudflare Pages → impact perf nul, accepté. |
| 2026-05-20 | 1.2 | Google Fonts sert désormais Inter (v20) et Oswald (v57) en **police variable** : un seul fichier woff2 par police couvre tous les poids. Plan basé sur 5 fichiers statiques (3 Inter + 2 Oswald). Adapté : 2 fichiers `inter-v20-latin.woff2` (48 ko) + `oswald-v57-latin.woff2` (21 ko). Économie ≈ 90 ko bande passante 1er load. L'étape 1.4 sera adaptée : 2 blocs `@font-face` avec `font-weight: 100 900` au lieu de 5 blocs poids fixe. |
| 2026-05-20 | 1.3 | `cwebp` et `avifenc` non installés (ni ImageMagick) → bascule sur `sharp` (npm, libvips). Script `scripts/convert-photos.js` (npm run photos) reproduit la pipeline. Tailles WebP/AVIF générées 2-4× au-dessus des estimations du plan (originaux JPEG déjà bien compressés + 6/7 photos en portrait 1380×1725). Total disque assets/photos/ = 8,1 Mo pour 28 fichiers (vs plan ≤ 1 Mo : cible irréaliste pour 28 variantes responsive). **Ce qui compte : poids par visite** ≈ 59 ko hero mobile, ≈ 900 ko mobile full-scroll, ≈ 1,0 Mo desktop full-scroll — acceptable. |
| 2026-05-20 | 1.5 | Quatre ajustements au JSON-LD copié de `AUDIT_04_SEO.md` § 4 pour qu'il parse correctement et n'expose pas de fichiers fantômes : (1) retiré le bloc `/* aggregateRating ... */` (commentaire JS invalide en JSON) ; (2) retiré la 2e clé `founder` dupliquée (la 1re, riche en `worksFor`/`alumniOf`, écrasée sinon par la 2e) ; (3) remplacé `https://abtp77.fr/photos/photo-entete.jpg` (fichier renommé en 1.3) par `https://abtp77.fr/assets/photos/hero-chantier-1600.webp` dans le tableau `image` ; (4) retiré la propriété `logo` qui pointait vers `/logo-abtp.svg` (asset inexistant). og.jpg généré via sharp (1200×630, mozjpeg q82, 155 ko). |
| 2026-05-20 | Sec.2 | W3C nu validation : 9 → 1 erreur. (a) Favicon SVG data URI : encodage `%20` pour tous les espaces (validator strict, navigateurs tolèrent). (b) AVIF `<source>` x7 : ajout `1024w` au srcset + `sizes` aligné sur la source WebP voisine (validator exige un descripteur de largeur dès qu'on déclare `sizes`, et inversement — circulaire mais résolu). (c) 1 erreur restante : `href="{{MEDIATEUR_URL}}"` — placeholder TODO_CLIENT légitime, disparaîtra au moment où le client fournira l'URL du médiateur. |
| 2026-05-20 | Sec.3 | Déploiement basculé Cloudflare Pages → Netlify (repo déjà connecté à Netlify côté client). Étapes 3.2 + 3.3 du guide sautées. Ajout d'un `netlify.toml` à la racine avec `command = npm run build`, `publish = "."`, `NODE_VERSION = "20"`. Mention "Cloudflare Pages" dans politique de confidentialité et CLAUDE_CODE_EXECUTION reste à jour ailleurs au moment de fournir HEBERGEUR client. |
| 2026-05-20 | Sec.3.4 | DNS abtp77.fr **différé** : client (Alexandre) non disponible pour confirmer registrar / propriété du domaine. Site accessible via l'URL temporaire `*.netlify.app` en attendant. Reprendre Section 3.4 (Netlify DNS ou enregistrements externes) + 3.5 (tests prod) une fois le client joignable. |

*Claude Code remplit ce tableau s'il doit dévier d'une instruction (ex : Formspree limite atteinte -> bascule Web3Forms ; AVIF non supporté par cwebp version installée -> fallback WebP seul).*
