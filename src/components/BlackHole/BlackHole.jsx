'use client'

import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function FactCard({ title, content, index, isActive, onClick }) {
  const cardRef = useRef()
  
  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        delay: index * 0.1,
        ease: "back.out(1.7)"
      }
    )
  }, [index])

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`p-6 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isActive 
          ? 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-purple-400/50 shadow-lg shadow-purple-500/20' 
          : 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 hover:border-purple-400/50'
      }`}
    >
      <div className="flex items-start mb-3">
        <div className={`w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0 ${
          isActive ? 'bg-purple-400 shadow-[0_0_10px_2px_rgba(192,132,252,0.5)]' : 'bg-purple-600'
        }`} />
        <h3 className="text-lg font-semibold text-white mb-2 font-orbitron">{title}</h3>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{content}</p>
    </div>
  )
}

function SpacetimeCurvature() {
  const svgRef = useRef()
  
  return (
    <div className="relative h-96 w-full rounded-xl overflow-hidden border border-purple-500/30 shadow-lg shadow-purple-500/10 bg-black p-4">
      <svg 
        ref={svgRef} 
        viewBox="0 0 800 400" 
        className="w-full h-full"
      >
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(100, 100, 255, 0.3)" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)"/>
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(100, 100, 255, 0.5)" strokeWidth="1"/>
          </pattern>
          
          <radialGradient id="blackHoleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="70%" stopColor="#000000" />
            <stop offset="90%" stopColor="#4a00e0" />
            <stop offset="100%" stopColor="#8e2de2" />
          </radialGradient>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <path
          d="M 0,200 Q 350,150 400,200 Q 450,250 800,200"
          fill="none"
          stroke="url(#blackHoleGradient)"
          strokeWidth="3"
          className="animate-pulse"
        />
        <path
          d="M 0,150 Q 350,120 400,200 Q 450,280 800,250"
          fill="none"
          stroke="url(#blackHoleGradient)"
          strokeWidth="2"
          strokeOpacity="0.7"
        />
        <path
          d="M 0,250 Q 350,180 400,200 Q 450,220 800,150"
          fill="none"
          stroke="url(#blackHoleGradient)"
          strokeWidth="2"
          strokeOpacity="0.7"
        />
        
        <circle cx="400" cy="200" r="40" fill="url(#blackHoleGradient)" filter="url(#glow)" />
        <circle cx="400" cy="200" r="45" fill="none" stroke="#ff0066" strokeWidth="2" strokeDasharray="5,5" />
        
        <circle cx="400" cy="200" r="50" fill="none" stroke="#ff3300" strokeWidth="2" className="animate-pulse" />
        
        <g className="animate-spin-slow" style={{ transformOrigin: '400px 200px' }}>
          <circle cx="500" cy="200" r="5" fill="#4d79ff" />
          <circle cx="450" cy="250" r="4" fill="#4d79ff" />
          <circle cx="350" cy="150" r="6" fill="#4d79ff" />
        </g>
        
        {/* Legendas */}
        <text x="400" y="120" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">Curvatura do Espaço-Tempo</text>
        <text x="400" y="270" textAnchor="middle" fill="#ff3300" fontSize="12">Horizonte de Eventos</text>
        <text x="400" y="290" textAnchor="middle" fill="#4d79ff" fontSize="12">Matéria sendo absorvida</text>
      </svg>
      
      
    </div>
  )
}


export default function BlackHoleSection() {
  const [activeInfo, setActiveInfo] = useState('curvatura')
  const sectionRef = useRef()
  const titleRef = useRef()
  const descRef = useRef()

  useEffect(() => {
    const handleInfoClick = (event) => {
      setActiveInfo(event.detail)
    }

    window.addEventListener('infoClick', handleInfoClick)
    return () => window.removeEventListener('infoClick', handleInfoClick)
  }, [])

  useGSAP(() => {
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    )
    
    gsap.fromTo(descRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power3.out" }
    )

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      onEnter: () => {
        gsap.to(sectionRef.current, {
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        })
      }
    })
  }, [])

  const facts = [
    {
      id: 'formacao',
      title: "Formação dos Buracos Negros",
      content: "São formados quando estrelas massivas colapsam sob sua própria gravidade após esgotarem seu combustível nuclear."
    },
    {
      id: 'tamanho',
      title: "Gigantes Cósmicos",
      content: "O maior buraco negro conhecido está no centro da galáxia M87, com massa 6,5 bilhões de vezes maior que a do Sol."
    }
  ]

  return (
    <section 
      ref={sectionRef} 
      id="resources" 
      className="min-h-screen py-20 px-4 relative overflow-hidden"
    >
      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="text-5xl md:text-6xl font-bold text-white mb-6 font-orbitron tracking-wider">
            BURACOS NEGROS
          </h2>
          <p ref={descRef} className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            Os fenômenos mais <span className="text-purple-400 font-semibold">misteriosos</span> e <span className="text-purple-400 font-semibold">fascinantes</span> do cosmos. 
            Explore como essas maravilhas cósmicas <span className="text-purple-400 font-semibold">distorcem</span> o próprio tecido do espaço-tempo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          <div className="relative">
            <SpacetimeCurvature activeInfo={activeInfo} />
            
           
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-white mb-4 font-orbitron">FORMAÇÃO CÓSMICA</h3>
              <p className="text-gray-300 leading-relaxed">
                Buracos negros se formam quando estrelas massivas, com pelo menos <span className="text-purple-300">20 vezes a massa do Sol</span>, 
                esgotam seu combustível nuclear e colapsam sob sua própria gravidade. Este colapso cria uma 
                <span className="text-purple-300"> singularidade</span> - um ponto de densidade infinita onde as leis da física como as conhecemos deixam de funcionar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facts.map((fact, index) => (
                <FactCard
                  key={fact.id}
                  title={fact.title}
                  content={fact.content}
                  index={index}
                  isActive={activeInfo === fact.id}
                  onClick={() => setActiveInfo(fact.id)}
                />
              ))}
            </div>
          </div>
        </div>

        
        <div className="mt-16 p-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30">
          <h3 className="text-2xl font-semibold text-white mb-4">Entendendo a Curvatura do Espaço-Tempo</h3>
          <p className="text-gray-300 mb-4">
            De acordo com a teoria da relatividade geral de Einstein, a gravidade não é uma força que atrai objetos,
            mas sim uma curvatura no tecido do espaço-tempo causada pela presença de massa e energia.
          </p>
          <p className="text-gray-300">
            Buracos negros criam as curvaturas mais extremas no universo, distorcendo tanto o espaço-tempo que
            criam uma "singularidade" - um ponto de densidade infinita onde as leis da física como as conhecemos deixam de funcionar.
          </p>
        </div>
      </div>
      
    </section>
  )
}