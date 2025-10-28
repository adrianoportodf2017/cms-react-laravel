import { Facebook, Twitter, Linkedin, Target, Heart, Briefcase } from 'lucide-react';

export const PropostoValoresNegocio = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            PROPÓSITO, VALORES E NEGÓCIO
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
                Quem Somos
              </h2>
              <p className="text-gray-700 text-justify leading-relaxed mb-4">
                O Instituto Cooperforte é uma Associação para Promoção Humana e Desenvolvimento Social, criada em 2003 pela COOPERFORTE para ampliar o alcance de suas iniciativas sociais.
              </p>
              <p className="text-gray-700 text-justify leading-relaxed mb-4">
                Considerado como Organização da Sociedade Civil de Interesse Público – OSCIP, o Instituto reúne e alinha práticas de responsabilidade social, cumprindo o sétimo princípio do cooperativismo: "Interesse pela Comunidade".
              </p>
              <p className="text-gray-700 text-justify leading-relaxed mb-6">
                Com atuação nacional, o Instituto contribui para a transformação socioeconômica de pessoas e organizações sociais, a partir da capacitação e inserção no mundo do trabalho. Em 22 anos de história, já beneficiou diretamente mais de 25 mil pessoas e cerca de 100 mil de forma indireta.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Nossa Atuação
              </h2>
              <p className="text-gray-700 text-justify leading-relaxed mb-4">
                O Instituto Cooperforte atua em busca das melhores práticas para transformação de pessoas e organizações sociais, disseminando a cultura da cooperação, multiplicando conhecimento e transformando realidades.
              </p>
              <p className="text-gray-700 text-justify leading-relaxed mb-4">
                Nosso foco está na capacitação e inserção de jovens, adultos e pessoas com deficiência, em situação de vulnerabilidade social, no mundo do trabalho, em sintonia com os Objetivos de Desenvolvimento Sustentável (ODS) da Agenda 2030 da ONU.
              </p>
              <p className="text-gray-700 text-justify leading-relaxed mb-6">
                Atendemos principalmente aos princípios de Educação de Qualidade (ODS 4) e Trabalho Decente e Crescimento Econômico (ODS 8).
              </p>
            </div>

            {/* Button */}
            <div className="pt-4">
             <a  href="https://www.cf.coop.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full md:w-auto text-center px-8 py-3 border-2 border-black text-black font-semibold rounded hover:bg-yellow-400 hover:border-yellow-400 hover:text-black transition-colors"
              >
                COOPERFORTE
              </a>
            </div>
          </div>

          {/* Right Column - Propósito, Valores e Negócio Cards */}
          <div className="space-y-6">
            {/* Propósito */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Propósito
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Transformar realidades socioeconômicas de pessoas e organizações sociais, em sintonia com a Agenda 2030 da Organização das Nações Unidas (ONU).
              </p>
            </div>

            {/* Valores */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Valores
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-gray-700 font-semibold">Solidariedade</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-gray-700 font-semibold">Sustentabilidade</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-gray-700 font-semibold">Integridade</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-gray-700 font-semibold">Diversidade</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-gray-700 font-semibold">Cidadania</p>
                </div>
              </div>
            </div>

            {/* Negócio */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Negócio
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Inclusão socioprodutiva de pessoas em situação de vulnerabilidade social por meio de projetos e ações com o objetivo de promover o desenvolvimento humano e profissional, capacitando e inserindo jovens, adultos e pessoas com deficiência no mundo do trabalho.
              </p>
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