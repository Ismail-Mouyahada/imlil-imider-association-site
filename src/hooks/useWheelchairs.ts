import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  createWheelchair,
  getWheelchairs,
  updateWheelchair,
  deleteWheelchair,
  getWheelchairStats,
  type WheelchairData,
} from '@/api/wheelchairs';
import { Wheelchair } from '@/lib/mockDatabase';

interface UseWheelchairsReturn {
  wheelchairs: Wheelchair[];
  stats: {
    total: number;
    available: number;
    assigned: number;
    maintenance: number;
    retired: number;
  };
  loading: boolean;
  error: string | null;
  create: (data: WheelchairData) => Promise<boolean>;
  update: (id: string, data: Partial<WheelchairData>) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export const useWheelchairs = (): UseWheelchairsReturn => {
  const { toast } = useToast();
  const [wheelchairs, setWheelchairs] = useState<Wheelchair[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    maintenance: 0,
    retired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [wheelchairsRes, statsRes] = await Promise.all([
        getWheelchairs(1, 1000),
        getWheelchairStats(),
      ]);

      if (wheelchairsRes.success) {
        setWheelchairs(wheelchairsRes.wheelchairs || []);
      } else {
        throw new Error(wheelchairsRes.error || 'Failed to load wheelchairs');
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

  const create = useCallback(async (data: WheelchairData): Promise<boolean> => {
    try {
      setError(null);
      const result = await createWheelchair(data);
      
      if (result.success) {
        toast({
          title: 'نجح',
          description: 'تم إضافة الكرسي المتحرك بنجاح',
        });
        await loadData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to create wheelchair');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wheelchair';
      setError(errorMessage);
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, loadData]);

  const update = useCallback(async (id: string, data: Partial<WheelchairData>): Promise<boolean> => {
    try {
      setError(null);
      const result = await updateWheelchair(id, data);
      
      if (result.success) {
        toast({
          title: 'نجح',
          description: 'تم تحديث الكرسي المتحرك بنجاح',
        });
        await loadData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to update wheelchair');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update wheelchair';
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
      const result = await deleteWheelchair(id);
      
      if (result.success) {
        toast({
          title: 'نجح',
          description: 'تم حذف الكرسي المتحرك بنجاح',
        });
        await loadData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete wheelchair');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete wheelchair';
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
    wheelchairs,
    stats,
    loading,
    error,
    create,
    update,
    remove,
    refresh: loadData,
  };
};
