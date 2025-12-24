
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { User, Mail, Phone, MapPin, Calendar, Edit, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  accountType?: string;
  role: string;
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  address?: string;
  postalCode?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    area: "",
    address: "",
    postalCode: "",
    avatar: "",
  });

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLocation("/login");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setLocation("/login");
    } finally {
      setLoading(false);
    }
  }, [setLocation]);

  useEffect(() => {
    if (!user) return;
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      country: user.country || "",
      state: user.state || "",
      city: user.city || "",
      area: user.area || "",
      address: user.address || "",
      postalCode: user.postalCode || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const resp = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          phone: editForm.phone,
          country: editForm.country,
          state: editForm.state,
          city: editForm.city,
          area: editForm.area,
          address: editForm.address,
          postalCode: editForm.postalCode,
          avatar: editForm.avatar,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        alert(data?.message || "Failed to update profile");
        return;
      }

      const merged = { ...user, ...data };
      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));
      setIsEditOpen(false);
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user.firstName?.[0] || user.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.username}
                    </h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                        {user.role}
                      </Badge>
                      {user.accountType && (
                        <Badge variant="outline">{user.accountType}</Badge>
                      )}
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Update your contact and location details.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm((p) => ({ ...p, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={editForm.postalCode}
                      onChange={(e) => setEditForm((p) => ({ ...p, postalCode: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editForm.address}
                    onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      value={editForm.area}
                      onChange={(e) => setEditForm((p) => ({ ...p, area: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editForm.city}
                      onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={editForm.state}
                      onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editForm.country}
                      onChange={(e) => setEditForm((p) => ({ ...p, country: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      value={editForm.avatar}
                      onChange={(e) => setEditForm((p) => ({ ...p, avatar: e.target.value }))}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Information */}
          {(user.address || user.city || user.country) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <div className="space-y-1">
                      {user.address && <p className="font-medium">{user.address}</p>}
                      {user.area && <p className="text-sm">{user.area}</p>}
                      <p className="text-sm">
                        {[user.city, user.state, user.postalCode].filter(Boolean).join(", ")}
                      </p>
                      {user.country && <p className="text-sm">{user.country}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
