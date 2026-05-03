import { Lightbulb } from 'lucide-react';
import AIGenerator from './AIGenerator';
import { aiAPI } from '../../services/api';

export default function BusinessIdeas() {
  return (
    <AIGenerator
      title="Business Ideas Generator"
      description="Get innovative business ideas with market analysis"
      icon={Lightbulb}
      color="from-yellow-500 to-amber-500"
      apiFunction={aiAPI.generateBusinessIdeas}
      placeholder="Describe your interests, skills, or industry..."
      examplePrompt="I'm passionate about sustainability, have coding skills, and live in an urban area. I'm interested in B2B SaaS and have a budget of around $5,000 to start."
    />
  );
}
