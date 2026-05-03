import { Package } from 'lucide-react';
import AIGenerator from './AIGenerator';
import { aiAPI } from '../../services/api';

export default function ProductGenerator() {
  return (
    <AIGenerator
      title="Product Description Generator"
      description="Generate compelling, conversion-optimized product descriptions"
      icon={Package}
      color="from-blue-500 to-cyan-500"
      apiFunction={aiAPI.generateProduct}
      placeholder="Describe your product. Include features, benefits, target audience, and any specific details..."
      examplePrompt="A premium wireless noise-canceling headphone with 40-hour battery life, active noise cancellation, comfortable memory foam ear cushions, and Bluetooth 5.0. Target audience: professionals and travelers who value quality audio experience."
      isProduct={true}
    />
  );
}
