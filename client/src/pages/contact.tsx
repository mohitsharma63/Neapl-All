
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-contact">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16" data-testid="contact-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-contact-title">
            हामीसँग सम्पर्क गर्नुहोस् | Contact Us
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto" data-testid="text-contact-subtitle">
            नेपालको अग्रणी रियल एस्टेट सेवामा तपाईंलाई स्वागत छ। हामी तपाईंको सेवामा सधैं तत्पर छौं।
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Office Information */}
              <Card data-testid="office-info">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span>मुख्य कार्यालय | Head Office</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Jeevika Services Pvt. Ltd.</h4>
                    <p className="text-muted-foreground">
                      New Baneshwor, Kathmandu<br />
                      नयाँ बानेश्वर, काठमाडौं<br />
                      Nepal
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <div>
                      <p>+977-1-4123456</p>
                      <p>+977-9812345678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <div>
                      <p>info@jeevikaservices.com</p>
                      <p>support@jeevikaservices.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <div>
                      <p>Sunday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Branch Offices */}
              <Card data-testid="branch-offices">
                <CardHeader>
                  <CardTitle>शाखा कार्यालयहरू | Branch Offices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Pokhara Branch</h4>
                    <p className="text-muted-foreground text-sm">
                      Lakeside, Pokhara<br />
                      +977-61-123456
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Chitwan Branch</h4>
                    <p className="text-muted-foreground text-sm">
                      Bharatpur, Chitwan<br />
                      +977-56-123456
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Butwal Branch</h4>
                    <p className="text-muted-foreground text-sm">
                      Traffic Chowk, Butwal<br />
                      +977-71-123456
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card data-testid="quick-links">
                <CardHeader>
                  <CardTitle>तुरुन्त सम्पर्क | Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" data-testid="button-whatsapp">
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp: +977-9812345678
                  </Button>
                  <Button className="w-full justify-start" variant="outline" data-testid="button-viber">
                    <Phone className="w-4 h-4 mr-2" />
                    Viber: +977-9812345678
                  </Button>
                  <Button className="w-full justify-start" variant="outline" data-testid="button-emergency">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency: +977-9898989898
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card data-testid="contact-form">
              <CardHeader>
                <CardTitle className="text-2xl">
                  सन्देश पठाउनुहोस् | Send us a Message
                </CardTitle>
                <p className="text-muted-foreground">
                  तपाईंको कुनै प्रश्न वा सुझाव छ? हामीलाई सन्देश पठाउनुहोस्।
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">नाम | Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">इमेल | Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">फोन नम्बर | Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+977-9812345678"
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">विषय | Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter message subject"
                        data-testid="input-subject"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">सन्देश | Message *</Label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter your message here..."
                      className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      "पठाउँदै... | Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        सन्देश पठाउनुहोस् | Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map Section */}
            <Card className="mt-8" data-testid="map-section">
              <CardHeader>
                <CardTitle>हाम्रो स्थान | Our Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Interactive Map (Google Maps integration would go here)
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  New Baneshwor, Kathmandu, Nepal | GPS: 27.6944° N, 85.3206° E
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card data-testid="contact-faq">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                बारम्बार सोधिने प्रश्नहरू | Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">How can I list my property?</h4>
                  <p className="text-muted-foreground text-sm">
                    You can list your property by contacting us directly or using our online form. Our team will guide you through the process.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What areas do you cover?</h4>
                  <p className="text-muted-foreground text-sm">
                    We cover major cities across Nepal including Kathmandu, Pokhara, Chitwan, Butwal, and surrounding areas.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Do you charge consultation fees?</h4>
                  <p className="text-muted-foreground text-sm">
                    Initial consultation is free. We charge commission only when a successful transaction is completed.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How long does property verification take?</h4>
                  <p className="text-muted-foreground text-sm">
                    Property verification typically takes 3-5 business days depending on the location and documentation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />

      {/* Back to Top Button */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        data-testid="button-back-to-top"
      >
        ↑
      </button>
    </div>
  );
}
