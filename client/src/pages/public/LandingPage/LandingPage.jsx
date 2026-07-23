import HeroSection from '../../../components/landing/HeroSection/HeroSection';
import HowItWorksSection from '../../../components/landing/HowItWorksSection/HowItWorksSection';
import ServicesShowcase from '../../../components/landing/ServicesShowcase/ServicesShowcase';
import WhyBuildlySection from '../../../components/landing/WhyBuildlySection/WhyBuildlySection';
import FinalCTASection from '../../../components/landing/FinalCTASection/FinalCTASection';

import PublicLayout from '../../../layouts/PublicLayout/PublicLayout';

const LandingPage = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <HowItWorksSection />
      <ServicesShowcase />
      <WhyBuildlySection />
      <FinalCTASection />
    </PublicLayout>
  );
};

export default LandingPage;