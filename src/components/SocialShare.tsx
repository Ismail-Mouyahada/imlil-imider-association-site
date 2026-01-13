import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Share2, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  MessageCircle, 
  Mail, 
  Link,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
}

const SocialShare: React.FC<SocialShareProps> = ({
  url = window.location.href,
  title = 'جمعية إمليل - تطوير قرية إميدر',
  description = 'اكتشف أنشطة ومبادرات جمعية إمليل لتطوير قرية إميدر في المغرب',
  image = '/hero-image.jpg',
  hashtags = ['إمليل', 'إميدر', 'المغرب', 'التنمية', 'القرية'],
  className = '',
  variant = 'outline',
  size = 'default'
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = hashtags.map(tag => `%23${tag}`).join('');

  const shareData = {
    url,
    title,
    text: description,
    hashtags: hashtags.join(',')
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    instagram: `https://www.instagram.com/`, // Instagram ne supporte pas le partage direct
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleShare = async (platform: string) => {
    try {
      if (platform === 'native' && navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "تم المشاركة بنجاح",
          description: "تم مشاركة المحتوى بنجاح.",
        });
        return;
      }

      if (platform === 'copy') {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast({
          title: "تم نسخ الرابط",
          description: "تم نسخ الرابط إلى الحافظة.",
        });
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      const shareUrl = shareLinks[platform as keyof typeof shareLinks];
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        toast({
          title: "تم فتح منصة المشاركة",
          description: `تم فتح ${platform} للمشاركة.`,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "خطأ في المشاركة",
        description: "حدث خطأ أثناء محاولة المشاركة.",
        variant: "destructive",
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      case 'telegram':
        return <MessageCircle className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'copy':
        return copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />;
      default:
        return <Share2 className="w-4 h-4" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'فيسبوك';
      case 'instagram':
        return 'إنستغرام';
      case 'linkedin':
        return 'لينكد إن';
      case 'twitter':
        return 'تويتر (X)';
      case 'whatsapp':
        return 'واتساب';
      case 'telegram':
        return 'تيليجرام';
      case 'email':
        return 'البريد الإلكتروني';
      case 'copy':
        return copied ? 'تم النسخ!' : 'نسخ الرابط';
      case 'native':
        return 'مشاركة';
      default:
        return platform;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`flex items-center gap-2 ${className}`}
        >
          <Share2 className="w-4 h-4" />
          مشاركة
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Partage natif si disponible */}
        {navigator.share && (
          <>
            <DropdownMenuItem onClick={() => handleShare('native')}>
              <Share2 className="w-4 h-4 ml-2" />
              مشاركة
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Réseaux sociaux */}
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="w-4 h-4 ml-2 text-blue-600" />
          فيسبوك
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="w-4 h-4 ml-2 text-blue-400" />
          تويتر (X)
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          <Linkedin className="w-4 h-4 ml-2 text-blue-700" />
          لينكد إن
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('instagram')}>
          <Instagram className="w-4 h-4 ml-2 text-pink-500" />
          إنستغرام
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Messagerie */}
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          <MessageCircle className="w-4 h-4 ml-2 text-green-500" />
          واتساب
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('telegram')}>
          <MessageCircle className="w-4 h-4 ml-2 text-blue-500" />
          تيليجرام
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('email')}>
          <Mail className="w-4 h-4 ml-2 text-gray-600" />
          البريد الإلكتروني
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Actions */}
        <DropdownMenuItem onClick={() => handleShare('copy')}>
          {getPlatformIcon('copy')}
          <span className="mr-2">{getPlatformName('copy')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;
