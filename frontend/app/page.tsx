import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import FAQ from '@/components/home/FAQ';
import CTA from '@/components/home/CTA';
import Footer from '@/components/home/Footer';
import { auth } from '@/config/auth';

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  const isAuthenticated = Boolean(user);

  return (
    <main className="bg-primary-bg text-pure-color min-h-screen overflow-hidden">
      <Header user={user} />
      <Hero isAuthenticated={isAuthenticated} />
      <Features />
      <HowItWorks />
      <FAQ />
      <CTA isAuthenticated={isAuthenticated} />
      <Footer />
    </main>
  );
}
