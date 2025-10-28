
import * as React from 'react'

export default function Sidebar() {
  const [open, setOpen] = React.useState(false)


  React.useEffect(() => {
    const handler = () => setOpen((v) => !v)
    document.addEventListener('sidebar:toggle', handler as EventListener)
    return () => document.removeEventListener('sidebar:toggle', handler as EventListener)
  }, [])


  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden`}
      />


      {/* Drawer */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300
${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-auto md:w-full md:shadow-none md:bg-transparent`}
        aria-hidden={!open}
      >
        <div className="md:hidden px-4 py-3 border-b flex items-center justify-between bg-white">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setOpen(false)} className="w-9 h-9 grid place-content-center border rounded-lg">✕</button>
        </div>
        <nav className="p-4 md:p-0 md:container md:mx-auto md:px-4">
          <ul className="grid gap-2 text-sm font-medium">
            <li><a className="block rounded-lg px-3 py-2 hover:bg-orange-100" href="/">Início</a></li>
            <li><a className="block rounded-lg px-3 py-2 hover:bg-orange-100" href="/institucional">Institucional</a></li>
            <li><a className="block rounded-lg px-3 py-2 hover:bg-orange-100" href="/ajude">Ajude</a></li>
            <li><a className="block rounded-lg px-3 py-2 hover:bg-orange-100" href="/atuacao">Nossa atuação</a></li>
            <li><a className="block rounded-lg px-3 py-2 hover:bg-orange-100" href="/transparencia">Transparência</a></li>
            <li><a className="block rounded-lg px-3 py-2 hover:bg-orange-100" href="/etica">Ética</a></li>
            <li><a className="block rounded-lg px-3 py-2 hover:bg-orange-100" href="/noticias">Notícias</a></li>
            <li><a className="block rounded-lg px-3 py-2 hover:bg-orange-100" href="/contato">Contato</a></li>
          </ul>
          <a href="/doar" className="mt-4 inline-flex items-center justify-center rounded-full bg-green-500 text-white px-5 py-2 font-semibold md:hidden">Doar</a>
        </nav>
      </aside>
    </>
  )
}