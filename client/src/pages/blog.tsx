
import { useState } from "react";
import { Calendar, Clock, User, Search, Tag, ArrowRight, TrendingUp } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Posts", count: 24 },
    { id: "real-estate", name: "Real Estate", count: 8 },
    { id: "property-tips", name: "Property Tips", count: 6 },
    { id: "market-trends", name: "Market Trends", count: 5 },
    { id: "legal", name: "Legal & Documentation", count: 3 },
    { id: "investment", name: "Investment", count: 2 },
  ];

  const featuredPost = {
    id: 1,
    title: "2025 Nepal Real Estate Market Outlook: What to Expect",
    excerpt: "An in-depth analysis of the upcoming trends in Nepal's real estate sector, including price predictions and investment opportunities.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
    author: "Mohit Sharma",
    date: "January 15, 2025",
    readTime: "8 min read",
    category: "Market Trends",
    views: "2.4K"
  };

  const blogPosts = [
    {
      id: 2,
      title: "Understanding Property Ownership Laws in Nepal",
      excerpt: "A comprehensive guide to property ownership, documentation, and legal requirements for buyers in Nepal.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
      author: "Sita Gautam",
      date: "January 12, 2025",
      readTime: "6 min read",
      category: "Legal & Documentation",
      views: "1.8K"
    },
    {
      id: 3,
      title: "Top 10 Areas for Property Investment in Kathmandu Valley",
      excerpt: "Discover the most promising neighborhoods for real estate investment with high growth potential.",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=250&fit=crop",
      author: "Ram Thapa",
      date: "January 10, 2025",
      readTime: "5 min read",
      category: "Investment",
      views: "3.1K"
    },
    {
      id: 4,
      title: "How to Get the Best Deal When Buying Property",
      excerpt: "Expert tips and negotiation strategies to help you secure the best price for your dream property.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop",
      author: "Asha Rai",
      date: "January 8, 2025",
      readTime: "7 min read",
      category: "Property Tips",
      views: "2.2K"
    },
    {
      id: 5,
      title: "The Rise of Smart Homes in Nepal",
      excerpt: "Exploring the growing trend of smart home technology and automation in Nepali properties.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
      author: "Prakash Karki",
      date: "January 5, 2025",
      readTime: "4 min read",
      category: "Real Estate",
      views: "1.5K"
    },
    {
      id: 6,
      title: "Renting vs Buying: Making the Right Choice",
      excerpt: "A detailed comparison to help you decide whether renting or buying is the better option for you.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      author: "Binita Shrestha",
      date: "January 3, 2025",
      readTime: "6 min read",
      category: "Property Tips",
      views: "2.7K"
    },
  ];

  const trendingTopics = [
    "Property Valuation",
    "Home Loans",
    "Interior Design",
    "Sustainable Housing",
    "Property Insurance"
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-blog">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20" data-testid="blog-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6" data-testid="text-blog-title">
              ब्लग | Our Blog
            </h1>
            <p className="text-xl opacity-90 mb-8" data-testid="text-blog-subtitle">
              Insights, tips, and stories from Nepal's real estate experts
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-white text-gray-900 rounded-full"
                data-testid="input-search"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
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
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span>{category.name}</span>
                      <Badge variant={selectedCategory === category.id ? "secondary" : "outline"}>
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Trending Topics
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-50">
                      <Tag className="w-3 h-3 mr-1" />
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <h3 className="text-lg font-semibold">Subscribe to Newsletter</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get weekly updates on latest articles and market insights
                </p>
                <Input placeholder="Your email" type="email" className="mb-3" />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Post */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-orange-500">Featured</Badge>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-3">{featuredPost.category}</Badge>
                  <h2 className="text-3xl font-bold mb-4 hover:text-blue-600 transition-colors cursor-pointer">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <Button className="w-fit bg-blue-600 hover:bg-blue-700">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </div>
            </Card>

            {/* Blog Posts Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4">{post.category}</Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>{post.readTime}</span>
                          <span>• {post.views} views</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
