import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

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
                Want to advertise on Qatar Living?
              </h3>
              <p className="text-primary-foreground/80 mb-4" data-testid="text-advertise-description">
                Take a look at our{" "}
                <span className="text-accent underline cursor-pointer">Advertise page</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Explore Section */}
          <div data-testid="footer-explore">
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-properties">
                  Properties
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-vehicles">
                  Vehicles
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-classifieds">
                  Classifieds
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-services">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-jobs">
                  Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-rewards">
                  Rewards
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-premium">
                  Premium subscriptions
                </a>
              </li>
            </ul>
          </div>

          {/* Other Section */}
          <div data-testid="footer-other">
            <h3 className="text-lg font-semibold mb-4">Other</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-news">
                  News
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-events">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-forums">
                  Forums
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-business">
                  Business pages
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-eshops">
                  eShops
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div data-testid="footer-legal">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-advertising-terms">
                  Advertising Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-refund-policy">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-website-terms">
                  Website Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-posting-rules">
                  Rules for posting ads
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors underline" data-testid="link-footer-contact">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Brand */}
          <div data-testid="footer-brand">
            <div className="mb-6">
              <div className="text-2xl font-bold" data-testid="text-footer-logo">
                <span className="text-white">Qatar</span>
                <span className="text-accent">LIVING</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4" data-testid="text-social-title">
                Let's stay connected
              </h4>
              <div className="flex space-x-3" data-testid="social-links">
                <a href="#" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-accent transition-colors" data-testid="link-facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-accent transition-colors" data-testid="link-twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-accent transition-colors" data-testid="link-instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-accent transition-colors" data-testid="link-linkedin">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-accent transition-colors" data-testid="link-youtube">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-accent transition-colors" data-testid="link-tiktok">
                  <i className="fab fa-tiktok"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-primary-foreground/60" data-testid="text-copyright">
            Copyright © 2025 Qatar Living. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
