
// Puter.js Image Generation Service for Genifai
// Free alternative to OpenAI DALL-E for AI image generation
// Uses Puter.js txt2img() API - no API key required!
// Documentation: https://docs.puter.com/

class PuterImageService {
  constructor() {
    this.isInitialized = false;
    this.availableModels = ['flux', 'sdxl', 'sd3', 'sd15', 'flux-schnell', 'flux-dev'];
  }

  /**
   * Check if Puter.js is available in browser environment
   */
  static isAvailable() {
    return typeof window !== 'undefined' && typeof puter !== 'undefined';
  }

  /**
   * Initialize Puter.js service
   * Returns true if ready to use
   */
  async initialize() {
    if (this.isInitialized) {
      return true;
    }

    if (!PuterImageService.isAvailable()) {
      console.warn('Puter.js not available in this environment');
      return false;
    }

    this.isInitialized = true;
    console.log('✅ Puter.js service initialized');
    return true;
  }

  /**
   * Generate images using Puter.js txt2img()
   * This is the core function that replaces OpenAI DALL-E and Unsplash
   *
   * @param {string} prompt - Text description of image to generate
   * @param {Object} options - Generation options
   * @param {number} options.count - Number of images to generate (default: 4)
   * @param {string} options.model - AI model to use (default: "flux")
   * @param {number} options.width - Image width (default: 1024)
   * @param {number} options.height - Image height (default: 1024)
   * @param {boolean} options.enhance - Auto-enhance prompt using LLM (default: true)
   * @param {boolean} options.safe - Enable content filtering (default: true)
   * @returns {Promise<Array>} Array of image objects with URLs
   */
  async generateImages(prompt, options = {}) {
    const {
      count = 4,
      model = 'flux',
      width = 1024,
      height = 1024,
      enhance = true,
      safe = true
    } = options;

    await this.initialize();

    try {
      console.log('🚀 Generating images with Puter.js...', {
        prompt,
        count,
        model,
        size: `${width}x${height}`
      });

      // Call Puter.js txt2img() function
      // This function uses various models (Flux, SDXL, etc.) to generate images
      const images = await puter.ai.txt2img({
        prompt: prompt,
        model: model,
        width: width,
        height: height,
        n: count,
        enhance: enhance,
        safe: safe
      });

      console.log(`✅ Generated ${images.length} images successfully`);

      // Format response to match existing Genifai API structure
      return images.map((img, index) => ({
        url: img.url || img,
        prompt: prompt,
        width: img.width || width,
        height: img.height || height,
        model: model,
        index: index + 1,
        generatedAt: new Date().toISOString(),
        source: 'puterjs'
      }));

    } catch (error) {
      console.error('❌ Puter.js generation error:', error);
      throw new Error(`Puter.js image generation failed: ${error.message}`);
    }
  }

  /**
   * Generate logo options (4 variations)
   * Replaces backend generateLogo() function
   *
   * @param {string} brandName - Brand/company name
   * @param {string} industry - Industry type (default: "tech")
   * @returns {Promise<Object>} Logo options with variants
   */
  async generateLogo(brandName, industry = 'tech') {
    const prompt = `A modern, professional, minimalist logo for a brand named "${brandName}" in the ${industry} industry. Vector style, flat design, white background, high contrast, clean lines, corporate identity`;

    try {
      const images = await this.generateImages(prompt, {
        count: 4,
        model: 'flux',
        width: 1024,
        height: 1024,
        enhance: true,
        safe: true
      });

      return {
        brandName: brandName,
        industry: industry,
        options: images,
        primary: images[0],
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Logo generation error:', error);
      throw error;
    }
  }

  /**
   * Generate product images with optional branding
   * Replaces backend generateImages() function
   *
   * @param {string} productInfo - Product description
   * @param {Object} companyDetails - Optional company branding details
   * @param {number} count - Number of images to generate (default: 4)
   * @returns {Promise<Array>} Product images
   */
  async generateProductImages(productInfo, companyDetails = null, count = 4) {
    let prompt = `High-quality professional product photography: ${productInfo}. Commercial style, clean background, studio lighting, 4k resolution, highly detailed`;

    if (companyDetails?.name) {
      prompt += `. Brand: ${companyDetails.name}, professional presentation`;
    }

    return await this.generateImages(prompt, {
      count: count,
      model: 'flux',
      width: 1024,
      height: 1024,
      enhance: true,
      safe: true
    });
  }

  /**
   * Get available image generation models
   */
  getAvailableModels() {
    return this.availableModels;
  }

  /**
   * Get list of image generation models from Puter.js
   * Note: Requires initialize() to be called first
   */
  async listModels() {
    try {
      await this.initialize();
      const models = await puter.ai.listModels();
      return models;
    } catch (error) {
      console.error('Error listing models:', error);
      return this.availableModels;
    }
  }
}

// Export singleton instance - use this throughout the app
export const puterImageService = new PuterImageService();
export default puterImageService;

