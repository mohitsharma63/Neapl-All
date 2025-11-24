import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-background" data-testid="page-about">
      <Header />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16" data-testid="about-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us | हाम्रो बारेमा</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Jeevika Services Pvt. Ltd. ले नेपालमा गुणस्तरीय सेवा र भरोसायोग्य सहायता पुर्‍याउने उद्देश्यका साथ काम गरिरहेको छ। हामी ग्राहकलाई केन्द्रमा राखेर अविरल सुधार र पारदर्शी सेवा प्रदान गर्छौं।
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission | हाम्रो लक्ष्य</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide reliable, accessible and affordable services across Nepal. We aim to empower local
                  communities by offering trusted listings, helpful customer support, and tools that make
                  transactions simple and transparent.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Vision | हाम्रो दृष्‍टि</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A digital marketplace where everyone in Nepal can discover, buy, sell and access services with
                  confidence — creating economic opportunities and connecting people to what they need.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Story | हाम्रो कथा</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Started by a small team with a big idea, Jeevika began as a local listing service and gradually
                  expanded into a full platform for services, properties and jobs. We grew by listening to users,
                  iterating fast and keeping simple, human-centred design at the core of what we build.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Values | मूल्य</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Trust & Transparency</li>
                  <li>User-first Design</li>
                  <li>Local Empowerment</li>
                  <li>Continuous Improvement</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Mohit Sharma</h4>
                    <p className="text-sm text-muted-foreground">Founder & CEO</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sita Gautam</h4>
                    <p className="text-sm text-muted-foreground">Head of Operations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="/contact" className="block text-primary hover:underline">Contact Us</a>
                <a href="/blog" className="block text-primary hover:underline">Blog</a>
                <a href="/signup" className="block text-primary hover:underline">Join Our Team</a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ready to get started?</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/signup">Create an Account</a>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
