import React from 'react'

export const Footer = () => {
  return (

    <footer className="p-4 bg-white rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-900">
      <div className="sm:flex">
        <span className="underline">Our Partners</span>
        <img src="https://muensterhack.de/img/logo_muensterhack.png"
             className="ml-5 h-8" alt="muensterhack Logo"/>
        <img src="https://www.ukm.de/typo3conf/ext/ukm_main/Resources/Public/img/UKM_LOGO_2.jpg"
             className="ml-5 h-8" alt="ukm Logo"/>
        <img src="https://www.warendorf.de/fileadmin/templates/gfx/logo.svg"
             className="ml-5 h-8" alt="warendorf Logo" />
      </div>
    </footer>
  )
}
