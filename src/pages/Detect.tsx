import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

const Detect = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select a valid image file");
      }
    }
  };

  const handleDetection = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Detection complete! Results would be displayed here in production.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
              Thermal Image Detection
            </h1>
            <p className="text-xl text-muted-foreground mb-12 text-center">
              Upload a thermal image for AI-powered object detection
            </p>

            <Card className="p-8 bg-gradient-card border-border">
              <div className="space-y-6">
                <div
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img
                        src={selectedImage}
                        alt="Selected thermal"
                        className="max-h-96 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-16 w-16 text-primary mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-foreground mb-2">
                          Upload Thermal Image
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Click to browse or drag and drop
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
                  size="lg"
                  onClick={handleDetection}
                  disabled={!selectedImage || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Run Detection
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card border-border text-center">
                <div className="text-3xl font-bold text-primary mb-2">Step 1</div>
                <p className="text-sm text-muted-foreground">
                  Upload your thermal image
                </p>
              </Card>
              <Card className="p-6 bg-card border-border text-center">
                <div className="text-3xl font-bold text-primary mb-2">Step 2</div>
                <p className="text-sm text-muted-foreground">
                  AI processes the image
                </p>
              </Card>
              <Card className="p-6 bg-card border-border text-center">
                <div className="text-3xl font-bold text-primary mb-2">Step 3</div>
                <p className="text-sm text-muted-foreground">
                  View detected objects
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Detect;
