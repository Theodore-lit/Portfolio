import React, { useState } from "react";
import { Home, FileArchive, User, Backpack, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-semibold text-2xl tracking-tight text-primary">
          Port<span className="text-white">folio</span>
        </a>

        {/* Navigation Desktop */}
        <div className="hidden md:flex items-center gap-9 text-sm text-muted-foreground">
          <a href="#home" className="hover:text-foreground flex gap-1 transition-colors">
            <Home className="size-4" /> <span>Accueil</span>
          </a>
          <a href="#work" className="hover:text-foreground flex gap-1 transition-colors">
            <FileArchive className="size-4" /> <span>Projets</span>
          </a>
          <a href="#about" className="hover:text-foreground flex gap-1 transition-colors">
            <User className="size-4" /> <span>À propos</span>
          </a>
          <a href="#stack" className="hover:text-foreground flex gap-1 transition-colors">
            <Backpack className="size-4" /> <span>Stack</span>
          </a>
        </div>

        {/* Bouton Contact Desktop */}
        <Button
          asChild
          size="sm"
          className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <a href="#contact">Travailler ensemble</a>
        </Button>

        {/* Bouton Hamburger / Fermeture Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 focus:outline-none pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="size-5 text-white" />
          ) : (
            <Menu className="size-5 text-white" />
          )}
        </button>
      </nav>

      {/* Menu Déroulant Mobile */}
      {isOpen && (
        <div className="md:hidden flex flex-col p-5 items-start gap-7 text-sm text-muted-foreground bg-background/95 border-b border-border/50">
          <a href="#home" onClick={toggleMenu} className="hover:text-foreground items-center flex gap-1 text-lg transition-colors">
            <Home className="size-4" /> <span>Accueil</span>
          </a>
          <a href="#work" onClick={toggleMenu} className="hover:text-foreground items-center flex gap-1 text-lg transition-colors">
            <FileArchive className="size-4" /> <span>Projets</span>
          </a>
          <a href="#about" onClick={toggleMenu} className="hover:text-foreground items-center flex gap-1 text-lg transition-colors">
            <User className="size-4" /> <span>À propos</span>
          </a>
          <a href="#stack" onClick={toggleMenu} className="hover:text-foreground items-center flex gap-1 text-lg transition-colors">
            <Backpack className="size-4" /> <span>Stack</span>
          </a>
          <a href="#contact" onClick={toggleMenu} className="text-primary hover:text-primary/90 flex gap-1 text-lg transition-colors font-medium">
            Travailler ensemble
          </a>
        </div>
      )}
    </header>
  );
}