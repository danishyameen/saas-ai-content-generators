import { Search } from 'lucide-react';
import AIGenerator from './AIGenerator';
import { aiAPI } from '../../services/api';

export default function SEOGenerator() {
  return (
    <AIGenerator
      title="SEO Content Generator"
      description="Create SEO-optimized articles and blog posts"
      icon={Search}
      color="from-green-500 to-emerald-500"
      apiFunction={aiAPI.generateSEO}
      placeholder="Enter your target keyword or topic..."
      examplePrompt="best project management software for small teams 2026"
    />
  );
}
