# Safran Neural Hub
_Plateforme Edge-AI Sécurisée pour l'Analytique RH & l'Assistance Intelligente_

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-async-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![GDPR Compliant](https://img.shields.io/badge/GDPR-Conforme-blueviolet)](https://gdpr.eu/)
[![Edge Ready](https://img.shields.io/badge/Edge-Ready-orange)](#)

---

## 🎯 Objectif du POC

**Safran Neural Hub** est un prototype de qualité industrielle conçu selon le principe **"Privacy-First"** (confidentialité par conception) pour le Hackathon **"Safran Think to Deploy"**.

Il répond aux problématiques opérationnelles critiques des RH — traitement manuel des fichiers CSV, lenteur d'analyse et risques liés aux IA tierces — en proposant une plateforme **Edge-AI locale et sécurisée**. Celle-ci permet d'effectuer des analyses avancées et d'offrir une assistance conversationnelle sans jamais envoyer de données sensibles vers des services cloud tiers.

### Valeur ajoutée clé

* **Traitement local (Edge) :** Architecture prête pour les environnements déconnectés (Air-gapped) afin d'éliminer tout risque d'exfiltration de données
* **Analytique RH :** Génération rapide de KPI et détection automatique de "signaux faibles" (anomalies)
* **Assistant "Bob" :** Un assistant sémantique basé sur le RAG (Retrieval-Augmented Generation) utilisant des embeddings calculés localement

---

## ⚙️ Instructions d'Installation et d'Exécution

Voici les étapes minimales pour exécuter le projet localement en utilisant deux terminaux. Ces instructions supposent que **Python 3.11+** et **Node.js 18+** sont installés sur votre machine.

### 1. Backend (Terminal A)

Mise en place de l'environnement Python et lancement de l'API FastAPI.

```bash
cd backend

# Création de l'environnement virtuel
python -m venv .venv

# Activation de l'environnement
# Windows PowerShell :
.venv\Scripts\Activate.ps1
# Windows CMD :
.venv\Scripts\activate.bat
# macOS / Linux :
source .venv/bin/activate

# Installation des dépendances
pip install -r requirements.txt

# Lancement du serveur
uvicorn main:app --reload --port 8000
```

**Documentation de l'API disponible sur :** [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Frontend (Terminal B)

Installation des dépendances JS et lancement de l'interface Next.js.

```bash
cd frontend

# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev
```

**Application accessible sur :** [http://localhost:3000](http://localhost:3000)

### 3. Identifiants par défaut (Démo)

Pour accéder au tableau de bord, utilisez les identifiants administrateur suivants :

* **Email :** `admin@safran.com`
* **Mot de passe :** `admin123`

> ⚠️ **Note de sécurité :** Ces identifiants sont uniquement pour la démonstration. En production, utilisez un système d'authentification robuste avec mots de passe hachés (bcrypt/argon2).

---

## 🏗 Architecture Technique

* **Frontend :** Next.js 14 (App Router) — Interface industrielle sur-mesure avec Tailwind CSS
* **Backend :** FastAPI (Python asynchrone) — Modèles Pydantic, Authentification JWT
* **Intelligence :** RAG Local utilisant SentenceTransformers + Scikit-Learn pour l'analytique
* **Données :** SQLite (local, chiffré au repos recommandé pour la production)

Cette architecture est intentionnellement conçue **"Edge-first"** pour garantir la souveraineté des données et réduire la surface d'attaque dans les déploiements industriels.

### Diagramme d'Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Conteneur Docker (Isolé)                 │
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │  Frontend UI │ ───► │ API Gateway  │ ───► │Persistence│ │
│  │  Next.js 14  │      │   FastAPI    │      │  SQLite   │ │
│  └──────────────┘      └──────┬───────┘      └───────────┘ │
│                               │                              │
│                               ▼                              │
│                        ┌──────────────┐                      │
│                        │  Moteur IA   │                      │
│                        │    Local     │                      │
│                        │ Transformers │                      │
│                        └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Fonctionnalités Clés

### 📊 Analytique RH

* Pipeline d'ingestion CSV → Génération automatisée de KPI (satisfaction, volume, tendances)
* Analyse de sentiment et insights temporels
* Détection de signaux faibles (alertes précoces sur les dérives de formation)

### 🤖 "Bob" — Assistant RAG Local

* Embeddings générés via SentenceTransformers et stockés localement
* Génération Augmentée par la Récupération (RAG) pour des réponses contextuelles
* Aucun appel API sortant : risque d'exfiltration de données nul

### 🔒 Cœur de Sécurité

* Authentification JWT et conception prête pour le RBAC (rôles)
* Sanitization des entrées pour mitiger les vecteurs d'attaque XSS / SQLi
* Compatible Air-gapped ; traitement des données aligné avec le RGPD (minimisation)

---

## 🛡 Pourquoi cette architecture ? (Approche Cyber / Industrielle)

**Sécurité & Souveraineté :** L'exécution locale des embeddings et du RAG supprime les dépendances externes et les vecteurs d'exfiltration vers le Cloud.

**Latence Prévisible :** L'utilisation de SQLite et de modèles in-process assure des réponses cohérentes et rapides, cruciales pour les flux opérationnels.

**Surface d'Attaque Minimale :** Moins de composants mobiles et pas de stockage géré par le Cloud simplifient l'audit, la conformité et le durcissement (hardening).

**Compromis Pragmatique pour POC :** SQLite + modèles locaux accélèrent le développement et la reproductibilité pour le hackathon tout en restant extensibles pour la production.

---

## 📂 Structure du Projet

```
safran-neural-hub/
├── backend/
│   ├── auth.py                      # Gestion JWT et authentification
│   ├── database.py                  # Configuration SQLite
│   ├── main.py                      # Application FastAPI + endpoints
│   ├── models.py                    # Modèles Pydantic
│   ├── services/
│   │   ├── analysis_service.py      # Pipeline analytique RH
│   │   └── chatbot_service.py       # Moteur RAG local
│   └── requirements.txt             # Dépendances Python
├── frontend/
│   ├── app/
│   │   ├── (dashboard)/             # Routes du tableau de bord
│   │   ├── login/                   # Page d'authentification
│   │   └── layout.tsx               # Layout global
│   ├── components/                  # Composants React réutilisables
│   ├── package.json                 # Dépendances Node.js
│   └── next.config.js               # Configuration Next.js
├── data/
│   ├── RH_infos.csv                 # Données RH (exemple)
│   └── evaluation_formation.csv     # Évaluations de formation
└── README.md                        # Ce fichier
```

---

## 🚀 Déploiement en Production

### Recommandations pour un environnement industriel

1. **Conteneurisation :** Utiliser Docker avec images multi-stage pour réduire la surface d'attaque
2. **Chiffrement :** Activer SQLCipher ou équivalent pour le chiffrement au repos de la base de données
3. **Secrets Management :** Utiliser des variables d'environnement sécurisées (Vault, AWS Secrets Manager)
4. **Reverse Proxy :** Déployer derrière Nginx/Traefik avec certificats TLS (Let's Encrypt)
5. **Monitoring :** Intégrer Prometheus + Grafana pour la supervision
6. **Audit Logs :** Activer les logs structurés (JSON) avec rotation automatique

### Pipeline DevSecOps

```
Commit → Linting → SAST → Build → Scan → Deploy
  ↓        ↓        ↓       ↓       ↓       ↓
 Git   Flake8   Bandit  Docker  Trivy  Registry
```

---

## 📝 Licence et Conformité

* **Projet Hackathon :** Code fourni à titre démonstratif
* **RGPD :** Architecture conforme par conception (minimisation des données, traitement local)
* **Dépendances Open Source :** Voir `requirements.txt` et `package.json` pour les licences tierces

---

## 👥 Équipe Srataero

* **CHOUBIK Houssam** — Architecture & Backend
* **TARIRHI Asmaâ** — Frontend & UX/UI
* **SABBAHI Mohammed Ilias** — IA & Data Science

**Contact :** [choubikhoussam@gmail.com](mailto:choubikhoussam@gmail.com)

---

## 🙏 Remerciements

Merci à **Safran** et **Think to Deploy** pour l'opportunité de démontrer une approche Edge-AI sécurisée et souveraine pour les cas d'usage industriels critiques.

---

**Made with 🛡️ Security-First mindset | Edge-AI for Industrial Grade Systems**