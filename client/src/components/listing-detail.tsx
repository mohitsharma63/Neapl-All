import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  listing: any;
  titleField?: string; // e.g. 'title' or 'name'
  subtitleField?: string; // e.g. 'tutorName' or 'contactPerson'
  showFields?: string[]; // explicit list of fields to show in details grid
  featureKeys?: string[]; // optional list of boolean feature keys to show as badges
};

function prettyKey(k: string) {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b(\w)/g, (s) => s.toUpperCase());
}

export default function ListingDetail({ listing, titleField = "title", subtitleField = "contactPerson", showFields, featureKeys }: Props) {
  if (!listing) return null;

  // Default fields to display when no showFields provided.
  const defaultFields = [
    "listingType",
    "subjectCategory",
    "teachingMode",
    "classType",
    "tutorQualification",
    "tutorExperienceYears",
    "gradeLevel",
    "minGrade",
    "maxGrade",
    "board",
    "batchSize",
    "feePerMonth",
    "feePerHour",
    "feePerSubject",
    "country",
    "stateProvince",
    "city",
    "areaName",
    "fullAddress",
    "isActive",
    "isFeatured",
    "viewCount",
    "createdAt",
    "updatedAt",
  ];

  const fields = showFields && showFields.length > 0 ? showFields : defaultFields;

  // Derive all keys from the listing object so we can optionally show everything
  const allKeysFromListing = useMemo(() => {
    try {
      return Object.keys(listing).filter(Boolean).sort((a, b) => a.localeCompare(b));
    } catch (e) {
      return [] as string[];
    }
  }, [listing]);

  const [showAllFields, setShowAllFields] = useState(false);
  const [fieldFilter, setFieldFilter] = useState("");

  const visibleFields = useMemo(() => {
    const source = showAllFields ? allKeysFromListing : fields;
    const normalized = (source || []).filter(Boolean).map((k) => String(k));
    if (fieldFilter && fieldFilter.trim().length > 0) {
      const q = fieldFilter.trim().toLowerCase();
      return normalized.filter((k) => k.toLowerCase().includes(q));
    }
    return normalized;
  }, [showAllFields, allKeysFromListing, fields, fieldFilter]);

  const formatValue = (v: any): React.ReactNode => {
    if (v == null) return "—";
    if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
    if (typeof v === "boolean") return v ? "Yes" : "No";
    if (typeof v === "object") return <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(v, null, 2)}</pre>;
    // Dates
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toLocaleString();
    // Numbers representing money
    if (typeof v === "number") return v.toString();
    return String(v);
  };

  // Image gallery logic
  const images: string[] = Array.isArray(listing.images)
    ? listing.images
    : listing.images && typeof listing.images === "string"
    ? [listing.images]
    : listing.images && typeof listing.images === "object"
    ? Object.values(listing.images as Record<string, any>).filter(Boolean).map(String)
    : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImage = images.length ? images[currentImageIndex] : undefined;

  const defaultFeatureKeys = [
    "demoClassAvailable",
    "studyMaterialProvided",
    "testSeriesIncluded",
    "doubtClearingSessions",
    "flexibleTimings",
    "weekendClasses",
    "homeTuitionAvailable",
    "onlineClassesAvailable",
  ];

  const resolvedFeatureKeys = featureKeys ?? defaultFeatureKeys.filter((k) => Object.prototype.hasOwnProperty.call(listing, k));

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">{listing[titleField] || listing.name || "Details"}</h1>
          {listing[subtitleField] && <div className="text-sm text-muted-foreground">{listing[subtitleField]}</div>}
          {listing.feePerMonth || listing.feePerHour || listing.feePerSubject ? (
            <div className="mt-3 text-xl font-semibold text-green-700">
              {listing.feePerMonth ? `₹${Number(listing.feePerMonth).toLocaleString()}/month` : listing.feePerHour ? `₹${Number(listing.feePerHour).toLocaleString()}/hr` : listing.feePerSubject ? `₹${Number(listing.feePerSubject).toLocaleString()}/subject` : null}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white p-4 rounded shadow">
              <div className="relative">
                {currentImage ? (
                  <img src={currentImage} alt={listing[titleField] || "listing image"} className="w-full h-72 md:h-96  rounded" />
                ) : (
                  <div className="w-full h-72 md:h-96 bg-gray-100 flex items-center justify-center rounded">No Image</div>
                )}

                {/* Prev/Next controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((idx) => (idx - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                      aria-label="previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((idx) => (idx + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                      aria-label="next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail row */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto mt-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                        idx === currentImageIndex ? "border-[#0B8457] shadow-md" : "border-gray-200/50 hover:border-gray-300"
                      }`}
                    >
                      <img src={img} alt={`${listing[titleField] || "listing"} ${idx + 1}`} className="w-full h-full " />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {listing.description ? (
              <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold mb-2">About</h2>
                <p className="text-muted-foreground">{listing.description}</p>
              </div>
            ) : null}

            {listing.subjectsOffered && listing.subjectsOffered.length > 0 ? (
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.subjectsOffered.map((s: string, i: number) => (
                    <Badge key={i} className="bg-gray-100 text-gray-800">{s}</Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-3">Details</h3>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input id="showAllFields" type="checkbox" checked={showAllFields} onChange={(e) => setShowAllFields(e.target.checked)} />
                    <span>Show all fields</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)} placeholder="Filter fields" className="px-2 py-1 border rounded text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visibleFields.map((f) => (
                  <React.Fragment key={f}>
                    <div className="text-sm text-muted-foreground">{prettyKey(f)}</div>
                    <div className="font-medium">{formatValue(listing[f])}</div>
                  </React.Fragment>
                ))}
              </div>

              {resolvedFeatureKeys.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {resolvedFeatureKeys.map((k) => (
                    <div key={k} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className={`inline-block w-2 h-2 rounded-full ${(listing as any)[k] ? "bg-green-500" : "bg-gray-400"}`}></span>
                      <span className="text-sm">{prettyKey(k)}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Raw Data</div>
                <div className="text-sm text-muted-foreground">Toggle to view full JSON</div>
              </div>
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer text-sm text-muted-foreground">Show raw JSON</summary>
                <pre className="text-xs mt-2 bg-gray-100 rounded p-2 overflow-auto max-h-60">{JSON.stringify(listing, null, 2)}</pre>
              </details>

              <hr className="my-4" />

              <div className="font-semibold">Contact</div>
              <div className="mt-2 text-sm text-muted-foreground">{listing.contactPerson || "—"}</div>
              {listing.contactPhone ? (
                <a href={`tel:${listing.contactPhone}`} className="block mt-3 w-full text-center bg-green-600 text-white px-4 py-2 rounded"><Phone className="inline-block mr-2"/>Call</a>
              ) : null}
              {listing.contactEmail ? (
                <a href={`mailto:${listing.contactEmail}`} className="block mt-2 w-full text-center bg-gray-800 text-white px-4 py-2 rounded"><Mail className="inline-block mr-2"/>Email</a>
              ) : null}
            </div>

            <div className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Stats</div>
                <div className="text-sm text-muted-foreground">{listing.isActive ? <Badge className="bg-green-100 text-green-800">Active</Badge> : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>}</div>
              </div>

              <div className="mt-3 text-sm text-muted-foreground">
                <div className="mb-2">{listing.isFeatured ? <Badge className="mr-2">Featured</Badge> : null}Views: <span className="font-medium">{listing.viewCount ?? 0}</span></div>
                <div className="mb-1">Created: <span className="font-medium">{listing.createdAt ? new Date(listing.createdAt).toLocaleString() : "—"}</span></div>
                <div className="mb-1">Updated: <span className="font-medium">{listing.updatedAt ? new Date(listing.updatedAt).toLocaleString() : "—"}</span></div>
                <div className="mb-1">Location: <span className="font-medium">{[listing.areaName, listing.city, listing.stateProvince, listing.country].filter(Boolean).join(", ") || '—'}</span></div>
                <div className="mb-1">Address: <span className="font-medium">{listing.fullAddress || '—'}</span></div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
