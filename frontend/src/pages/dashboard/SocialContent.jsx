import { Share2 } from 'lucide-react';
import AIGenerator from './AIGenerator';
import { aiAPI } from '../../services/api';

export default function SocialContent() {
  return (
    <AIGenerator
      title="Social Media Content Generator"
      description="Create engaging content for all social platforms"
      icon={Share2}
      color="from-purple-500 to-pink-500"
      apiFunction={aiAPI.generateSocialContent}
      placeholder="Describe your brand, product, or topic..."
      examplePrompt="A fitness coaching brand that offers online personal training programs. Target audience: busy professionals who want to stay fit but can't make it to the gym. Tone: motivational, professional, results-focused."
    />
  );
}
