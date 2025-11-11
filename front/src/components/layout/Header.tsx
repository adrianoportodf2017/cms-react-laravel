import { useEffect, useState } from 'react'
import { useObterMenu } from '../../services/menu/mutation'
import type { MenuItem } from '../../types'
import { Link } from 'react-router-dom'

function LoadingOverlay({ show }: { show: boolean }) {
  // trava o scroll do body enquanto o overlay estiver visível
  useEffect(() => {
    if (show) document.body.classList.add('overflow-hidden')
    else document.body.classList.remove('overflow-hidden')
    return () => document.body.classList.remove('overflow-hidden')
  }, [show])

  if (!show) return null
  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-white/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Carregando conteúdo"
    >
      <div className="flex flex-col items-center gap-4">
        {/* spinner */}
        <svg
          className="h-12 w-12 animate-spin"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-50" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
        <p className="text-sm text-gray-700"></p>
      </div>
      <span className="sr-only">Carregando</span>
    </div>
  )
}

export default function MobileMenu() {
  const { data, isLoading, isError, error } = useObterMenu(true)
  const menuItems: MenuItem[] = data?.menuItems ?? []

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Fechar menu / busca ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMenuOpen && !target.closest('.mobile-sidebar') && !target.closest('.menu-toggle-btn')) {
        setIsMenuOpen(false)
      }
      if (isSearchOpen && !target.closest('.search-container') && !target.closest('.search-toggle-btn')) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen, isSearchOpen])

  const toggleMenu = () => {
    setIsMenuOpen((v) => !v)
    setExpandedItems([])
  }

  const toggleSubmenu = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const toggleSearch = () => {
    setIsSearchOpen((v) => !v)
    if (!isSearchOpen) setTimeout(() => document.getElementById('search-input')?.focus(), 100)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Pesquisando por: ${searchQuery}`)
  }

  const Chevron = () => (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
      <path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const desktopMenuItems = menuItems.filter(
    (item) => !['associe-se-bottom', 'menu-bottom', 'contato-bottom'].includes(item.id)
  )

  const icons = {
    search: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    menu: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    x: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    'chevron-down': (
      <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
  }

  return (
    <>
      {/* Overlay de loading cobrindo a tela toda */}
      <LoadingOverlay show={isLoading} />

      {/* Header sempre renderiza; em erro mostramos a mensagem no topo */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w=[1400px] items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/2023_04_10_NovaLogo_SEMSLOGAN.png"
              className="p-3 max-w-[150px] md:max-w-[250px]"
              alt="Instituto Cooperforte"
            />
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-6 text-lg font-medium">
            {desktopMenuItems.map((item) => (
              <div key={item.id}>
                {item.hasDropdown ? (
                  <div className="relative group">
                    <Link to={'#'} className="inline-flex items-center gap-1 hover:text-[#ffcc00]">
                      {item.title} <Chevron />
                    </Link>
                    <div className="invisible absolute left-0 top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 min-w-[220px]">
                      {item.submenu?.map((sub, idx) => (
                        <Link
                          key={idx}
                          to={sub.link}
                          className="block rounded-lg px-3 py-2 hover:bg-yellow-400 hover:text-black"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link to={item.link} className="hover:text-[#ffcc00]">
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + SEARCH + TOGGLE MOBILE */}
          <div className="flex items-center gap-3">
            <a href="/doar" className="hidden md:block rounded-full bg-[#ffcc00] px-4 py-2 font-semibold text-black hover:opacity-90">
              Doe
            </a>
            <a href="/associe" className="hidden md:block rounded-full bg-[#ffcc00] px-4 py-2 font-semibold text-black hover:opacity-90">
              Associe-se
            </a>
            <button
              onClick={toggleSearch}
              className="search-toggle-btn p-2 text-gray-600 hover:text-[#ffcc00] transition-colors"
              aria-label="Pesquisar"
            >
              {icons.search}
            </button>
            <button
              onClick={toggleMenu}
              className="menu-toggle-btn md:hidden p-2 text-gray-600 hover:text-[#ffcc00] transition-colors"
              aria-label="Menu"
            >
              {icons.menu}
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa Expansível */}
        <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-20' : 'max-h-0'}`}>
          <div className="search-container border-t border-gray-200 bg-white px-4 py-3">
            {isError ? (
              <div className="mx-auto max-w-[1400px] text-red-600">
                {error?.message || 'Não foi possível carregar o menu.'}
              </div>
            ) : (
              <form onSubmit={handleSearch} className="mx-auto max-w-[1400px]">
                <div className="relative">
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Digite sua pesquisa..."
                    className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-[#ffcc00] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]/20"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icons.search}
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {icons.x}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" />}

      {/* Menu Lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white transform transition-transform duration-300 z-50 mobile-sidebar ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header do Menu Lateral */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src="./2023_04_10_NovaLogo_SEMSLOGAN.png"
                className="max-w-[120px]"
                alt="Instituto Cooperforte"
              />
            </div>
            <button onClick={toggleMenu} className="p-2 text-gray-500 hover:text-gray-700">
              {icons.x}
            </button>
          </div>

          {/* Conteúdo do Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">{item.title}</span>
                      <div className={`${expandedItems.includes(item.id) ? 'rotate-180' : ''}`}>
                        {icons['chevron-down']}
                      </div>
                    </button>

                    {/* Submenu */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        expandedItems.includes(item.id) ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      {item.submenu?.map((sub, index) => (
                        <Link
                          key={index}
                          to={sub.link}
                          className="block px-8 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 border-l-2 border-transparent hover:border-orange-500"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.link}
                    className="block px-4 py-3 font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Footer do Menu */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            <Link
              to="/doar"
              className="block w-full text-center rounded-full bg-orange-500 px-4 py-3 font-semibold text-white hover:opacity-90"
              onClick={() => setIsMenuOpen(false)}
            >
              Doe
            </Link>
            <Link
              to="/associe"
              className="block w-full text-center rounded-full bg-yellow-500 px-4 py-3 font-semibold text-white hover:opacity-90"
              onClick={() => setIsMenuOpen(false)}
            >
              Associe-se
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
