import { TypeAnimation } from 'react-type-animation';

export default function HeroText() {
  return (
    <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
      Je conçoit des <br />{' '}
      <TypeAnimation
        sequence={[
          'produits numériques.', // Premier texte
          2000,                  // Attend 2 secondes
          'applications mobiles.', // Deuxième texte
          2000,
          'interfaces élégantes.',
          2000,
          'systèmes intelligentes.',
          2000
        ]}
        wrapper="span"
        speed={40}                // Vitesse d'écriture
        className="text-cyan-400" // Tu peux lui mettre ton CSS/Tailwind
        repeat={Infinity}         // Boucle infinie
      />
    </h1>
  );
}