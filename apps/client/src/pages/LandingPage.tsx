import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { ProductPreviewSection } from '../components/landing/ProductPreviewSection';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/landing/Footer';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/documents', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null; // Don't flash the landing page while redirecting
  }

  return (
    <div className="min-h-dvh bg-surface font-sans text-text-primary selection:bg-primary-500/30">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ProductPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
