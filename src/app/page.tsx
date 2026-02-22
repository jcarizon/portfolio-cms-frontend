import { HeroSection } from '@/features/portfolio/components/hero-section';
import { AboutSection } from '@/features/portfolio/components/about-section';
import { SkillsSection } from '@/features/portfolio/components/skills-section';
import { ProjectsSection } from '@/features/portfolio/components/projects-section';
import { ExperienceSection } from '@/features/portfolio/components/experience-section';
import { ContactSection } from '@/features/portfolio/components/contact-section';
import { Footer } from '@/features/portfolio/components/footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
