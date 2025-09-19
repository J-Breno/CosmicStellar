'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulação de envio
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="min-h-screen py-20 px-4 relative overflow-hidden"
    >
      <div className="stars pointer-events-none"></div>
      <div className="stars2 pointer-events-none"></div>
      <div className="stars3 pointer-events-none"></div>
      
      <div className="absolute top-20 left-10 opacity-30 pointer-events-none">
        <DeathStarIcon className="w-40 h-40 text-purple-500" />
      </div>
      
      <div className="absolute bottom-40 right-10 opacity-20 pointer-events-none">
        <StarDestroyerIcon className="w-48 h-32 text-cyan-400" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="mb-6 flex justify-center"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <DroidIcon className="w-16 h-16 text-cyan-400" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            TEM UMA PERGUNTA PADAWAN?
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Use o terminal de comunicação e nossa equipe da Aliança Rebelde responderá sua mensagem
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg border border-purple-500/30 rounded-xl p-8 shadow-2xl shadow-cyan-500/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 animate-pulse pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-purple-900/10 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-full terminal-scanline pointer-events-none"></div>
              
              <div className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <label htmlFor="name" className="block text-cyan-300 mb-3 font-medium font-orbitron">
                      IDENTIFICAÇÃO
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-purple-900/30 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all duration-300 placeholder-purple-300/40 font-orbitron relative z-20"
                        placeholder="Digite seu nome de usuário"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 }}
                    className="relative"
                  >
                    <label htmlFor="email" className="block text-cyan-300 mb-3 font-medium font-orbitron">
                      FREQUÊNCIA DE COMUNICAÇÃO
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-purple-900/30 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all duration-300 placeholder-purple-300/40 font-orbitron relative z-20"
                        placeholder="seu.codigo@rebelalliance.com"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="relative"
                  >
                    <label htmlFor="message" className="block text-cyan-300 mb-3 font-medium font-orbitron">
                      MENSAGEM
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-5 py-4 bg-purple-900/30 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all duration-300 resize-none placeholder-purple-300/40 font-orbitron relative z-20"
                        placeholder="Transmita sua mensagem para a Aliança..."
                      ></textarea>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="text-center pt-4"
                  >
                    <button
                      type="submit"
                      disabled={isSending}
                      className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-orbitron text-lg rounded-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform duration-300 border border-cyan-400/50 z-20"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isSending ? (
                          <>
                            <HyperspaceJump className="w-5 h-5 mr-2" />
                            HIPERESPAÇO...
                          </>
                        ) : (
                          <>
                            <TransmitIcon className="w-5 h-5 mr-2" />
                            TRANSMITIR MENSAGEM
                          </>
                        )}
                      </span>
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </button>

                    {isSending && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6"
                      >
                        <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                          <motion.div 
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          />
                        </div>
                        <div className="hyperspace-tunnel pointer-events-none">
                          <div className="hyperspace-lines"></div>
                        </div>
                        <p className="text-cyan-300 mt-3 text-sm font-orbitron">Iniciando salto para o hiperespaço...</p>
                      </motion.div>
                    )}
                  </motion.div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-lg border border-cyan-500/50 rounded-xl p-12 shadow-2xl shadow-cyan-500/10 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 animate-pulse pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-purple-900/10 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-full terminal-scanline pointer-events-none"></div>
              
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mb-8"
                >
                  <SuccessIcon className="w-20 h-20 text-cyan-400 mx-auto" />
                </motion.div>
                
                <h3 className="text-3xl font-orbitron text-cyan-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                  TRANSMISSÃO BEM-SUCEDIDA!
                </h3>
                <p className="text-cyan-300 text-lg mb-8 font-orbitron">
                  Sua mensagem foi recebida pela Aliança Rebelde. Que a Força esteja com você!
                </p>
                
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-orbitron rounded-lg hover:scale-105 transition-transform duration-300 border border-cyan-400/50 z-20"
                >
                  ENVIAR NOVA TRANSMISSÃO
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .stars, .stars2, .stars3 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          z-index: 0;
        }
        
        .stars:before, .stars2:before, .stars3:before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-image: radial-gradient(white 1px, transparent 1px);
          background-size: 100px 100px;
          animation: stars-animation 60s linear infinite;
        }
        
        .stars2:before {
          background-size: 200px 200px;
          animation: stars-animation 100s linear infinite;
          opacity: 0.5;
        }
        
        .stars3:before {
          background-size: 300px 300px;
          animation: stars-animation 150s linear infinite;
          opacity: 0.3;
        }
        
        @keyframes stars-animation {
          from { transform: translateY(0) }
          to { transform: translateY(-2000px) }
        }
        
        .terminal-scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(200, 180, 255, 0.03) 10%, 
            rgba(255, 255, 255, 0) 100%);
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
        
        @keyframes scanline {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        
        .hyperspace-tunnel {
          position: relative;
          width: 100%;
          height: 60px;
          margin: 20px 0;
          perspective: 200px;
          overflow: hidden;
        }
        
        .hyperspace-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 5px,
            rgba(100, 200, 255, 0.5) 5px,
            rgba(100, 200, 255, 0.5) 10px
          );
          animation: hyperspace 1s linear infinite;
          transform-origin: center;
          transform: rotateX(60deg);
        }
        
        @keyframes hyperspace {
          0% { transform: rotateX(60deg) translateY(0); }
          100% { transform: rotateX(60deg) translateY(20px); }
        }
      `}</style>
    </section>
  );
}

// Componentes de ícones com tema Star Wars
function DroidIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L9 8.5V10H15V8.5L21 9ZM21 13L15 12.5V14H9V12.5L3 13V15L9 14.5V16H15V14.5L21 15V13ZM21 17L15 16.5V18H9V16.5L3 17V19L9 18.5V20H15V18.5L21 19V17Z" />
    </svg>
  );
}

function DeathStarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
    </svg>
  );
}

function StarDestroyerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2L2,7L12,12L22,7L12,2M2,17L12,22L22,17V12L12,17L2,12V17Z" />
    </svg>
  );
}

function TransmitIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2L2,7L12,12L22,7L12,2M2,17L12,22L22,17V12L12,17L2,12V17Z" />
    </svg>
  );
}

function HyperspaceJump({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SuccessIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
    </svg>
  );
}