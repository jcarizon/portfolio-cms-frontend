'use client';

import { useEffect, useState } from 'react';
import { Github, ExternalLink, Mail, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { heroApi, settingsApi } from '@/shared/lib/api';
import type { Hero, SiteSettings } from '@/shared/types';

// Fallback data while loading
const defaultHero: Hero = {
  id: 'default',
  initials: 'JC',
  fullName: 'Jhon Mark Carizon',
  title: 'Web Developer',
  location: 'Mandaue City, Cebu, Philippines',
  profileImage: null,
  gradientFrom: '#667eea',
  gradientTo: '#764ba2',
  stats: [],
  createdAt: '',
  updatedAt: '',
};

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [hero, setHero] = useState<Hero>(defaultHero);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        const [heroRes, settingsRes] = await Promise.all([
          heroApi.get(),
          settingsApi.getSite(),
        ]);
        setHero(heroRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <header
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${hero.gradientFrom} 0%, ${hero.gradientTo} 100%)`,
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Shapes */}
        <div
          className={cn(
            'absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-10',
            'bg-white blur-3xl transition-all duration-1000',
            mounted ? 'translate-x-0 opacity-10' : '-translate-x-full opacity-0'
          )}
        />
        <div
          className={cn(
            'absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10',
            'bg-white blur-3xl transition-all duration-1000 delay-300',
            mounted ? 'translate-x-0 opacity-10' : 'translate-x-full opacity-0'
          )}
        />
        
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-5 text-center text-white relative z-10">
        {/* Profile Image / Initials */}
        <div
          className={cn(
            'mx-auto mb-8 transition-all duration-700',
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          )}
        >
          {hero.profileImage ? (
            <img
              src={hero.profileImage}
              alt={hero.fullName}
              className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white/20 shadow-2xl mx-auto"
            />
          ) : (
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-white/95 flex items-center justify-center shadow-2xl mx-auto backdrop-blur-sm">
              <span
                className="text-5xl md:text-6xl font-bold"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${hero.gradientFrom}, ${hero.gradientTo})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {hero.initials}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <h1
          className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight',
            'font-[family-name:var(--font-display)]',
            'transition-all duration-700 delay-100',
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {hero.fullName}
        </h1>

        {/* Title */}
        <p
          className={cn(
            'text-xl md:text-2xl font-medium mb-4 text-white/95',
            'transition-all duration-700 delay-200',
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {hero.title}
        </p>

        {/* Location */}
        <p
          className={cn(
            'flex items-center justify-center gap-2 text-white/80 mb-8',
            'transition-all duration-700 delay-300',
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <MapPin className="w-4 h-4" />
          {hero.location}
        </p>

        {/* Social Links */}
        <div
          className={cn(
            'flex flex-wrap items-center justify-center gap-4',
            'transition-all duration-700 delay-400',
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {settings.githubUrl && (
            <a
              href={settings.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline text-white border-white/30 hover:bg-white gap-2"
              style={{ '--hover-color': hero.gradientFrom } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = hero.gradientFrom;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white';
              }}
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
          )}

          {settings.portfolioUrl && (
            <a
              href={settings.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline text-white border-white/30 hover:bg-white gap-2"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = hero.gradientFrom;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white';
              }}
            >
              <ExternalLink className="w-5 h-5" />
              Portfolio
            </a>
          )}

          <a
            href="#contact"
            className="btn bg-white/10 backdrop-blur-sm text-white hover:bg-white gap-2"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = hero.gradientFrom;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'white';
            }}
          >
            <Mail className="w-5 h-5" />
            Contact
          </a>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div
        className={cn(
          'absolute bottom-8 left-1/2 -translate-x-1/2',
          'transition-all duration-700 delay-500',
          mounted ? 'opacity-100' : 'opacity-0'
        )}
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
          aria-label="Scroll to about section"
        >
          <span className="text-sm font-medium">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </a>
      </div>
    </header>
  );
}