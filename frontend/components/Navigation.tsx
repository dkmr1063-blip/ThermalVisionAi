import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">THERMAL</span>
              <span className="text-xs text-primary">VISION AI</span>
            </div>
          </NavLink>

          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground"
            >
              Home
            </NavLink>
            <NavLink
              to="/detect"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground"
            >
              Detection
            </NavLink>
            <NavLink
              to="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground"
            >
              About
            </NavLink>
            <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <NavLink
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/detect"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Detection
            </NavLink>
            <NavLink
              to="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>
            <Button variant="default" className="bg-primary text-primary-foreground">
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
