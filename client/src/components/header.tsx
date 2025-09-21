import { Heart, User, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/properties", label: "Properties", isActive: location.startsWith("/properties") || location === "/" },
    { href: "#", label: "Vehicles", isActive: false },
    { href: "#", label: "Classifieds", isActive: false },
    { href: "#", label: "Services", isActive: false },
    { href: "#", label: "Jobs", isActive: false },
    { href: "#", label: "Rewards", isActive: false },
  ];

  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50" data-testid="header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <div className="text-2xl font-bold">
              <span className="text-white">Qatar</span>
              <span className="text-accent">LIVING</span>
            </div>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-8" data-testid="nav-main">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`${
                  item.isActive
                    ? "text-accent border-b-2 border-accent pb-1"
                    : "hover:text-accent transition-colors"
                }`}
                data-testid={`link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-4" data-testid="header-actions">
            <button className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors" data-testid="button-post-ad">
              <Plus className="w-4 h-4 mr-2 inline" />
              Post Ad
            </button>
            <button className="p-2 hover:bg-primary/80 rounded-lg transition-colors" data-testid="button-favorites">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-primary/80 rounded-lg transition-colors" data-testid="button-profile">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
