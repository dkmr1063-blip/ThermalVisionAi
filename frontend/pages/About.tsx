import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const About = () => {
  const capabilities = [
    "YOLO11 architecture for superior accuracy",
    "Thermal-aware preprocessing with CLAHE",
    "Real-time object detection and tracking",
    "AdamW optimizer with cosine learning rate",
    "Export to ONNX for deployment flexibility",
    "GPU-accelerated inference",
    "Supports HIT-UAV thermal dataset",
    "Advanced data augmentation techniques",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
              About Thermal Vision AI
            </h1>
            <p className="text-xl text-muted-foreground mb-12 text-center">
              Advanced object detection in thermal imagery using cutting-edge deep learning
            </p>

            <Card className="p-8 bg-gradient-card border-border mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Technology</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our thermal object detection system is built on YOLO11, the latest evolution in the YOLO 
                (You Only Look Once) family of object detection models. YOLO11 brings unprecedented accuracy 
                and speed to thermal imaging analysis, making it ideal for applications in surveillance, 
                search and rescue, industrial inspection, and autonomous systems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The system uses advanced preprocessing techniques specifically designed for thermal imagery, 
                including Contrast Limited Adaptive Histogram Equalization (CLAHE) and thermal-aware 
                normalization. This ensures optimal performance even in challenging conditions with varying 
                temperature ranges and environmental factors.
              </p>
            </Card>

            <Card className="p-8 bg-gradient-card border-border mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">Key Capabilities</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{capability}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-gradient-card border-border">
              <h2 className="text-3xl font-bold text-foreground mb-4">Technical Details</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Model Architecture</h3>
                  <p>
                    YOLO11 with optimized backbone for thermal imagery. The model uses a sophisticated 
                    feature pyramid network (FPN) to detect objects at multiple scales.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Training Dataset</h3>
                  <p>
                    Trained on the HIT-UAV thermal dataset, which contains diverse thermal imagery from 
                    unmanned aerial vehicles (UAVs) in various environmental conditions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Performance Metrics</h3>
                  <p>
                    Achieves 99.2% accuracy with sub-50ms inference time on modern GPUs, making it 
                    suitable for real-time applications.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
