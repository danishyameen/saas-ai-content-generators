import { Megaphone } from 'lucide-react';
import AIGenerator from './AIGenerator';
import { aiAPI } from '../../services/api';

export default function AdsGenerator() {
  return (
    <AIGenerator
      title="Ad Copy Generator"
      description="Generate high-converting ads for all platforms"
      icon={Megaphone}
      color="from-orange-500 to-red-500"
      apiFunction={aiAPI.generateAds}
      placeholder="Describe your product/service and target audience..."
      examplePrompt="A meal kit delivery service that delivers pre-portioned ingredients and chef-designed recipes to your door. Target: busy professionals aged 25-45 who want to cook at home but lack time for meal planning and grocery shopping."
    />
  );
}
