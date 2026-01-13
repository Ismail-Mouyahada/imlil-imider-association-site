import { Badge } from '@/components/ui/badge';

export interface StatusInfo {
  color: string;
  label: string;
}

export const getWheelchairStatusInfo = (status: string): StatusInfo => {
  const statusMap: Record<string, StatusInfo> = {
    AVAILABLE: { color: 'bg-green-100 text-green-800', label: 'متاح' },
    ASSIGNED: { color: 'bg-blue-100 text-blue-800', label: 'مُسند' },
    MAINTENANCE: { color: 'bg-yellow-100 text-yellow-800', label: 'صيانة' },
    RETIRED: { color: 'bg-gray-100 text-gray-800', label: 'متقاعد' },
  };
  return statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: 'غير معروف' };
};

export const getBeneficiaryStatusInfo = (status: string): StatusInfo => {
  const statusMap: Record<string, StatusInfo> = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'في الانتظار' },
    APPROVED: { color: 'bg-blue-100 text-blue-800', label: 'موافق عليه' },
    DELIVERED: { color: 'bg-green-100 text-green-800', label: 'تم التسليم' },
    FOLLOW_UP: { color: 'bg-purple-100 text-purple-800', label: 'متابعة' },
    REJECTED: { color: 'bg-red-100 text-red-800', label: 'مرفوض' },
  };
  return statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: 'غير معروف' };
};

export const StatusBadge = ({ status, type }: { status: string; type: 'wheelchair' | 'beneficiary' }) => {
  const statusInfo = type === 'wheelchair' 
    ? getWheelchairStatusInfo(status)
    : getBeneficiaryStatusInfo(status);
  
  return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
};
