import { Card } from "@/components/ui/card";
import { Brain, Zap, Shield, Cloud } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "YOLO11 Architecture",
    description: "State-of-the-art deep learning model optimized for thermal imaging detection with superior accuracy.",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Process thermal images in milliseconds with optimized inference pipeline and GPU acceleration.",
  },
  {
    icon: Shield,
    title: "Robust Detection",
    description: "Advanced preprocessing with CLAHE and thermal-aware normalization for reliable results.",
  },
  {
    icon: Cloud,
    title: "Cloud-Ready",
    description: "Scalable architecture ready for deployment on any cloud platform with edge computing support.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cutting-Edge Technology
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built on the latest advancements in computer vision and thermal imaging
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow group"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
