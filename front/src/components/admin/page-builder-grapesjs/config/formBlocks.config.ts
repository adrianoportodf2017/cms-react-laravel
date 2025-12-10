// Em algum config tipo formBlocks.config.ts
export const registerFormBlocks = (editor: any) => {
  const domc = editor.DomComponents;
  const blockManager = editor.BlockManager;

  domc.addType('cf-form', {
    // opcional, mas ajuda o Grapes a reconhecer o form sozinho
    isComponent: (el: HTMLElement) => {
      if (el.tagName === 'FORM' && el.hasAttribute('data-cf-form')) {
        return { type: 'cf-form' };
      }
      return false;
    },
    extend: 'form',
    model: {
      defaults: {
        tagName: 'form',
        attributes: {
          'data-cf-form': 'true',
          'data-endpoint': '/api/form',
          'data-method': 'POST',
          'data-payload-type': 'json',
          'data-success-message': 'Formulário enviado com sucesso!',
          'data-error-message': 'Não foi possível enviar. Tente novamente.',
          class: 'space-y-6',
        },
        traits: [
          {
            type: 'text',
            name: 'data-endpoint',       // tem que ser IGUAL ao atributo
            label: 'Endpoint de envio',
            placeholder: '/api/form/associacao',
          },
          {
            type: 'select',
            name: 'data-method',
            label: 'Método',
            options: [
              { id: 'POST', label: 'POST' },
              { id: 'GET', label: 'GET' },
            ],
            default: 'POST',
          },
          {
            type: 'select',
            name: 'data-payload-type',
            label: 'Formato do payload',
            options: [
              { id: 'json', label: 'JSON' },
              { id: 'form-data', label: 'FormData' },
            ],
            default: 'json',
          },
          {
            type: 'text',
            name: 'data-success-message',
            label: 'Mensagem de sucesso',
          },
          {
            type: 'text',
            name: 'data-error-message',
            label: 'Mensagem de erro',
          },
        ],
      },
    },
  });

  // bloco usando esse tipo
  blockManager.add('cf-form-contato', {
    label: 'Formulário de Contato',
    category: 'Formulários',
        attributes: { class: 'fa fa-envelope' },

    content: `
      <form
        data-gjs-type="cf-form"
        data-cf-form="true"
        data-endpoint="/api/contato"
        data-method="POST"
        data-payload-type="json"
        data-success-message="Mensagem enviada com sucesso!"
        data-error-message="Não foi possível enviar sua mensagem. Tente novamente."
        class="space-y-6 p-3 bg-white rounded-lg shadow-md"
      >
        <!-- teus campos aqui -->
         <!-- Linha: Nome + E-mail -->
      <div class="grid gap-6 md:grid-cols-2">
        <div>
          <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            placeholder="Seu nome completo"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border--ffcc00- focus:outline-none transition"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="seu@email.com"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border--ffcc00- focus:outline-none transition"
          />
        </div>
      </div>

      <!-- Linha: Telefone + Assunto -->
      <div class="grid gap-6 md:grid-cols-2">
        <div>
          <label for="telefone" class="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            placeholder="(11) 98765-4321"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border--ffcc00- focus:outline-none transition"
          />
        </div>

        <div>
          <label for="assunto" class="block text-sm font-medium text-gray-700 mb-2">
            Assunto *
          </label>
          <input
            type="text"
            id="assunto"
            name="assunto"
            required
            placeholder="Sobre o que é a sua mensagem?"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border--ffcc00- focus:outline-none transition"
          />
        </div>
      </div>

      <!-- Mensagem -->
      <div>
        <label for="mensagem" class="block text-sm font-medium text-gray-700 mb-2">
          Mensagem *
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          required
          rows="5"
          placeholder="Digite sua mensagem aqui..."
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border--ffcc00- focus:outline-none transition resize-none"
        ></textarea>
      </div>

      <!-- LGPD / Aceite -->
      <div class="bg-gray-50 rounded-lg p-4">
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            id="aceite"
            name="aceite"
            class="mt-1 w-4 h-4 text--ffcc00- border-gray-300 rounded focus:ring--ffcc00-"
          />
          <span class="text-sm text-gray-700">
            Autorizo o uso dos meus dados para contato e concordo com a
            <a href="#" class="text--ffcc00- font-semibold hover:underline">política de privacidade</a>.
          </span>
        </label>
      </div>

      <!-- Botão Enviar -->
      <div class="space-y-3">
        <button
          type="submit"
          class="w-full px-8 py-4 bg--ffcc00- text-black font-bold text-lg rounded-lg hover:bg-yellow-400 transition shadow-lg hover:shadow-xl"
        >
          Enviar Mensagem
        </button>
        <p class="text-sm text-gray-500 text-center">
          Os campos marcados com * são obrigatórios.
        </p>
      </div>

      <!-- Mensagem de retorno -->
      <div class="cf-form-message mt-4 text-sm"></div>
      </form>
    `.trim(),
  });
};
