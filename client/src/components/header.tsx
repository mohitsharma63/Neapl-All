import { Heart, User, Plus, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/properties", label: "घर जग्गा | Properties", shortLabel: "Properties", isActive: location.startsWith("/properties") || location === "/", hasRoute: true },
    { href: "/vehicles", label: "सवारी | Vehicles", shortLabel: "Vehicles", isActive: location.startsWith("/vehicles"), hasRoute: false },
    { href: "/jobs", label: "रोजगार | Jobs", shortLabel: "Jobs", isActive: location.startsWith("/jobs"), hasRoute: false },
    { href: "/services", label: "सेवा | Services", shortLabel: "Services", isActive: location.startsWith("/services"), hasRoute: false },
    { href: "/education", label: "शिक्षा | Education", shortLabel: "Education", isActive: location.startsWith("/education"), hasRoute: false },
    { href: "/health", label: "स्वास्थ्य | Health", shortLabel: "Health", isActive: location.startsWith("/health"), hasRoute: false },
  ];

  return (
    <>
      <header className="nepal-gradient text-primary-foreground shadow-lg sticky top-0 z-50" data-testid="header">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 md:space-x-3" data-testid="link-home">
              <div className="text-xl md:text-2xl font-bold flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-lg flex items-center justify-center text-white font-black text-lg md:text-xl">
                  j
                </div>
                <div className="hidden sm:block">
                  <span className="text-white text-lg md:text-xl tracking-wide">JEEVIKA</span>
                  <div className="text-xs text-accent/90 -mt-1 font-medium hidden md:block">सेवा प्रा. लि. | Services Pvt. Ltd.</div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/properties" className="text-sm font-medium hover:text-accent transition-colors px-3 py-2 rounded-lg hover:bg-accent/10">
                Properties
              </Link>
              <Link href="/agents" className="text-sm font-medium hover:text-accent transition-colors px-3 py-2 rounded-lg hover:bg-accent/10">
                Agents
              </Link>
              <Link href="/agencies" className="text-sm font-medium hover:text-accent transition-colors px-3 py-2 rounded-lg hover:bg-accent/10">
                Agencies
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-accent transition-colors px-3 py-2 rounded-lg hover:bg-accent/10">
                Contact
              </Link>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 md:space-x-4" data-testid="header-actions">
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs md:text-sm px-2 md:px-4"
                data-testid="button-post-ad"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Post Ad</span>
                <span className="sm:hidden">Post</span>
              </Button>

              <button className="p-2 hover:bg-primary/80 rounded-lg transition-colors hidden sm:block" data-testid="button-favorites">
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <Link href="/login" className="p-2 hover:bg-primary/80 rounded-lg transition-colors hidden sm:block" data-testid="button-profile">
                <User className="w-4 h-4 md:w-5 md:h-5" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 hover:bg-primary/80 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} data-testid="mobile-menu-overlay">
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <nav className="container mx-auto px-4 py-6" data-testid="nav-mobile">
              <div className="space-y-4">
                {navItems.map((item) => (
                  item.hasRoute ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`block py-2 px-4 rounded-lg transition-colors ${
                        item.isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      className={`block w-full text-left py-2 px-4 rounded-lg transition-colors ${
                        item.isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        // Add your category selection logic here
                        console.log(`Selected category: ${item.label}`);
                        // Don't close menu for inactive categories
                      }}
                      data-testid={`mobile-button-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                      <span className="text-xs text-gray-500 block">(Coming Soon)</span>
                    </button>
                  )
                ))}
                <hr className="my-4" />
                <Link
                  href="#"
                  className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-link-favorites"
                >
                  <Heart className="w-4 h-4 mr-2 inline" />
                  Favorites
                </Link>
                <Link
                  href="/login"
                  className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-link-profile"
                >
                  <User className="w-4 h-4 mr-2 inline" />
                  Profile
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}