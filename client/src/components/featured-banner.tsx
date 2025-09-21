export default function FeaturedBanner() {
  return (
    <section className="container mx-auto px-4 py-8" data-testid="featured-banner">
      <div 
        className="relative bg-gradient-to-r from-primary to-blue-600 rounded-2xl overflow-hidden shadow-xl"
        style={{
          backgroundImage: "linear-gradient(rgba(30, 58, 138, 0.8), rgba(59, 130, 246, 0.8)), url('https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=400')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="relative z-10 px-12 py-16">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-2" data-testid="text-event-title">Cityscape Qatar</h2>
                <p className="text-xl opacity-90" data-testid="text-event-location">Doha Exhibition & Convention Center</p>
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-5xl font-bold mb-4" data-testid="text-main-title-1">SHAPING THE FUTURE</h3>
              <h3 className="text-5xl font-bold mb-6" data-testid="text-main-title-2">OF REAL ESTATE</h3>
            </div>
          </div>
          <div className="absolute bottom-6 right-12">
            <div className="flex space-x-2" data-testid="banner-indicators">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white/50 rounded-full"></div>
              <div className="w-3 h-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
