import { Facebook, Twitter, Linkedin } from 'lucide-react';


export const HistoriaIdeologia = () => {
      return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            HISTÓRIA E IDEOLOGIA
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                História e Ideologia
              </h2>
              <p className="text-gray-700 text-justify leading-relaxed mb-4">
                O Instituto Cooperforte foi criado em 2003 com o objetivo de ampliar o alcance das iniciativas sociais da COOPERFORTE, sua instituidora. Considerado como Organização da Sociedade Civil de Interesse Público – OSCIP, o Instituto reúne e alinha práticas de responsabilidade social, cumprindo o sétimo princípio do cooperativismo: "Interesse pela Comunidade".
              </p>
              <p className="text-gray-700 text-justify leading-relaxed mb-4">
                Tem como propósito transformar realidades socioeconômicas de pessoas e organizações sociais, em sintonia com a Agenda 2030 da Organização das Nações Unidas (ONU). E baseia sua atuação em valores pautados pela solidariedade, sustentabilidade, integridade, diversidade e cidadania.
              </p>
              <p className="text-gray-700 text-justify leading-relaxed mb-6">
                O Instituto Cooperforte tem atuação nacional e contribui para a transformação socioeconômica de pessoas e organizações sociais, a partir da capacitação e inserção no mundo do trabalho. Em 22 anos de história, já impactou a vida de mais de 100 mil cidadãos, direta e indiretamente por meio de uma visão ampla do trabalho como meio de transformação social. Entre eles, jovens, adultos e pessoas com deficiência.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Modelo de Atuação
              </h2>
              <p className="text-gray-700 text-justify leading-relaxed mb-4">
                Em 2022, o Instituto adequou seu modelo de negócios, com o intuito de desenvolver parcerias de longo prazo e alcançar mais eficiência no propósito de inserção de pessoas no mundo do trabalho.
              </p>
              <p className="text-gray-700 text-justify leading-relaxed mb-4">
                Em dezembro/2021, foi publicado o Edital de Chamada Pública, tendo como foco a seleção de organizações sociais para apoiar projetos de desenvolvimento de pessoas em situação de vulnerabilidade social, no período de 2022 a 2024, visando a qualificação ou requalificação profissional de jovens e adultos.
              </p>
              <p className="text-gray-700 text-justify leading-relaxed mb-6">
                As OSCs selecionadas pelo Instituto Cooperforte, por meio dos editais, precisam estar alinhados aos Objetivos de Desenvolvimento Sustentável (ODS) da Agenda 2030, visando atender principalmente aos princípios de Educação de Qualidade (ODS 4) e Trabalho Decente e Crescimento Econômico (ODS 8).
              </p>
            </div>

            {/* Button */}
            <div className="pt-4">
              <a
                href="https://www.cf.coop.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full md:w-auto text-center px-8 py-3 border-2 border-black text-black font-semibold rounded hover:bg-yellow-400 hover:border-yellow-400 hover:text-black transition-colors"
              >
                COOPERFORTE
              </a>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <div className="w-32 h-24 mx-auto mb-4 flex items-center justify-center">
                  <img 
                    src="https://ic-cf.org.br/images/160x120.png" 
                    alt="Instituto Cooperforte"
                    className="max-w-full h-auto"
                  />
                </div>
                <p className="text-gray-700 text-sm">
                  Associação para Promoção Humana e Desenvolvimento Social.
                </p>
              </div>

              {/* Card 2 - Propósito */}
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <div className="mx-auto mb-4 flex items-center justify-center">
                  <img 
                    src="https://ic-cf.org.br/images/proposito_ic.png" 
                    alt="Propósito"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="text-gray-800 font-bold text-base mb-3">
                  Propósito
                </h3>
                <p className="text-gray-700 text-sm">
                  Transformar realidades socioeconômicas de pessoas e organizações sociais, em sintonia com a Agenda 2030 da Organização das Nações Unidas (ONU).
                </p>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 3 - Valores */}
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <div className="mx-auto mb-4 flex items-center justify-center">
                  <img 
                    src="https://ic-cf.org.br/images/valores_ic.png" 
                    alt="Valores"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="text-gray-800 font-bold text-base mb-3">
                  Valores
                </h3>
                <div className="text-gray-700 text-sm space-y-1">
                  <p>- Solidariedade</p>
                  <p>- Sustentabilidade</p>
                  <p>- Integridade</p>
                  <p>- Diversidade</p>
                  <p>- Cidadania</p>
                </div>
              </div>

              {/* Card 4 - Negócio */}
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <div className="mx-auto mb-4 flex items-center justify-center">
                  <img 
                    src="https://ic-cf.org.br/images/viso_ic.png" 
                    alt="Negócio"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="text-gray-800 font-bold text-base mb-3">
                  Negócio
                </h3>
                <p className="text-gray-700 text-sm">
                  Inclusão socioprodutiva de pessoas em situação de vulnerabilidade social por meio de projetos e ações com o objetivo de promover o desenvolvimento humano e profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <hr className="border-gray-300" />
      </div>

      {/* Social Share Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center md:justify-start gap-4">
          <span className="text-gray-600 text-sm font-semibold">Compartilhar:</span>
          <div className="flex gap-3">
            <button
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
              aria-label="Compartilhar no Facebook"
            >
              <Facebook className="w-5 h-5 text-white" />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors"
              aria-label="Compartilhar no Twitter"
            >
              <Twitter className="w-5 h-5 text-white" />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center transition-colors"
              aria-label="Compartilhar no LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

 