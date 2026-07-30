import availabilityRule from './availabilityRule';
import blockedPeriod from './blockedPeriod';
import service from './service';
import siteSettings from './siteSettings';
import homePage from './homePage';
import aboutPage from './aboutPage';
import servicesPage from './servicesPage';
import contactPage from './contactPage';

import link from './objects/link';
import ctaBanner from './objects/ctaBanner';
import teaser from './objects/teaser';
import sectionHeader from './objects/sectionHeader';
import media from './objects/media';
import seo from './objects/seo';
import faqItem from './objects/faqItem';
import credentialItem from './objects/credentialItem';
import approachStep from './objects/approachStep';

export const schemaTypes = [
  // documents
  siteSettings,
  homePage,
  aboutPage,
  servicesPage,
  contactPage,
  service,
  availabilityRule,
  blockedPeriod,
  // shared objects
  link,
  ctaBanner,
  teaser,
  sectionHeader,
  media,
  seo,
  faqItem,
  credentialItem,
  approachStep,
];
