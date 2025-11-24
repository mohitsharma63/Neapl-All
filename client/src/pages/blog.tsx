
import { useState } from "react";
import { Calendar, Clock, User, Search, Tag, ArrowRight, TrendingUp } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openPost, setOpenPost] = useState<any | null>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const res = await fetch("/api/blog/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["blog-posts", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory && selectedCategory !== "all" ? `/api/blog/posts?category=${encodeURIComponent(selectedCategory)}` : "/api/blog/posts";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  // Fetch all posts (unfiltered) to compute category counts and overall stats
  const { data: allPosts = [], isLoading: allPostsLoading } = useQuery({
    queryKey: ["blog-posts-all"],
    queryFn: async () => {
      const res = await fetch("/api/blog/posts");
      if (!res.ok) throw new Error("Failed to fetch all posts");
      return res.json();
    },
  });

  const trendingTopics = [
    "Property Valuation",
    "Home Loans",
    "Interior Design",
    "Sustainable Housing",
    "Property Insurance",
  ];

  // derive displayed posts after search filter
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const displayedPosts = (posts || []).filter((p: any) => {
    if (!normalizedQuery) return true;
    const hay = `${p.title || ""} ${p.excerpt || ""} ${p.content || ""}`.toLowerCase();
    return hay.includes(normalizedQuery);
  });

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
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === "all" ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>All Posts</span>
                    <Badge variant={selectedCategory === "all" ? "secondary" : "outline"}>{allPosts.length}</Badge>
                  </button>

                  {categories.map((category: any) => {
                    // compute count from allPosts so counts remain accurate regardless of current filter
                    const count = (allPosts || []).filter((p: any) => p.category === category.slug).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                          selectedCategory === category.slug ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span>{category.name}</span>
                        <Badge variant={selectedCategory === category.slug ? "secondary" : "outline"}>{count}</Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Post (first featured, or fallback to first post) */}
            {posts && posts.length > 0 && (
              (() => {
                const featured = posts.find((p: any) => p.isFeatured) || posts[0];
                return (
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative h-64 md:h-auto">
                        <img
                          src={featured.coverImageUrl || featured.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop"}
                          alt={featured.title}
                          className="w-full h-full object-cover"
                        />
                        {featured.isFeatured && <Badge className="absolute top-4 left-4 bg-orange-500">Featured</Badge>}
                      </div>
                      <CardContent className="p-8 flex flex-col justify-center">
                        <Badge className="w-fit mb-3">{featured.category}</Badge>
                        <Link to={`/blog/${featured.slug}`}>
                          <h2 className="text-3xl font-bold mb-4 hover:text-blue-600 transition-colors cursor-pointer">
                            {featured.title}
                          </h2>
                        </Link>
                        <p className="text-muted-foreground mb-6">{featured.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{featured.authorName || featured.author || "Admin"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{featured.publishedAt ? new Date(featured.publishedAt).toDateString() : ""}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{featured.readTime || "—"}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => setOpenPost(featured)}
                          className="w-fit bg-blue-600 hover:bg-blue-700"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                );
              })()
            )}

            {/* Posts Grid */}
            <div>
              <h2 className="text-2xl font-bold mt-6 mb-6">Latest Blog</h2>

              {postsLoading ? (
                <div className="text-center py-12">Loading posts...</div>
              ) : displayedPosts.length === 0 ? (
                <div className="text-center py-12">No posts found.</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {displayedPosts.map((post: any) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.coverImageUrl || post.imageUrl || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <Badge className="absolute top-4 left-4">{post.category}</Badge>
                      </div>
                      <CardContent className="p-6">
                        <Link to={`/blog/${post.slug}`}>
                          <h3 className="text-xl font-bold mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{post.authorName || "Admin"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span>{post.readTime || "—"}</span>
                            <span>• {post.viewCount ?? 0} views</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Button variant="outline" onClick={() => setOpenPost(post)}>
                            Read More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Post Modal */}
            <Dialog open={!!openPost} onOpenChange={(open) => { if (!open) setOpenPost(null); }}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{openPost?.title}</DialogTitle>
                  <DialogDescription>{openPost?.excerpt}</DialogDescription>
                </DialogHeader>

                {openPost?.coverImageUrl && (
                  <div className="my-4">
                    <img src={openPost.coverImageUrl} alt={openPost.title} className="w-full h-80 object-cover rounded-md" />
                  </div>
                )}

                <div className="prose max-w-none whitespace-pre-wrap">
                  {openPost?.content && typeof openPost.content === "string" && /</.test(openPost.content) ? (
                    <div dangerouslySetInnerHTML={{ __html: openPost.content }} />
                  ) : (
                    <div>{openPost?.content}</div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

         
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
