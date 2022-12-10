import React from 'react'

export const Navbar = () => {
  const [navbarOpen] = React.useState(false)
  return (
    <>
      <nav className="bg-primary relative flex flex-wrap items-center justify-between px-2 py-3 mb-3">
        <a href="/" className="flex items-center">
          <img src="https://raw.githubusercontent.com/Just-another-Muensterhack/helpwave-static/main/banner.svg" className="h-6 mr-3 sm:h-9" alt="Flowbite Logo"/>
        </a>
        <button data-collapse-toggle="navbar-default" type="button"
                className="inline-flex items-center p-2 ml-3 text-sm text-white rounded-lg md:hidden  focus:outline-none focus:ring-2 focus:ring-transparent dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-default" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"></path>
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto " id="navbar-default">
          <ul className="flex flex-col p-4 md:flex-row lg:flex-row list-none lg:ml-auto">
            <li className="hover:underline nav-item">
              <a className="px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" href="#">
                  <span className="ml-2">
                    Roadmap
                  </span>
              </a>
            </li>
            <li className="hover:underline nav-item">
              <a className="px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" href="#">
                  <span className="ml-2">
                    Team
                  </span>
              </a>
            </li>
            <li className="hover:underline nav-item">
              <a className="px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" href="#">
                  <span className="ml-2">
                    About
                  </span>
              </a>
            </li>
            <li className="hover:underline nav-item">
              <a className="px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" href="/contact">
                  <span className="ml-2">
                    Contact us
                  </span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
