import { NavLink } from "@/components/NavLink";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex flex-col mb-4">
              <span className="text-2xl font-bold text-foreground">THERMAL</span>
              <span className="text-xs text-primary">VISION AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced thermal object detection powered by YOLO11
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Navigation</h3>
            <div className="flex flex-col gap-2">
              <NavLink to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </NavLink>
              <NavLink to="/detect" className="text-muted-foreground hover:text-primary transition-colors">
                Detection
              </NavLink>
              <NavLink to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </NavLink>
            </div>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Technology</h3>
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-sm">YOLO11</span>
              <span className="text-muted-foreground text-sm">Thermal Imaging</span>
              <span className="text-muted-foreground text-sm">Deep Learning</span>
              <span className="text-muted-foreground text-sm">Computer Vision</span>
            </div>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Contact</h3>
            <div className="flex flex-col gap-2">
              <a href="mailto:info@thermalvision.ai" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                info@thermalvision.ai
              </a>
              <span className="text-muted-foreground text-sm">
                Built with React + TypeScript
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Thermal Vision AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
