import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sampleActivities, sampleEvents, sampleNews, sampleGallery } from "@/data/sampleData";
import { notificationService } from "@/lib/notificationService";

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  isActive: boolean;
  role?: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  participants: number;
  image?: string;
  status: 'planned' | 'ongoing' | 'completed';
  organizer: string;
  requirements?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  maxParticipants?: number;
  currentParticipants: number;
  organizer: string;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  image?: string;
  category: string;
  isPublished: boolean;
}

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  details?: string;
  imageUrl: string;
  category: string;
  date: string;
  eventId?: string;
  tags?: string[];
  photographer?: string;
  location?: string;
  featured?: boolean;
}

interface AppContextType {
  members: Member[];
  activities: Activity[];
  events: Event[];
  news: NewsItem[];
  gallery: GalleryImage[];
  addMember: (member: Omit<Member, "id" | "registrationDate">) => void;
  addActivity: (activity: Omit<Activity, "id">) => void;
  addEvent: (event: Omit<Event, "id">) => void;
  addNews: (news: Omit<NewsItem, "id">) => void;
  addGalleryImage: (image: Omit<GalleryImage, "id">) => void;
  updateGalleryImage: (id: string, image: GalleryImage) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  updateNews: (id: string, updates: Partial<NewsItem>) => void;
  deleteMember: (id: string) => void;
  deleteActivity: (id: string) => void;
  deleteEvent: (id: string) => void;
  deleteNews: (id: string) => void;
  deleteGalleryImage: (id: string) => void;
  loadSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem("members");
    return saved ? JSON.parse(saved) : [];
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem("activities");
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : [];
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem("news");
    return saved ? JSON.parse(saved) : [];
  });

  const [gallery, setGallery] = useState<GalleryImage[]>(() => {
    const saved = localStorage.getItem("gallery");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("news", JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem("gallery", JSON.stringify(gallery));
  }, [gallery]);

  // Add functions
  const addMember = (member: Omit<Member, "id" | "registrationDate">) => {
    const newMember: Member = {
      ...member,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString(),
      isActive: true,
    };
    setMembers([...members, newMember]);
    
    // Créer une notification pour le nouveau membre
    notificationService.onMemberRegistered(newMember);
  };

  const addActivity = (activity: Omit<Activity, "id">) => {
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
    };
    setActivities([...activities, newActivity]);
    
    // Créer une notification pour la nouvelle activité
    notificationService.onActivityCreated(newActivity);
  };

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
      currentParticipants: 0,
    };
    setEvents([...events, newEvent]);
    
    // Créer une notification pour le nouvel événement
    notificationService.onEventCreated(newEvent);
  };

  const addNews = (newsItem: Omit<NewsItem, "id">) => {
    const newNews: NewsItem = {
      ...newsItem,
      id: crypto.randomUUID(),
    };
    setNews([...news, newNews]);
  };

  const addGalleryImage = (image: Omit<GalleryImage, "id">) => {
    const newImage: GalleryImage = {
      ...image,
      id: crypto.randomUUID(),
    };
    setGallery([...gallery, newImage]);
  };

  // Update functions
  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, ...updates } : activity
    ));
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const updateNews = (id: string, updates: Partial<NewsItem>) => {
    setNews(news.map(newsItem => 
      newsItem.id === id ? { ...newsItem, ...updates } : newsItem
    ));
  };

  // Delete functions
  const deleteMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const deleteNews = (id: string) => {
    setNews(news.filter(newsItem => newsItem.id !== id));
  };

  const updateGalleryImage = (id: string, updatedImage: GalleryImage) => {
    setGallery(gallery.map(image => 
      image.id === id ? { ...updatedImage, id } : image
    ));
  };

  const deleteGalleryImage = (id: string) => {
    setGallery(gallery.filter(image => image.id !== id));
  };

  const loadSampleData = () => {
    // Load sample activities
    sampleActivities.forEach(activity => {
      addActivity(activity);
    });
    
    // Load sample events
    sampleEvents.forEach(event => {
      addEvent(event);
    });
    
    // Load sample news
    sampleNews.forEach(newsItem => {
      addNews(newsItem);
    });
    
    // Load sample gallery
    sampleGallery.forEach(image => {
      addGalleryImage(image);
    });
  };

  return (
    <AppContext.Provider
      value={{ 
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
