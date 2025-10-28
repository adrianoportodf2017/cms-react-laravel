import Header from './Header'
import Footer from './Footer'
 import { Outlet } from 'react-router-dom'


export default function Layout() {
  return (
    <div className={`w-full`}>
      <div className="flex flex-1 flex-col">
        <Header />
         <main className="h-full overflow-y-auto  bg-gray-50  ">
          <div className="container-fluid mx-auto grid ">
            <Outlet />
          </div>
        </main>
         <Footer />
      </div>
    </div>
  )
}
