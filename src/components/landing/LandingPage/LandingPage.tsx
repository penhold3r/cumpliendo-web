'use client';

import { Button, Icon, Surface, Text } from '@latty-ds/react';
import { signIn } from 'next-auth/react';
import { useTranslation } from '@/i18n';
import styles from './LandingPage.module.css';

/**
 * Value props, mirrored from the React Native onboarding carousel
 * (`onboarding.slides.*`). Icons are Latty built-ins so they stay typed.
 */
const FEATURES = [
  {
    icon: 'activity',
    titleKey: 'onboarding.slides.slide1.title',
    descriptionKey: 'onboarding.slides.slide1.description',
  },
  {
    icon: 'clock',
    titleKey: 'onboarding.slides.slide2.title',
    descriptionKey: 'onboarding.slides.slide2.description',
  },
  {
    icon: 'cloud',
    titleKey: 'onboarding.slides.slide3.title',
    descriptionKey: 'onboarding.slides.slide3.description',
  },
] as const;

export function LandingPage() {
  const { t } = useTranslation();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <span className={styles.logo} aria-hidden="true" />
          <Text as="h1" variant="display-lg" className={styles.heading}>
            Cumpliendo
          </Text>
          <Text variant="lead" className={styles.tagline}>
            {t('onboarding.tagline')}
          </Text>
        </header>

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => signIn('google', { callbackUrl: '/home' })}
          >
            {t('onboarding.continueGoogle')}
          </Button>
          <Text variant="caption" className={styles.footer}>
            {t('onboarding.footer')}
          </Text>
        </div>

        <Surface appearance="outlined" elevation="1" className={styles.features}>
          <div className={styles.card}>
            <ul className={styles.featureList}>
              {FEATURES.map(feature => (
                <li key={feature.titleKey} className={styles.feature}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <Icon name={feature.icon} size="sm" />
                  </span>
                  <div className={styles.featureText}>
                    <Text variant="label" as="p">
                      {t(feature.titleKey)}
                    </Text>
                    <Text variant="body-sm" className={styles.featureDescription}>
                      {t(feature.descriptionKey)}
                    </Text>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Surface>
      </div>
    </main>
  );
}
