import AssocieSeButton from '../ui/AssocieSeButton';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-300 lg:h-80 h-150 text-black">
      <div className="max-w-[1200px] mx-auto px-4 py-10 grid-cols-1 grid md:grid-cols-3 gap-8 flex flex-col justify-between text-center text-center">
        {/* Onde nos encontrar */}
        <img
          src="/2023_04_10_NovaLogo_SEMSLOGAN.png"
          className="max-w-[200px] bg-white m-2 p-5 mx-auto"
          alt="Instituto Cooperforte"
        />
        <div>
          <h3 className="text-black font-semibold text-lg mb-3">ONDE NOS ENCONTRAR</h3>
          <p className="text-sm leading-relaxed text-black">
            SCS Quadra 9 Lote C Torre C, 9º andar,<br />
            Edifício Parque Cidade Corporate<br />
            Brasília/DF - CEP: 70.308-200
          </p>
        </div>

        {/* Contatos */}
        <div>
          <h3 className="text-black font-semibold text-lg mb-3">CONTATOS</h3>
          <p className="text-sm leading-relaxed text-black">
            (61) 3223-4270<br />
            <a href="mailto:instituto@ic-cf.org.br" className="hover:text-orange-500">
              instituto@ic-cf.org.br
            </a>
          </p>
        </div>
      </div>
      <div>
        {/* Direitos e política */}
        <div className="flex flex-col justify-between text-center text-black">
          <p className="text-sm">
            © {new Date().getFullYear()} Sua ONG. Todos os direitos reservados.
          </p>
          <a
            className="text-[#ffcc00] hover:underline mt-3 md:mt-0"
            href="#"
          >
            Política de Privacidade
          </a>
        </div>
      </div>
      {/* Botão fixo WhatsApp 
      <a
        href="https://wa.me/5561999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 md:flex hidden"
        aria-label="WhatsApp"
      >
       
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="h-7 w-7"
        >
          <path d="M20.52 3.48A11.94 11.94 0 0 0 12.01 0C5.37 0 .02 5.35.02 11.98c0 2.11.55 4.18 1.59 6.01L0 24l6.16-1.61a11.94 11.94 0 0 0 5.84 1.49h.01c6.64 0 12.01-5.36 12.01-11.99 0-3.2-1.25-6.21-3.5-8.41zM12 21.5c-1.92 0-3.8-.51-5.44-1.48l-.39-.23-3.65.96.97-3.56-.25-.37A9.48 9.48 0 0 1 2.5 12C2.5 6.77 6.77 2.5 12 2.5c2.52 0 4.89.98 6.68 2.77a9.46 9.46 0 0 1 2.82 6.72c0 5.23-4.27 9.5-9.5 9.5zm5.28-7.13c-.29-.15-1.71-.84-1.97-.94-.26-.1-.45-.15-.64.15s-.74.94-.91 1.14c-.17.2-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.42-.85-.76-1.42-1.7-1.59-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.51.07-.78.36-.27.29-1.02.99-1.02 2.42 0 1.42 1.04 2.79 1.18 2.98.15.19 2.04 3.11 4.95 4.36.69.3 1.23.48 1.65.62.69.22 1.31.19 1.8.11.55-.08 1.71-.7 1.95-1.37.24-.67.24-1.24.17-1.37-.07-.13-.26-.21-.55-.36z" />
        </svg>
      </a>*/}
      <AssocieSeButton />
    </footer>
  );
}
