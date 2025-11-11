export const tailwindBlocks = {
  card: `
    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-md mx-auto">
      <h3 class="text-xl font-bold text-gray-800 mb-2">Título do Card</h3>
      <p class="text-gray-600 mb-4">Este é um card simples com classes Tailwind CSS.</p>
      <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">Ação</button>
    </div>
  `,
  
  grid: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
      <div class="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 text-center">
        <div class="text-3xl mb-3">⚡</div>
        <h4 class="font-bold text-lg mb-2">Rápido</h4>
        <p class="text-sm text-gray-600">Carregamento ultrarrápido</p>
      </div>
      <div class="bg-green-50 p-6 rounded-lg border-2 border-green-200 text-center">
        <div class="text-3xl mb-3">🎨</div>
        <h4 class="font-bold text-lg mb-2">Bonito</h4>
        <p class="text-sm text-gray-600">Design moderno e limpo</p>
      </div>
      <div class="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 text-center">
        <div class="text-3xl mb-3">🔧</div>
        <h4 class="font-bold text-lg mb-2">Customizável</h4>
        <p class="text-sm text-gray-600">Totalmente personalizável</p>
      </div>
    </div>
  `,
  
  hero: `
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-12 rounded-xl text-center my-6">
      <h2 class="text-4xl font-bold mb-4">Hero Section Incrível</h2>
      <p class="text-xl opacity-90 mb-6 max-w-2xl mx-auto">Uma seção hero impressionante com gradiente e tipografia moderna.</p>
      <div class="flex gap-4 justify-center">
        <button class="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold transition">Começar Agora</button>
        <button class="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-bold transition">Saiba Mais</button>
      </div>
    </div>
  `,
  
  buttons: `
    <div class="flex gap-4 flex-wrap my-4">
      <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">Primário</button>
      <button class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition">Secundário</button>
      <button class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition">Sucesso</button>
      <button class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition">Perigo</button>
    </div>
  `
};

export type TailwindBlockType = keyof typeof tailwindBlocks;