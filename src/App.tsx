/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeProvider } from "./ThemeContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Principles } from "./components/Principles";
import { Cases } from "./components/Cases";
import { Methodology } from "./components/Methodology";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="jnaranjo-portfolio-theme">
      <BrowserRouter>
        <div className="min-h-screen selection:bg-accent selection:text-white">
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <main className="flex flex-col">
                  <Hero />
                  <Principles />
                  <Cases />
                  <Methodology />
                  <Experience />
                </main>
                <Footer />
              </>
            } />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
