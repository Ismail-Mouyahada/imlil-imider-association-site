import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Eye,
  User,
  CheckCircle,
  Clock as ClockIcon,
  AlertCircle,
  Plus,
  X
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Events = () => {
  const { events } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: ""
  });
  const { toast } = useToast();

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleRegister = (event: any) => {
    setSelectedEvent(event);
    setIsRegistrationOpen(true);
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationData.fullName || !registrationData.email || !registrationData.phone) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // Simuler l'inscription
    toast({
      title: "تم التسجيل بنجاح!",
      description: `تم تسجيلك في فعالية "${selectedEvent.title}"`,
    });

    // Réinitialiser le formulaire
    setRegistrationData({
      fullName: "",
      email: "",
      phone: "",
      message: ""
    });
    setIsRegistrationOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="default" className="flex items-center gap-1"><ClockIcon className="w-3 h-3" />قادم</Badge>;
      case 'ongoing':
        return <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />جاري</Badge>;
      case 'completed':
        return <Badge variant="outline" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />مكتمل</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const filteredAndSortedEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'participants':
          return b.currentParticipants - a.currentParticipants;
        default:
          return 0;
      }
    });

  const upcomingEvents = filteredAndSortedEvents.filter(event => event.status === 'upcoming');
  const ongoingEvents = filteredAndSortedEvents.filter(event => event.status === 'ongoing');
  const completedEvents = filteredAndSortedEvents.filter(event => event.status === 'completed');

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-gradient">الفعاليات</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            تابع جميع الفعاليات والبرامج القادمة للجمعية
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في الفعاليات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفعاليات</SelectItem>
                <SelectItem value="upcoming">قادمة</SelectItem>
                <SelectItem value="ongoing">جارية</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">التاريخ</SelectItem>
                <SelectItem value="title">العنوان</SelectItem>
                <SelectItem value="participants">عدد المشاركين</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events by Status */}
        {statusFilter === "all" && (
          <>
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-foreground">الفعاليات القادمة</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      index={index}
                      onViewDetails={handleViewDetails}
                      onRegister={handleRegister}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Ongoing Events */}
            {ongoingEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-foreground">الفعاليات الجارية</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ongoingEvents.map((event, index) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      index={index}
                      onViewDetails={handleViewDetails}
                      onRegister={handleRegister}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Events */}
            {completedEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-foreground">الفعاليات المكتملة</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedEvents.map((event, index) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      index={index}
                      onViewDetails={handleViewDetails}
                      onRegister={handleRegister}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Filtered Events */}
        {statusFilter !== "all" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                index={index}
                onViewDetails={handleViewDetails}
                onRegister={handleRegister}
              />
            ))}
          </div>
        )}

        {filteredAndSortedEvents.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {events.length === 0 
                ? "لا توجد فعاليات مسجلة حالياً" 
                : "لم يتم العثور على فعاليات تطابق معايير البحث"
              }
            </p>
            <Link to="/">
              <Button>العودة إلى الرئيسية</Button>
            </Link>
          </div>
        )}

        {/* Event Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {selectedEvent?.title}
              </DialogTitle>
              <DialogDescription>
                تفاصيل الفعالية
              </DialogDescription>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">الوصف</h3>
                    <p className="text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">التاريخ:</span>
                        <span>{new Date(selectedEvent.date).toLocaleDateString("ar-MA")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">الوقت:</span>
                        <span>{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">الموقع:</span>
                        <span>{selectedEvent.location}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">المنظم:</span>
                        <span>{selectedEvent.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">المشاركون:</span>
                        <span>{selectedEvent.currentParticipants}</span>
                        {selectedEvent.maxParticipants && (
                          <span> / {selectedEvent.maxParticipants}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">الحالة:</span>
                        {getStatusBadge(selectedEvent.status)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => setIsDetailsOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    إغلاق
                  </Button>
                  {selectedEvent.status === 'upcoming' && (
                    <Button 
                      onClick={() => {
                        setIsDetailsOpen(false);
                        handleRegister(selectedEvent);
                      }}
                      className="flex-1"
                    >
                      <Plus className="w-4 h-4 ml-1" />
                      التسجيل
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Registration Modal */}
        <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                التسجيل في الفعالية
              </DialogTitle>
              <DialogDescription>
                {selectedEvent?.title}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                <Input
                  value={registrationData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">البريد الإلكتروني *</label>
                <Input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
                <Input
                  value={registrationData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="أدخل رقم هاتفك"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">رسالة (اختياري)</label>
                <textarea
                  className="w-full p-2 border rounded-md resize-none"
                  rows={3}
                  value={registrationData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="أي ملاحظات أو أسئلة..."
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  type="button"
                  onClick={() => setIsRegistrationOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1">
                  <CheckCircle className="w-4 h-4 ml-1" />
                  تأكيد التسجيل
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const EventCard = ({ event, index, onViewDetails, onRegister }: { 
  event: any; 
  index: number; 
  onViewDetails: (event: any) => void;
  onRegister: (event: any) => void;
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="default" className="flex items-center gap-1"><ClockIcon className="w-3 h-3" />قادم</Badge>;
      case 'ongoing':
        return <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />جاري</Badge>;
      case 'completed':
        return <Badge variant="outline" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />مكتمل</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const isEventFull = event.maxParticipants && event.currentParticipants >= event.maxParticipants;

  return (
    <Card
      className="hover-scale group cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          {getStatusBadge(event.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {event.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString("ar-MA")}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {event.time}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            {event.organizer}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {event.currentParticipants} مشارك
            {event.maxParticipants && ` / ${event.maxParticipants}`}
          </div>
        </div>

        {isEventFull && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-xs font-medium text-destructive">الفعالية ممتلئة</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails(event)}
          >
            <Eye className="w-4 h-4 ml-1" />
            التفاصيل
          </Button>
          {event.status === 'upcoming' && !isEventFull && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onRegister(event)}
            >
              <Plus className="w-4 h-4 ml-1" />
              التسجيل
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Events;