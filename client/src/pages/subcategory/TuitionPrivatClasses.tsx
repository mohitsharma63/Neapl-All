import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TuitionListingCard from "@/components/tuition-listing-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function TuitionPrivatClassesSubpage() {
	const [searchTerm, setSearchTerm] = useState("");

	const { data: listings = [], isLoading } = useQuery({
		queryKey: ["tuition-private-classes-subpage"],
		queryFn: async () => {
			const res = await fetch("/api/admin/tuition-private-classes");
			if (!res.ok) throw new Error("Failed to fetch tuition listings");
			return res.json();
		},
	});

	const visible = listings.filter((l: any) => l.isActive && (!searchTerm || (l.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || (l.description || "").toLowerCase().includes(searchTerm.toLowerCase())));

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
				<div className="container mx-auto px-4">
					<h1 className="text-3xl md:text-4xl font-bold">Tuition & Private Classes</h1>
					<p className="mt-2 text-sm md:text-base opacity-90 max-w-2xl">Find qualified tutors and private classes near you. Filter, search and connect quickly.</p>
				</div>
			</section>

			<main className="container mx-auto px-4 py-8">
				<Card className="mb-6">
					<CardContent className="p-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
							<div className="relative md:col-span-2">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
								<Input
									placeholder="Search tutors, subjects, or locations..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-11"
								/>
							</div>

							<div className="flex gap-3 justify-end">
								<Button size="sm" className="hidden sm:inline-flex">Filter</Button>
								<Button size="sm" variant="ghost">Post a Class</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="mb-4 flex items-center justify-between">
					<div className="text-sm text-gray-600">Showing <span className="font-semibold">{visible.length}</span> results</div>
					<div className="text-xs text-gray-500">Tip: use subject names or location for better results</div>
				</div>

				{isLoading ? (
					<div className="py-20 text-center text-gray-600">Loading listings...</div>
				) : visible.length === 0 ? (
					<Card>
						<CardContent className="py-12 text-center">
							<h3 className="text-lg font-semibold">No classes found</h3>
							<p className="text-sm text-gray-500 mt-2">Try broadening your search or check back later.</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{visible.map((listing: any) => (
							<TuitionListingCard key={listing.id} listing={listing} />
						))}
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}
