import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Link, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  Download,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestImage {
  id: string;
  title: string;
  url: string;
  type: 'url' | 'file';
  size?: number;
  preview?: string;
}

const ImageUploadTester: React.FC = () => {
  const [testImages, setTestImages] = useState<TestImage[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const testUrlUpload = () => {
    const testImage: TestImage = {
      id: Date.now().toString(),
      title: 'صورة تجريبية من URL',
      url: 'https://picsum.photos/400/300?random=' + Date.now(),
      type: 'url'
    };
    
    setTestImages(prev => [...prev, testImage]);
    toast({
      title: "نجح اختبار URL",
      description: "تم إضافة صورة من رابط بنجاح",
    });
  };

  const testFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "نوع ملف غير صحيح",
          description: "يرجى اختيار ملف صورة صالح",
          variant: "destructive"
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "حجم الملف كبير جداً",
          description: "يرجى اختيار صورة بحجم أقل من 10 ميجابايت",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const testImage: TestImage = {
          id: Date.now().toString(),
          title: file.name,
          url: event.target?.result as string,
          type: 'file',
          size: file.size,
          preview: event.target?.result as string
        };
        
        setTestImages(prev => [...prev, testImage]);
        toast({
          title: "نجح اختبار الملف",
          description: `تم رفع الملف: ${file.name}`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const testAllUploads = async () => {
    setIsTesting(true);
    
    try {
      // Test URL upload
      testUrlUpload();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test multiple URL uploads
      for (let i = 0; i < 3; i++) {
        const testImage: TestImage = {
          id: (Date.now() + i).toString(),
          title: `صورة تجريبية ${i + 1}`,
          url: `https://picsum.photos/400/300?random=${Date.now() + i}`,
          type: 'url'
        };
        setTestImages(prev => [...prev, testImage]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast({
        title: "تم إنجاز جميع الاختبارات",
        description: "تم اختبار رفع الصور بنجاح",
      });
    } catch (error) {
      console.error('Test failed:', error);
      toast({
        title: "فشل الاختبار",
        description: "حدث خطأ أثناء الاختبار",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const removeImage = (id: string) => {
    setTestImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "تم حذف الصورة",
      description: "تم حذف الصورة من القائمة",
    });
  };

  const clearAllImages = () => {
    setTestImages([]);
    toast({
      title: "تم مسح جميع الصور",
      description: "تم حذف جميع الصور من القائمة",
    });
  };

  const getImageTypeIcon = (type: 'url' | 'file') => {
    return type === 'url' ? <Link className="w-4 h-4" /> : <FileImage className="w-4 h-4" />;
  };

  const getImageTypeColor = (type: 'url' | 'file') => {
    return type === 'url' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            اختبار رفع الصور
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-semibold text-blue-800 dark:text-blue-200">إجمالي الصور</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">{testImages.length}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <FileImage className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-semibold text-green-800 dark:text-green-200">من الملفات</div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  {testImages.filter(img => img.type === 'file').length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <Link className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-semibold text-purple-800 dark:text-purple-200">من الروابط</div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  {testImages.filter(img => img.type === 'url').length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions de test */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات الاختبار</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={testUrlUpload}
              className="flex items-center gap-2"
            >
              <Link className="w-4 h-4" />
              اختبار رفع URL
            </Button>
            
            <Button 
              onClick={() => document.getElementById('file-upload')?.click()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileImage className="w-4 h-4" />
              اختبار رفع ملف
            </Button>
            
            <Button 
              onClick={testAllUploads}
              disabled={isTesting}
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isTesting ? 'جاري الاختبار...' : 'اختبار شامل'}
            </Button>
            
            <Button 
              onClick={clearAllImages}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              مسح الكل
            </Button>
          </div>

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={testFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Liste des الصور المرفوعة */}
      {testImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              الصور المرفوعة ({testImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testImages.map((image) => (
                <div key={image.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getImageTypeColor(image.type)} flex items-center gap-1`}>
                      {getImageTypeIcon(image.type)}
                      {image.type === 'url' ? 'رابط' : 'ملف'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeImage(image.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm line-clamp-2">{image.title}</h4>
                    {image.size && (
                      <p className="text-xs text-muted-foreground">
                        الحجم: {(image.size / 1024 / 1024).toFixed(2)} ميجابايت
                      </p>
                    )}
                  </div>
                  
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(image.url, '_blank')}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      عرض
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = image.url;
                        link.download = image.title;
                        link.click();
                      }}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 ml-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>تعليمات الاستخدام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>رفع من URL:</strong> يمكنك رفع الصور من أي رابط مباشر للصورة
              </AlertDescription>
            </Alert>
            
            <Alert>
              <FileImage className="h-4 w-4" />
              <AlertDescription>
                <strong>رفع ملف:</strong> يمكنك رفع ملفات الصور من جهازك (JPG, PNG, GIF, WebP)
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>قيود الملف:</strong> الحد الأقصى لحجم الملف هو 10 ميجابايت
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadTester;
