import { useState, useEffect } from 'react';
import { createContact, getContacts, updateContactStatus, deleteContact } from '@/api/contacts';
import { useToast } from '@/hooks/use-toast';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const { toast } = useToast();

  const fetchContacts = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getContacts(page, pagination.limit);
      if (result.success) {
        setContacts(result.contacts);
        setPagination(result.pagination);
      } else {
        toast({
          title: 'خطأ',
          description: 'فشل في تحميل جهات الاتصال',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحميل جهات الاتصال',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const submitContact = async (data: any) => {
    setLoading(true);
    try {
      const result = await createContact(data);
      if (result.success) {
        toast({
          title: 'تم الإرسال',
          description: 'تم إرسال رسالتك بنجاح',
        });
        return true;
      } else {
        toast({
          title: 'خطأ',
          description: 'فشل في إرسال الرسالة',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الرسالة',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string, response?: string) => {
    try {
      const result = await updateContactStatus(id, status, response);
      if (result.success) {
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث حالة جهة الاتصال',
        });
        fetchContacts(pagination.page);
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
      console.error('Error updating contact status:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الحالة',
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeContact = async (id: string) => {
    try {
      const result = await deleteContact(id);
      if (result.success) {
        toast({
          title: 'تم الحذف',
          description: 'تم حذف جهة الاتصال',
        });
        fetchContacts(pagination.page);
        return true;
      } else {
        toast({
          title: 'خطأ',
          description: 'فشل في حذف جهة الاتصال',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف جهة الاتصال',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    pagination,
    fetchContacts,
    submitContact,
    updateStatus,
    removeContact,
  };
};
