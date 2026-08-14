import { FiMapPin, FiNavigation } from "react-icons/fi";

// Replace this with your resort's real address or coordinates.
const RESORT_LOCATION = "Royal Palace, Phnom Penh, Cambodia";

const encodedLocation = encodeURIComponent(RESORT_LOCATION);

const mapEmbedUrl =
  `https://www.google.com/maps?q=${encodedLocation}&output=embed`;

const directionUrl =
  `https://www.google.com/maps/dir/?api=1` +
  `&destination=${encodedLocation}` +
  `&travelmode=driving`;

export default function ResortMap() {
  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-Blue">
            Our location
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Find Our Resort
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Click the map to open Google Maps and get directions to our resort.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slate-900">
          <div className="relative h-[400px] w-full">
            <iframe
              src={mapEmbedUrl}
              title="Resort location"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* This transparent link makes the whole map clickable */}
            <a
              href={directionUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open directions to our resort in Google Maps"
              className="absolute inset-0 z-10"
            />
          </div>

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FiMapPin
                className="mt-1 shrink-0 text-2xl text-primary-Blue"
                aria-hidden="true"
              />

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Resort Address
                </h3>

                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {RESORT_LOCATION}
                </p>
              </div>
            </div>

            <a
              href={directionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-Blue px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <FiNavigation aria-hidden="true" />
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}