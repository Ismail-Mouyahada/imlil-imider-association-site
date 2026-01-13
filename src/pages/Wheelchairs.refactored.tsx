import { useState, useMemo } from 'react';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Armchair as WheelchairIcon, 
  Users, 
  Plus,
  Edit,
  Trash2,
  Package,
  Search,
  Clock,
  UserCheck,
} from "lucide-react";
import { useWheelchairs } from "@/hooks/useWheelchairs";
import { useBeneficiaries } from "@/hooks/useBeneficiaries";
import { getWheelchairStatusInfo, getBeneficiaryStatusInfo, StatusBadge } from "@/lib/utils/statusHelpers";
import WheelchairForm from "@/components/WheelchairForm";
import BeneficiaryForm from "@/components/BeneficiaryForm";
import { AssignDialog, DeliverDialog, FollowUpDialog } from "@/components/WheelchairAssignmentDialogs";
import { Wheelchair, Beneficiary } from "@/lib/mockDatabase";
import { useAuth } from "@/contexts/AuthContext";

const Wheelchairs = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Dialog states
  const [isWheelchairDialogOpen, setIsWheelchairDialogOpen] = useState(false);
  const [isBeneficiaryDialogOpen, setIsBeneficiaryDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDeliverDialogOpen, setIsDeliverDialogOpen] = useState(false);
  const [isFollowUpDialogOpen, setIsFollowUpDialogOpen] = useState(false);
  const [editingWheelchair, setEditingWheelchair] = useState<Wheelchair | null>(null);
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  // Use custom hooks (DRY principle)
  const { 
    wheelchairs, 
    stats: wheelchairStats, 
    loading: wheelchairsLoading,
    create: createWheelchair,
    update: updateWheelchair,
    remove: deleteWheelchair,
  } = useWheelchairs();

  const { 
    beneficiaries, 
    stats: beneficiaryStats, 
    loading: beneficiariesLoading,
    create: createBeneficiary,
    update: updateBeneficiary,
    remove: deleteBeneficiary,
    assign: assignWheelchair,
    deliver: deliverWheelchair,
    followUp: addFollowUp,
  } = useBeneficiaries();

  // Memoized filtered data (performance optimization)
  const filteredWheelchairs = useMemo(() => {
    return wheelchairs.filter(w => {
      const matchesSearch = !searchTerm || 
        w.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.model?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || w.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [wheelchairs, searchTerm, statusFilter]);

  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => {
      const matchesSearch = !searchTerm || 
        b.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone?.includes(searchTerm) ||
        b.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [beneficiaries, searchTerm, statusFilter]);

  const availableWheelchairs = useMemo(() => {
    return wheelchairs.filter(w => w.status === 'AVAILABLE');
  }, [wheelchairs]);

  const eligibleBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => b.status === 'APPROVED' || b.status === 'PENDING');
  }, [beneficiaries]);

  // Handlers
  const handleOpenWheelchairDialog = (wheelchair?: Wheelchair) => {
    setEditingWheelchair(wheelchair || null);
    setIsWheelchairDialogOpen(true);
  };

  const handleOpenBeneficiaryDialog = (beneficiary?: Beneficiary) => {
    setEditingBeneficiary(beneficiary || null);
    setIsBeneficiaryDialogOpen(true);
  };

  const handleWheelchairSubmit = async (data: any) => {
    if (editingWheelchair) {
      return await updateWheelchair(editingWheelchair.id, data);
    } else {
      return await createWheelchair(data);
    }
  };

  const handleBeneficiarySubmit = async (data: any) => {
    if (editingBeneficiary) {
      return await updateBeneficiary(editingBeneficiary.id, data);
    } else {
      return await createBeneficiary(data);
    }
  };

  const handleDeleteWheelchair = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الكرسي المتحرك؟")) {
      await deleteWheelchair(id);
    }
  };

  const handleDeleteBeneficiary = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المستفيد؟")) {
      await deleteBeneficiary(id);
    }
  };

  const handleAssign = async (wheelchairId: string) => {
    if (!selectedBeneficiary) return false;
    return await assignWheelchair(selectedBeneficiary.id, wheelchairId, user?.id);
  };

  const handleDeliver = async (deliveryDate: string, deliveryLocation: string, ceremonyDate?: string) => {
    if (!selectedBeneficiary) return false;
    return await deliverWheelchair(selectedBeneficiary.id, deliveryDate, deliveryLocation, ceremonyDate);
  };

  const handleFollowUp = async (followUpDate: string, followUpNotes: string, satisfactionRating?: number, feedback?: string) => {
    if (!selectedBeneficiary) return false;
    return await addFollowUp(selectedBeneficiary.id, followUpDate, followUpNotes, satisfactionRating, feedback);
  };

  const loading = wheelchairsLoading || beneficiariesLoading;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-gradient">كراسي متحركة</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            دعم الأشخاص في وضعية إعاقة حركية لتحسين تنقلهم واستقلاليتهم اليومية
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <WheelchairIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{wheelchairStats.total}</div>
              <div className="text-sm text-muted-foreground">إجمالي الكراسي</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{wheelchairStats.available}</div>
              <div className="text-sm text-muted-foreground">متاح</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <UserCheck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{wheelchairStats.assigned}</div>
              <div className="text-sm text-muted-foreground">مُسند</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{beneficiaryStats.total}</div>
              <div className="text-sm text-muted-foreground">المستفيدون</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">{beneficiaryStats.pending}</div>
              <div className="text-sm text-muted-foreground">في الانتظار</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="wheelchairs">الكراسي المتحركة</TabsTrigger>
            <TabsTrigger value="beneficiaries">المستفيدون</TabsTrigger>
            <TabsTrigger value="assignments">الإسناد والمتابعة</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات الكراسي المتحركة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي الكراسي</span>
                    <Badge variant="outline">{wheelchairStats.total}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>متاح</span>
                    <Badge className="bg-green-100 text-green-800">{wheelchairStats.available}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>مُسند</span>
                    <Badge className="bg-blue-100 text-blue-800">{wheelchairStats.assigned}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>في الصيانة</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{wheelchairStats.maintenance}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>متقاعد</span>
                    <Badge className="bg-gray-100 text-gray-800">{wheelchairStats.retired}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات المستفيدين</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي المستفيدين</span>
                    <Badge variant="outline">{beneficiaryStats.total}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>في الانتظار</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{beneficiaryStats.pending}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>موافق عليه</span>
                    <Badge className="bg-blue-100 text-blue-800">{beneficiaryStats.approved}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>تم التسليم</span>
                    <Badge className="bg-green-100 text-green-800">{beneficiaryStats.delivered}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>في المتابعة</span>
                    <Badge className="bg-purple-100 text-purple-800">{beneficiaryStats.followUp}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Wheelchairs Tab */}
          <TabsContent value="wheelchairs" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="بحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="فلترة حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="AVAILABLE">متاح</SelectItem>
                    <SelectItem value="ASSIGNED">مُسند</SelectItem>
                    <SelectItem value="MAINTENANCE">صيانة</SelectItem>
                    <SelectItem value="RETIRED">متقاعد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleOpenWheelchairDialog()}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة كرسي متحرك
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>قائمة الكراسي المتحركة</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">جاري التحميل...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الرقم التسلسلي</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>المصدر</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWheelchairs.length > 0 ? (
                        filteredWheelchairs.map((wheelchair) => (
                          <TableRow key={wheelchair.id}>
                            <TableCell>{wheelchair.serialNumber || 'غير محدد'}</TableCell>
                            <TableCell>{wheelchair.type}</TableCell>
                            <TableCell>{wheelchair.source}</TableCell>
                            <TableCell>
                              <StatusBadge status={wheelchair.status} type="wheelchair" />
                            </TableCell>
                            <TableCell>
                              {new Date(wheelchair.receivedDate).toLocaleDateString('ar-MA')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenWheelchairDialog(wheelchair)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteWheelchair(wheelchair.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            لا توجد كراسي متحركة
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Beneficiaries Tab */}
          <TabsContent value="beneficiaries" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="بحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="فلترة حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="PENDING">في الانتظار</SelectItem>
                    <SelectItem value="APPROVED">موافق عليه</SelectItem>
                    <SelectItem value="DELIVERED">تم التسليم</SelectItem>
                    <SelectItem value="FOLLOW_UP">متابعة</SelectItem>
                    <SelectItem value="REJECTED">مرفوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleOpenBeneficiaryDialog()}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة مستفيد
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>قائمة المستفيدين</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">جاري التحميل...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>الهاتف</TableHead>
                        <TableHead>نوع الإعاقة</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ الطلب</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBeneficiaries.length > 0 ? (
                        filteredBeneficiaries.map((beneficiary) => (
                          <TableRow key={beneficiary.id}>
                            <TableCell>{beneficiary.firstName} {beneficiary.lastName}</TableCell>
                            <TableCell>{beneficiary.phone || 'غير محدد'}</TableCell>
                            <TableCell>{beneficiary.disabilityType || 'غير محدد'}</TableCell>
                            <TableCell>
                              <StatusBadge status={beneficiary.status} type="beneficiary" />
                            </TableCell>
                            <TableCell>
                              {new Date(beneficiary.applicationDate).toLocaleDateString('ar-MA')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenBeneficiaryDialog(beneficiary)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            لا يوجد مستفيدون
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المستفيدون المطابقون للمعايير</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">جاري التحميل...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الكرسي المُسند</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eligibleBeneficiaries.length > 0 ? (
                        eligibleBeneficiaries.map((beneficiary) => (
                          <TableRow key={beneficiary.id}>
                            <TableCell>{beneficiary.firstName} {beneficiary.lastName}</TableCell>
                            <TableCell>
                              <StatusBadge status={beneficiary.status} type="beneficiary" />
                            </TableCell>
                            <TableCell>
                              {beneficiary.wheelchairId ? (
                                <Badge className="bg-blue-100 text-blue-800">مُسند</Badge>
                              ) : (
                                <Badge variant="outline">غير مُسند</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {!beneficiary.wheelchairId && availableWheelchairs.length > 0 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedBeneficiary(beneficiary);
                                      setIsAssignDialogOpen(true);
                                    }}
                                  >
                                    إسناد كرسي
                                  </Button>
                                )}
                                {beneficiary.wheelchairId && beneficiary.status !== 'DELIVERED' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedBeneficiary(beneficiary);
                                      setIsDeliverDialogOpen(true);
                                    }}
                                  >
                                    تسجيل التسليم
                                  </Button>
                                )}
                                {beneficiary.status === 'DELIVERED' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedBeneficiary(beneficiary);
                                      setIsFollowUpDialogOpen(true);
                                    }}
                                  >
                                    متابعة
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            لا يوجد مستفيدون مطابقون
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Forms and Dialogs */}
        <WheelchairForm
          open={isWheelchairDialogOpen}
          onOpenChange={setIsWheelchairDialogOpen}
          onSubmit={handleWheelchairSubmit}
          editingWheelchair={editingWheelchair}
          loading={loading}
        />

        <BeneficiaryForm
          open={isBeneficiaryDialogOpen}
          onOpenChange={setIsBeneficiaryDialogOpen}
          onSubmit={handleBeneficiarySubmit}
          editingBeneficiary={editingBeneficiary}
          loading={loading}
        />

        <AssignDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          beneficiary={selectedBeneficiary}
          availableWheelchairs={availableWheelchairs}
          onSubmit={handleAssign}
          loading={loading}
        />

        <DeliverDialog
          open={isDeliverDialogOpen}
          onOpenChange={setIsDeliverDialogOpen}
          beneficiary={selectedBeneficiary}
          onSubmit={handleDeliver}
          loading={loading}
        />

        <FollowUpDialog
          open={isFollowUpDialogOpen}
          onOpenChange={setIsFollowUpDialogOpen}
          beneficiary={selectedBeneficiary}
          onSubmit={handleFollowUp}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Wheelchairs;
