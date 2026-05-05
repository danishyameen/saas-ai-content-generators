
// Puter.js AI Image Generation Service
// This service uses Puter.js txt2img() for client-side AI image generation
// It provides faster response times and reduces server load

import { puter } from "@heyputer/puter.js";

class PuterImageService {
  constructor() {
    this.isInitialized = false;
    this.availableModels = [];
  }

  /**
   * Initialize Puter.js service
   * Must be called before using any Puter.js functions
   */
  async initialize() {
    if (this.isInitialized) {
      return true;
    }

    try {
      // Check if user is signed in to Puter
      const isSignedIn = await puter.auth.isSignedIn();

      if (!isSignedIn) {
        console.log('Puter.js: User not signed in, using anonymous mode');
        // Puter.js can work without explicit sign-in for basic features
      }

      // Get available models for image generation
      await this.listAvailableModels();

      this.isInitialized = true;
      console.log('Puter.js service initialized successfully');
      return true;
    } catch (error) {
      console.error('Puter.js initialization error:', error);
      return false;
    }
  }

  /**
   * List available image generation models
   */
  async listAvailableModels() {
    try {
      const models = await puter.ai.listModels();
      this.availableModels = models;
      return models;
    } catch (error) {
      console.error('Error listing Puter.js models:', error);
      return [];
    }
  }

  /**
   * Generate images using Puter.js txt2img()
   * @param {string} prompt - The text prompt for image generation
   * @param {Object} options - Generation options
   * @param {number} options.n - Number of images to generate (default: 4)
   * @param {string} options.model - Model to use (default: "flux" or "sdxl")
   * @param {number} options.width - Image width (default: 1024)
   * @param {number} options.height - Image height (default: 1024)
   * @param {number} options.seed - Seed for reproducibility (default: random)
   * @param {boolean} options.safe - Enable content filtering (default: true)
   * @returns {Promise<Array>} Array of generated image URLs
   */
  async generateImages(prompt, options = {}) {
    const {
      n = 4,
      model = 'flux', // or "sdxl", "sd3", "sd15", "flux-schnell", "flux-dev"
      width = 1024,
      height = 1024,
      seed = Math.floor(Math.random() * 1000000),
      safe = true,
      enhance = true, // Automatically enhance prompt using LLM
    } = options;

    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('Puter.js: Generating images with prompt:', prompt);

      // Generate images using Puter.js txt2img
      const result = await puter.ai.txt2img({
        prompt: prompt,
        model: model,
        width: width,
        height: height,
        seed: seed,
        safe: safe,
        enhance: enhance,
        n: n,
      });

      // Puter.js returns an array of image objects with URLs
      const images = result.map(img => ({
        url: img.url || img,
        prompt: prompt,
        width: img.width || width,
        height: img.height || height,
        model: model,
        seed: seed,
        generatedAt: new Date().toISOString(),
      }));

      console.log(`Puter.js: Successfully generated ${images.length} images`);
      return images;

    } catch (error) {
      console.error('Puter.js image generation error:', error);
      throw new Error(`Puter.js image generation failed: ${error.message}`);
    }
  }

  /**
   * Generate a single logo image
   * @param {string} brandName - The brand name for the logo
   * @param {string} industry - The industry/style for the logo
   * @returns {Promise<Object>} Generated logo image object
   */
  async generateLogo(brandName, industry = 'tech') {
    const prompt = `A modern, professional, minimalist logo for a brand named "${brandName}" in the ${industry} industry. Vector style, flat design, white background, high contrast, clean lines, corporate identity`;

    try {
      const images = await this.generateImages(prompt, {
        n: 4,
        model: 'flux',
        width: 1024,
        height: 1024,
        enhance: true,
      });

      // Return first image as primary, but include all options
      return {
        primary: images[0],
        options: images,
        brandName: brandName,
        industry: industry,
      };
    } catch (error) {
      console.error('Puter.js logo generation error:', error);
      throw error;
    }
  }

  /**
   * Generate product images with branding
   * @param {string} productInfo - Product description
   * @param {Object} companyDetails - Company branding details
   * @param {number} count - Number of images to generate
   * @returns {Promise<Array>} Array of product images
   */
  async generateProductImages(productInfo, companyDetails = null, count = 4) {
    let prompt = `High-quality professional product photography of: ${productInfo}. Commercial style, clean background, 4k resolution, studio lighting`;

    if (companyDetails && companyDetails.name) {
      prompt += `. Include the brand "${companyDetails.name}"`;
      if (companyDetails.website) prompt += `. Website branding`;
      if (companyDetails.phone) prompt += `. Professional presentation`;
    }

    return await this.generateImages(prompt, {
      n: count,
      model: 'flux',
      width: 1024,
      height: 1024,
      enhance: true,
    });
  }

  /**
   * Get current usage statistics
   */
  async getUsageStats() {
    try {
      const usage = await puter.auth.getMonthlyUsage();
      return usage;
    } catch (error) {
      console.error('Error getting Puter.js usage:', error);
      return null;
    }
  }

  /**
   * Check if Puter.js is available
   */
  static isAvailable() {
    return typeof window !== 'undefined' && typeof puter !== 'undefined';
  }
}

// Create and export singleton instance
export const puterImageService = new PuterImageService();
export default puterImageService;

// Named exports for convenience
export {
  puterImageService,
};

