import { createFileRoute } from "@tanstack/react-router";
import { motion } from 'framer-motion';
import portrait from "@/assets/profil.png";
import fintrack from "@/assets/projects/fintrack.png";
import docSavvy from "@/assets/projects/docSavvy.png";
import farm from "@/assets/projects/farm.png";
import cityPlay from "@/assets/projects/cityPlay.png";
import HeroText from "@/components/ui/typing";
import StackMarquee from "@/components/stack/stackMarquee"
import Navbar from "@/components/partial/Navbar"
import { Textarea } from "@/components/ui/textarea.tsx";
import aboutSmile from "@/assets/aboutSmile.png";
import ContactForm from "@/components/partial/contactForm"
import {
  ArrowUpRight,
  Code2,
  Smartphone,
  Sparkles,
  MapPin,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "recharts";

import  React from "react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Développeur Web & Mobile" },
      {
        name: "description",
        content:
          "Développeur web et mobile freelance. Je crée des produits numériques modernes, performants et élégants.",
      },
      { property: "og:title", content: "Portfolio — Développeur Web & Mobile" },
      {
        property: "og:description",
        content: "Développeur web et mobile freelance. Je crée des produits numériques modernes.",
      },
    ],
  }),
  component: Index,
});

const projects = [
  {
    title: "FinTrack",
    tag: "Vue Js . Nodejs · MongoDB",
    desc: "Application de suivi financier avec synchronisation bancaire temps réel et insights IA.",
    year: "2026",
    link: "#",
    img: fintrack,
  },

  {
    title: "DocSavvy",
    tag: "Laravel · Vue.js · Supabase",
    desc: "Solution numérique d’apprentissage médical aidant les étudiants à réviser efficacement grâce à des QCM, des cours et des analyses détaillées de progression.",
    year: "2026",
    link: "#",
    img: docSavvy,
  },
  {
    title: "Smart Farm",
    tag: "Vue Js · Node.js · MongoDB",
    desc: "Solution intelligente de gestion agricole intégrant le suivi des cultures, la planification des tâches et l'analyse des données de production.",
    year: "2026",
    link: "#",
    img: farm,
  },
  {
    title: "CityPlay",
    tag: "Laravel · Vue.js · Supabase",
    desc: "Application web gamifiée développée avec Laravel, intégrant des quiz, des énigmes et des parcours interactifs pour valoriser le patrimoine local.",
    year: "2026",
    link: "#",
    img: cityPlay,
  },
];

// des variables pour animer la grid de project
// 1. On définit les règles de l'animation pour le parent et les enfants
const containerVariants = {
  hidden: { opacity: 0.8 },
  visible: {
    opacity: 1,
    transition: {
      // Déclenche l'animation des enfants les uns après les autres (0.15s d'écart)
      staggerChildren: 0.15,
    },
  },
};

const aboutText = {
  hidden: { opacity: 0.5, x: 200, scale: 0.95 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],// Équivalent d'un easeOut premium
      delay: 0.2
    },
  }
}
const aboutImg = {
  hidden: { opacity: 0, x: -200, scale: 0.95 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1] // Équivalent d'un easeOut premium
    },
  }
}



const cardVariants = {
  hidden: {
    opacity: 0.1,
    y: 40
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] // Équivalent d'un easeOut premium
    }
  },
};

const stack = [
  { label: "Front", items: ["React", "Vue.js", "TypeScript", "Tailwind"] },
  { label: "Mobile", items: ["React Native", "Flutter", "Dart", "Swift"] },
  { label: "Back", items: ["Node.js", "MongoDB", "PostgreSQL", "Supabase"] },
  { label: "Outils", items: ["Figma", "Vercel", "Docker", "Git"] },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
    <Navbar/>
      <section id="home"
        className="relative pt-32 pb-24 px-6 overflow-hidden"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/60 text-xs text-muted-foreground mb-8">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              Disponible pour de nouveaux projets
            </div>
            <div className="min-h-30 my-3">
              <HeroText />
            </div>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Développeur web et mobile. Je transforme des idées ambitieuses en interfaces fluides,
              performantes et soignées — du premier wireframe au déploiement.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)]"
              >
                <a href="#work">
                  Voir mes projets <ArrowUpRight className="ml-1 size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border bg-card/40">
                <a href="#contact">Me contacter</a>
              </Button>
            </div>
            <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
              <div>
                <span className="text-foreground font-semibold text-xl">2+</span> ans d'expérience
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <span className="text-foreground font-semibold text-xl">10+</span> projets livrés
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-1">
                <MapPin className="size-3" /> Cotonou - Benin
              </div>
            </div>
          </div>
          <motion.div
            className="relative"
            initial={{ opacity: 0.1, y: 60, scale: 0.95 }} // État de départ (invisible, plus bas, légèrement plus petit)
            animate={{ opacity: 1, y: 0, scale: 1 }}     // État final (visible, à sa place, taille normale)
            transition={{
              duration: 0.8,                             // Durée de l'animation (0.8 seconde)
              ease: [0.16, 1, 0.3, 1],                   // Courbe de vitesse "Custom Ease" ultra fluide (type out-expo)
              delay: 0.2                                 // Petit délai pour laisser le reste de la page charger
            }}
          >
            {/* Lueur d'arrière-plan */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-transparent blur-3xl rounded-full" />

            {/* Conteneur de l'image */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-[var(--shadow-elegant)]">
              <img
                src={portrait}
                alt="Portrait"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="work" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm text-primary mb-2 uppercase tracking-widest">
                Projets sélectionnés
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Travaux récents</h2>
            </div>
            {/* <p className="text-muted-foreground hidden md:block max-w-sm">
              Une sélection de produits que j'ai conçus et développés ces dernières années.
            </p> */}
          </div>
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }} // Se déclenche dès que 10% de la grille est visible
          >
            {projects.map((p) => (
              <motion.a
                key={p.title}
                href={p.link}
                variants={cardVariants}
                // 1. On ajoute 'group' pour les hovers et des styles de base
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden min-h-75 flex flex-col justify-end"
              >
                {/* 2. L'image de fond */}
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* 3. L'overlay sombre pour la lisibilité (Dégradé du noir vers le transparent) */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

                {/* 4. Ton dégradé de couleur principal au Hover (Optionnel, pour garder ta touche de couleur) */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <span className="text-xs absolute top-0 right-0 text-gray-300 font-medium bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                  {p.year}
                </span>

                {/* 5. Le contenu textuel (Obligatoirement en 'relative' et 'z-10' pour passer AU-DESSUS de l'image) */}
                <div className="relative z-10 w-full">
                  <h3 className="text-2xl flex gap-3 font-semibold mb-2 text-white drop-shadow-md">
                    <span>{p.title}</span>
                    <ArrowUpRight className="size-5 text-gray-300 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  </h3>

                  <p className="text-sm text-primary font-medium mb-3">
                    {p.tag}
                  </p>

                  <p className="text-gray-200 text-sm leading-relaxed line-clamp-2 drop-shadow-sm">
                    {p.desc}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 border-t max-h-170 border-border" style={{ backgroundImage: "var(--gradient-hero)" }}>
        <div className="max-w-6xl mx-auto">
          {/* <div className="text-center"> */}
          <p className="text-sm text-center text-primary mb-8 uppercase tracking-widest">À propos</p>
          {/* <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Salut 👋</h2> */}
          {/* </div> */}

          <div className="grid md:grid-cols-2 items-center ">
            <motion.div
              variants={aboutImg}
              initial="hidden"
              whileInView='visible'
              viewport={{ amount: 0.4 }}
              className="flex justify-center">
              <img src={aboutSmile} alt="photo" height="290px" width="230px" className="border text-center rounded-[50%] border-primary animate-pulse"
              />
            </motion.div>
            <motion.div
              variants={aboutText}
              initial="hidden"
              whileInView='visible'
              viewport={{ once: true, amount: 0.4 }}
            >
              <span className="text-xl md:text-3xl font-bold tracking-tight pb-4 text-white">Salut 👋</span>
              <p className="text-lg sm:pt-0 pt-10 md:pb-0 pb-8 text-muted-foreground leading-relaxed">
                <span className="text-white font-semibold text-lg" >Je me nomme Theodore Lima <span className="text-primary" >alias Li't Dev</span>.</span> <br />
                Je suis un développeur passionné par les beaux produits qui fonctionnent. Depuis 2 ans,
                j'accompagne startups et entreprises dans la création d'expériences digitales, du
                concept jusqu'au déploiement. <br /> Mon obsession : l'attention au détail, la performance et
                le soin apporté à chaque interaction avec un esprit créatif.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-primary mb-2 uppercase tracking-widest">Compétences</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
            Ma boîte de compétence
          </h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Code2,
              title: "Développement Web",
              desc: "Sites vitrines, SaaS, e-commerce. Architectures modernes avec React, Next.js et TypeScript.",
            },
            {
              icon: Smartphone,
              title: "Applications Mobile",
              desc: "iOS et Android avec React Native ou Flutter. Performance native, UX soignée.",
            },
            {
              icon: Sparkles,
              title: "Design d'interfaces",
              desc: "Direction artistique, design system et prototypage Figma avant l'intégration.",
            },
          ].map((s) => (
            <div key={s.title} className="p-8 rounded-2xl bg-card border border-border transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/10 ">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <s.icon className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="stack" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-primary mb-2 uppercase tracking-widest">Stack technique</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
            Ma Stack Technique
          </h2>
          <StackMarquee />
        </div>
      </section>
      <section id="contact" className="py-32 px-6 border-t border-border relative overflow-hidden">
      <ContactForm />
      </section>

      <footer className="py-8 px-6 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} build with ❤ by Li't~dev.
      </footer>
    </div>
  );
}
