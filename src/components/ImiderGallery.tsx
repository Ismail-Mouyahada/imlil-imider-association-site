import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MapPin, 
  Calendar, 
  User, 
  Eye,
  Download,
  Heart,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import { imiderImages, getImiderImageUrl, ImiderImage, getImiderImagesByCategory, searchImiderImages, getImiderImagesStats } from '@/data/imiderImages';
import SocialShare from '@/components/SocialShare';

const ImiderGallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<ImiderImage | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const stats = getImiderImagesStats();

  // Filtrage et recherche des images
  const filteredImages = useMemo(() => {
    let images = imiderImages;

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      images = getImiderImagesByCategory(selectedCategory as ImiderImage['category']);
    }

    // Recherche textuelle
    if (searchQuery.trim()) {
      images = searchImiderImages(searchQuery);
    }

    return images;
  }, [searchQuery, selectedCategory]);

  const categories = [
    { value: 'all', label: 'جميع الفئات', count: imiderImages.length },
    { value: 'مناظر_طبيعية', label: 'المناظر الطبيعية', count: stats.categories['مناظر_طبيعية'] || 0 },
    { value: 'قرية', label: 'القرية', count: stats.categories['قرية'] || 0 },
    { value: 'جبل', label: 'الجبال', count: stats.categories['جبل'] || 0 },
    { value: 'طبيعة', label: 'الطبيعة', count: stats.categories['طبيعة'] || 0 },
    { value: 'عمارة', label: 'العمارة', count: stats.categories['عمارة'] || 0 },
    { value: 'حياة_يومية', label: 'الحياة اليومية', count: stats.categories['حياة_يومية'] || 0 },
  ];

  const openLightbox = (image: ImiderImage) => {
    setSelectedImage(image);
    setCurrentImageIndex(filteredImages.findIndex(img => img.id === image.id));
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredImages.length - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(filteredImages[newIndex]);
    } else {
      const newIndex = currentImageIndex < filteredImages.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
      setSelectedImage(filteredImages[newIndex]);
    }
  };

  const downloadImage = (image: ImiderImage) => {
    const link = document.createElement('a');
    link.href = getImiderImageUrl(image.filename);
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareImage = async (image: ImiderImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">معرض صور قرية  إميضر</h2>
        <p className="text-muted-foreground">
          اكتشف جمال قرية  إميضر من خلال هذه المجموعة المميزة من الصور
        </p>
        <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {stats.total} صورة
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {stats.featured} مميزة
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="البحث في الصور..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-center text-muted-foreground">
        عرض {filteredImages.length} من {imiderImages.length} صورة
      </div>

      {/* Images Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={getImiderImageUrl(image.filename)}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {image.featured && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-white dark:bg-yellow-600">
                    <Star className="w-3 h-3 ml-1" />
                    مميزة
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => openLightbox(image)}
                  >
                    <Eye className="w-4 h-4 ml-1" />
                    عرض
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{image.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{image.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {categories.find(c => c.value === image.category)?.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex gap-4 p-4">
                <div className="w-32 h-24 relative overflow-hidden rounded-lg flex-shrink-0">
                  <img
                    src={getImiderImageUrl(image.filename)}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {image.featured && (
                    <Badge className="absolute top-1 right-1 bg-yellow-500 text-white text-xs dark:bg-yellow-600">
                      <Star className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">{image.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{image.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.value === image.category)?.label}
                    </Badge>
                    {image.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {image.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {image.location}
                      </span>
                    )}
                    {image.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(image.date).toLocaleDateString('ar-MA')}
                      </span>
                    )}
                    {image.photographer && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {image.photographer}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openLightbox(image)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadImage(image)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => shareImage(image)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedImage && (
            <div className="relative">
              <DialogHeader className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-lg p-2">
                <DialogTitle className="text-white">{selectedImage.title}</DialogTitle>
              </DialogHeader>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 z-10 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </Button>

              <div className="relative">
                <img
                  src={getImiderImageUrl(selectedImage.filename)}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              <div className="p-4 bg-background">
                <p className="text-sm text-muted-foreground mb-2">{selectedImage.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedImage.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {selectedImage.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedImage.location}
                      </span>
                    )}
                    {selectedImage.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedImage.date).toLocaleDateString('ar-MA')}
                      </span>
                    )}
                    {selectedImage.photographer && (
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedImage.photographer}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadImage(selectedImage)}
                    >
                      <Download className="w-4 h-4 ml-1" />
                      تحميل
                    </Button>
                    <SocialShare
                      url={window.location.href}
                      title={selectedImage.title}
                      description={selectedImage.description}
                      image={getImiderImageUrl(selectedImage.filename)}
                      hashtags={['إميدر', 'قرية', 'المغرب', 'جمعية_إمليل']}
                      size="sm"
                      variant="outline"
                    />
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  {currentImageIndex + 1} من {filteredImages.length}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImiderGallery;
