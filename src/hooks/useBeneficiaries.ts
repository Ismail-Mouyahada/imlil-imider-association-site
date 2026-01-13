import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  createBeneficiary,
  getBeneficiaries,
  updateBeneficiary,
  deleteBeneficiary,
  assignWheelchair,
  deliverWheelchair,
  addFollowUp,
  getBeneficiaryStats,
  type BeneficiaryData,
} from '@/api/beneficiaries';
import { Beneficiary } from '@/lib/mockDatabase';

interface UseBeneficiariesReturn {
  beneficiaries: Beneficiary[];
  stats: {
    total: number;
    pending: number;
    approved: number;
    delivered: number;
    followUp: number;
  };
  loading: boolean;
  error: string | null;
  create: (data: BeneficiaryData) => Promise<boolean>;
  update: (id: string, data: Partial<BeneficiaryData & { status?: Beneficiary['status'] }>) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  assign: (beneficiaryId: string, wheelchairId: string, assignedBy?: string) => Promise<boolean>;
  deliver: (beneficiaryId: string, deliveryDate: string, deliveryLocation: string, ceremonyDate?: string) => Promise<boolean>;
  followUp: (beneficiaryId: string, followUpDate: string, followUpNotes: string, satisfactionRating?: number, feedback?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export const useBeneficiaries = (): UseBeneficiariesReturn => {
  const { toast } = useToast();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    delivered: 0,
    followUp: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [beneficiariesRes, statsRes] = await Promise.all([
        getBeneficiaries(1, 1000),
        getBeneficiaryStats(),
      ]);

      if (beneficiariesRes.success) {
        setBeneficiaries(beneficiariesRes.beneficiaries || []);
      } else {
        throw new Error(beneficiariesRes.error || 'Failed to load beneficiaries');
      }

      if (statsRes.success) {
        setStats(statsRes.data || stats);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const create = useCallback(async (data: BeneficiaryData): Promise<boolean> => {
    try {
      setError(null);
      const result = await createBeneficiary(data);
      
      if (result.success) {
        toast({
          title: 'نجح',
          description: 'تم إضافة المستفيد بنجاح',
        });
        await loadData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to create beneficiary');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create beneficiary';
      setError(errorMessage);
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, loadData]);

  const update = useCallback(async (id: string, data: Partial<BeneficiaryData & { status?: Beneficiary['status'] }>): Promise<boolean> => {
    try {
      setError(null);
      const result = await updateBeneficiary(id, data);
      
      if (result.success) {
        toast({
          title: 'نجح',
          description: 'تم تحديث المستفيد بنجاح',
        });
        await loadData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to update beneficiary');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update beneficiary';
      setError(errorMessage);
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, loadData]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await deleteBeneficiary(id);
      
      if (result.success) {
        toast({
          title: 'نجح',
          description: 'تم حذف المستفيد بنجاح',
        });
        await loadData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete beneficiary');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete beneficiary';
      setError(errorMessage);
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, loadData]);

  const assign = useCallback(async (beneficiaryId: string, wheelchairId: string, assignedBy?: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await assignWheelchair(beneficiaryId, wheelchairId, assignedBy);
      
      if (result.success) {
        toast({
          title: 'نجح',
          description: 'تم إسناد الكرسي المتحرك بنجاح',
        });
        await loadData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to assign wheelchair');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign wheelchair';
      setError(errorMessage);
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, loadData]);

  const deliver = useCallback(async (beneficiaryId: string, deliveryDate: string, deliveryLocation: string, ceremonyDate?: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await deliverWheelchair(beneficiaryId, deliveryDate, deliveryLocation, ceremonyDate);
      
      if (result.success) {
        toast({
          title: 'نجح',
          description: 'تم تسجيل تسليم الكرسي المتحرك بنجاح',
        });
        await loadData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to deliver wheelchair');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deliver wheelchair';
      setError(errorMessage);
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, loadData]);

  const followUp = useCallback(async (beneficiaryId: string, followUpDate: string, followUpNotes: string, satisfactionRating?: number, feedback?: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await addFollowUp(beneficiaryId, followUpDate, followUpNotes, satisfactionRating, feedback);
      
      if (result.success) {
        toast({
          title: 'نجح',
          description: 'تم إضافة متابعة بنجاح',
        });
        await loadData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to add follow-up');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add follow-up';
      setError(errorMessage);
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, loadData]);

  return {
    beneficiaries,
    stats,
    loading,
    error,
    create,
    update,
    remove,
    assign,
    deliver,
    followUp,
    refresh: loadData,
  };
};
