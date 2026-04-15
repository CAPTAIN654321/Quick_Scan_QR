import React from 'react';
import UniversalTemplate from './UniversalTemplate';
import BioPage from './BioPage';
import DigitalMenu from './DigitalMenu';
import BusinessCard from './BusinessCard';
import EventInvite from './EventInvite';

export default function TemplateRenderer({ templateName, config }) {
  switch (templateName) {
    case 'Corporate Nexus':
    case 'Social Vibe':
    case 'Minimalist Bio':
      return <UniversalTemplate config={config} />;
    case 'Creative Portfolio':
      return <BioPage config={config} />;
    case 'Foodie Delight':
    case 'Digital Menu Pro':
      return <DigitalMenu config={config} />;
    case 'Executive Card':
      return <BusinessCard config={config} />;
    case 'Event Pro':
    case 'Grand Opening':
      return <EventInvite config={config} />;
    default:
      return <UniversalTemplate config={config} />;
  }
}
