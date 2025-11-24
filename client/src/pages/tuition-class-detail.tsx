import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { MapPin, Phone, Eye, Grid, List, Search, User, GraduationCap, BookOpen, Clock } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TuitionPrivateClasses() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["/api/tuition-private-classes"],
  });

  const filteredListings = listings.filter((listing: any) => {
    const matchesSearch = !searchQuery ||
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.teacherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.subjects?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = selectedCity === "all" || listing.city === selectedCity;
    const matchesSubject = selectedSubject === "all" || listing.subjects?.includes(selectedSubject);
    const matchesLevel = selectedLevel === "all" || listing.classLevels?.includes(selectedLevel);
    const matchesMode = selectedMode === "all" || listing.classMode === selectedMode;

    return matchesSearch && matchesCity && matchesSubject && matchesLevel && matchesMode;
  });

  const cities = Array.from(new Set(listings.map((l: any) => l.city).filter(Boolean)));
  const subjects = Array.from(new Set(listings.flatMap((l: any) => l.subjects || []).filter(Boolean)));
  const levels = Array.from(new Set(listings.flatMap((l: any) => l.classLevels || []).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tuition & Private Classes</h1>
          <p className="text-muted-foreground">Browse tuition & private classes listings</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tuition & private classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger>
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredListings.length} results
          </p>
          {(selectedCity !== "all" || selectedSubject !== "all" || selectedLevel !== "all" || selectedMode !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCity("all");
                setSelectedSubject("all");
                setSelectedLevel("all");
                setSelectedMode("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Listings Grid/List */}
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tuition classes found</p>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredListings.map((listing: any) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
                    {listing.isFeatured && (
                      <Badge className="bg-yellow-500">Featured</Badge>
                    )}
                  </div>

                  {/* Teacher/Seller Name - Prominent Display */}
                  {(listing.teacherName || listing.contactPerson) && (
                    <div className="flex items-center gap-2 mb-3 bg-green-50 dark:bg-green-950/20 p-2 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-green-700 dark:text-green-300" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Teacher</p>
                        <p className="font-semibold text-sm text-green-700 dark:text-green-300">
                          {listing.teacherName || listing.contactPerson}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Class Details */}
                  <div className="space-y-2 mb-3">
                    {listing.classLevels && listing.classLevels.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          {listing.classLevels.join(", ")}
                        </span>
                      </div>
                    )}

                    {listing.classMode && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground capitalize">
                          {listing.classMode} Classes
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Subjects */}
                  {listing.subjects && listing.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {listing.subjects.slice(0, 3).map((subject: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {subject}
                        </Badge>
                      ))}
                      {listing.subjects.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{listing.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    {listing.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.city}</span>
                      </div>
                    )}
                    {listing.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{listing.contactPhone}</span>
                      </div>
                    )}
                    {listing.viewCount !== undefined && (
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{listing.viewCount} views</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/tuition-class/${listing.id}`}>
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}