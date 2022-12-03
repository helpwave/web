import React from 'react'

export const Navbar = () => {
  const [navbarOpen] = React.useState(false)
  return (
    <>
      <nav className="bg-helpwave relative flex flex-wrap items-center justify-between px-2 py-3 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div
            className={
              'lg:flex flex-grow items-center' +
              (navbarOpen ? 'flex' : 'hidden')
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <a className="px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" href="#">
                  <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75"></i><span className="ml-2">Roadmap</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" href="#">
                  <i className="fab fa-twitter text-lg leading-lg text-white opacity-75"></i><span className="ml-2">Team</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" href="#">
                  <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i><span className="ml-2">About</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" href="#">
                  <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i><span className="ml-2">Contact us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}
