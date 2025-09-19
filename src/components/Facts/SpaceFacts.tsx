'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "O que é um buraco negro?",
    answer: "Buracos negros são regiões do espaço onde a gravidade é tão intensa que nada pode escapar, nem mesmo a luz. Eles se formam a partir do colapso de estrelas massivas."
  },
  {
    id: 2,
    question: "Como as estrelas nascem?",
    answer: "As estrelas se formam a partir de grandes nuvens de gás e poeira chamadas de nebulosas. A gravidade faz com que o material se acumule e aqueça, gerando a fusão nuclear."
  },
  {
    id: 3,
    question: "Qual é a maior estrela conhecida?",
    answer: "A maior estrela conhecida é a UY Scuti, que é uma supergigante vermelha localizada a cerca de 9.500 anos-luz da Terra."
  },
  {
    id: 4,
    question: "O que é a matéria escura?",
    answer: "A matéria escura é uma forma de matéria que não emite luz nem radiação, mas tem massa e afeta a gravidade das galáxias e estrelas."
  },
  {
    id: 5,
    question: "O que é a radiação cósmica de fundo?",
    answer: "A radiação cósmica de fundo é a radiação remanescente do Big Bang, que preenche todo o universo e pode ser detectada com antenas de micro-ondas."
  }
];

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );
}

// Predefined star positions to avoid hydration mismatch
const starPositions = [
  { top: "13.14%", left: "91.97%", width: "1.18px", height: "3.47px", opacity: 0.65 },
  { top: "38.63%", left: "90.74%", width: "3.97px", height: "1.10px", opacity: 0.52 },
  { top: "83.19%", left: "47.16%", width: "1.65px", height: "1.60px", opacity: 0.49 },
  { top: "62.15%", left: "0.74%", width: "3.85px", height: "2.75px", opacity: 0.70 },
  { top: "74.09%", left: "4.28%", width: "2.11px", height: "2.93px", opacity: 0.93 },
  { top: "14.98%", left: "28.16%", width: "3.33px", height: "2.58px", opacity: 0.92 },
  { top: "78.39%", left: "39.61%", width: "3.36px", height: "1.18px", opacity: 0.66 },
  { top: "45.09%", left: "16.87%", width: "3.72px", height: "3.95px", opacity: 0.52 },
  { top: "88.76%", left: "17.75%", width: "1.86px", height: "2.29px", opacity: 0.55 },
  { top: "54.01%", left: "66.90%", width: "1.39px", height: "1.53px", opacity: 0.85 },
  { top: "27.39%", left: "16.76%", width: "1.79px", height: "2.21px", opacity: 0.75 },
  { top: "30.58%", left: "80.63%", width: "2.65px", height: "2.03px", opacity: 0.68 },
  { top: "4.62%", left: "75.67%", width: "3.23px", height: "3.67px", opacity: 0.96 },
  { top: "59.36%", left: "76.34%", width: "1.02px", height: "1.61px", opacity: 0.70 },
  { top: "11.47%", left: "49.75%", width: "1.11px", height: "1.66px", opacity: 0.84 }
];

export default function SpaceFactsSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const toggleItem = (id: number) => {
    if (openItems.includes(id)) {
      setOpenItems(openItems.filter(itemId => itemId !== id));
    } else {
      setOpenItems([...openItems, id]);
    }
  };

  return (
    <section 
      id="facts" 
      ref={sectionRef}
      className="min-h-screen py-20 px-4 relative overflow-hidden"
    >
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Fatos Espaciais
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Explore as perguntas mais fascinantes sobre o cosmos e desvende os mistérios do universo.
          </p>
        </motion.div>

        <div className="space-y-6">
          {faqData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative bg-gradient-to-b from-purple-900/20 to-blue-900/20 backdrop-blur-md border border-purple-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 group">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                >
                  <div className="flex items-start">
                    <div className="mr-4 mt-1 text-cyan-400 opacity-80">
                      <StarIcon />
                    </div>
                    <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-300">
                      {item.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 text-cyan-400 flex-shrink-0"
                  >
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openItems.includes(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3 },
                          opacity: { duration: 0.4, delay: 0.1 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3 },
                          opacity: { duration: 0.2 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-12">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 mb-4 rounded-full"></div>
                        <p className="text-gray-200 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 backdrop-blur-sm">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-cyan-400"
            >
              <svg 
                className="w-8 h-8" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </motion.div>
          </div>
          <p className="mt-4 text-purple-300 font-light">Continue explorando o cosmos infinito</p>
        </motion.div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        {starPositions.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.width,
              height: star.height,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </section>
  );
}