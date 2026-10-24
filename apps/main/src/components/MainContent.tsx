"use client";

import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experiences from "@/components/Experiences";
import Certifications from "@/components/Certifications";
import Journey from "@/components/Journey";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Stack from "@/components/Stack";

export default function MainContent() {
  const { setOpenMenu } = useContext(MenuContext);

  return (
    <div onMouseOver={() => setOpenMenu(false)}>
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <div className="grid-container">
          <div className="col-start-2 col-end-3 flex xl:gap-12">
            <div>
              <Experiences />
              <Certifications />
              <Projects />
              <Journey />
              <Contact />
            </div>
            <div className="relative"><Stack /></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
