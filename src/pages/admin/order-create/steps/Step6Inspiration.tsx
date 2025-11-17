import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { useWizard } from '../WizardContext';

export function Step6Inspiration() {
  const { formData, updateFormData } = useWizard();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    const maxFiles = Math.min(files.length, 5 - formData.inspirationImages.length);

    for (let i = 0; i < maxFiles; i++) {
      const file = files[i];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === maxFiles) {
              updateFormData({
                inspirationImages: [...formData.inspirationImages, ...newImages]
              });
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.inspirationImages.filter((_, i) => i !== index);
    updateFormData({ inspirationImages: newImages });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '24px',
            fontWeight: 600,
            color: '#2B2B2B',
            marginBottom: '8px'
          }}
        >
          Inspiration Images
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Upload up to 5 reference images (optional)
        </p>
      </div>

      {/* Upload Area */}
      {formData.inspirationImages.length < 5 && (
        <Card
          className="p-8"
          style={{
            borderColor: isDragging ? '#C44569' : '#E0E0E0',
            borderWidth: '2px',
            borderStyle: 'dashed',
            background: isDragging ? 'rgba(196, 69, 105, 0.05)' : '#FFFFFF'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(196, 69, 105, 0.1)' }}
            >
              <Upload size={32} color="#C44569" />
            </div>
            <h3
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '8px'
              }}
            >
              Drop images here or click to upload
            </h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
              Upload up to {5 - formData.inspirationImages.length} more images
            </p>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              style={{ display: 'none' }}
            />
            <Button
              onClick={() => document.getElementById('image-upload')?.click()}
              style={{ background: '#C44569', color: '#FFFFFF' }}
            >
              <ImageIcon size={18} className="mr-2" />
              Choose Files
            </Button>
          </div>
        </Card>
      )}

      {/* Uploaded Images */}
      {formData.inspirationImages.length > 0 && (
        <div>
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: '#2B2B2B',
              marginBottom: '12px'
            }}
          >
            Uploaded Images ({formData.inspirationImages.length}/5)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {formData.inspirationImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Inspiration ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                  style={{ borderColor: '#E0E0E0' }}
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: '#C44569' }}
                >
                  <X size={14} color="#FFFFFF" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Validation function
export function validateStep6(formData: any): boolean {
  // Images are optional
  return true;
}
