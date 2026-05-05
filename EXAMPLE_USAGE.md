
# Puter.js Integration - Example Usage

This document shows practical examples of using Puter.js for AI image generation in Genifai.

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install @heyputer/puter.js
```

### 2. Basic Image Generation

```javascript
import { aiAPI } from './services/api';

// Generate 4 product images
const result = await aiAPI.generateImages({
  prompt: "Modern wireless headphones on white background, professional product photography",
  count: 4
});

console.log(result.source); // 'puterjs' or 'backend'
console.log(result.data); // Array of 4 image objects

// Display images
result.data.forEach(img => {
  const imageElement = document.createElement('img');
  imageElement.src = img.url;
  document.body.appendChild(imageElement);
});
```

## Practical Examples

### Example 1: Product Generator Page

```javascript
import { aiAPI } from './services/api';
import { useState } from 'react';

function ProductGenerator() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateImages = async () => {
    setLoading(true);
    try {
      const result = await aiAPI.generateImages({
        prompt: prompt,
        count: 4
      });
      setImages(result.data);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your product..."
      />
      <button onClick={generateImages} disabled={loading}>
        {loading ? 'Generating...' : 'Generate 4 Images'}
      </button>

      <div className="image-grid">
        {images.map((img, index) => (
          <div key={index} className="image-card">
            <img src={img.url} alt={`Generated ${index + 1}`} />
            <a href={img.url} download={`product-${index + 1}.png`}>
              Download PNG
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Logo Generator

```javascript
import { aiAPI } from './services/api';
import { useState } from 'react';

function LogoGenerator() {
  const [brandName, setBrandName] = useState('MyBrand');
  const [industry, setIndustry] = useState('tech');
  const [logos, setLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);

  const generateLogos = async () => {
    try {
      const result = await aiAPI.generateLogo({
        brandName: brandName,
        industry: industry
      });
      setLogos(result.data);
      setSelectedLogo(result.primary);
    } catch (error) {
      console.error('Logo generation failed:', error);
    }
  };

  return (
    <div>
      <input
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        placeholder="Your brand name"
      />
      <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
        <option value="tech">Technology</option>
        <option value="fashion">Fashion</option>
        <option value="food">Food & Beverage</option>
        <option value="fitness">Fitness</option>
      </select>
      <button onClick={generateLogos}>Generate 4 Logo Options</button>

      <div className="logo-options">
        {logos.map((logo, index) => (
          <div
            key={index}
            className={`logo-option ${selectedLogo?.url === logo.url ? 'selected' : ''}`}
            onClick={() => setSelectedLogo(logo)}
          >
            <img src={logo.url} alt={`Logo option ${index + 1}`} />
            <div className="download-buttons">
              <a href={logo.url} download={`${brandName}-logo-${index + 1}.png`}>
                PNG
              </a>
              <a href={logo.url} download={`${brandName}-logo-${index + 1}.jpg`}>
                JPG
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 3: Using Puter.js Service Directly

```javascript
import { puterImageService } from './services/api';
// or: import puterImageService from './services/puterImageService';

async function generateCustomImages() {
  try {
    // Check if Puter.js is available
    if (!puterImageService.isAvailable()) {
      console.log('Puter.js not available, using fallback');
      return;
    }

    // List available models
    const models = await puterImageService.listModels();
    console.log('Available models:', models);

    // Generate with specific model
    const images = await puterImageService.generateImages(
      'A futuristic smartwatch with holographic display',
      {
        count: 4,
        model: 'flux', // or 'sdxl', 'sd3'
        width: 1024,
        height: 1024,
        enhance: true,
        safe: true
      }
    );

    console.log('Generated:', images.length, 'images');
    return images;

  } catch (error) {
    console.error('Error:', error);
  }
}

// Generate logo
async function generateBrandLogo() {
  const result = await puterImageService.generateLogo(
    'TechCorp',
    'technology'
  );

  console.log('Primary logo:', result.primary);
  console.log('All options:', result.options);
  return result;
}

// Generate product images with branding
async function generateBrandedProducts() {
  const images = await puterImageService.generateProductImages(
    'Premium leather wallet',
    {
      name: 'LuxuryBrand',
      website: 'luxurybrand.com',
      phone: '+1-234-567-8900'
    },
    4 // count
  );

  return images;
}
```

### Example 4: Error Handling & Fallback

```javascript
import { aiAPI } from './services/api';

async function generateWithFallback(prompt) {
  try {
    // This will automatically use Puter.js if available,
    // otherwise fall back to backend API
    const result = await aiAPI.generateImages({
      prompt: prompt,
      count: 4
    });

    console.log('Generation successful!');
    console.log('Source:', result.source); // 'puterjs' or 'backend'
    console.log('Images:', result.data);

    return result;

  } catch (error) {
    console.error('All generation methods failed:', error);

    // Show user-friendly error
    alert('Image generation failed. Please try again later.');

    // Return placeholder images
    return {
      success: false,
      data: [
        'https://via.placeholder.com/1024x1024?text=Error+1',
        'https://via.placeholder.com/1024x1024?text=Error+2',
        'https://via.placeholder.com/1024x1024?text=Error+3',
        'https://via.placeholder.com/1024x1024?text=Error+4'
      ]
    };
  }
}
```

### Example 5: Advanced - Model Selection UI

```javascript
import { puterImageService } from './services/api';
import { useState, useEffect } from 'react';

function AdvancedImageGenerator() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('flux');
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Load available models on mount
    loadModels();
  }, []);

  const loadModels = async () => {
    const availableModels = await puterImageService.listModels();
    setModels(availableModels);
    setSelectedModel(availableModels[0]);
  };

  const generate = async () => {
    const result = await puterImageService.generateImages(
      'A beautiful landscape at sunset',
      {
        count: 4,
        model: selectedModel,
        width: 1024,
        height: 1024,
        enhance: true
      }
    );
    setImages(result);
  };

  return (
    <div>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        {models.map(model => (
          <option key={model} value={model}>
            {model.toUpperCase()}
          </option>
        ))}
      </select>

      <button onClick={generate}>Generate with {selectedModel}</button>

      <div className="image-grid">
        {images.map((img, index) => (
          <img key={index} src={img.url} alt={`Generated ${index}`} />
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

### 1. Always Check Availability

```javascript
import { puterImageService } from './services/api';

if (puterImageService.isAvailable()) {
  // Use Puter.js
} else {
  // Use fallback
}
```

### 2. Handle Errors Gracefully

```javascript
try {
  const result = await aiAPI.generateImages({ prompt, count: 4 });
  // Success!
} catch (error) {
  console.error('Failed:', error);
  // Show user-friendly message
}
```

### 3. Show Loading States

```javascript
const [loading, setLoading] = useState(false);

const generate = async () => {
  setLoading(true);
  try {
    const result = await aiAPI.generateImages({ prompt, count: 4 });
    setImages(result.data);
  } finally {
    setLoading(false);
  }
};
```

### 4. Optimize Prompts

```javascript
// Good prompt - specific and detailed
const prompt = `Modern smartphone, white background, studio lighting,
                4k resolution, commercial product photography`;

// Avoid - too vague
const prompt = "A phone";
```

### 5. Monitor Usage

```javascript
// Check which service is being used
const result = await aiAPI.generateImages({ prompt, count: 4 });
console.log('Using:', result.source); // 'puterjs' or 'backend'

// Log for analytics
if (result.source === 'puterjs') {
  analytics.track('puterjs_generations');
}
```

## Common Patterns

### Pattern 1: Simple Generation

```javascript
const result = await aiAPI.generateImages({
  prompt: "Your prompt here",
  count: 4
});
```

### Pattern 2: With Error Handling

```javascript
try {
  const result = await aiAPI.generateImages({
    prompt: "Your prompt",
    count: 4
  });
  setImages(result.data);
} catch (error) {
  console.error('Failed:', error);
  setError('Generation failed');
}
```

### Pattern 3: With Loading State

```javascript
const [loading, setLoading] = useState(false);
const [images, setImages] = useState([]);

const generate = async () => {
  setLoading(true);
  try {
    const result = await aiAPI.generateImages({ prompt, count: 4 });
    setImages(result.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Pattern 4: Logo Generation

```javascript
const result = await aiAPI.generateLogo({
  brandName: "MyBrand",
  industry: "tech"
});

const primaryLogo = result.primary;
const allLogos = result.data;
```

## API Reference

### generateImages(options)

```typescript
{
  prompt: string,      // Text description of image
  count: number        // Number of images (default: 4)
}
```

Returns:
```typescript
{
  success: boolean,
  data: Array<{
    url: string,
    prompt: string,
    width: number,
    height: number,
    model: string,
    index: number
  }>,
  source: 'puterjs' | 'backend'
}
```

### generateLogo(options)

```typescript
{
  brandName: string,   // Brand name
  industry: string     // Industry type
}
```

Returns:
```typescript
{
  success: boolean,
  data: Array<{ url: string }>,  // 4 logo options
  primary: { url: string },       // Primary logo
  source: 'puterjs'
}
```

## Troubleshooting

### Issue: Puter.js not working
**Solution**: Check console for errors, ensure HTTPS connection

### Issue: Images not loading
**Solution**: Check network, verify CORS settings

### Issue: Falling back to backend
**Solution**: Normal behavior if Puter.js unavailable

### Issue: Slow generation
**Solution**: Puter.js typically takes 5-15s, check browser performance

## Summary

The Puter.js integration provides:
- ✅ Free AI image generation
- ✅ No API keys required
- ✅ High-quality images
- ✅ Easy to use
- ✅ Automatic fallback

Perfect for production use in Genifai! 🚀

