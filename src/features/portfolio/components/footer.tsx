'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Twitter, ExternalLink, Settings } from 'lucide-react';
import { settingsApi } from '@/shared/lib/api';
import type { SiteSettings } from '@/shared/types';

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsApi.getSite();
        setSettings(response.data);
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const currentYear = new Date().getFullYear();
  const footerText = settings?.footerText || `© ${currentYear} All rights reserved.`;

  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {settings?.githubUrl && (
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}

            {settings?.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}

            {settings?.twitterUrl && (
              <a
                href={settings.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}

            {settings?.portfolioUrl && (
              <a
                href={settings.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Portfolio"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Copyright */}
          <p className="text-neutral-400 text-sm text-center">
            {footerText}
          </p>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm transition-colors"
          >
            <Settings className="w-4 h-4" />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}