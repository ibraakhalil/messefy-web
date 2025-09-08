import Header from '@/components/home/Header'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import HowItWorks from '@/components/home/HowItWorks'
import Pricing from '@/components/home/Pricing'
import FAQ from '@/components/home/FAQ'
import CTA from '@/components/home/CTA'
import Footer from '@/components/home/Footer'
import RevealOnScroll from '@/components/common/RevealOnScroll'

export default function Home() {
  return (
    <main>
      <RevealOnScroll />
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
