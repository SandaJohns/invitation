/* ============================================================
   MAIN.JS = animations, musique 50 Cent - In Da Club & interactions
============================================================ */
"use strict";

const $ = (sel) => document.querySelector(sel);
const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------- 0. ÉCRAN D'OUVERTURE & MUSIQUE IN DA CLUB ---------- */
const rideau = $("#rideau");
const loaderRemplissage = $("#loader-remplissage");
const loaderPct = $("#loader-pct");
const btnEntrer = $("#btn-entrer");
const musique = $("#musique");
const disque = $("#disque");
const playerTexte = $("#player-texte");

let progression = 0;
const intervalleLoader = setInterval(() => {
  progression += Math.floor(Math.random() * 18) + 8;
  if (progression >= 100) {
    progression = 100;
    clearInterval(intervalleLoader);
    loaderPct.textContent = "100 % · Le club est ouvert !";
    btnEntrer.classList.remove("cache");
  } else {
    loaderPct.textContent = progression + " %";
  }
  loaderRemplissage.style.width = progression + "%";
}, 110);

function lancerMusique() {
  musique.play().then(() => {
    disque.classList.add("tourne");
    playerTexte.textContent = "In Da Club (En cours)";
  }).catch(() => {
    playerTexte.textContent = "Lancer In Da Club ▶";
  });
}

btnEntrer.addEventListener("click", () => {
  rideau.classList.add("ouvert");
  document.body.classList.remove("bloque");
  lancerMusique();
  exploser(20);
});

$("#btn-musique").addEventListener("click", () => {
  if (musique.paused) {
    lancerMusique();
  } else {
    musique.pause();
    disque.classList.remove("tourne");
    playerTexte.textContent = "In Da Club (Pause)";
  }
});


/* ---------- 1. APPARITION AU DÉFILEMENT (SCROLL REVEAL) ---------- */
const observateurScroll = new IntersectionObserver((entrees) => {
  entrees.forEach((entree) => {
    if (entree.isIntersecting) {
      entree.target.classList.add("visible");
      observateurScroll.unobserve(entree.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveler").forEach((el) => observateurScroll.observe(el));


/* ---------- 2. COMPTE À REBOURS ---------- */
const rebours = $("#rebours");
const cible = new Date(rebours.dataset.date);

function majRebours() {
  const reste = cible - new Date();
  if (reste <= 0) {
    rebours.textContent = "GO YANIA, IT’S YOUR BIRTHDAY !";
    return false;
  }
  const valeurs = {
    j: Math.floor(reste / 86400000),
    h: Math.floor(reste / 3600000) % 24,
    m: Math.floor(reste / 60000) % 60,
    s: Math.floor(reste / 1000) % 60,
  };
  for (const [unite, v] of Object.entries(valeurs)) {
    rebours.querySelector(`[data-u="${unite}"]`).textContent = v;
  }
  return true;
}
majRebours();
const minuteur = setInterval(() => { if (!majRebours()) clearInterval(minuteur); }, 1000);


/* ---------- 3. BULLES DANS LE VERRE ---------- */
for (let i = 0; i < 16; i++) {
  const b = document.createElement("span");
  b.style.setProperty("--x", Math.random() * 90 + "%");
  b.style.setProperty("--t", 4 + Math.random() * 7 + "px");
  b.style.setProperty("--d", 2 + Math.random() * 2.5 + "s");
  b.style.setProperty("--delai", 3.4 + Math.random() * 3 + "s");
  $("#bulles").append(b);
}


/* ---------- 4. COPIER L'ADRESSE & GÉNÉRATEUR D'EXCUSES ---------- */
$("#btn-copier").addEventListener("click", () => {
  const adresse = $("#adresse-texte").textContent;
  navigator.clipboard.writeText(adresse).then(() => {
    const btn = $("#btn-copier");
    btn.textContent = "Adresse copiée ! ✅";
    setTimeout(() => { btn.textContent = "Copier l'adresse 📋"; }, 2500);
  });
});

const excuses = [
  "« J’ai mangé un yaourt périmé de 2024, je ne peux pas quitter ma salle de bain. »",
  "« Mon chat a avalé mes clés de voiture, j’attends que la nature fasse son travail. »",
  "« Je suis coincé(e) dans l’ascenseur avec un livreur Uber Eats depuis 6 h du matin. »",
  "« J’ai une allergie soudaine aux lundis soir prolongés. »",
  "« Mon réveil était réglé sur le fuseau horaire de Tokyo. »",
  "« J’ai aidé une mamie à traverser… jusqu’à Metz. »",
];
let indexExcuse = 0;

$("#btn-excuse").addEventListener("click", () => {
  $("#texte-excuse").textContent = excuses[indexExcuse];
  $("#texte-excuse").style.color = "var(--ambre)";
  $("#texte-excuse").style.fontWeight = "700";
  indexExcuse = (indexExcuse + 1) % excuses.length;
});


/* ---------- 5. JAUGE D’AMBIANCE (MONTE À 110 %) ---------- */
const etats = [
  [0, "Sobre comme un chameau"],
  [20, "« Non mais moi ce soir je reste sage »"],
  [45, "Début des anecdotes gênantes"],
  [70, "« Go shorty, it’s your birthday ! » 🎤"],
  [90, "Danse sur la table basse"],
  [105, "ALERTE ROUGE : Perte totale de dignité 🚨"],
];

function afficherJauge(p) {
  $("#remplissage").style.width = Math.min(p, 100) + "%";
  $("#pct").textContent = Math.round(p) + " %";
  $("#etat").textContent = etats.filter(([seuil]) => p >= seuil).pop()[1];
}

function monterJauge() {
  if (calme) return afficherJauge(110);
  const debut = performance.now();
  const duree = 4800;
  (function pas(maintenant) {
    const p = Math.min((maintenant - debut) / duree, 1);
    afficherJauge(p * 110);
    if (p < 1) {
      requestAnimationFrame(pas);
    } else {
      $(".barre").classList.add("secouer");
    }
  })(debut);
}

new IntersectionObserver((entrees, obs) => {
  if (entrees[0].isIntersecting) { obs.disconnect(); monterJauge(); }
}, { threshold: 0.6 }).observe($(".barre"));


/* ---------- 6. TRINQUER : PLUIE D'EMOJIS ---------- */
const EMOJIS = ["🥂", "🍻", "🍹", "🎉", "🎂", "🪩", "🔥", "💃"];

function exploser(n = 16) {
  if (calme) return;
  for (let i = 0; i < n; i++) {
    const e = document.createElement("span");
    e.className = "emoji";
    e.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    e.style.setProperty("--x", Math.random() * 95 + "vw");
    e.style.setProperty("--d", 2 + Math.random() * 2 + "s");
    document.body.append(e);
    e.addEventListener("animationend", () => e.remove());
  }
}

let santes = 0;
$("#trinquer").addEventListener("click", () => {
  santes++;
  $("#compteur").textContent = santes;
  exploser();
  if (santes === 5) $("#trinquer").textContent = "Doucement sur le rythme ! 🥴";
  if (santes === 10) $("#trinquer").textContent = "BOIS DE L'EAU MAINTENANT 🚰";
});


/* ---------- 7. LE BOUTON « JE NE VIENS PAS » QUI FUIT ---------- */
const non = $("#non");
const phrases = [
  "Je ne viens pas",
  "Tu cliques mal, vise à gauche !",
  "Même pas pour voir Yania danser ?",
  "Erreur 404 : Excuse introuvable",
  "Mon doigt a glissé sur « Oui »",
  "Bon d’accord, j’arrive avec une bouteille 🍾",
];
let essais = 0;

function fuir() {
  if (essais >= phrases.length - 1) return;
  essais++;
  non.textContent = phrases[essais];
  if (essais === phrases.length - 1) {
    non.style.transform = "none";
    non.style.background = "var(--rose)";
    non.style.borderColor = "var(--rose)";
    return;
  }
  const dx = (Math.random() - 0.5) * 260;
  const dy = (Math.random() - 0.5) * 150;
  const rot = (Math.random() - 0.5) * 30;
  non.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
}

non.addEventListener("pointerenter", fuir);
non.addEventListener("focus", fuir);
non.addEventListener("click", () => {
  if (essais >= phrases.length - 1) $("#oui").click();
});
$("#oui").addEventListener("click", () => exploser(28));