'use client';

import { useMenu } from '@/context/MenuContext';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Experiences from '@/components/Experiences';
import Journey from '@/components/Journey';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Stack from '@/components/Stack';

export default function MainContent() {
  const { setOpenMenu } = useMenu();

  return (
    <div onMouseOver={() => setOpenMenu(false)}>
      <Hero />

      {/* Relative bounds for the sticky side stack — keeps it confined
          to these sections only, away from Header, Hero, and Footer. */}

      <div className="grid-container">
        <div className="col-start-2 col-end-3 flex xl:gap-12">
          <div>
            <Experiences />
            <Projects />
            <Journey />
            <Contact />
          </div>

          <div className="relative">
            <Stack />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
