import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

/**
 * Image Upload Grid Component
 * Allows users to upload up to 5 inspiration images (JPG/PNG)
 * Features: thumbnails, delete, progress animation, responsive grid
 */

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploadGridProps {
  onImagesChange?: (images: File[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export function ImageUploadGrid({ 
  onImagesChange, 
  maxImages = 5,
  maxSizeMB = 5 
}: ImageUploadGridProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast.error('Please upload JPG or PNG images only', {
        duration: 4000,
        style: {
          background: 'var(--toast-error-bg)',
          color: 'var(--toast-error-text)',
          border: '1px solid var(--toast-error-border)'
        }
      });
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB} MB`, {
        duration: 4000,
        style: {
          background: 'var(--toast-error-bg)',
          color: 'var(--toast-error-text)',
          border: '1px solid var(--toast-error-border)'
        }
      });
      return;
    }

    // Check if limit exceeded
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`, {
        duration: 4000,
        style: {
          background: 'var(--toast-error-bg)',
          color: 'var(--toast-error-text)',
          border: '1px solid var(--toast-error-border)'
        }
      });
      return;
    }

    // Simulate upload progress
    const imageId = `${Date.now()}-${slotIndex}`;
    setUploading(imageId);

    // Create preview URL
    const preview = URL.createObjectURL(file);

    setTimeout(() => {
      const newImage: UploadedImage = {
        id: imageId,
        file,
        preview
      };

      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      setUploading(null);

      // Callback with file array
      if (onImagesChange) {
        onImagesChange(updatedImages.map(img => img.file));
      }

      toast.success('Image uploaded successfully', {
        duration: 3000,
        style: {
          background: 'var(--toast-success-bg)',
          color: 'var(--toast-success-text)',
          border: '1px solid var(--toast-success-border)'
        }
      });
    }, 1200);
  };

  const handleDelete = (imageId: string) => {
    const imageToDelete = images.find(img => img.id === imageId);
    if (imageToDelete) {
      URL.revokeObjectURL(imageToDelete.preview);
    }

    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);

    if (onImagesChange) {
      onImagesChange(updatedImages.map(img => img.file));
    }

    toast.success('Image removed', {
      duration: 2000,
      style: {
        background: 'var(--toast-info-bg)',
        color: 'var(--toast-info-text)',
        border: '1px solid var(--toast-info-border)'
      }
    });
  };

  const renderSlot = (index: number) => {
    const uploadedImage = images[index];
    const isUploading = uploading && images.length === index;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          borderRadius: '8px',
          border: `2px dashed ${uploadedImage ? 'transparent' : '#C44569'}`,
          background: uploadedImage ? 'transparent' : '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: uploadedImage ? 'default' : 'pointer',
          overflow: 'hidden',
          transition: 'all 200ms ease-out',
          boxShadow: uploadedImage ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none'
        }}
        onClick={() => {
          if (!uploadedImage && !isUploading) {
            fileInputRefs.current[index]?.click();
          }
        }}
        onMouseEnter={(e) => {
          if (!uploadedImage) {
            e.currentTarget.style.background = 'rgba(196, 69, 105, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!uploadedImage) {
            e.currentTarget.style.background = '#FFFFFF';
          }
        }}
      >
        <input
          ref={(el) => (fileInputRefs.current[index] = el)}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e, index)}
          aria-label={`Upload image slot ${index + 1} of ${maxImages}`}
        />

        {/* Empty Slot */}
        {!uploadedImage && !isUploading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              opacity: 0.7
            }}
          >
            <Upload size={28} color="#C44569" />
            <span
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                color: '#C44569'
              }}
            >
              Upload
            </span>
          </div>
        )}

        {/* Uploading State */}
        {isUploading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(196, 69, 105, 0.2)',
                borderTopColor: '#C44569',
                borderRadius: '50%'
              }}
            />
            <span
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '12px',
                color: '#5A3825'
              }}
            >
              Uploading...
            </span>
          </div>
        )}

        {/* Uploaded Image */}
        {uploadedImage && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%'
              }}
            >
              <img
                src={uploadedImage.preview}
                alt={`Uploaded inspiration ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />

              {/* Delete Button Overlay */}
              <motion.button
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(uploadedImage.id);
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms ease-out',
                  opacity: 0
                }}
                aria-label={`Remove image ${index + 1}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <X size={18} color="white" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    );
  };

  return (
    <div
      style={{
        background: '#F8EBD7',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '24px'
      }}
    >
      {/* Section Title */}
      <div style={{ marginBottom: '16px' }}>
        <h3
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            color: '#2B2B2B',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ImageIcon size={20} color="#C44569" />
          Upload Inspiration Images
        </h3>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#5A3825',
            opacity: 0.8,
            lineHeight: 1.5
          }}
        >
          Add up to {maxImages} images (JPG or PNG, max {maxSizeMB} MB each) to show your dream cake design.
        </p>
      </div>

      {/* Upload Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '16px',
          marginBottom: '12px'
        }}
      >
        {Array.from({ length: maxImages }).map((_, index) => renderSlot(index))}
      </div>

      {/* Counter */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '12px',
          fontStyle: 'italic',
          color: '#2B2B2B',
          opacity: 0.6
        }}
      >
        {images.length} of {maxImages} uploaded
      </div>

      {/* Mobile Responsive */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
