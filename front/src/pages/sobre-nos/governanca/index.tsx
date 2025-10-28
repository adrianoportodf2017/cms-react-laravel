import { Facebook, Twitter, Linkedin, Users, FileCheck, Briefcase, Network } from 'lucide-react';

export const Governanca = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            GOVERNANÇA
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        
        {/* Conselho Deliberativo */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Conselho Deliberativo
            </h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">»</span>
                <p className="text-gray-700">
                  <span className="font-semibold">José Valdir Ribeiro Dos Reis</span> (Presidente)
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">»</span>
                <p className="text-gray-700">Asclepius Ramatiz Lopes Soares</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">»</span>
                <p className="text-gray-700">Mauro Braga de Souza</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">»</span>
                <p className="text-gray-700">Adézio de Almeida Lima</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">»</span>
                <p className="text-gray-700">Elvira Cruvinel Ferreira</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">»</span>
                <p className="text-gray-700">Magno Soares dos Santos</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">»</span>
                <p className="text-gray-700">Sandra Regina de Miranda</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Conselho Fiscal */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Conselho Fiscal
            </h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">»</span>
                <p className="text-gray-700">José Alípio Dos Santos</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">»</span>
                <p className="text-gray-700">Hayton Jurema da Rocha</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">»</span>
                <p className="text-gray-700">Cláudio de Castro Vasconcelos</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Comitê Executivo */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Comitê Executivo
            </h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-purple-500">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold mt-1">»</span>
                <p className="text-gray-700">
                  <span className="font-semibold">Juscineide Souza Pimentel</span> - Superintendente
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold mt-1">»</span>
                <p className="text-gray-700">
                  <span className="font-semibold">Marcos Rafael de Oliveira Raymundo</span> - Gerente
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Organograma */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Organograma
            </h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-orange-500">
            <div className="flex justify-center">
              <img 
                src="https://ic-cf.org.br/images/organograma-cooperforte.png" 
                alt="Organograma - Instituto Cooperforte"
                className="w-full max-w-4xl h-auto rounded-lg shadow-md"
              />
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