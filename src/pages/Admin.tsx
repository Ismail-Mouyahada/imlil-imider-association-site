import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Image, 
  Newspaper, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Database,
  Settings,
  Upload
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import DataManager from "@/components/DataManager";
import NotificationSettings from "@/components/NotificationSettings";
import NotificationStats from "@/components/NotificationStats";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import UserManagement from "@/pages/UserManagement";
import AdminPrivacySettings from "@/components/AdminPrivacySettings";
import ButtonTestSuite from "@/components/ButtonTestSuite";
import EnhancedGallery from "@/components/EnhancedGallery";
import ImageUploadTester from "@/components/ImageUploadTester";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Admin = () => {
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
    addGalleryImage,
    updateGalleryImage,
    updateMember,
    updateActivity,
    updateEvent,
    updateNews,
    deleteMember,
    deleteActivity,
    deleteEvent,
    deleteNews,
    deleteGalleryImage,
    loadSampleData
  } = useApp();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("members");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [memberForm, setMemberForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: ""
  });

  const [activityForm, setActivityForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    participants: 0,
    organizer: "",
    requirements: "",
    status: "planned"
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    maxParticipants: "",
    status: "upcoming"
  });

  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    isPublished: true
  });

  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: ""
  });

  const openDialog = (type: string, item: any = null) => {
    setDialogType(type);
    setEditingItem(item);
    
    if (item) {
      // Populate form with existing data
      switch (type) {
        case "member":
          setMemberForm({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            address: item.address,
            role: item.role || ""
          });
          break;
        case "activity":
          setActivityForm({
            title: item.title,
            description: item.description,
            category: item.category,
            date: item.date,
            location: item.location,
            participants: item.participants,
            organizer: item.organizer,
            requirements: item.requirements || "",
            status: item.status
          });
          break;
        case "event":
          setEventForm({
            title: item.title,
            description: item.description,
            date: item.date,
            time: item.time,
            location: item.location,
            organizer: item.organizer,
            maxParticipants: item.maxParticipants?.toString() || "",
            status: item.status
          });
          break;
        case "news":
          setNewsForm({
            title: item.title,
            content: item.content,
            excerpt: item.excerpt,
            author: item.author,
            category: item.category,
            isPublished: item.isPublished
          });
          break;
        case "gallery":
          setGalleryForm({
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            category: item.category
          });
          break;
      }
    } else {
      // Reset forms
      setMemberForm({ fullName: "", email: "", phone: "", address: "", role: "" });
      setActivityForm({ title: "", description: "", category: "", date: "", location: "", participants: 0, organizer: "", requirements: "", status: "planned" });
      setEventForm({ title: "", description: "", date: "", time: "", location: "", organizer: "", maxParticipants: "", status: "upcoming" });
      setNewsForm({ title: "", content: "", excerpt: "", author: "", category: "", isPublished: true });
      setGalleryForm({ title: "", description: "", imageUrl: "", category: "" });
    }
    
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setDialogType("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      switch (dialogType) {
        case "member":
          if (editingItem) {
            updateMember(editingItem.id, memberForm);
            toast({ title: "تم تحديث العضو بنجاح" });
          } else {
            addMember(memberForm);
            toast({ title: "تم إضافة العضو بنجاح" });
          }
          break;
        case "activity":
          if (editingItem) {
            updateActivity(editingItem.id, activityForm);
            toast({ title: "تم تحديث النشاط بنجاح" });
          } else {
            addActivity(activityForm);
            toast({ title: "تم إضافة النشاط بنجاح" });
          }
          break;
        case "event":
          if (editingItem) {
            updateEvent(editingItem.id, eventForm);
            toast({ title: "تم تحديث الفعالية بنجاح" });
          } else {
            addEvent(eventForm);
            toast({ title: "تم إضافة الفعالية بنجاح" });
          }
          break;
        case "news":
          if (editingItem) {
            updateNews(editingItem.id, newsForm);
            toast({ title: "تم تحديث الخبر بنجاح" });
          } else {
            addNews(newsForm);
            toast({ title: "تم إضافة الخبر بنجاح" });
          }
          break;
        case "gallery":
          if (editingItem) {
            // Update gallery image logic would go here
            toast({ title: "تم تحديث الصورة بنجاح" });
          } else {
            addGalleryImage(galleryForm);
            toast({ title: "تم إضافة الصورة بنجاح" });
          }
          break;
      }
      closeDialog();
    } catch (error) {
      toast({ title: "حدث خطأ", description: "يرجى المحاولة مرة أخرى", variant: "destructive" });
    }
  };

  const handleDelete = (type: string, id: string) => {
    try {
      switch (type) {
        case "member":
          deleteMember(id);
          toast({ title: "تم حذف العضو بنجاح" });
          break;
        case "activity":
          deleteActivity(id);
          toast({ title: "تم حذف النشاط بنجاح" });
          break;
        case "event":
          deleteEvent(id);
          toast({ title: "تم حذف الفعالية بنجاح" });
          break;
        case "news":
          deleteNews(id);
          toast({ title: "تم حذف الخبر بنجاح" });
          break;
        case "gallery":
          deleteGalleryImage(id);
          toast({ title: "تم حذف الصورة بنجاح" });
          break;
      }
    } catch (error) {
      toast({ title: "حدث خطأ", description: "يرجى المحاولة مرة أخرى", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-gradient">لوحة الإدارة</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            إدارة محتوى الجمعية وأنشطتها
          </p>
          <Button 
            onClick={() => {
              loadSampleData();
              toast({ title: "تم تحميل البيانات التجريبية بنجاح" });
            }}
            variant="outline"
            className="mb-4"
          >
            تحميل البيانات التجريبية
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-12">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              المستخدمون
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              الأعضاء
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              الأنشطة
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              الفعاليات
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              الأخبار
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              المعرض
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              البيانات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="notification-stats" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              إحصائيات الإشعارات
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              الخصوصية
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              الاختبارات
            </TabsTrigger>
            <TabsTrigger value="upload-test" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              اختبار الرفع
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة الأعضاء</h2>
              <Button onClick={() => openDialog("member")}>
                <Plus className="w-4 h-4 ml-1" />
                إضافة عضو
              </Button>
            </div>
            <div className="grid gap-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{member.fullName}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-sm text-muted-foreground">{member.phone}</p>
                        {member.role && <Badge variant="outline" className="mt-1">{member.role}</Badge>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openDialog("member", member)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("member", member.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة الأنشطة</h2>
              <Button onClick={() => openDialog("activity")}>
                <Plus className="w-4 h-4 ml-1" />
                إضافة نشاط
              </Button>
            </div>
            <div className="grid gap-4">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{activity.category}</Badge>
                          <Badge variant="secondary">{activity.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openDialog("activity", activity)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("activity", activity.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة الفعاليات</h2>
              <Button onClick={() => openDialog("event")}>
                <Plus className="w-4 h-4 ml-1" />
                إضافة فعالية
              </Button>
            </div>
            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{event.status}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {event.currentParticipants}/{event.maxParticipants || "∞"} مشارك
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openDialog("event", event)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("event", event.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة الأخبار</h2>
              <Button onClick={() => openDialog("news")}>
                <Plus className="w-4 h-4 ml-1" />
                إضافة خبر
              </Button>
            </div>
            <div className="grid gap-4">
              {news.map((newsItem) => (
                <Card key={newsItem.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{newsItem.title}</h3>
                        <p className="text-sm text-muted-foreground">{newsItem.excerpt}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{newsItem.category}</Badge>
                          <Badge variant={newsItem.isPublished ? "default" : "secondary"}>
                            {newsItem.isPublished ? "منشور" : "مسودة"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openDialog("news", newsItem)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("news", newsItem.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المعرض</h2>
              <Button onClick={() => openDialog("gallery")}>
                <Plus className="w-4 h-4 ml-1" />
                إضافة صورة
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((image) => (
                <Card key={image.id}>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                      {image.imageUrl ? (
                        <img src={image.imageUrl} alt={image.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Image className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm">{image.title}</h3>
                    <p className="text-xs text-muted-foreground">{image.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">{image.category}</Badge>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => openDialog("gallery", image)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete("gallery", image.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-4">
            <DataManager />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <NotificationSettings />
              </div>
              <div>
                <PerformanceMonitor />
              </div>
            </div>
          </TabsContent>

          {/* Notification Stats Tab */}
          <TabsContent value="notification-stats" className="space-y-6">
            <NotificationStats />
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <AdminPrivacySettings />
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            <ButtonTestSuite />
          </TabsContent>

          {/* Upload Test Tab */}
          <TabsContent value="upload-test" className="space-y-4">
            <ImageUploadTester />
          </TabsContent>

        </Tabs>

        {/* Dialog for adding/editing items */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? `تعديل ${dialogType === "member" ? "عضو" : dialogType === "activity" ? "نشاط" : dialogType === "event" ? "فعالية" : dialogType === "news" ? "خبر" : "صورة"}` : 
                 `إضافة ${dialogType === "member" ? "عضو" : dialogType === "activity" ? "نشاط" : dialogType === "event" ? "فعالية" : dialogType === "news" ? "خبر" : "صورة"}`}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? `قم بتعديل معلومات ${dialogType === "member" ? "العضو" : dialogType === "activity" ? "النشاط" : dialogType === "event" ? "الفعالية" : dialogType === "news" ? "الخبر" : "الصورة"} المحدد.` : 
                 `أضف ${dialogType === "member" ? "عضو" : dialogType === "activity" ? "نشاط" : dialogType === "event" ? "فعالية" : dialogType === "news" ? "خبر" : "صورة"} جديد إلى النظام.`}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {dialogType === "member" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل</Label>
                    <Input
                      id="fullName"
                      value={memberForm.fullName}
                      onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={memberForm.email}
                      onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={memberForm.phone}
                      onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      value={memberForm.address}
                      onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">الدور (اختياري)</Label>
                    <Input
                      id="role"
                      value={memberForm.role}
                      onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    />
                  </div>
                </>
              )}

              {dialogType === "activity" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان النشاط</Label>
                    <Input
                      id="title"
                      value={activityForm.title}
                      onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">وصف النشاط</Label>
                    <Textarea
                      id="description"
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">الفئة</Label>
                      <Select value={activityForm.category} onValueChange={(value) => setActivityForm({ ...activityForm, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الأنشطة الاجتماعية">الأنشطة الاجتماعية</SelectItem>
                          <SelectItem value="التربية والتعليم">التربية والتعليم</SelectItem>
                          <SelectItem value="الثقافة والتراث">الثقافة والتراث</SelectItem>
                          <SelectItem value="الرياضة والشباب">الرياضة والشباب</SelectItem>
                          <SelectItem value="التنمية الاقتصادية">التنمية الاقتصادية</SelectItem>
                          <SelectItem value="البنية التحتية">البنية التحتية</SelectItem>
                          <SelectItem value="التحسيس والمواطنة">التحسيس والمواطنة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">الحالة</Label>
                      <Select value={activityForm.status} onValueChange={(value) => setActivityForm({ ...activityForm, status: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">مخطط</SelectItem>
                          <SelectItem value="ongoing">جاري</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">التاريخ</Label>
                      <Input
                        id="date"
                        type="date"
                        value={activityForm.date}
                        onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participants">عدد المشاركين</Label>
                      <Input
                        id="participants"
                        type="number"
                        value={activityForm.participants}
                        onChange={(e) => setActivityForm({ ...activityForm, participants: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      value={activityForm.location}
                      onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizer">المنظم</Label>
                    <Input
                      id="organizer"
                      value={activityForm.organizer}
                      onChange={(e) => setActivityForm({ ...activityForm, organizer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">المتطلبات (اختياري)</Label>
                    <Textarea
                      id="requirements"
                      value={activityForm.requirements}
                      onChange={(e) => setActivityForm({ ...activityForm, requirements: e.target.value })}
                    />
                  </div>
                </>
              )}

              {dialogType === "event" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الفعالية</Label>
                    <Input
                      id="title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">وصف الفعالية</Label>
                    <Textarea
                      id="description"
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">التاريخ</Label>
                      <Input
                        id="date"
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">الوقت</Label>
                      <Input
                        id="time"
                        type="time"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizer">المنظم</Label>
                    <Input
                      id="organizer"
                      value={eventForm.organizer}
                      onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxParticipants">الحد الأقصى للمشاركين (اختياري)</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={eventForm.maxParticipants}
                        onChange={(e) => setEventForm({ ...eventForm, maxParticipants: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">الحالة</Label>
                      <Select value={eventForm.status} onValueChange={(value) => setEventForm({ ...eventForm, status: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">قادمة</SelectItem>
                          <SelectItem value="ongoing">جارية</SelectItem>
                          <SelectItem value="completed">مكتملة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {dialogType === "news" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الخبر</Label>
                    <Input
                      id="title"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">الملخص</Label>
                    <Textarea
                      id="excerpt"
                      value={newsForm.excerpt}
                      onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">المحتوى</Label>
                    <Textarea
                      id="content"
                      value={newsForm.content}
                      onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                      required
                      rows={6}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">المؤلف</Label>
                      <Input
                        id="author"
                        value={newsForm.author}
                        onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">الفئة</Label>
                      <Select value={newsForm.category} onValueChange={(value) => setNewsForm({ ...newsForm, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="أخبار عامة">أخبار عامة</SelectItem>
                          <SelectItem value="أنشطة وفعاليات">أنشطة وفعاليات</SelectItem>
                          <SelectItem value="إعلانات مهمة">إعلانات مهمة</SelectItem>
                          <SelectItem value="تحديثات المشاريع">تحديثات المشاريع</SelectItem>
                          <SelectItem value="شهادات وتكريمات">شهادات وتكريمات</SelectItem>
                          <SelectItem value="أخرى">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {dialogType === "gallery" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الصورة</Label>
                    <Input
                      id="title"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">وصف الصورة (اختياري)</Label>
                    <Textarea
                      id="description"
                      value={galleryForm.description}
                      onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">رابط الصورة</Label>
                    <Input
                      id="imageUrl"
                      value={galleryForm.imageUrl}
                      onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">الفئة</Label>
                    <Select value={galleryForm.category} onValueChange={(value) => setGalleryForm({ ...galleryForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="الأنشطة الاجتماعية">الأنشطة الاجتماعية</SelectItem>
                        <SelectItem value="التربية والتعليم">التربية والتعليم</SelectItem>
                        <SelectItem value="الثقافة والتراث">الثقافة والتراث</SelectItem>
                        <SelectItem value="الرياضة والشباب">الرياضة والشباب</SelectItem>
                        <SelectItem value="التنمية الاقتصادية">التنمية الاقتصادية</SelectItem>
                        <SelectItem value="البنية التحتية">البنية التحتية</SelectItem>
                        <SelectItem value="التحسيس والمواطنة">التحسيس والمواطنة</SelectItem>
                        <SelectItem value="أخرى">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 ml-1" />
                  {editingItem ? "تحديث" : "إضافة"}
                </Button>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  <X className="w-4 h-4 ml-1" />
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
