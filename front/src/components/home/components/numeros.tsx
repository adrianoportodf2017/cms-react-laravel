import { useState, useEffect } from 'react'

// Hook para animação de contadores
function useCounter(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * (end - start) + start))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, start])

  return count
}
interface StatCardProps {
  number: number
  label: string
  delay?: number
}
// Componente para card individual
function StatCard({ number, label, delay = 0 }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const animatedNumber = useCounter(isVisible ? number : 0, 2000)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border-l-4 border-[#ffcc00]">
      <div className="text-3xl font-bold text-[#ffcc00] mb-2">
        {formatNumber(animatedNumber)}
      </div>
      <div className="text-gray-600 text-sm font-medium">
        {label}
      </div>
    </div>
  )
}

export function Numeros() {
  const stats = [
    { number: 171146, label: "Atendimentos totais" },
    { number: 218960, label: "Doações de itens" },
    { number: 99810, label: "Toneladas de alimentos" },
    { number: 45200, label: "Famílias beneficiadas" },
  ]

  return (
    <section id="numeros" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Instituto <span className="text-[#ffcc00]">COOPERFORTE</span> 2025
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Conheça os números que representam nosso impacto na comunidade
          </p>
        </div>

        {/* Grid de Cards e Imagem lado a lado */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="/mapa-brasil-home-numeros.png"
              className="rounded-lg   w-[550px]"
              alt="Instituto COOPERFORTE"
            />
          </div>

          <div>
            {/* Grid de Cards 2x3 (5 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className={`${index === 4 ? 'sm:col-span-2 sm:max-w-sm sm:mx-auto' : ''}`}>
                  <StatCard
                    number={stat.number}
                    label={stat.label}
                    delay={index * 100}
                  />
                </div>
              ))}
            </div>

             {/* Textos e botões */}
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Fazendo a diferença todos os dias
              </h3>

              {/* Primeiro parágrafo com ícone ODS 4 */}
              <div className="flex flex-col sm:flex-row gap-4 items-start mb-6">
                <p className="text-gray-600 leading-relaxed flex-1">
                  Estamos presentes em todo o território nacional, levando solidariedade e desenvolvimento a quem mais precisa.
                  Cada número representa vidas transformadas, famílias apoiadas e esperança renovada.
                </p>
                <img
                  src="/thumbnail_ODS 4.png"
                  className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
                  alt="ODS 4 - Educação de Qualidade"
                />
              </div>

              {/* Segundo parágrafo com ícone ODS 8 */}
              <div className="flex flex-col sm:flex-row gap-4 items-start mb-6">
                <p className="text-gray-600 leading-relaxed flex-1">
                  Em sintonia com a Agenda 2030 da ONU, contribuímos para o alcance dos Objetivos de Desenvolvimento Sustentável (ODS).
                </p>
                <img
                  src="/thumbnail_ODS 8.png"
                  className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
                  alt="ODS 8 - Trabalho Decente e Crescimento Econômico"
                />
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start mt-8">
                <a
                  href="/institucional"
                  className="bg-[#ffcc00] text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  Sobre nós
                </a>
                <a

                  href="/como-ajudar"
                  className="border-2 border-[#ffcc00] text-[#ffcc00] px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 hover:text-black transition-colors"
                >
                  Como ajudar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}