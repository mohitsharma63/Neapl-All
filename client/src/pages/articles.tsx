
import { useState } from "react";
import { FileText, Download, Share2, Bookmark, Eye, ThumbsUp, Filter, Calendar } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Articles() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const articleCategories = [
    { id: "all", name: "All Articles", icon: FileText },
    { id: "guides", name: "Guides", icon: FileText },
    { id: "research", name: "Research", icon: FileText },
    { id: "whitepapers", name: "Whitepapers", icon: FileText },
  ];

  const featuredArticles = [
    {
      id: 1,
      title: "Complete Guide to Property Registration in Nepal 2025",
      description: "A comprehensive step-by-step guide covering all aspects of property registration, required documents, fees, and legal procedures.",
      type: "Guide",
      author: "Legal Team",
      publishedDate: "January 2025",
      pages: 45,
      downloads: "5.2K",
      views: "12.4K",
      likes: 847,
      thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
      isPremium: false
    },
    {
      id: 2,
      title: "Nepal Real Estate Market Report 2024-2025",
      description: "Annual market analysis featuring price trends, investment opportunities, and forecasts for major cities across Nepal.",
      type: "Research",
      author: "Market Research Team",
      publishedDate: "December 2024",
      pages: 78,
      downloads: "8.7K",
      views: "18.2K",
      likes: 1243,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      isPremium: true
    },
    {
      id: 3,
      title: "Sustainable Housing Development in Nepal",
      description: "Exploring eco-friendly construction practices, green building certifications, and sustainable urban development strategies.",
      type: "Whitepaper",
      author: "Sustainability Experts",
      publishedDate: "November 2024",
      pages: 32,
      downloads: "3.4K",
      views: "9.1K",
      likes: 621,
      thumbnail: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=250&fit=crop",
      isPremium: false
    },
  ];

  const recentArticles = [
    {
      id: 4,
      title: "Tax Benefits for Property Owners in Nepal",
      type: "Guide",
      publishedDate: "January 2025",
      pages: 18,
      downloads: "2.1K",
    },
    {
      id: 5,
      title: "Understanding Rental Agreements and Tenant Rights",
      type: "Guide",
      publishedDate: "December 2024",
      pages: 24,
      downloads: "3.8K",
    },
    {
      id: 6,
      title: "Commercial Property Investment Strategies",
      type: "Whitepaper",
      publishedDate: "November 2024",
      pages: 41,
      downloads: "1.9K",
    },
    {
      id: 7,
      title: "Property Valuation Methods and Techniques",
      type: "Research",
      publishedDate: "October 2024",
      pages: 56,
      downloads: "4.2K",
    },
    {
      id: 8,
      title: "Smart Home Technology Integration Guide",
      type: "Guide",
      publishedDate: "September 2024",
      pages: 29,
      downloads: "2.7K",
    },
  ];

  const topDownloads = [
    { title: "Property Buying Checklist 2025", downloads: "15.3K" },
    { title: "Home Loan Guide", downloads: "12.8K" },
    { title: "Legal Documentation Template Pack", downloads: "10.5K" },
    { title: "Property Investment Calculator", downloads: "9.2K" },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-articles">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20" data-testid="articles-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <FileText className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6" data-testid="text-articles-title">
              लेख तथा अनुसन्धान | Articles & Research
            </h1>
            <p className="text-xl opacity-90 mb-8" data-testid="text-articles-subtitle">
              In-depth guides, research papers, and resources for property buyers, sellers, and investors
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100">
                <Filter className="w-4 h-4 mr-2" />
                Filter Articles
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Articles", value: "156", icon: FileText },
            { label: "Total Downloads", value: "124K", icon: Download },
            { label: "Active Readers", value: "45K", icon: Eye },
            { label: "Expert Authors", value: "28", icon: ThumbsUp },
          ].map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Categories</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {articleCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedFilter(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        selectedFilter === category.id
                          ? "bg-purple-600 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Downloads */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-500" />
                  Top Downloads
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topDownloads.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-1">{index + 1}</Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.downloads} downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscribe */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardHeader>
                <h3 className="text-lg font-semibold">Get New Articles</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to access new research and guides
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Articles */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
              <div className="space-y-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="grid md:grid-cols-3 gap-0">
                      <div className="relative h-48 md:h-auto">
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        {article.isPremium && (
                          <Badge className="absolute top-4 left-4 bg-amber-500">Premium</Badge>
                        )}
                      </div>
                      <CardContent className="md:col-span-2 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge>{article.type}</Badge>
                          <span className="text-sm text-muted-foreground">{article.pages} pages</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 hover:text-purple-600 transition-colors cursor-pointer">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                          <span>By {article.author}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {article.publishedDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {article.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {article.likes}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                          <Button variant="outline">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button variant="outline">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Articles */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Publications</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {recentArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <Badge className="mb-3">{article.type}</Badge>
                      <h3 className="text-lg font-bold mb-3 hover:text-purple-600 transition-colors cursor-pointer line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{article.publishedDate}</span>
                        <span>{article.pages} pages</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {article.downloads}
                        </span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
