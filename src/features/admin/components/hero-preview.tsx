'use client';

import { MapPin, Github, ExternalLink, Mail } from 'lucide-react';
import type { Hero } from '@/shared/types';

interface HeroPreviewProps {
  hero: Partial<Hero>;
}

export function HeroPreview({ hero }: HeroPreviewProps) {
  const {
    initials = 'JC',
    fullName = 'Your Name',
    title = 'Your Title',
    location = 'Your Location',
    gradientFrom = '#667eea',
    gradientTo = '#764ba2',
    profileImage,
  } = hero;

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200">
      {/* Preview Label */}
      <div className="bg-neutral-800 text-white text-xs px-4 py-2 flex items-center justify-between">
        <span>Live Preview</span>
        <span className="text-neutral-400">Desktop View</span>
      </div>

      {/* Preview Content */}
      <div
        className="relative py-16 px-8 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        }}
      >
        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Profile */}
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-xl mx-auto mb-6"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/95 flex items-center justify-center shadow-xl mx-auto mb-6">
              <span
                className="text-3xl font-bold"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {initials}
              </span>
            </div>
          )}

          {/* Name */}
          <h1 className="text-2xl font-bold mb-2">{fullName}</h1>

          {/* Title */}
          <p className="text-lg text-white/90 mb-2">{title}</p>

          {/* Location */}
          <p className="flex items-center justify-center gap-1.5 text-white/70 text-sm mb-6">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </p>

          {/* Buttons Preview */}
          <div className="flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-white/30 rounded-lg text-white/80">
              <Github className="w-4 h-4" />
              GitHub
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-white/30 rounded-lg text-white/80">
              <ExternalLink className="w-4 h-4" />
              Portfolio
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-white/10 rounded-lg text-white/80">
              <Mail className="w-4 h-4" />
              Contact
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}