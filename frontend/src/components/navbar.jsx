import React, { useState } from 'react';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky inset-x-0 top-0 z-50 w-full border-b border-gray-800 bg-[#121212] px-4 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center py-3">
        {/* Logo */}
        <div className="mr-6 w-12 shrink-0 sm:w-16">
          <svg
            style={{width:"100%"}}
            viewBox="0 0 63 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-200 hover:scale-105"
          >
            <path
              d="M47.25 47.458C55.9485 38.7595 55.9485 24.6565 47.25 15.958C38.5515 7.25952 24.4485 7.25952 15.75 15.958C7.05151 24.6565 7.05151 38.7595 15.75 47.458C24.4485 56.1565 38.5515 56.1565 47.25 47.458Z"
              stroke="#E9FCFF"
              strokeWidth="1.38962"
              strokeMiterlimit="10"
            />
            <path
              d="M10.5366 47.7971V17.5057C10.5366 16.9599 11.1511 16.6391 11.599 16.9495L33.4166 32.0952C33.8041 32.3639 33.8041 32.9368 33.4166 33.2076L11.599 48.3533C11.1511 48.6657 10.5366 48.3429 10.5366 47.7971Z"
              stroke="url(#paint0_linear_53_10115)"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M18.1915 27.6963C20.1641 27.6963 21.7285 28.7066 21.7285 30.9021C21.7285 33.0976 20.1621 34.2433 18.1915 34.2433H16.8854V37.8677H14.1733V27.6984H18.1915V27.6963Z"
              fill="#E9FCFF"
            />
            <path
              d="M25.2053 27.6963V35.4868H28.484V37.8657H22.4932V27.6963H25.2053Z"
              fill="#E9FCFF"
            />
            <path
              d="M35.3142 27.6963L39.4553 37.8657H36.5328L35.9162 36.1763H32.1939L31.5773 37.8657H28.6548L32.7959 27.6963H35.3101H35.3142ZM34.9143 33.5663L34.2144 31.7832C34.1582 31.6395 33.954 31.6395 33.8978 31.7832L33.1979 33.5663C33.1541 33.6767 33.2354 33.7975 33.3562 33.7975H34.756C34.8747 33.7975 34.958 33.6767 34.9143 33.5663Z"
              fill="#E9FCFF"
            />
            <path
              d="M40.9491 27.6963L42.8592 30.5188L44.7694 27.6963H48.0355L44.2132 33.2559V37.8657H41.5011V33.2559L37.6787 27.6963H40.9449H40.9491Z"
              fill="#E9FCFF"
            />
            <path
              d="M16.894 32.1396V29.9129C16.894 29.8212 16.9982 29.7671 17.0732 29.8191L18.6771 30.9315C18.7417 30.9773 18.7417 31.0731 18.6771 31.1189L17.0732 32.2313C16.9982 32.2834 16.894 32.2313 16.894 32.1375V32.1396Z"
              fill="#232323"
            />
            <defs>
              <linearGradient
                id="paint0_linear_53_10115"
                x1="2.23416"
                y1="20.3361"
                x2="26.863"
                y2="44.9649"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#007EF8" />
                <stop offset="1" stopColor="#FF4A9A" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Desktop Search */}
        <div className="relative mx-auto hidden w-full max-w-lg overflow-hidden sm:block">
          <input
            className="w-full rounded-full border border-gray-700 bg-gray-900/50 py-2.5 pl-12 pr-4 text-white placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#ae7aff] focus:bg-gray-900/80 focus:ring-2 focus:ring-[#ae7aff]/20"
            placeholder="Search videos..."
            type="search"
          />
          <span className="absolute left-4 top-1/2 inline-block -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </span>
        </div>

        {/* Mobile Search Button */}
        <button className="ml-auto mr-4 rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-gray-800 hover:text-white sm:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="group flex w-8 shrink-0 flex-col justify-center gap-1.5 rounded p-1 transition-all duration-200 hover:bg-gray-800 sm:hidden"
        >
          <span className={`block h-0.5 w-full bg-white transition-all duration-300 group-hover:bg-[#ae7aff] ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-2/3 bg-white transition-all duration-300 group-hover:bg-[#ae7aff] ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-full bg-white transition-all duration-300 group-hover:bg-[#ae7aff] ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 sm:ml-6 sm:flex">
          <button className="rounded-lg bg-gray-800 px-4 py-2 text-white transition-all duration-200 hover:bg-gray-700">
            Log in
          </button>
          <button className="rounded-lg bg-gradient-to-r from-[#007EF8] to-[#FF4A9A] px-6 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95">
            Sign up
          </button>
        </div>

        {/* Mobile Slide-out Menu */}
        <div className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-full transform flex-col border-l border-gray-800 bg-[#121212] shadow-2xl transition-transform duration-300 ease-in-out sm:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between border-b border-gray-800 p-4">
            <div className="w-10">
              <svg
                style={{width:"100%"}}
                viewBox="0 0 63 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M47.25 47.458C55.9485 38.7595 55.9485 24.6565 47.25 15.958C38.5515 7.25952 24.4485 7.25952 15.75 15.958C7.05151 24.6565 7.05151 38.7595 15.75 47.458C24.4485 56.1565 38.5515 56.1565 47.25 47.458Z"
                  stroke="#E9FCFF"
                  strokeWidth="1.38962"
                  strokeMiterlimit="10"
                />
                <path
                  d="M10.5366 47.7971V17.5057C10.5366 16.9599 11.1511 16.6391 11.599 16.9495L33.4166 32.0952C33.8041 32.3639 33.8041 32.9368 33.4166 33.2076L11.599 48.3533C11.1511 48.6657 10.5366 48.3429 10.5366 47.7971Z"
                  stroke="url(#paint1_linear_53_10115)"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="paint1_linear_53_10115"
                    x1="2.23416"
                    y1="20.3361"
                    x2="26.863"
                    y2="44.9649"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#007EF8" />
                    <stop offset="1" stopColor="#FF4A9A" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-800 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Items */}
          <ul className="flex-1 space-y-2 p-4">
            <li>
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-700 p-3 text-left transition-all duration-200 hover:border-[#ae7aff] hover:bg-[#ae7aff]/10 hover:text-[#ae7aff]">
                <svg className="h-5 w-5" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 21V10M1 12V19C1 20.1046 1.89543 21 3 21H16.4262C17.907 21 19.1662 19.9197 19.3914 18.4562L20.4683 11.4562C20.7479 9.6389 19.3418 8 17.5032 8H14C13.4477 8 13 7.55228 13 7V3.46584C13 2.10399 11.896 1 10.5342 1C10.2093 1 9.91498 1.1913 9.78306 1.48812L6.26394 9.40614C6.10344 9.76727 5.74532 10 5.35013 10H3C1.89543 10 1 10.8954 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-medium">Liked Videos</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-700 p-3 text-left transition-all duration-200 hover:border-[#ae7aff] hover:bg-[#ae7aff]/10 hover:text-[#ae7aff]">
                <svg className="h-5 w-5" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 4.93137C21 4.32555 21 4.02265 20.8802 3.88238C20.7763 3.76068 20.6203 3.69609 20.4608 3.70865C20.2769 3.72312 20.0627 3.93731 19.6343 4.36569L16 8L19.6343 11.6343C20.0627 12.0627 20.2769 12.2769 20.4608 12.2914C20.6203 12.3039 20.7763 12.2393 20.8802 12.1176C21 11.9774 21 11.6744 21 11.0686V4.93137Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H11.2C12.8802 1 13.7202 1 14.362 1.32698C14.9265 1.6146 15.3854 2.07354 15.673 2.63803C16 3.27976 16 4.11984 16 5.8V10.2C16 11.8802 16 12.7202 15.673 13.362C15.3854 13.9265 14.9265 14.3854 14.362 14.673C13.7202 15 12.8802 15 11.2 15H5.8C4.11984 15 3.27976 15 2.63803 14.673C2.07354 14.3854 1.6146 13.9265 1.32698 13.362C1 12.7202 1 11.8802 1 10.2V5.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-medium">My Content</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-700 p-3 text-left transition-all duration-200 hover:border-[#ae7aff] hover:bg-[#ae7aff]/10 hover:text-[#ae7aff]">
                <svg className="h-5 w-5" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.09 8C8.3251 7.33167 8.78915 6.76811 9.39995 6.40913C10.0108 6.05016 10.7289 5.91894 11.4272 6.03871C12.1255 6.15849 12.7588 6.52152 13.2151 7.06353C13.6713 7.60553 13.9211 8.29152 13.92 9C13.92 11 10.92 12 10.92 12M11 16H11.01M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-medium">Support</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-4 rounded-lg border border-gray-700 p-3 text-left transition-all duration-200 hover:border-[#ae7aff] hover:bg-[#ae7aff]/10 hover:text-[#ae7aff]">
                <svg className="h-5 w-5" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 14C12.6569 14 14 12.6569 14 11C14 9.34315 12.6569 8 11 8C9.34315 8 8 9.34315 8 11C8 12.6569 9.34315 14 11 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.7282 9.7918C18.8236 10.2479 18.8236 10.7521 18.7282 11.2082C18.6328 11.6643 18.4366 12.0963 18.1533 12.4636C17.87 12.831 17.5071 13.1237 17.0918 13.3182L15.5 14.1364C15.0847 14.3309 14.6173 14.4216 14.1491 14.4003C13.6808 14.379 13.2246 14.2465 12.8182 14.0136C12.4118 13.7807 12.0682 13.4547 11.8182 13.0636C11.5682 12.6725 11.4182 12.2273 11.3818 11.7682L11.3182 11.2082C11.2228 10.7521 11.2228 10.2479 11.3182 9.7918C11.4136 9.33571 11.6098 8.90369 11.8931 8.53636C12.1764 8.16904 12.5393 7.87631 12.9546 7.6818L14.5464 6.86364C14.9617 6.66908 15.4291 6.57842 15.8973 6.59971C16.3656 6.621 16.8218 6.75346 17.2282 6.98636C17.6346 7.21926 17.9782 7.54527 18.2282 7.93636C18.4782 8.32745 18.6282 8.77273 18.6646 9.23182L18.7282 9.7918Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-medium">Settings</span>
              </button>
            </li>
          </ul>

          {/* Mobile Menu Footer */}
          <div className="border-t border-gray-800 p-4 space-y-3">
            <button className="w-full rounded-lg bg-gray-800 py-3 text-white transition-all duration-200 hover:bg-gray-700">
              Log in
            </button>
            <button className="w-full rounded-lg bg-gradient-to-r from-[#007EF8] to-[#FF4A9A] py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95">
              Sign up
            </button>
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
            onClick={toggleMobileMenu}
          />
        )}
      </nav>
    </header>
  );
}

export default Navbar;