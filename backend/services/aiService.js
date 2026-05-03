const OpenAI = require('openai');
const axios = require('axios');

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const AI_PROMPTS = {
  'product-generator': (input) => `
You are an expert product description writer.
Generate compelling, conversion-optimized product descriptions.

Input: ${input}

Generate:
1. A catchy product title
2. A compelling headline (max 10 words)
3. A detailed product description (150-200 words)
4. 5 key features/benefits (bullet points)
5. A call-to-action
6. Target audience description
7. Unique selling proposition (USP)

Format the output clearly with sections.
`,

  'seo-generator': (input) => `
You are an expert SEO content strategist and writer.
Generate SEO-optimized content for the following topic/keyword.

Input: ${input}

Generate:
1. SEO-optimized title (with primary keyword)
2. Meta description (150-160 characters)
3. URL slug suggestion
4. H1 heading
5. 3-5 H2 subheadings
6. Full SEO article (500-800 words)
7. Internal linking suggestions
8. 5 related long-tail keywords
9. Image alt text suggestions
10. Schema markup recommendation

Make it search-engine friendly and reader-friendly.
`,

  'ads-generator': (input) => `
You are an expert digital marketing copywriter.
Generate high-converting ad copy for the following product/service.

Input: ${input}

Generate:
1. Facebook Ad (primary text + headline + description)
2. Google Search Ad (3 headlines + 2 descriptions)
3. TikTok Video Script (30 seconds)
4. Instagram Ad Caption + Hashtags
5. Twitter/X Ad Copy
6. LinkedIn Ad Copy
7. 5 Viral Hooks
8. Call-to-Action variations

Make each ad compelling, benefit-driven, and action-oriented.
`,

  'business-ideas': (input) => `
You are an expert business strategist and startup advisor.
Generate innovative business ideas based on the following input/interests.

Input: ${input}

Generate 5 business ideas. For each idea provide:
1. Business name
2. One-line pitch
3. Problem it solves
4. Target market
5. Revenue model
6. Startup cost estimate (low/medium/high)
7. Time to launch estimate
8. Growth potential (1-10)
9. First 3 steps to start
10. Potential competitors

Focus on ideas with real market potential.
`,

  'social-content': (input) => `
You are an expert social media manager and content creator.
Generate engaging social media content for the following topic/brand.

Input: ${input}

Generate:
1. Instagram Caption (with hashtags)
2. Twitter/X Post (280 chars)
3. Facebook Post
4. LinkedIn Post (professional tone)
5. TikTok Video Script (60 seconds)
6. YouTube Shorts Script (60 seconds)
7. Pinterest Pin Description
8. 5 Story Ideas for Instagram/Snapchat
9. Best posting times recommendation
10. Engagement-boosting question

Make content platform-specific and engaging.
`,

  'competitor-analysis': (input) => `
You are an expert market analyst and competitive intelligence specialist.
Perform a competitive analysis for the following business/product.

Input: ${input}

Generate:
1. Top 5 competitors
2. Competitor strengths and weaknesses
3. Pricing comparison
4. Feature comparison
5. Market positioning
6. SWOT analysis
7. Opportunities in the market
8. Threats to watch for
9. Recommended differentiation strategy
10. Action items to gain competitive advantage

Be thorough and strategic.
`,
};

class AIService {
  constructor() {
    this.model = 'llama-3.3-70b-versatile';
  }

  async generate(type, input) {
    try {
      const prompt = AI_PROMPTS[type];
      if (!prompt) {
        throw new Error(`Unknown AI type: ${type}`);
      }

      const fullPrompt = prompt(input);

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that generates high-quality business and marketing content.',
          },
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 4096,
      });

      const text = completion.choices[0].message.content;

      return {
        success: true,
        data: text,
        type,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  async generateMarketingCampaign(input) {
    try {
      const prompt = `
You are an expert marketing campaign manager.
Create a complete marketing campaign for: ${input}

Generate:
1. Campaign Name
2. Campaign Objective
3. Target Audience
4. Campaign Duration Recommendation
5. Channel Strategy (which platforms to use)
6. Budget Allocation Recommendation
7. 5 Email Sequence (subject + body)
8. Landing Page Copy
9. Retargeting Strategy
10. KPIs to Track
11. A/B Testing Suggestions

Make it actionable and results-oriented.
`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: prompt },
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 4096,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Marketing Campaign Error:', error);
      throw new Error(`Campaign generation failed: ${error.message}`);
    }
  }

  async generateTemplates() {
    try {
      const prompt = `
Generate 10 reusable marketing templates:
1. Welcome Email Template
2. Product Launch Email Template
3. Abandoned Cart Email Template
4. Newsletter Template
5. Facebook Ad Template
6. Instagram Post Template
7. Landing Page Headline Template
8. Sales Page Template
9. Webinar Invitation Template
10. Customer Testimonial Request Template

Make each template fill-in-the-blank style with placeholders.
`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: prompt },
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 4096,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Template Generation Error:', error);
      throw new Error(`Template generation failed: ${error.message}`);
    }
  }

  async generateImages(productInfo, count = 4, companyDetails = null) {
    try {
      // First try to search high-quality images from Unsplash
      if (UNSPLASH_ACCESS_KEY) {
        try {
          const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
              query: productInfo,
              per_page: count,
              orientation: 'squarish'
            },
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
          });

          if (response.data.results && response.data.results.length > 0) {
            return response.data.results.map(img => img.urls.regular);
          }
        } catch (searchError) {
          console.warn('Unsplash Search failed, falling back to AI generation:', searchError.message);
        }
      }

      // Fallback to DALL-E 3 if search fails or no key provided
      let brandingPrompt = '';
      if (companyDetails && companyDetails.name) {
        brandingPrompt = ` The image MUST include the company branding for "${companyDetails.name}".`;
        if (companyDetails.website) brandingPrompt += ` Website: ${companyDetails.website}.`;
        if (companyDetails.phone) brandingPrompt += ` Contact: ${companyDetails.phone}.`;
        if (companyDetails.address) brandingPrompt += ` Address: ${companyDetails.address}.`;
        brandingPrompt += ` Ensure the logo and details are integrated naturally onto the product or a subtle overlay in the corner.`;
      }

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `High-quality professional product photography of: ${productInfo}.${brandingPrompt} Commercial style, clean background, 4k resolution.`,
        n: 1, // DALL-E 3 only supports 1 image per request
        size: "1024x1024",
      });

      return [response.data[0].url];
    } catch (error) {
      console.error('AI Image Generation Error:', error);
      // Return 4 beautiful images from Unsplash as fallback based on product name
      const query = encodeURIComponent(productInfo);
      return [
        `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80&text=${query}_1`,
        `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80&text=${query}_2`,
        `https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80&text=${query}_3`,
        `https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80&text=${query}_4`
      ];
    }
  }

  async generateLogo(brandName, industry = 'tech') {
    try {
      let logos = [];

      // 1. Try OpenAI DALL-E 3 (Generates 1 high-quality logo)
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-placeholder') {
        try {
          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `A modern, professional, minimalist logo for a brand named "${brandName}" in the ${industry} industry. Vector style, flat design, white background, high contrast.`,
            n: 1,
            size: "1024x1024",
          });

          if (response.data && response.data[0].url) {
            logos.push(response.data[0].url);
          }
        } catch (openaiError) {
          console.warn('OpenAI Logo Generation failed:', openaiError.message);
        }
      }

      // 2. Supplement with high-quality Unsplash search results (3-4 images)
      if (UNSPLASH_ACCESS_KEY) {
        try {
          const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
              query: `${brandName} ${industry} brand logo minimalist`,
              per_page: 4,
              orientation: 'squarish'
            },
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
          });

          if (response.data.results && response.data.results.length > 0) {
            const unsplashLogos = response.data.results.map(img => img.urls.regular);
            logos = [...logos, ...unsplashLogos];
          }
        } catch (unsplashError) {
          console.warn('Unsplash Logo Search failed:', unsplashError.message);
        }
      }

      // 3. Final Reliable Fallback if we don't have enough logos
      if (logos.length < 4) {
        const fallbackCount = 4 - logos.length;
        const query = encodeURIComponent(`${brandName} ${industry} brand logo`);
        const fallbacks = [
          `https://placehold.co/800x800?text=${brandName}+Logo+1`,
          `https://placehold.co/800x800?text=${brandName}+Logo+2`,
          `https://placehold.co/800x800?text=${brandName}+Logo+3`,
          `https://placehold.co/800x800?text=${brandName}+Logo+4`
        ];
        logos = [...logos, ...fallbacks.slice(0, fallbackCount)];
      }

      // Ensure we return exactly 4 options
      return logos.slice(0, 4);
    } catch (error) {
      console.error('AI Logo Generation Error:', error);
      return [
        `https://placehold.co/800x800?text=${encodeURIComponent(brandName)}+Logo+1`,
        `https://placehold.co/800x800?text=${encodeURIComponent(brandName)}+Logo+2`,
        `https://placehold.co/800x800?text=${encodeURIComponent(brandName)}+Logo+3`,
        `https://placehold.co/800x800?text=${encodeURIComponent(brandName)}+Logo+4`
      ];
    }
  }
}

module.exports = new AIService();
