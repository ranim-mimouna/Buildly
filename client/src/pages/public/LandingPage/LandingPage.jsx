import HeroSection from '../../../components/landing/HeroSection/HeroSection';
import HowItWorksSection from '../../../components/landing/HowItWorksSection/HowItWorksSection';
import ServicesShowcase from '../../../components/landing/ServicesShowcase/ServicesShowcase';

import PublicLayout from '../../../layouts/PublicLayout/PublicLayout';

const LandingPage = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <HowItWorksSection />
      <ServicesShowcase />
    </PublicLayout>
  );
};

export default LandingPage;