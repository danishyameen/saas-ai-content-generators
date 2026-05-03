import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { aiAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AIGenerator({ title, description, icon: Icon, color, apiFunction, placeholder, examplePrompt, isProduct = false }) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [hasImage, setHasImage] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiFunction({ prompt });
      setResult(data.data);
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChoice = async (choice) => {
    setHasImage(choice);
    if (choice === 'no' && prompt.trim()) {
      setImgLoading(true);
      try {
        const { data } = await aiAPI.generateImages({ prompt });
        setImages(data.data);
        toast.success('Images generated!');
      } catch (error) {
        toast.error('Image generation failed');
      } finally {
        setImgLoading(false);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard!');
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const downloadImage = (imgUrl, index, format = 'png') => {
    try {
      const a = document.createElement('a');
      a.href = imgUrl;
      a.download = `product-image-${index + 1}.${format}`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(`Image downloaded as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-dark-400">{description}</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card space-y-4"
        >
          <div>
            <h3 className="font-semibold mb-4">Enter Your Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="input w-full h-48 resize-none"
              placeholder={placeholder}
            />
            {examplePrompt && (
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => setPrompt(examplePrompt)}
                className="mt-2 text-sm text-primary-400 hover:text-primary-300"
              >
                Use example prompt →
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {isProduct && result && !hasImage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-dark-900 rounded-lg border border-dark-700"
              >
                <p className="text-sm font-medium mb-3">Do you have a product image?</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleImageChoice('yes')}
                    className="btn-secondary text-sm flex-1"
                  >
                    Yes, upload
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleImageChoice('no')}
                    className="btn-secondary text-sm flex-1"
                  >
                    No, generate one
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {hasImage === 'yes' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-dark-900 rounded-lg border border-dark-700"
              >
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-dark-600 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-colors">
                  <Upload size={24} className="text-dark-400 mb-2" />
                  <span className="text-sm text-dark-300">Click to upload product image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="btn-primary w-full"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="inline mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Content'
            )}
          </motion.button>
        </motion.div>

        {/* Output */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Generated Content</h3>
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex gap-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyToClipboard}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      <Copy size={14} className="inline mr-1" />
                      Copy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadResult}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      <Download size={14} className="inline mr-1" />
                      Download
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="bg-dark-900 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 size={32} className="animate-spin text-primary-400 mx-auto mb-2" />
                    <p className="text-dark-400">AI is working...</p>
                  </div>
                </div>
              ) : result ? (
                <motion.pre
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="whitespace-pre-wrap text-sm text-dark-300"
                >
                  {result}
                </motion.pre>
              ) : (
                <div className="flex items-center justify-center h-full text-dark-500">
                  <p>Generated content will appear here</p>
                </div>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {(images.length > 0 || imgLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="card"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <ImageIcon size={18} className="text-primary-400" />
                  Product Images
                </h3>
                {imgLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-primary-400" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative"
                      >
                        <img src={img} alt="Generated product" className="rounded-lg w-full h-auto shadow-lg" />
                        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => downloadImage(img, i, 'png')}
                            className="p-2 bg-dark-900/80 rounded-full hover:bg-primary-600"
                            title="Download as PNG"
                          >
                            <Download size={16} className="text-white" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => downloadImage(img, i, 'jpg')}
                            className="p-2 bg-dark-900/80 rounded-full hover:bg-green-600"
                            title="Download as JPG"
                          >
                            <Download size={16} className="text-white" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
