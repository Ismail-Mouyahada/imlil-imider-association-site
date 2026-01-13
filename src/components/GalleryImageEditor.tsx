import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Plus,
  Upload,
  Eye,
  Calendar,
  MapPin,
  User,
  Tag,
  Link,
  FileImage,
  ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface GalleryImageEditorProps {
  image?: GalleryImage;
  onSave: (image: GalleryImage) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
}

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

const GalleryImageEditor: React.FC<GalleryImageEditorProps> = ({
  image,
  onSave,
  onCancel,
  onDelete,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<GalleryImage>({
    id: image?.id || '',
    title: image?.title || '',
    description: image?.description || '',
    details: image?.details || '',
    category: image?.category || '',
    tags: image?.tags || [],
    photographer: image?.photographer || '',
    location: image?.location || '',
    date: image?.date || new Date().toISOString().split('T')[0],
    featured: image?.featured || false,
    url: image?.url || ''
  });

  const [newTag, setNewTag] = useState('');
  const [imageSource, setImageSource] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { toast } = useToast();

  const handleInputChange = (field: keyof GalleryImage, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: "نوع ملف غير صحيح",
          description: "يرجى اختيار ملف صورة صالح",
          variant: "destructive"
        });
        return;
      }

      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "حجم الملف كبير جداً",
          description: "يرجى اختيار صورة بحجم أقل من 10 ميجابايت",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      
      // Créer une URL de prévisualisation
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({
        ...prev,
        url: url // URL temporaire pour la prévisualisation
      }));
    }
  };

  const handleImageSourceChange = (source: 'url' | 'file') => {
    setImageSource(source);
    if (source === 'url') {
      setSelectedFile(null);
      setPreviewUrl('');
      setFormData(prev => ({
        ...prev,
        url: ''
      }));
    }
  };

  const processImageFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('فشل في قراءة الملف'));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى ملء العنوان والوصف",
        variant: "destructive"
      });
      return;
    }

    if (imageSource === 'file' && !selectedFile) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى اختيار ملف صورة",
        variant: "destructive"
      });
      return;
    }

    if (imageSource === 'url' && !formData.url) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى إدخال رابط الصورة",
        variant: "destructive"
      });
      return;
    }

    try {
      let finalUrl = formData.url;

      // Si c'est un fichier, le convertir en base64
      if (imageSource === 'file' && selectedFile) {
        finalUrl = await processImageFile(selectedFile);
      }

      const imageData = {
        ...formData,
        url: finalUrl,
        id: formData.id || Date.now().toString()
      };

      onSave(imageData);
      toast({
        title: "تم الحفظ بنجاح",
        description: isEditing ? "تم تحديث الصورة" : "تم إضافة الصورة",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "خطأ في معالجة الصورة",
        description: "حدث خطأ أثناء معالجة الصورة",
        variant: "destructive"
      });
    }
  };

  const handleDelete = () => {
    if (onDelete && formData.id) {
      onDelete(formData.id);
      toast({
        title: "تم الحذف",
        description: "تم حذف الصورة بنجاح",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto" dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-6 h-6" />
          {isEditing ? 'تعديل الصورة' : 'إضافة صورة جديدة'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="عنوان الصورة"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">الوصف *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="وصف مختصر للصورة"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="details">التفاصيل</Label>
                <Textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) => handleInputChange('details', e.target.value)}
                  placeholder="تفاصيل إضافية عن الصورة"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="photographer">المصور</Label>
                <Input
                  id="photographer"
                  value={formData.photographer}
                  onChange={(e) => handleInputChange('photographer', e.target.value)}
                  placeholder="اسم المصور"
                />
              </div>
              
              <div>
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="مكان التقاط الصورة"
                />
              </div>
              
              <div>
                <Label htmlFor="date">التاريخ</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>العلامات</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="أضف علامة جديدة"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-auto p-0 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Image Source Selection */}
          <div className="space-y-4">
            <div>
              <Label>مصدر الصورة</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  type="button"
                  variant={imageSource === 'url' ? 'default' : 'outline'}
                  onClick={() => handleImageSourceChange('url')}
                  className="flex items-center gap-2"
                >
                  <Link className="w-4 h-4" />
                  رابط URL
                </Button>
                <Button
                  type="button"
                  variant={imageSource === 'file' ? 'default' : 'outline'}
                  onClick={() => handleImageSourceChange('file')}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  رفع ملف
                </Button>
              </div>
            </div>

            {/* URL Input */}
            {imageSource === 'url' && (
              <div>
                <Label htmlFor="url">رابط الصورة</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://مثال.com/صورة.jpg"
                />
              </div>
            )}

            {/* File Upload */}
            {imageSource === 'file' && (
              <div>
                <Label htmlFor="file">ملف الصورة</Label>
                <div className="mt-2">
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file')?.click()}
                    className="w-full flex items-center gap-2"
                  >
                    <FileImage className="w-4 h-4" />
                    {selectedFile ? selectedFile.name : 'اختر ملف صورة'}
                  </Button>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      حجم الملف: {(selectedFile.size / 1024 / 1024).toFixed(2)} ميجابايت
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Image Preview */}
            {(formData.url || previewUrl) && (
              <div>
                <Label>معاينة الصورة</Label>
                <div className="mt-2 border rounded-lg p-4">
                  <img
                    src={previewUrl || formData.url}
                    alt="معاينة الصورة"
                    className="max-w-full max-h-64 object-contain mx-auto rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="featured">صورة مميزة</Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 ml-1" />
              {isEditing ? 'تحديث' : 'حفظ'}
            </Button>
            
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 ml-1" />
              إلغاء
            </Button>
            
            {isEditing && onDelete && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 ml-1" />
                حذف
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GalleryImageEditor;
