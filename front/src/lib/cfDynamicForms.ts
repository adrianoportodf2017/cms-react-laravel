// src/utils/cfDynamicForms.ts
import { axiosConfig } from '../lib/axios';

type RootElement = Document | HTMLElement;

export function initCfDynamicForms(root: RootElement = document) {
  const forms = root.querySelectorAll<HTMLFormElement>('form[data-cf-form="true"]');

  forms.forEach((form) => {
    // Evita bind duplicado se o React re-renderizar o container
    if ((form as any)._cfBound) return;
    (form as any)._cfBound = true;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const endpoint = form.getAttribute('data-endpoint') || '/associados/public';
      const method = (form.getAttribute('data-method') || 'POST').toUpperCase();
      const payloadType = form.getAttribute('data-payload-type') || 'json';
      const successMessage =
        form.getAttribute('data-success-message') ||
        'Formulário enviado com sucesso!';
      const errorMessage =
        form.getAttribute('data-error-message') ||
        'Não foi possível enviar. Tente novamente.';

      if (!endpoint) {
        console.error('Form dinâmico sem endpoint configurado');
        return;
      }

      const submitBtn =
        form.querySelector<HTMLButtonElement>('button[type="submit"], [type="submit"]');

      const msgBox =
        form.querySelector<HTMLDivElement>('.cf-form-message') ||
        (() => {
          const el = document.createElement('div');
          el.className = 'cf-form-message mt-4 text-sm';
          form.appendChild(el);
          return el;
        })();

      const setMessage = (type: 'success' | 'error', text: string) => {
        msgBox.innerHTML = text;
        msgBox.className =
          'cf-form-message mt-4 text-sm rounded-lg px-4 py-3 border ' +
          (type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800');
      };

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.dataset.originalText = submitBtn.innerText;
          submitBtn.innerText = 'Enviando...';
        }

        const formData = new FormData(form);

        let data: any = null;
        let params: any = undefined;

        if (method === 'GET') {
          // GET: manda tudo como query string
          const obj: Record<string, any> = {};
          formData.forEach((value, key) => {
            if (obj[key] !== undefined) {
              obj[key] = Array.isArray(obj[key])
                ? [...obj[key], value]
                : [obj[key], value];
            } else {
              obj[key] = value;
            }
          });
          params = obj;
        } else {
          // POST/PUT/etc
          if (payloadType === 'json') {
            const obj: Record<string, any> = {};
            formData.forEach((value, key) => {
              if (obj[key] !== undefined) {
                obj[key] = Array.isArray(obj[key])
                  ? [...obj[key], value]
                  : [obj[key], value];
              } else {
                obj[key] = value;
              }
            });
            data = obj;
          } else {
            // form-data
            data = formData;
          }
        }

        const response = await axiosConfig.request({
          url: endpoint,
          method: method as any,
          data,
          params,
          // axios já seta o Content-Type de FormData sozinho,
          // e para JSON ele põe application/json.
        });

        let responseText = successMessage;

        // se a API devolver message, usamos ela
        if (response.data && typeof response.data.message === 'string') {
          responseText = response.data.message;
        }

        setMessage('success', responseText);
        form.reset();
      } catch (error: any) {
        console.error(error);

        // tenta extrair mensagem do backend, se existir
        let finalMessage = errorMessage;
        const backendMsg =
          error?.response?.data?.message || error?.response?.data?.error;

        if (typeof backendMsg === 'string') {
          finalMessage = backendMsg;
        }

        setMessage('error', finalMessage);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtn.dataset.originalText) {
            submitBtn.innerText = submitBtn.dataset.originalText;
          }
        }
      }
    });
  });
}
