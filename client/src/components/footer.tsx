import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["public-categories"],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", { email });
      toast({
        title: "Success!",
        description: "You have been subscribed to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to subscribe to newsletter. Please try again.",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground" data-testid="footer">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="bg-primary-foreground/10 rounded-xl p-8 mb-12" data-testid="newsletter-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2" data-testid="text-advertise-title">
                Want to advertise on Jeevika Services?
              </h3>
              <p className="text-primary-foreground/80 mb-4" data-testid="text-advertise-description">
                Connecting Nepal with quality services.{" "}
                <span className="text-accent underline cursor-pointer">Advertise with us</span>
              </p>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2" data-testid="text-newsletter-title">
                  Subscribe to our newsletter to get the latest updates
                </h4>
                <form onSubmit={handleNewsletterSubscribe} className="flex space-x-3">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 text-foreground bg-white"
                    data-testid="input-newsletter-email"
                  />
                  <Button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-testid="button-newsletter-subscribe"
                  >
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-4" data-testid="text-mobile-app-title">
                  Our Mobile App
                </h4>
                <div className="space-y-3">
                  <a href="#" className="block" data-testid="link-google-play">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      className="h-12 mx-auto lg:ml-auto lg:mr-0"
                    />
                  </a>
                  <a href="#" className="block" data-testid="link-app-store">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="Download on the App Store"
                      className="h-12 mx-auto lg:ml-auto lg:mr-0"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
          {/* Explore Section */}
          <div data-testid="footer-explore">
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              {(categories || [])
                .filter((c: any) => c?.isActive !== false)
                .slice(0, 10)
                .map((c: any) => (
                  <li key={String(c.id)}>
                    <Link
                      href={`/category/${encodeURIComponent(String(c.slug || c.id))}`}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors underline"
                    >
                      {String(c.name || 'Category')}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Social & Brand */}
          <div data-testid="footer-brand">
            <div className="mb-6">
              <div className="text-2xl font-bold flex items-center space-x-3" data-testid="text-footer-logo">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-black text-xl">
                  j
                </div>
                <div>
                  <span className="text-white text-xl tracking-wide">JEEVIKA</span>
                  <div className="text-xs text-accent/90 -mt-1 font-medium">सेवा प्रा. लि. | Services Pvt. Ltd.</div>
                </div>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-2">नेपाललाई सेवासँग जोड्दै | Connecting Nepal with Services</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4" data-testid="text-social-title">
                Let's stay connected
              </h4>
              <div className="flex space-x-3" data-testid="social-links">
                <a href="https://www.facebook.com/share/1GKbiCHhY1/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-primary-foreground/30 transition-colors" data-testid="link-facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://x.com/jeevika1631?s=21" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-primary-foreground/30 transition-colors" data-testid="link-twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.instagram.com/jeevika_1631?igsh=MTk1M2NmeGV3ajlrdw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-primary-foreground/30 transition-colors" data-testid="link-instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.linkedin.com/company/jeevika-services-pvt-ltd/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-primary-foreground/30 transition-colors" data-testid="link-linkedin">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://www.youtube.com/channel/UCfOq8T-NtTGC-hC06_qnBaQ" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-primary-foreground/30 transition-colors" data-testid="link-youtube">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="https://www.tiktok.com/@jeevika.services?_r=1&_t=ZS-924Vhw7hXYy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-primary-foreground/30 transition-colors" data-testid="link-tiktok">
                  <i className="fab fa-tiktok"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-primary-foreground/60" data-testid="text-copyright">
            Copyright © 2025 Jeevika Services Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}