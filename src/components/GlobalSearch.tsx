import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Search, X, Calendar, Users, Image, Newspaper, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'activity' | 'event' | 'news' | 'gallery' | 'member';
  category?: string;
  date?: string;
  icon: React.ComponentType<any>;
}

const GlobalSearch = () => {
  const { activities, events, news, gallery, members } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];

    // Search activities
    activities.forEach(activity => {
      if (activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchResults.push({
          id: activity.id,
          title: activity.title,
          description: activity.description,
          type: 'activity',
          category: activity.category,
          date: activity.date,
          icon: Calendar
        });
      }
    });

    // Search events
    events.forEach(event => {
      if (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchResults.push({
          id: event.id,
          title: event.title,
          description: event.description,
          type: 'event',
          date: event.date,
          icon: Calendar
        });
      }
    });

    // Search news
    news.forEach(newsItem => {
      if (newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          newsItem.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          newsItem.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchResults.push({
          id: newsItem.id,
          title: newsItem.title,
          description: newsItem.excerpt,
          type: 'news',
          category: newsItem.category,
          date: newsItem.date,
          icon: Newspaper
        });
      }
    });

    // Search gallery
    gallery.forEach(image => {
      if (image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
        searchResults.push({
          id: image.id,
          title: image.title,
          description: image.description || '',
          type: 'gallery',
          category: image.category,
          date: image.date,
          icon: Image
        });
      }
    });

    // Search members
    members.forEach(member => {
      if (member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchResults.push({
          id: member.id,
          title: member.fullName,
          description: member.email,
          type: 'member',
          icon: User
        });
      }
    });

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
  }, [searchTerm, activities, events, news, gallery, members]);

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'activity':
        navigate('/activities');
        break;
      case 'event':
        navigate('/events');
        break;
      case 'news':
        navigate('/news');
        break;
      case 'gallery':
        navigate('/gallery');
        break;
      case 'member':
        navigate('/admin');
        break;
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'activity': return 'نشاط';
      case 'event': return 'فعالية';
      case 'news': return 'خبر';
      case 'gallery': return 'صورة';
      case 'member': return 'عضو';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'activity': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'news': return 'bg-purple-100 text-purple-800';
      case 'gallery': return 'bg-orange-100 text-orange-800';
      case 'member': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Search Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">البحث...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>البحث في جميع المحتويات</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                ref={inputRef}
                placeholder="ابحث في الأنشطة، الفعاليات، الأخبار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {searchTerm.length >= 2 && (
              <div className="max-h-96 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((result) => {
                      const IconComponent = result.icon;
                      return (
                        <Card
                          key={`${result.type}-${result.id}`}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleResultClick(result)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <IconComponent className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium truncate">{result.title}</h4>
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${getTypeColor(result.type)}`}
                                  >
                                    {getTypeLabel(result.type)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {result.description}
                                </p>
                                {result.category && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {result.category}
                                  </p>
                                )}
                                {result.date && (
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(result.date).toLocaleDateString('ar-MA')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لم يتم العثور على نتائج</p>
                    <p className="text-sm">جرب كلمات مختلفة</p>
                  </div>
                )}
              </div>
            )}

            {searchTerm.length < 2 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>اكتب للبحث في جميع المحتويات</p>
                <p className="text-sm">الأنشطة، الفعاليات، الأخبار، المعرض، والأعضاء</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalSearch;
