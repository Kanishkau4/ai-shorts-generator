import * as React from "react";
import Link from "next/link";
import { X, Camera, Video, Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background pt-24 pb-8 overflow-hidden relative border-t border-border/40">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
            <Link href="/" className="text-3xl font-bold tracking-tighter mb-4 inline-block">
              VIBIO
            </Link>
            <p className="text-muted-foreground mt-4 mb-6">
              The AI-powered shorts generator and scheduler for modern creators.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors"><X size={20} /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Camera size={20} /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Video size={20} /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Code size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Templates</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Big Text Footer */}
        <div className="w-full border-t border-border/40 pt-8 mt-8 flex flex-col items-center">
          <div className="w-full overflow-hidden flex justify-center py-4">
            <h1 className="text-[20vw] font-black leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted select-none">
              VIBIO
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            © {new Date().getFullYear()} Vibio Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
