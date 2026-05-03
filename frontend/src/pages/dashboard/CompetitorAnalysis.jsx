import { BarChart3 } from 'lucide-react';
import AIGenerator from './AIGenerator';
import { aiAPI } from '../../services/api';

export default function CompetitorAnalysis() {
  return (
    <AIGenerator
      title="Competitor Analysis Generator"
      description="Analyze competitors and find market opportunities"
      icon={BarChart3}
      color="from-indigo-500 to-blue-500"
      apiFunction={aiAPI.generateCompetitorAnalysis}
      placeholder="Describe your business or product..."
      examplePrompt="An online project management tool designed specifically for remote software development teams. Features include sprint planning, code review integration, and automated standup meetings."
    />
  );
}
