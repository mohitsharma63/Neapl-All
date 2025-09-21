import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Stats } from "@/lib/types";

export default function StatsSection() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <section className="bg-muted py-16" data-testid="stats-section-loading">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading statistics...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-muted py-16" data-testid="stats-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium" data-testid="text-stats-header">
              Discover the Power of Qatar's Leading Property Platform
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-stats-title">
            Where agents gain unmatched exposure and property seekers find their perfect home.
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-stats-description">
            Join us for top-tier visibility and real results in buying, selling, or renting. 
            Check out our impressive stats below from 2023!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center" data-testid="stat-page-views">
            <div className="text-6xl font-bold stats-number mb-2">140</div>
            <div className="text-xl text-muted-foreground mb-1">Million</div>
            <div className="text-lg font-medium text-foreground">Page Views</div>
          </div>
          <div className="text-center" data-testid="stat-new-visitors">
            <div className="text-6xl font-bold stats-number mb-2">+1.7</div>
            <div className="text-xl text-muted-foreground mb-1">Million</div>
            <div className="text-lg font-medium text-foreground">New Visitors</div>
          </div>
          <div className="text-center" data-testid="stat-impressions">
            <div className="text-6xl font-bold stats-number mb-2">1.05</div>
            <div className="text-xl text-muted-foreground mb-1">Billion</div>
            <div className="text-lg font-medium text-foreground">Impressions</div>
          </div>
        </div>
      </div>
    </section>
  );
}
