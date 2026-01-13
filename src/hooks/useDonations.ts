import { useState, useEffect } from 'react';
import { 
  createDonation, 
  getDonations, 
  getDonationById, 
  updateDonationStatus, 
  getDonationStats,
  deleteDonation 
} from '@/api/donations';
import { useToast } from '@/hooks/use-toast';

export const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const { toast } = useToast();

  const fetchDonations = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getDonations(page, pagination.limit);
      if (result.success) {
        setDonations(result.donations);
        setPagination(result.pagination);
      } else {
        toast({
          title: 'خطأ',
          description: 'فشل في تحميل التبرعات',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحميل التبرعات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getDonationStats();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching donation stats:', error);
    }
  };

  const submitDonation = async (data: any) => {
    setLoading(true);
    try {
      const result = await createDonation(data);
      if (result.success) {
        toast({
          title: 'تم التسجيل',
          description: 'تم تسجيل تبرعك بنجاح',
        });
        fetchStats(); // Update stats
        return { success: true, donation: result.donation };
      } else {
        toast({
          title: 'خطأ',
          description: 'فشل في تسجيل التبرع',
          variant: 'destructive',
        });
        return { success: false };
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تسجيل التبرع',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const trackDonation = async (id: string) => {
    setLoading(true);
    try {
      const result = await getDonationById(id);
      if (result.success) {
        return { success: true, donation: result.donation };
      } else {
        toast({
          title: 'خطأ',
          description: 'لم يتم العثور على التبرع',
          variant: 'destructive',
        });
        return { success: false };
      }
    } catch (error) {
      console.error('Error tracking donation:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء البحث عن التبرع',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string, transactionId?: string) => {
    try {
      const result = await updateDonationStatus(id, status, transactionId);
      if (result.success) {
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث حالة التبرع',
        });
        fetchDonations(pagination.page);
        fetchStats();
        return true;
      } else {
        toast({
          title: 'خطأ',
          description: 'فشل في تحديث الحالة',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الحالة',
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeDonation = async (id: string) => {
    try {
      const result = await deleteDonation(id);
      if (result.success) {
        toast({
          title: 'تم الحذف',
          description: 'تم حذف التبرع',
        });
        fetchDonations(pagination.page);
        fetchStats();
        return true;
      } else {
        toast({
          title: 'خطأ',
          description: 'فشل في حذف التبرع',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف التبرع',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, []);

  return {
    donations,
    stats,
    loading,
    pagination,
    fetchDonations,
    fetchStats,
    submitDonation,
    trackDonation,
    updateStatus,
    removeDonation,
  };
};
