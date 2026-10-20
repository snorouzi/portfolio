import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { name: 'Home', to: '/' },
  { name: 'Projects', to: '/projects' },
  { name: 'About', to: '/about' },
];

const MOBILE_BREAKPOINT = 641;

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79" />
  </svg>
);

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );
  const buttonRef = useRef(null);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleKeydown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen, closeMenu]);

  const handleLinkClick = () => {
    if (isMobile) closeMenu();
  };

  const toggleLabel = `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`;
  const toggleIcon = theme === 'light' ? <MoonIcon /> : <SunIcon />;

  return (
    <header className="header">
      <div className="container">
        <nav className="nav" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className="nav-link"
              end={link.name === 'Home'}
              onClick={handleLinkClick}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          {!isMobile && (
            <button className="theme-toggle" onClick={toggleTheme} aria-label={toggleLabel}>
              {toggleIcon}
            </button>
          )}

          {isMobile && (
            <button className="theme-toggle" onClick={toggleTheme} aria-label={toggleLabel}>
              {toggleIcon}
            </button>
          )}

          <button
            ref={buttonRef}
            className="menu-button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

        </div>

        {isMobile && (
          <div
            className={`mobile-menu nav-links${isOpen ? ' open' : ''}`}
            id="mobile-menu"
            role="menu"
            hidden={!isOpen}
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className="mobile-link"
                end={link.name === 'Home'}
                onClick={handleLinkClick}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
