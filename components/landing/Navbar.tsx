"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 ${
        isScrolled ? "py-3" : "py-6"
      }`}
    >
      <div 
        className={`container mx-auto flex items-center justify-between transition-all duration-300 rounded-full px-6 ${
          isScrolled 
            ? "bg-background/70 backdrop-blur-xl border border-border/50 shadow-lg py-2" 
            : "bg-transparent py-2"
        }`}
      >
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-background rounded-sm rotate-45" />
            </div>
            <span className="hidden sm:block">Vibio</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-[13px] font-medium tracking-wide uppercase">
          <Link href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
            Product
          </Link>
          <Link href="#solutions" className="text-foreground/70 hover:text-foreground transition-colors">
            Solutions
          </Link>
          <Link href="#pricing" className="text-foreground/70 hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="#docs" className="text-foreground/70 hover:text-foreground transition-colors">
            Docs
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-muted/50 border border-border/50 hover:bg-muted transition-all text-foreground hover:scale-110 active:scale-95"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-700" />}
            </button>
          )}
          <Link
            href="/signup"
            className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-foreground text-background rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Create Video
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-24 left-6 right-6 bg-background/95 backdrop-blur-2xl border border-border/50 p-8 rounded-3xl flex flex-col gap-6 shadow-2xl md:hidden animate-in fade-in zoom-in-95 duration-300">
          <Link href="#features" className="text-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>Product</Link>
          <Link href="#solutions" className="text-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>Solutions</Link>
          <Link href="#pricing" className="text-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          <Link href="/signup" className="mt-4 px-6 py-4 text-center text-lg font-bold bg-foreground text-background rounded-2xl" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
        </div>
      )}
    </header>
  );
}
