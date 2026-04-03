import Link from 'next/link';

interface Vendor {
  $id: string;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  price_range: string;
  photos: string;
}

export default function CityVendorGrid({
  vendors,
  city,
}: {
  vendors: Vendor[];
  city: string;
}) {
  if (vendors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-sans">
          No kota spots found in {city} yet.{' '}
          <Link href="/submit" className="text-mzansi-teal hover:underline">
            Be the first to add one!
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => {
        const photos: string[] = vendor.photos
          ? (() => { try { return JSON.parse(vendor.photos); } catch { return []; } })()
          : [];
        const thumb = photos[0] ?? '/placeholder-1.jpg';

        return (
          <Link
            key={vendor.$id}
            href={`/vendor/${vendor.$id}`}
            className="block bg-white rounded-2xl shadow-md overflow-hidden vendor-card"
          >
            <div className="relative h-40 bg-gray-100">
              <img
                src={thumb}
                alt={`Kota street food at ${vendor.name} in ${city}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="heading-bold text-lg text-mzansi-black mb-1">{vendor.name}</h2>
              <p className="text-gray-500 font-sans text-sm mb-2 line-clamp-2">{vendor.address}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  ⭐ {vendor.rating.toFixed(1)}{' '}
                  <span className="text-gray-400 font-normal">({vendor.review_count})</span>
                </span>
                {vendor.price_range && (
                  <span className="text-sm font-bold text-mzansi-teal">{vendor.price_range}</span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
