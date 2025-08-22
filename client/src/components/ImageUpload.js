import React, { useState } from 'react';
import axios from '../api/axios';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ImageUpload = ({ images, setImages, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await axios.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setImages([...images, response.data]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images
      </label>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.url}
              alt={`Product ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="text-gray-500">Uploading...</div>
            ) : (
              <>
                <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload Image</span>
              </>
            )}
          </label>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Maximum {maxImages} images. Supported formats: JPG, PNG, WEBP
      </p>
    </div>
  );
};

export default ImageUpload;