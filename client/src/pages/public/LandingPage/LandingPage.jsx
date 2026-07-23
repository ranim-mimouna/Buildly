import HeroSection from '../../../components/landing/HeroSection/HeroSection';
import HowItWorksSection from '../../../components/landing/HowItWorksSection/HowItWorksSection';

import PublicLayout from '../../../layouts/PublicLayout/PublicLayout';

const LandingPage = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <HowItWorksSection />
    </PublicLayout>
  );
};

export default LandingPage;