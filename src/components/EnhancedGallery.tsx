import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Calendar,
  MapPin,
  User,
  Tag,
  Star,
  Download,
  Share2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GalleryImageEditor from './GalleryImageEditor';
import SocialShare from './SocialShare';
import { useAuth } from '@/contexts/AuthContext';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  details: string;
  category: string;
  tags: string[];
  photographer: string;
  location: string;
  date: string;
  featured: boolean;
  url: string;
}

interface EnhancedGalleryProps {
  images: GalleryImage[];
  onImageUpdate: (image: GalleryImage) => void;
  onImageDelete: (id: string) => void;
  onImageAdd: (image: GalleryImage) => void;
  isAdmin?: boolean;
}

const EnhancedGallery: React.FC<EnhancedGalleryProps> = ({
  images,
  onImageUpdate,
  onImageDelete,
  onImageAdd,
  isAdmin = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const categories = [
    'المناظر الطبيعية',
    'القرية',
    'الجبل',
    'الطبيعة',
    'العمارة',
    'الحياة اليومية',
    'الأحداث',
    'الأشخاص',
    'التراث',
    'الفن'
  ];

  const filteredImages = useMemo(() => {
    return images.filter(image => {
      const matchesSearch = 
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || image.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [images, searchTerm, categoryFilter]);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const handleEdit = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleSave = (image: GalleryImage) => {
    if (isEditing) {
      onImageUpdate(image);
    } else {
      onImageAdd(image);
    }
    setIsEditing(false);
    setIsAdding(false);
    setSelectedImage(null);
  };

  const handleDelete = (id: string) => {
    onImageDelete(id);
    setIsEditing(false);
    setSelectedImage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedImage(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isAdding) {
    return (
      <GalleryImageEditor
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  if (isEditing && selectedImage) {
    return (
      <GalleryImageEditor
        image={selectedImage}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        isEditing={true}
      />
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* En-tête avec contrôles */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">معرض الصور</h2>
          <p className="text-muted-foreground">
            {filteredImages.length} من {images.length} صورة
          </p>
        </div>
        
        {isAdmin && (
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة صورة
          </Button>
        )}
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="البحث في الصور..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="جميع الفئات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
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

      {/* Affichage des images */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onClick={() => handleImageClick(image)}
                />
                {image.featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                    <Star className="w-3 h-3 ml-1" />
                    مميزة
                  </Badge>
                )}
                {isAdmin && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(image)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {image.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                  {image.description}
                </p>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  {image.photographer && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {image.photographer}
                    </div>
                  )}
                  {image.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {image.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(image.date)}
                  </div>
                </div>
                
                {image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {image.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="w-2 h-2 ml-1" />
                        {tag}
                      </Badge>
                    ))}
                    {image.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{image.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="flex gap-4 p-4">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                  onClick={() => handleImageClick(image)}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                        {image.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                        {image.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {image.photographer && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {image.photographer}
                          </div>
                        )}
                        {image.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {image.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(image.date)}
                        </div>
                      </div>
                      
                      {image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {image.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="w-2 h-2 ml-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(image)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(image.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de détail de l'image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedImage.title}</CardTitle>
                  <p className="text-muted-foreground mt-2">{selectedImage.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              
              {selectedImage.details && (
                <div>
                  <h4 className="font-semibold mb-2">التفاصيل</h4>
                  <p className="text-muted-foreground">{selectedImage.details}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">معلومات الصورة</h4>
                  <div className="space-y-1 text-sm">
                    {selectedImage.photographer && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>المصور: {selectedImage.photographer}</span>
                      </div>
                    )}
                    {selectedImage.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>الموقع: {selectedImage.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>التاريخ: {formatDate(selectedImage.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span>الفئة: {selectedImage.category}</span>
                    </div>
                  </div>
                </div>
                
                {selectedImage.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">العلامات</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedImage.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          <Tag className="w-3 h-3 ml-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 ml-1" />
                  تحميل
                </Button>
                <SocialShare
                  url={window.location.href}
                  title={selectedImage.title}
                  description={selectedImage.description}
                  image={selectedImage.url}
                  hashtags={['جمعية_إمليل', 'المغرب', 'التنمية', 'القرية']}
                  size="sm"
                  variant="outline"
                />
                {isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(selectedImage)}
                    >
                      <Edit className="w-4 h-4 ml-1" />
                      تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(selectedImage.id)}
                    >
                      <Trash2 className="w-4 h-4 ml-1" />
                      حذف
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {images.length === 0 ? 'لا توجد صور في المعرض' : 'لم يتم العثور على صور تطابق معايير البحث'}
          </p>
          {isAdmin && images.length === 0 && (
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 ml-1" />
              إضافة أول صورة
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedGallery;
