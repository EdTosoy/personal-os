'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoMenu, IoClose } from 'react-icons/io5';
import { useMenu } from '@/context/MenuContext';
import { navigation } from '@/constants/navigation';
import { ThemeToggle } from './ui/ToggleTheme';

export default function Header() {
  const { openMenu, setOpenMenu } = useMenu();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-line bg-ink/90 backdrop-blur'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="grid-container">
        <div className="col-start-2 col-end-3 flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3">
            <span className="mono text-sm text-fg-muted">~/</span>
            <span className="text-lg font-bold tracking-tight text-fg">
              Edberto Tosoy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <p className="mono text-sm text-fg-muted transition-colors hover:text-amber">
                  {item.name}
                </p>
              </Link>
            ))}

            <Link
              href="https://linkedin.com/in/edtosoy"
              target="_blank"
              className="btn-outline rounded-full px-5 py-2 text-sm font-medium"
            >
              Contact
            </Link>

            <ThemeToggle className="panel panel-hover grid h-10 w-10 place-content-center rounded-full text-fg-muted hover:text-amber" />
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle className="grid h-9 w-9 place-content-center rounded-full text-fg-muted" />

            <button
              className="text-2xl text-fg"
              aria-label="Toggle navigation"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              {openMenu ? <IoClose /> : <IoMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {openMenu && (
          <div className="col-start-2 col-end-3 border-t border-line bg-ink md:hidden">
            <nav className="flex flex-col py-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpenMenu(false)}
                  className="mono px-6 py-4 text-fg-muted transition-colors hover:text-amber"
                >
                  {item.name}
                </Link>
              ))}

              <div className="px-6 pt-4 pb-2">
                <Link
                  href="https://linkedin.com/in/edtosoy"
                  onClick={() => setOpenMenu(false)}
                  className="btn-outline block rounded-full py-3 text-center font-medium"
                >
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
