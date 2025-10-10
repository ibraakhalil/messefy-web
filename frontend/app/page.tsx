import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Pricing from '@/components/home/Pricing';
import FAQ from '@/components/home/FAQ';
import CTA from '@/components/home/CTA';
import Footer from '@/components/home/Footer';
import { auth } from '@/config/auth';
import { getWorkspaceByUser } from '@/lib/workspace-requests';

export default async function Home() {
  const session = await auth();
  const user = session?.user || undefined;
  const workspace = session?.accessToken ? await getWorkspaceByUser() : undefined;
  const userData = { user, workspace };

  return (
    <main>
      <Header userData={userData} />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
