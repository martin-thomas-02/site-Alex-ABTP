# Prompt Claude Design — Site one-page ABTP
*À copier-coller dans Claude Design. Itérations suivantes : Claude Code.*

---

## INSTRUCTIONS POUR LE LECTEUR (Thomas)

Ce fichier contient **deux blocs** :
- **§A** — un prompt système court à coller en première instruction
- **§B** — le brief détaillé à coller juste après

Tu peux aussi tout coller d'un bloc, mais le découpage rend les itérations plus propres.

---

## §A — PROMPT SYSTÈME (à coller en premier)

```
Tu es un designer web senior spécialisé en sites vitrine pour artisans français du BTP.
Tu vas produire une landing page one-page haute conversion pour ABTP, un terrassier
de Seine-et-Marne (77). Tu travailles en HTML + Tailwind CSS pur (pas de framework JS),
avec UN composant interactif JS vanilla en plus (le calculateur de bennes décrit en §B.7).

Contraintes non négociables :
- Mobile-first, 70% du trafic est mobile
- Téléphone toujours visible et cliquable (tel:0782408809)
- Schema.org LocalBusiness en JSON-LD dans le <head>
- Lighthouse Performance > 90 (pas d'images > 200ko, lazy-loading, SVG inline pour le logo)
- Zéro lorem ipsum, zéro placeholder — tous les textes sont fournis en §B
- Zéro fausse preuve sociale (pas de chiffres bidons type "+200 clients satisfaits")
- Accessibilité AA : contrastes, alt, aria-labels, focus visibles

Livre en UN SEUL fichier HTML auto-suffisant (CSS Tailwind via CDN, JS inline en bas).
```

---

## §B — BRIEF DÉTAILLÉ

### B.1 — Identité du client

- **Raison sociale** : ABTP (SARL)
- **SIREN** : 940 605 652
- **Dirigeant** : Alexandre Bossée
- **Activité** : terrassement, assainissement, pavage, aménagement extérieur, maçonnerie
- **Siège** : 8 Square de Beauregard, 77000 Melun
- **Téléphone** : 07 82 40 88 09
- **Email** : alexandre.bossee.abtp@gmail.com
- **Ancienneté** : SARL créée en février 2025
- **USP** : *"Formé sur les grands chantiers franciliens chez WIAME VRD, aujourd'hui à votre service en direct. Pas d'intermédiaire, le patron est sur le chantier."*

### B.2 — Cible & objectif

- Cible primaire : propriétaire en Brie / sud 77 avec projet allée, terrasse, assainissement, viabilisation
- Objectif principal : **générer un appel téléphonique ou un formulaire de devis**
- Action de conversion : `tel:0782408809` OU soumission du formulaire post-calculateur

### B.3 — Système de design

```css
/* Couleurs */
--abtp-yellow:        #FFC72C;  /* principal — CTA, accents */
--abtp-yellow-soft:   #FFE066;  /* hover, highlights */
--abtp-blue:          #3B82C4;  /* secondaire, liens */
--abtp-charcoal:      #1A1A1A;  /* texte principal */
--abtp-steel:         #4A4A4A;  /* texte secondaire */
--abtp-light:         #F5F5F5;  /* fonds alternés */
--abtp-white:         #FFFFFF;

/* Typo */
Titres : Oswald (700), uppercase, letter-spacing 0.02em
Corps  : Inter (400, 600), line-height 1.6

/* Coins arrondis */
rounded-lg partout. Pas d'angles tranchants sauf sur les CTA jaunes (rounded-md).

/* Ombres */
shadow-sm sur cartes, shadow-xl uniquement sur la calculatrice
```

Style visuel cible : **industriel propre**. Inspiration : sites Caterpillar, Manitou, mais en plus chaleureux. Pas de glassmorphism, pas de gradients pastel, pas de néon. Du **jaune signal franc** sur du **noir/blanc**.

### B.4 — Structure de la page (ordre des sections)

```
1. HEADER fixe (logo SVG inline + nav ancres + bouton "07 82 40 88 09")
2. HERO plein écran
3. SERVICES (6 cartes)
4. CALCULATEUR DE BENNES (feature wow) ← cœur conversion
5. POURQUOI ABTP (3 piliers : Formation WIAME VRD / Patron sur chantier / Ampliroll en propre)
6. ZONE D'INTERVENTION (carte SVG simplifiée du 77 + liste communes)
7. PROCESSUS (4 étapes : Appel → Visite chantier → Devis 48h → Réalisation)
8. CONTACT (formulaire + téléphone géant + email + mini-map)
9. FOOTER (mentions légales, SIREN, NAF, lien CGV à venir)
```

### B.5 — Contenus rédigés (à utiliser tels quels)

#### Hero
- **H1** : `Terrassement & aménagement extérieur en Brie. Le patron sur le chantier.`
- **Sous-titre** : `ABTP intervient à Melun et dans tout le sud Seine-et-Marne. Devis sous 48h, ampliroll en propre, zéro sous-traitance.`
- **CTA principal** (gros bouton jaune) : `Calculer mon chantier →` (scroll vers calculateur)
- **CTA secondaire** (lien souligné) : `Appeler — 07 82 40 88 09`
- **Visu hero** : placeholder pour photo du camion ampliroll n°114 (à fournir par Alexandre). En attendant, une grande illustration SVG d'une pelleteuse jaune stylisée sur fond charcoal avec effet "blueprint" (grille technique discrète).

#### Services (6 cartes, icônes Lucide ou SVG inline)
| Titre | Description courte (1 phrase) |
|---|---|
| Terrassement | Décaissement, nivellement, fouilles en rigole — pour fondations, piscines, viabilisation. |
| Assainissement | Raccordement tout-à-l'égout, fosses toutes eaux, drainage, eaux pluviales. |
| Création d'allée | Allées en pavé, dalles, graviers stabilisés — du tracé à la finition. |
| Aménagement extérieur | Cours, terrasses, abords, mise en forme du terrain. |
| Maçonnerie | Murets, dalles béton, soutènement, petits ouvrages d'abord. |
| Évacuation ampliroll | Bennes 8/15/30 m³ en propre — pas d'attente, pas de surcoût loueur. |

#### Section "Pourquoi ABTP" (3 piliers)
1. **Formé chez WIAME VRD** — *"Avant ABTP, Alexandre a travaillé sur les grands chantiers de VRD d'Île-de-France. Les méthodes des pros, appliquées chez vous."*
2. **Le patron au volant** — *"Pas de sous-traitance, pas d'intermédiaire. Le devis, le chantier, le suivi — toujours la même personne en face de vous."*
3. **Ampliroll en propre** — *"Notre camion 114 et nos bennes 8/15/30 m³ nous appartiennent. Évacuation immédiate, pas d'attente de loueur, pas de surcoût."*

#### Processus (4 étapes)
1. **Appel ou message** — sous 24h.
2. **Visite du chantier** — gratuite, sans engagement.
3. **Devis détaillé sous 48h** — clair, par poste, sans surprise.
4. **Chantier réalisé** — calendrier respecté, terrain propre à la livraison.

#### Zone d'intervention
**Titre** : `Nous intervenons partout en Brie et sud Seine-et-Marne`
Liste cliquable (ancres SEO) : Melun · Brie-Comte-Robert · Chaumes-en-Brie · Le Châtelet-en-Brie · Saint-Ouen-en-Brie · Nangis · Mormant · Fontainebleau · Provins · Coulommiers · Maincy · Sivry-Courtry · Vaux-le-Pénil · Dammarie-lès-Lys · Le Mée-sur-Seine
*"Votre commune n'apparaît pas ? Appelez-nous : si c'est dans le 77, on vient."*

#### Contact
- **H2** : `Parlons de votre chantier.`
- **Sous-titre** : `Un coup de fil suffit pour démarrer. Devis gratuit, visite sans engagement.`
- **Téléphone** énorme en jaune : **07 82 40 88 09**
- **Email** : alexandre.bossee.abtp@gmail.com
- Formulaire : Prénom · Téléphone · Commune · Type de chantier (select) · Surface approx. · Message (optionnel) · bouton "Envoyer ma demande"
- Mention RGPD sous le formulaire, à coller mot pour mot :
  > *Les informations transmises via ce formulaire sont utilisées uniquement pour vous recontacter au sujet de votre projet. Elles ne sont ni revendues, ni partagées. Vous pouvez demander leur suppression à tout moment en écrivant à alexandre.bossee.abtp@gmail.com (RGPD, art. 17).*

#### Footer
**Important** : les champs entre `{{accolades}}` ci-dessous sont à laisser **tels quels dans le HTML** (commentaire HTML `<!-- TODO: ... -->` au-dessus), pour qu'on les remplisse après en récupérant les infos auprès d'Alexandre. Ne JAMAIS inventer une valeur.

```html
<!-- TODO: remplacer {{CAPITAL}} après confirmation Alexandre -->
ABTP — SARL au capital de {{CAPITAL}} €
8 Square de Beauregard, 77000 Melun
SIREN 940 605 652 · NAF 4312A
Directeur de la publication : Alexandre Bossée
<!-- TODO: Hébergeur à compléter lors du déploiement -->
Hébergement : {{HEBERGEUR}}
<!-- TODO: Garantie décennale à compléter -->
Assurance décennale : {{COMPAGNIE_DECENNALE}} — Police n° {{N_POLICE}}
[Mentions légales] · [Politique de confidentialité]
© 2026 ABTP — Tous droits réservés.
```

**Page Mentions légales** (lien `#mentions`) : générer une section repliable en bas de page qui reprend les infos ci-dessus + un bloc "Données personnelles" qui pointe vers la mention RGPD du formulaire.

### B.6 — Schema.org JSON-LD (à mettre dans le <head>)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://abtp77.fr/#business",
  "name": "ABTP",
  "image": "https://abtp77.fr/og.jpg",
  "telephone": "+33782408809",
  "email": "alexandre.bossee.abtp@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "8 Square de Beauregard",
    "postalCode": "77000",
    "addressLocality": "Melun",
    "addressCountry": "FR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 48.5409, "longitude": 2.6601 },
  "areaServed": [
    {"@type": "City", "name": "Melun"},
    {"@type": "City", "name": "Brie-Comte-Robert"},
    {"@type": "City", "name": "Chaumes-en-Brie"},
    {"@type": "City", "name": "Le Châtelet-en-Brie"},
    {"@type": "City", "name": "Saint-Ouen-en-Brie"},
    {"@type": "City", "name": "Nangis"},
    {"@type": "City", "name": "Mormant"},
    {"@type": "City", "name": "Fontainebleau"},
    {"@type": "City", "name": "Provins"},
    {"@type": "City", "name": "Coulommiers"},
    {"@type": "City", "name": "Maincy"},
    {"@type": "City", "name": "Sivry-Courtry"},
    {"@type": "City", "name": "Vaux-le-Pénil"},
    {"@type": "City", "name": "Dammarie-lès-Lys"},
    {"@type": "City", "name": "Le Mée-sur-Seine"}
  ],
  "priceRange": "€€",
  "openingHours": "Mo-Sa 07:00-19:00",
  "founder": {"@type": "Person", "name": "Alexandre Bossée"}
}
```

### B.7 — FEATURE WOW : Calculateur "Combien ça creuse, combien ça coûte ?"

**Emplacement** : section 4, juste après les services, **avant** "Pourquoi ABTP". C'est l'ancre principale de la conversion.

#### Apparence
Carte large (max-w-5xl), fond `--abtp-charcoal`, intérieur clair, jaune partout sur les sliders et le bouton final. Sensation "console de chantier".

Titre section : `Estimez votre chantier en 30 secondes`
Sous-titre : `Volume à terrasser, nombre de bennes, fourchette de prix. Vous gardez les chiffres, on s'occupe du reste.`

#### Étape 1 — Type de chantier (cartes radio avec icône)
Une seule sélection. Chaque type change la **profondeur par défaut** et le **multiplicateur tarifaire** :

| Type | Profondeur défaut | Coef prix |
|---|---|---|
| Allée / cour pavée | 30 cm | × 1.0 |
| Terrasse | 25 cm | × 1.0 |
| Fosse / fondation | 100 cm | × 1.3 |
| Piscine | 180 cm | × 1.5 |
| Viabilisation / tranchée | 80 cm | × 1.2 |
| Nivellement terrain | 15 cm | × 0.7 |

#### Étape 2 — Surface (slider + input numérique synchronisés)
Range : 5 à 500 m². Step 5. Défaut 50.

#### Étape 3 — Profondeur (slider)
Range : 10 à 300 cm. Step 5. Pré-rempli selon type, modifiable.

#### Étape 4 — Type de sol (3 cartes radio avec picto)
| Sol | Coef volume foisonné | Coef temps |
|---|---|---|
| Terre / sablonneux | 1.20 | × 1.0 |
| Terre + cailloux | 1.30 | × 1.2 |
| Argileux / rocheux | 1.40 | × 1.5 |

#### Calculs (formules — à coder en JS vanilla)

```js
const volumeNet = (surface * profondeurCm / 100);                 // m³ en place
const volumeFoisonne = volumeNet * coefSol;                       // m³ à évacuer (foisonné)
const dureeJours = Math.max(1, Math.round((volumeNet / 25) * coefTemps * coefType));
// Note : cadence 25 m³/jour calibrée mini-pelle 5T en sol courant.

// Bennes : optimisation gloutonne 30 → 15 → 8 m³, sans sur-allocation
function repartirBennes(volume) {
  let restant = Math.ceil(volume);                                // arrondi sup au m³
  const r = { b30: 0, b15: 0, b8: 0 };
  while (restant > 0) {
    if (restant >= 23)      { r.b30 += 1; restant -= 30; }        // seuil 23 = mi-chemin 15↔30
    else if (restant >= 11) { r.b15 += 1; restant -= 15; }        // seuil 11 = mi-chemin 8↔15
    else                    { r.b8  += 1; restant -= 8;  }
  }
  return r;
}
// Test : repartirBennes(28) → {b30:1, b15:0, b8:0} (30 m³, 1 rotation)
// Test : repartirBennes(31) → {b30:1, b15:0, b8:1} (38 m³, 2 rotations)
// Test : repartirBennes(45) → {b30:1, b15:1, b8:0} (45 m³, 2 rotations)

// Fourchette de prix HT, indicative — à valider avec Alexandre avant mise en ligne
const prixBas  = volumeNet * 35  * coefSol * coefType;
const prixHaut = volumeNet * 90  * coefSol * coefType;
// 90 €/m³ couvre les cas piscine/rocheux. Mention obligatoire : "HT, hors évacuation
// décharge classée et hors fournitures, prix indicatif sans valeur contractuelle".

// Garde-fou : si volume absurde, ne pas afficher
if (volumeNet < 1) { /* masquer les résultats, afficher "Augmentez surface ou profondeur" */ }
```

#### Affichage des résultats (compteurs animés)
Trois grosses tuiles côte à côte, chiffres qui s'incrémentent (transition 600ms à chaque recalcul) :

```
┌──────────────────────┬───────────────────────┬───────────────────────┐
│   VOLUME À ÉVACUER   │        BENNES          │   FOURCHETTE DEVIS    │
│                      │                        │                       │
│       28 m³          │      1× benne 30 m³    │   1 800 € — 4 700 €   │
│  (terre foisonnée)   │     = 1 rotation 114   │   HT, hors fournitures│
└──────────────────────┴───────────────────────┴───────────────────────┘

  Durée estimée : 2 jours de chantier

  Format d'affichage bennes : "2× benne 30 m³ + 1× benne 15 m³ = 3 rotations 114"
  Toujours en HT. Mention sous les tuiles, taille 12px, gris :
  "Estimation indicative HT, hors évacuation en décharge classée et hors fournitures.
   Sans valeur contractuelle. Le devis d'Alexandre seul fait foi."
```

Sous les tuiles, **visualisation SVG** des bennes (silhouettes de bennes ampliroll) qui se remplissent au fur et à mesure que les sliders bougent — *c'est ça l'effet wow*. Animation CSS `transition` sur `height` d'un `<rect>` qui représente le contenu.

#### Conversion finale
CTA jaune massif sous les résultats :

> **Obtenir le vrai devis sous 48h →**

Au clic, formulaire qui s'ouvre **pré-rempli** avec les chiffres du calculateur (champ caché ou résumé visible). Champs : prénom, téléphone, code postal, message. Soumission → mailto: ou fetch POST vers un endpoint à définir (Formspree, Resend, n8n…).

**Important** : afficher en tout petit sous les chiffres :
> *Estimation indicative pour information. Le devis officiel d'Alexandre prend en compte l'accès chantier, les évacuations imposées, les terrassements en finition manuelle, et reste seul contractuel.*

### B.8 — Comportement SEO & technique

- `<title>` : `Terrassement Melun (77) — ABTP, le patron sur le chantier`
- `<meta description>` : `Terrassement, assainissement, pavage à Melun et sud Seine-et-Marne. Devis sous 48h, ampliroll en propre, pas de sous-traitance. ABTP — Alexandre Bossée.`
- `lang="fr"` sur `<html>`
- Open Graph + Twitter Card pour partage WhatsApp / Facebook
- Favicon = logo ABTP simplifié
- `prefers-reduced-motion` respecté (animations désactivables)
- Lazy-load des images
- Le numéro de téléphone est cliquable PARTOUT (header, hero, contact, footer)
- `<a href="tel:0782408809">` sur les CTA téléphone

### B.9 — Livrable attendu de Claude Design

Un fichier `index.html` autonome qui :
1. Affiche tout le contenu ci-dessus avec le design system imposé
2. Implémente le calculateur en JS vanilla fonctionnel (sliders → calculs → tuiles → SVG bennes animées)
3. Passe Lighthouse Performance ≥ 90 mobile
4. Tient en moins de 50 ko gzippé (hors polices Google Fonts)
5. Est commenté en français pour qu'on puisse itérer dans Claude Code

### B.10 — Ce qu'on fera APRÈS dans Claude Code

(Pour info de Claude Design, pas à coder maintenant) :
- Intégrer les vraies photos quand Alexandre les fournit
- Brancher le formulaire à Formspree / Resend
- Ajouter un blog `/conseils/` (5 articles SEO : *"Combien coûte un terrassement pour piscine en 2026 ?"*, *"Allée pavée ou enrobée : quoi choisir ?"*, etc.)
- Créer la page `/realisations/` avec galerie avant/après
- Déployer sur Vercel + domaine `abtp77.fr`
- Connecter Google Search Console + créer la fiche Google Business Profile en parallèle

### B.11 — Ce qu'il NE FAUT PAS faire

- ❌ Inventer des témoignages clients ou des chiffres ("+150 chantiers", "10 ans d'expérience")
- ❌ Afficher la note AlloVoisins (3/5 avec 1 avis 1/5 = contre-productif)
- ❌ Inventer un capital social, un n° d'assurance, un n° de police décennale
- ❌ Inventer une raison sociale, modifier la dénomination "ABTP"
- ❌ Mentionner l'article 293 B du CGI (réservé aux micro-entreprises ; ABTP est SARL)
- ❌ Mettre une photo stock de bureau avec costume
- ❌ Mettre une vidéo hero auto-play
- ❌ Mettre un chatbot
- ❌ Utiliser plus de 3 polices
- ❌ Faire un design "agence digitale" (dégradés violets, glassmorphism, blob SVG mauve)
- ❌ Bloquer le scroll, popups intrusives, cookies bar agressive
- ❌ Mettre des animations Framer Motion à chaque scroll — sobriété
- ❌ Afficher des prix TTC sans le préciser (toujours HT, mentionné clairement)
- ❌ Remplir les `{{placeholders}}` du footer avec des valeurs inventées

---

## §C — INSTRUCTION FINALE À CLAUDE DESIGN

> Produis maintenant le fichier `index.html` complet. Si une décision design n'est pas couverte par ce brief, choisis l'option la plus sobre et la plus mobile-friendly. Ne demande pas de précision — propose, on itèrera.
