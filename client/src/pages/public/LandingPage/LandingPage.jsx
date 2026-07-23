import HeroSection from '../../../components/landing/HeroSection/HeroSection';
import PublicLayout from '../../../layouts/PublicLayout/PublicLayout';

const LandingPage = () => {
  return (
    <PublicLayout>
      <HeroSection />

      <section
        id="how-it-works"
        style={{
          minHeight: '80vh',
          padding: '100px 24px',
          background: '#ffffff',
        }}
      >
        <div className="container">
          <h2>How Buildly works</h2>

          <p>
            This section will be created in the next
            tickets.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;