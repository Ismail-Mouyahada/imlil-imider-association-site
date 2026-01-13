import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Upload, 
  Database, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  Image,
  Newspaper
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DataManager = () => {
  const { 
    members, 
    activities, 
    events, 
    news, 
    gallery,
    addMember,
    addActivity,
    addEvent,
    addNews,
    addGalleryImage
  } = useApp();
  
  const { toast } = useToast();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importData, setImportData] = useState('');

  const exportToJSON = () => {
    const data = {
      members,
      activities,
      events,
      news,
      gallery,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imlil-association-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'تم التصدير',
      description: 'تم تصدير البيانات بنجاح'
    });
  };

  const exportToCSV = (type: 'members' | 'activities' | 'events' | 'news') => {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'members':
        csvContent = 'ID,الاسم الكامل,البريد الإلكتروني,رقم الهاتف,العنوان,تاريخ التسجيل,نشط,الدور\n';
        members.forEach(member => {
          csvContent += `${member.id},"${member.fullName}","${member.email}","${member.phone}","${member.address}","${member.registrationDate}",${member.isActive},"${member.role || ''}"\n`;
        });
        filename = 'members.csv';
        break;

      case 'activities':
        csvContent = 'ID,العنوان,الوصف,الفئة,التاريخ,الموقع,عدد المشاركين,المنظم,المتطلبات,الحالة\n';
        activities.forEach(activity => {
          csvContent += `${activity.id},"${activity.title}","${activity.description}","${activity.category}","${activity.date}","${activity.location}",${activity.participants},"${activity.organizer}","${activity.requirements || ''}","${activity.status}"\n`;
        });
        filename = 'activities.csv';
        break;

      case 'events':
        csvContent = 'ID,العنوان,الوصف,التاريخ,الوقت,الموقع,المنظم,الحد الأقصى للمشاركين,المشاركين الحاليين,الحالة\n';
        events.forEach(event => {
          csvContent += `${event.id},"${event.title}","${event.description}","${event.date}","${event.time}","${event.location}","${event.organizer}",${event.maxParticipants || ''},${event.currentParticipants},"${event.status}"\n`;
        });
        filename = 'events.csv';
        break;

      case 'news':
        csvContent = 'ID,العنوان,المحتوى,الملخص,المؤلف,الفئة,التاريخ,منشور\n';
        news.forEach(newsItem => {
          csvContent += `${newsItem.id},"${newsItem.title}","${newsItem.content}","${newsItem.excerpt}","${newsItem.author}","${newsItem.category}","${newsItem.date}",${newsItem.isPublished}\n`;
        });
        filename = 'news.csv';
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'تم التصدير',
      description: `تم تصدير ${type} إلى CSV بنجاح`
    });
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      
      if (!data.members || !data.activities || !data.events || !data.news || !data.gallery) {
        throw new Error('تنسيق البيانات غير صحيح');
      }

      // Clear existing data and import new data
      // Note: In a real app, you'd want to confirm this action
      
      // Import members
      data.members.forEach((member: any) => {
        addMember({
          fullName: member.fullName,
          email: member.email,
          phone: member.phone,
          address: member.address,
          role: member.role
        });
      });

      // Import activities
      data.activities.forEach((activity: any) => {
        addActivity({
          title: activity.title,
          description: activity.description,
          category: activity.category,
          date: activity.date,
          location: activity.location,
          participants: activity.participants,
          organizer: activity.organizer,
          requirements: activity.requirements,
          status: activity.status
        });
      });

      // Import events
      data.events.forEach((event: any) => {
        addEvent({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          organizer: event.organizer,
          maxParticipants: event.maxParticipants,
          status: event.status
        });
      });

      // Import news
      data.news.forEach((newsItem: any) => {
        addNews({
          title: newsItem.title,
          content: newsItem.content,
          excerpt: newsItem.excerpt,
          author: newsItem.author,
          category: newsItem.category,
          isPublished: newsItem.isPublished
        });
      });

      // Import gallery
      data.gallery.forEach((image: any) => {
        addGalleryImage({
          title: image.title,
          description: image.description,
          imageUrl: image.imageUrl,
          category: image.category
        });
      });

      toast({
        title: 'تم الاستيراد',
        description: 'تم استيراد البيانات بنجاح'
      });

      setIsImportOpen(false);
      setImportData('');

    } catch (error) {
      toast({
        title: 'خطأ في الاستيراد',
        description: 'تنسيق البيانات غير صحيح',
        variant: 'destructive'
      });
    }
  };

  const getStats = () => ({
    members: members.length,
    activities: activities.length,
    events: events.length,
    news: news.length,
    gallery: gallery.length
  });

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">إدارة البيانات</h2>
        <p className="text-muted-foreground">تصدير واستيراد بيانات الجمعية</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{stats.members}</div>
            <div className="text-sm text-muted-foreground">أعضاء</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{stats.activities}</div>
            <div className="text-sm text-muted-foreground">أنشطة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{stats.events}</div>
            <div className="text-sm text-muted-foreground">فعاليات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Newspaper className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{stats.news}</div>
            <div className="text-sm text-muted-foreground">أخبار</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p4 text-center">
            <Image className="w-8 h-8 mx-auto mb-2 text-pink-600" />
            <div className="text-2xl font-bold">{stats.gallery}</div>
            <div className="text-sm text-muted-foreground">صور</div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              تصدير البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={exportToJSON} className="w-full">
              <Database className="w-4 h-4 ml-2" />
              تصدير كامل (JSON)
            </Button>
            
            <div className="space-y-2">
              <h4 className="font-medium">تصدير منفصل:</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => exportToCSV('members')}>
                  <Users className="w-4 h-4 ml-1" />
                  الأعضاء
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportToCSV('activities')}>
                  <Calendar className="w-4 h-4 ml-1" />
                  الأنشطة
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportToCSV('events')}>
                  <Calendar className="w-4 h-4 ml-1" />
                  الفعاليات
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportToCSV('news')}>
                  <Newspaper className="w-4 h-4 ml-1" />
                  الأخبار
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              استيراد البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 ml-2" />
                  استيراد من JSON
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>استيراد البيانات</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">تحذير</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      سيتم استبدال جميع البيانات الحالية بالبيانات المستوردة
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="import-data">البيانات (JSON)</Label>
                    <textarea
                      id="import-data"
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                      placeholder="الصق بيانات JSON هنا..."
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleImport} disabled={!importData.trim()}>
                      <CheckCircle className="w-4 h-4 ml-2" />
                      استيراد
                    </Button>
                    <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataManager;
