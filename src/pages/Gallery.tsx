import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import EnhancedGallery from "@/components/EnhancedGallery";

const Gallery = () => {
  const { gallery, updateGalleryImage, deleteGalleryImage, addGalleryImage } = useApp();
  const { hasPermission } = useAuth();
  const isAdmin = hasPermission('admin.access');

  // Convertir les images de la galerie au format attendu par EnhancedGallery
  const enhancedImages = gallery.map(image => ({
    id: image.id,
    title: image.title,
    description: image.description || '',
    details: image.details || '',
    category: image.category || 'أخرى',
    tags: image.tags || [],
    photographer: image.photographer || 'جمعية إمليل',
    location: image.location || 'إمليل، المغرب',
    date: image.date || new Date().toISOString().split('T')[0],
    featured: image.featured || false,
    url: image.imageUrl || '/placeholder.svg'
  }));

  const handleImageUpdate = (updatedImage: any) => {
    updateGalleryImage(updatedImage.id, updatedImage);
  };

  const handleImageDelete = (imageId: string) => {
    deleteGalleryImage(imageId);
  };

  const handleImageAdd = (newImage: any) => {
    addGalleryImage(newImage);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-gradient">معرض الصور</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            صور من أنشطتنا وفعالياتنا المختلفة
          </p>
        </div>

        <EnhancedGallery
          images={enhancedImages}
          onImageUpdate={handleImageUpdate}
          onImageDelete={handleImageDelete}
          onImageAdd={handleImageAdd}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default Gallery;