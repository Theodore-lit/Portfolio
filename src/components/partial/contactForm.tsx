import pro from "@/assets/pro.png";
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Github, Facebook, Mail, Linkedin } from "lucide-react";
import { toast } from 'react-hot-toast'; // 1. Importer toast
import emailjs from '@emailjs/browser';


export default function ContactForm() { // Majuscule à ContactForm (Convention React obligatoire pour les composants)

  // 1. Centralisation des données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    tel: '',
    message: ''
  });


  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // 2. On crée la promesse de l'envoi EmailJS
    const sendEmailPromise = emailjs.send(serviceId, templateId, formData, publicKey)
      .then((response) => {
        // Si ça réussit, on vide le formulaire
        setFormData({ nom: '', email: '', tel: '', message: '' });
        return response; // Important pour la promesse
      });

    // 3. On passe la promesse à React Hot Toast
    toast.promise(sendEmailPromise, {
      loading: 'Envoi de votre message en cours...',
      success: 'Message envoyé avec succès ! 🚀',
      error: "Erreur lors de l'envoi. Veuillez réessayer. ❌",
    });
  };

  // 3. Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      nom: '',
      email: '',
      tel: '',
      message: ''
    })
    // Prêt pour ton fetch / axios !
  };

  return (
    <> {/* Fragment React : Parent unique obligatoire */}
      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-hero)" }} />

      <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 text-center">
        Un projet en tête ?
      </h2>

      <div className="relative max-w-3xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Section Image */}
          <div className="flex justify-center">
            <img
              src={pro}
              alt="photo"
              className="border text-center shadow-lg border-muted-foreground rounded-lg object-cover"
            />
          </div>

          {/* Section Formulaire */}
          <div>
            <form onSubmit={handleSubmit}> {/* Correction : onSubmit branché ici */}
              <fieldset className="space-y-5 my-5">
                <h4 className="text-lg text-primary mb-5 text-start italic">
                  Laissez-moi directement un message
                </h4>

                {/* Correction : Ajout des attributs name sur chaque composant */}
                <Input
                  id="name"
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Theodore"
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="theodore@gmail.com"
                />

                <Input
                  id="tel"
                  name="tel"
                  type="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  required
                  placeholder="+2290154105484"
                />

                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Votre message"
                />

                <Button type="submit" className="w-full">
                  Envoyer
                </Button>
              </fieldset>
            </form>

            {/* Réseaux Sociaux */}
            <div className="mt-12 flex items-center justify-center gap-6">
              <a href="https://github.com/Theodore-lit" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="size-5" />
              </a>
              <a href="https://www.facebook.com/people/Th%25C3%25A9odore-Lma/61561664421427/" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="size-5" />
              </a>
              <a href="mailto:ton-email@exemple.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="size-5" />
              </a>
              <a href="https://www.linkedin.com/in/théodore-lima-1331b8326" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="size-5" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}