import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useTheme } from '../../context/ThemeContext';

// Define the Cropper ref type to fix TypeScript errors
interface CropperRef {
  cropper: {
    getCroppedCanvas: () => HTMLCanvasElement;
    reset: () => void;
  };
}

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
}

interface FilterOption {
  name: string;
  filter: string;
}

interface AdjustmentOption {
  name: string;
  property: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onSave, onCancel }) => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'crop' | 'filter' | 'adjust' | 'text'>('crop');
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [adjustments, setAdjustments] = useState<Record<string, number>>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hueRotate: 0,
  });
  const [text, setText] = useState<string>('');
  const [textPosition, setTextPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [textSize, setTextSize] = useState<number>(24);
  const [isDraggingText, setIsDraggingText] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const cropperRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const filterOptions: FilterOption[] = [
    { name: 'Normal', filter: '' },
    { name: 'Grayscale', filter: 'grayscale(100%)' },
    { name: 'Sepia', filter: 'sepia(100%)' },
    { name: 'Vintage', filter: 'sepia(50%) contrast(120%) brightness(90%)' },
    { name: 'Warm', filter: 'sepia(30%) saturate(140%) brightness(110%)' },
    { name: 'Cool', filter: 'hue-rotate(180deg) saturate(80%)' },
    { name: 'Dramatic', filter: 'contrast(150%) brightness(90%)' },
    { name: 'Fade', filter: 'brightness(110%) saturate(80%) opacity(90%)' },
  ];
  
  const adjustmentOptions: AdjustmentOption[] = [
    { name: 'Brightness', property: 'brightness', min: 0, max: 200, step: 1, default: 100, unit: '%' },
    { name: 'Contrast', property: 'contrast', min: 0, max: 200, step: 1, default: 100, unit: '%' },
    { name: 'Saturation', property: 'saturation', min: 0, max: 200, step: 1, default: 100, unit: '%' },
    { name: 'Blur', property: 'blur', min: 0, max: 10, step: 0.1, default: 0, unit: 'px' },
    { name: 'Hue Rotate', property: 'hueRotate', min: 0, max: 360, step: 1, default: 0, unit: 'deg' },
  ];

  // Initialize canvas when image loads
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
        }
      }
    };
  }, [imageUrl]);

  // Apply filter and adjustments to canvas
  useEffect(() => {
    if (canvasRef.current && activeTab !== 'crop') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create a temporary canvas for filters
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          // Draw original image
          const img = new Image();
          img.src = imageUrl;
          tempCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Apply filter
          if (selectedFilter) {
            tempCtx.filter = selectedFilter;
            tempCtx.drawImage(tempCanvas, 0, 0);
            tempCtx.filter = 'none';
          }
          
          // Apply adjustments
          let filterString = '';
          filterString += `brightness(${adjustments.brightness}%) `;
          filterString += `contrast(${adjustments.contrast}%) `;
          filterString += `saturate(${adjustments.saturation}%) `;
          filterString += `blur(${adjustments.blur}px) `;
          filterString += `hue-rotate(${adjustments.hueRotate}deg)`;
          
          ctx.filter = filterString;
          ctx.drawImage(tempCanvas, 0, 0);
          ctx.filter = 'none';
          
          // Add text
          if (text) {
            ctx.font = `${textSize}px Arial`;
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            ctx.fillText(text, textPosition.x * canvas.width / 100, textPosition.y * canvas.height / 100);
          }
        }
      }
    }
  }, [imageUrl, selectedFilter, adjustments, text, textPosition, textColor, textSize, activeTab]);

  const handleCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImageUrl = croppedCanvas.toDataURL();
        
        // Update the canvas with the cropped image
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = croppedCanvas.width;
          canvas.height = croppedCanvas.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(croppedCanvas, 0, 0);
          }
        }
        
        // Reset cropper
        cropperRef.current.cropper.reset();
        
        setActiveTab('filter');
      }
    }
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleAdjustmentChange = (property: string, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const handleTextDragStart = (e: React.MouseEvent) => {
    if (imageContainerRef.current && text) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate offset from text position
      const textX = textPosition.x * rect.width / 100;
      const textY = textPosition.y * rect.height / 100;
      
      setDragOffset({
        x: textX - x,
        y: textY - y
      });
      
      setIsDraggingText(true);
    }
  };

  const handleTextDragMove = (e: React.MouseEvent) => {
    if (isDraggingText && imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + dragOffset.x;
      const y = e.clientY - rect.top + dragOffset.y;
      
      // Convert to percentage of container
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      
      setTextPosition({
        x: Math.max(0, Math.min(100, xPercent)),
        y: Math.max(0, Math.min(100, yPercent))
      });
    }
  };

  const handleTextDragEnd = () => {
    setIsDraggingText(false);
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      onSave(dataUrl);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 ${darkMode ? 'text-dark-text' : ''}`}>
      <div className={`w-full max-w-4xl p-6 rounded-lg ${darkMode ? 'bg-dark-secondary' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4">Edit Image</h2>
        
        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button 
            className={`px-4 py-2 ${activeTab === 'crop' ? (darkMode ? 'border-b-2 border-blue-500' : 'border-b-2 border-blue-600') : ''}`}
            onClick={() => setActiveTab('crop')}
          >
            Crop
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'filter' ? (darkMode ? 'border-b-2 border-blue-500' : 'border-b-2 border-blue-600') : ''}`}
            onClick={() => setActiveTab('filter')}
          >
            Filters
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'adjust' ? (darkMode ? 'border-b-2 border-blue-500' : 'border-b-2 border-blue-600') : ''}`}
            onClick={() => setActiveTab('adjust')}
          >
            Adjust
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'text' ? (darkMode ? 'border-b-2 border-blue-500' : 'border-b-2 border-blue-600') : ''}`}
            onClick={() => setActiveTab('text')}
          >
            Text
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Image Preview */}
          <div className="flex-1 mb-4 md:mb-0 md:mr-4">
            {activeTab === 'crop' ? (
              <Cropper
                src={imageUrl}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                guides={true}
                ref={cropperRef}
                zoomable={true}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
              />
            ) : (
              <div 
                ref={imageContainerRef} 
                className="relative h-96 flex items-center justify-center overflow-hidden"
                onMouseDown={activeTab === 'text' ? handleTextDragStart : undefined}
                onMouseMove={activeTab === 'text' ? handleTextDragMove : undefined}
                onMouseUp={activeTab === 'text' ? handleTextDragEnd : undefined}
                onMouseLeave={activeTab === 'text' ? handleTextDragEnd : undefined}
              >
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-full"
                />
                {activeTab === 'text' && text && (
                  <div 
                    className="absolute pointer-events-none"
                    style={{
                      left: `${textPosition.x}%`,
                      top: `${textPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: `${textSize}px`,
                      color: textColor,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {text}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className={`w-full md:w-64 ${darkMode ? 'bg-dark-bg' : 'bg-gray-100'} p-4 rounded-lg`}>
            {activeTab === 'crop' && (
              <div>
                <h3 className="font-medium mb-2">Crop & Resize</h3>
                <p className="text-sm mb-4">Drag to crop the image</p>
                <button 
                  className={`w-full py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  onClick={handleCrop}
                >
                  Apply Crop
                </button>
              </div>
            )}
            
            {activeTab === 'filter' && (
              <div>
                <h3 className="font-medium mb-2">Filters</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.name}
                      className={`p-2 text-sm rounded ${
                        selectedFilter === option.filter 
                          ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white')
                          : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200')
                      }`}
                      onClick={() => handleFilterSelect(option.filter)}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'adjust' && (
              <div>
                <h3 className="font-medium mb-2">Adjustments</h3>
                {adjustmentOptions.map((option) => (
                  <div key={option.property} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <label className="text-sm">{option.name}</label>
                      <span className="text-sm">{adjustments[option.property as keyof typeof adjustments]}{option.unit}</span>
                    </div>
                    <input
                      type="range"
                      min={option.min}
                      max={option.max}
                      step={option.step}
                      value={adjustments[option.property as keyof typeof adjustments]}
                      onChange={(e) => handleAdjustmentChange(option.property, parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                ))}
                <button 
                  className={`w-full py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} mt-2`}
                  onClick={() => {
                    // Reset adjustments to default
                    const defaults: Record<string, number> = {};
                    adjustmentOptions.forEach(option => {
                      defaults[option.property] = option.default;
                    });
                    setAdjustments(defaults);
                  }}
                >
                  Reset
                </button>
              </div>
            )}
            
            {activeTab === 'text' && (
              <div>
                <h3 className="font-medium mb-2">Add Text</h3>
                <div className="mb-3">
                  <label className="block text-sm mb-1">Text</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-800 border-gray-700' : 'border border-gray-300'}`}
                    placeholder="Enter text..."
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm mb-1">Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-8"
                  />
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <label className="text-sm">Size</label>
                    <span className="text-sm">{textSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={72}
                    step={1}
                    value={textSize}
                    onChange={(e) => setTextSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <p className="text-sm mt-4 mb-2">Drag text to position it</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button 
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
