import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Calendar,
  User,
  Eye,
  Tag,
  Clock,
  AlertCircle,
  Filter
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const News = () => {
  const { news } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = [
    "أخبار عامة",
    "أنشطة وفعاليات",
    "إعلانات مهمة",
    "تحديثات المشاريع",
    "شهادات وتكريمات",
    "أخرى"
  ];

  const filteredAndSortedNews = news
    .filter(newsItem => {
      const matchesSearch = newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           newsItem.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           newsItem.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || newsItem.category === categoryFilter;
      const isPublished = newsItem.isPublished;
      
      return matchesSearch && matchesCategory && isPublished;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });

  const openNewsDialog = (newsItem: any) => {
    setSelectedNews(newsItem);
    setIsDialogOpen(true);
  };

  const closeNewsDialog = () => {
    setSelectedNews(null);
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "أمس";
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 30) return `منذ ${Math.ceil(diffDays / 7)} أسابيع`;
    if (diffDays < 365) return `منذ ${Math.ceil(diffDays / 30)} أشهر`;
    return date.toLocaleDateString("ar-MA");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-gradient">الأخبار</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            آخر أخبار وإعلانات الجمعية
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في الأخبار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">التاريخ</SelectItem>
                <SelectItem value="title">العنوان</SelectItem>
                <SelectItem value="author">المؤلف</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedNews.map((newsItem, index) => (
            <Card
              key={newsItem.id}
              className="hover-scale group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openNewsDialog(newsItem)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">{newsItem.category}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDate(newsItem.date)}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {newsItem.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {newsItem.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {newsItem.image && (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={newsItem.image} 
                      alt={newsItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {newsItem.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(newsItem.date).toLocaleDateString("ar-MA")}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 ml-1" />
                    قراءة المزيد
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedNews.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {news.length === 0 
                ? "لا توجد أخبار منشورة حالياً" 
                : "لم يتم العثور على أخبار تطابق معايير البحث"
              }
            </p>
            <Link to="/">
              <Button>العودة إلى الرئيسية</Button>
            </Link>
          </div>
        )}
      </div>

      {/* News Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline">{selectedNews?.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {selectedNews && formatDate(selectedNews.date)}
              </div>
            </div>
            <DialogTitle className="text-2xl">{selectedNews?.title}</DialogTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {selectedNews?.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {selectedNews && new Date(selectedNews.date).toLocaleDateString("ar-MA")}
              </div>
            </div>
          </DialogHeader>
          
          {selectedNews && (
            <div className="space-y-6">
              {selectedNews.image && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={selectedNews.image} 
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {selectedNews.content}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default News;