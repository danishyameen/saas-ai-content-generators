import { Megaphone } from 'lucide-react';
import AIGenerator from './AIGenerator';
import { aiAPI } from '../../services/api';

export default function MarketingCampaign() {
  return (
    <AIGenerator
      title="Marketing Campaign Generator"
      description="Generate complete marketing campaigns"
      icon={Megaphone}
      color="from-pink-500 to-rose-500"
      apiFunction={aiAPI.generateMarketingCampaign}
      placeholder="Describe your product, target audience, and campaign goals..."
      examplePrompt="Launch campaign for a new AI-powered resume builder app. Target: job seekers and recent graduates. Goal: Drive app downloads and premium subscriptions. Budget: moderate. Duration: 4 weeks."
    />
  );
}
