import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit a Street Food Spot',
  description:
    'Know a great Kota or Bunny Chow spot in South Africa? Submit it to our community directory and help others discover the best kota street food in Mzansi.',
  keywords: [
    'add kota spot South Africa',
    'submit street food spot',
    'kota directory submission',
    'bunny chow spot listing',
  ],
  robots: { index: true, follow: true },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
