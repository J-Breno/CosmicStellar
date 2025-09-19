'use client';

import PlanetCarousel from './PlanetCarousel';
import PlanetControls from './Controls';
import { usePlanetCarousel } from '@/hooks/usePlanetCarousel';
import { useEffect, useState } from 'react';

type Planet = 'terra' | 'marte' | 'venus' | 'lua';

export default function Hero() {
  const { currentPlanet } = usePlanetCarousel();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    return () => setIsVisible(false);
  }, []);

  const planetInfo: Record<Planet, { title: string, description: string, curiosities: string[] }> = {
    terra: {
      title: 'Terra',
      description: 'A Terra é o único planeta conhecido a abrigar vida. Com sua atmosfera rica em oxigênio e água em estado líquido, ela é nosso lar.',
      curiosities: [
        'A Terra gira a cerca de 1.670 km/h em seu eixo.',
        'A superfície da Terra é coberta por cerca de 70% a 71% de água',
      ]
    },
    marte: {
      title: 'Marte',
      description: 'Marte possui paisagens desérticas e sua atmosfera fina. Ele é considerado um candidato para futura colonização humana.',
      curiosities: [
        'Marte tem duas luas pequenas, Fobos e Deimos.',
        'A temperatura média em Marte é de -63°C.',
      ]
    },
    venus: {
      title: 'Vênus',
      description: 'Vênus, o planeta mais quente do sistema solar, é envolto por uma espessa camada de nuvens de ácido sulfúrico.',
      curiosities: [
        'Vênus o Sol nasce no oeste e se põe no leste.',
        'A temperatura média em Vênus é cerca de 462°C.',
      ]
    },
    lua: {
      title: 'Lua',
      description: 'A Lua é nosso satélite natural, Sua presença influencia as marés da Terra.',
      curiosities: [
        'Ela está se afastando da Terra a uma taxa de aproximadamente 3,8 cm por ano.',
        'A Lua tem um lado oculto que nunca pode ser visto diretamente da Terra.',
      ]
    }
  };

  const info = planetInfo[currentPlanet as Planet];

  return (
    <section id='home' className="relative min-h-screen flex items-center justify-center overflow-hidden hero-container -mt-6">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-white">
            <h2 className="text-4xl lg:text-5xl font-orbitron font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200 inline-block planet-content">
                {info.title}
            </h2>

            <p className="text-lg md:text-xl text-gray-200 font-poppins mb-10 leading-relaxed border-l-4 border-cyan-500/50 pl-6 py-2 transition-all duration-500 hover:border-cyan-400/80 planet-content">
                {info.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {info.curiosities.map((curiosity, index) => (
                <div 
                    key={index} 
                    className="glass-effect p-6 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:scale-[1.02] group planet-content"
                    style={{ animationDelay: `${index * 200}ms` }}
                >
                    <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 mr-3 group-hover:animate-pulse"></div>
                    <h3 className="text-sm uppercase tracking-widest text-cyan-300 font-semibold">FATO #{index + 1}</h3>
                    </div>
                    <p className="text-lg font-medium text-white group-hover:text-cyan-50 transition-colors">{curiosity}</p>
                </div>
                ))}
            </div>
            </div>

          <div className="lg:w-200 flex justify-center transform transition-all duration-700 delay-300"
               style={{ 
                 opacity: isVisible ? 1 : 0, 
                 transform: isVisible ? 'translateX(0)' : 'translateX(30px)' 
               }}>
            <PlanetCarousel />
          </div>
        </div>

        <div className="flex justify-center transform transition-all duration-700 delay-500"
             style={{ 
               opacity: isVisible ? 1 : 0, 
               transform: isVisible ? 'translateY(0)' : 'translateY(20px)' 
             }}>
          <PlanetControls />
        </div>
      </div>
    </section>
  );
}