import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { 
  Armchair as WheelchairIcon, 
  Users, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Wrench,
  Package,
  Heart,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  createWheelchair, 
  getWheelchairs, 
  updateWheelchair, 
  deleteWheelchair, 
  getWheelchairStats,
  type WheelchairData 
} from "@/api/wheelchairs";
import { 
  createBeneficiary, 
  getBeneficiaries, 
  updateBeneficiary, 
  deleteBeneficiary, 
  assignWheelchair,
  deliverWheelchair,
  addFollowUp,
  getBeneficiaryStats,
  type BeneficiaryData 
} from "@/api/beneficiaries";
import { Wheelchair, Beneficiary } from "@/lib/mockDatabase";

const Wheelchairs = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [wheelchairs, setWheelchairs] = useState<Wheelchair[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [wheelchairStats, setWheelchairStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    maintenance: 0,
    retired: 0,
  });
  const [beneficiaryStats, setBeneficiaryStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    delivered: 0,
    followUp: 0,
  });
  const [loading, setLoading] = useState(true);
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

  // Form states
  const [wheelchairForm, setWheelchairForm] = useState<Partial<WheelchairData>>({
    type: 'STANDARD',
    condition: 'EXCELLENT',
    source: 'DONATION',
  });
  const [beneficiaryForm, setBeneficiaryForm] = useState<Partial<BeneficiaryData>>({});
  const [assignForm, setAssignForm] = useState({ wheelchairId: "" });
  const [deliverForm, setDeliverForm] = useState({ 
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryLocation: "",
    ceremonyDate: ""
  });
  const [followUpForm, setFollowUpForm] = useState({
    followUpDate: new Date().toISOString().split('T')[0],
    followUpNotes: "",
    satisfactionRating: 5,
    feedback: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [wheelchairsRes, beneficiariesRes, wheelchairStatsRes, beneficiaryStatsRes] = await Promise.all([
        getWheelchairs(1, 100),
        getBeneficiaries(1, 100),
        getWheelchairStats(),
        getBeneficiaryStats(),
      ]);

      if (wheelchairsRes.success) {
        setWheelchairs(wheelchairsRes.wheelchairs || []);
      }
      if (beneficiariesRes.success) {
        setBeneficiaries(beneficiariesRes.beneficiaries || []);
      }
      if (wheelchairStatsRes.success) {
        setWheelchairStats(wheelchairStatsRes.data || wheelchairStats);
      }
      if (beneficiaryStatsRes.success) {
        setBeneficiaryStats(beneficiaryStatsRes.data || beneficiaryStats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWheelchair = async () => {
    try {
      const result = await createWheelchair(wheelchairForm as WheelchairData);
      if (result.success) {
        toast({
          title: "نجح",
          description: "تم إضافة الكرسي المتحرك بنجاح",
        });
        setIsWheelchairDialogOpen(false);
        resetWheelchairForm();
        loadData();
      } else {
        toast({
          title: "خطأ",
          description: result.error || "فشل في إضافة الكرسي المتحرك",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الكرسي المتحرك",
        variant: "destructive",
      });
    }
  };

  const handleUpdateWheelchair = async () => {
    if (!editingWheelchair) return;
    try {
      const result = await updateWheelchair(editingWheelchair.id, wheelchairForm);
      if (result.success) {
        toast({
          title: "نجح",
          description: "تم تحديث الكرسي المتحرك بنجاح",
        });
        setIsWheelchairDialogOpen(false);
        setEditingWheelchair(null);
        resetWheelchairForm();
        loadData();
      } else {
        toast({
          title: "خطأ",
          description: result.error || "فشل في تحديث الكرسي المتحرك",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الكرسي المتحرك",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWheelchair = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكرسي المتحرك؟")) return;
    try {
      const result = await deleteWheelchair(id);
      if (result.success) {
        toast({
          title: "نجح",
          description: "تم حذف الكرسي المتحرك بنجاح",
        });
        loadData();
      } else {
        toast({
          title: "خطأ",
          description: result.error || "فشل في حذف الكرسي المتحرك",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الكرسي المتحرك",
        variant: "destructive",
      });
    }
  };

  const handleCreateBeneficiary = async () => {
    try {
      const result = await createBeneficiary(beneficiaryForm as BeneficiaryData);
      if (result.success) {
        toast({
          title: "نجح",
          description: "تم إضافة المستفيد بنجاح",
        });
        setIsBeneficiaryDialogOpen(false);
        resetBeneficiaryForm();
        loadData();
      } else {
        toast({
          title: "خطأ",
          description: result.error || "فشل في إضافة المستفيد",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المستفيد",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBeneficiary = async () => {
    if (!editingBeneficiary) return;
    try {
      const result = await updateBeneficiary(editingBeneficiary.id, beneficiaryForm);
      if (result.success) {
        toast({
          title: "نجح",
          description: "تم تحديث المستفيد بنجاح",
        });
        setIsBeneficiaryDialogOpen(false);
        setEditingBeneficiary(null);
        resetBeneficiaryForm();
        loadData();
      } else {
        toast({
          title: "خطأ",
          description: result.error || "فشل في تحديث المستفيد",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المستفيد",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBeneficiary = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستفيد؟")) return;
    try {
      const result = await deleteBeneficiary(id);
      if (result.success) {
        toast({
          title: "نجح",
          description: "تم حذف المستفيد بنجاح",
        });
        loadData();
      } else {
        toast({
          title: "خطأ",
          description: result.error || "فشل في حذف المستفيد",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المستفيد",
        variant: "destructive",
      });
    }
  };

  const handleAssignWheelchair = async () => {
    if (!selectedBeneficiary || !assignForm.wheelchairId) return;
    try {
      const result = await assignWheelchair(selectedBeneficiary.id, assignForm.wheelchairId);
      if (result.success) {
        toast({
          title: "نجح",
          description: "تم إسناد الكرسي المتحرك بنجاح",
        });
        setIsAssignDialogOpen(false);
        setSelectedBeneficiary(null);
        setAssignForm({ wheelchairId: "" });
        loadData();
      } else {
        toast({
          title: "خطأ",
          description: result.error || "فشل في إسناد الكرسي المتحرك",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إسناد الكرسي المتحرك",
        variant: "destructive",
      });
    }
  };

  const handleDeliverWheelchair = async () => {
    if (!selectedBeneficiary) return;
    try {
      const result = await deliverWheelchair(
        selectedBeneficiary.id,
        deliverForm.deliveryDate,
        deliverForm.deliveryLocation,
        deliverForm.ceremonyDate || undefined
      );
      if (result.success) {
        toast({
          title: "نجح",
          description: "تم تسجيل تسليم الكرسي المتحرك بنجاح",
        });
        setIsDeliverDialogOpen(false);
        setSelectedBeneficiary(null);
        setDeliverForm({ 
          deliveryDate: new Date().toISOString().split('T')[0],
          deliveryLocation: "",
          ceremonyDate: ""
        });
        loadData();
      } else {
        toast({
          title: "خطأ",
          description: result.error || "فشل في تسجيل التسليم",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل التسليم",
        variant: "destructive",
      });
    }
  };

  const handleAddFollowUp = async () => {
    if (!selectedBeneficiary) return;
    try {
      const result = await addFollowUp(
        selectedBeneficiary.id,
        followUpForm.followUpDate,
        followUpForm.followUpNotes,
        followUpForm.satisfactionRating,
        followUpForm.feedback
      );
      if (result.success) {
        toast({
          title: "نجح",
          description: "تم إضافة متابعة بنجاح",
        });
        setIsFollowUpDialogOpen(false);
        setSelectedBeneficiary(null);
        setFollowUpForm({
          followUpDate: new Date().toISOString().split('T')[0],
          followUpNotes: "",
          satisfactionRating: 5,
          feedback: ""
        });
        loadData();
      } else {
        toast({
          title: "خطأ",
          description: result.error || "فشل في إضافة المتابعة",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المتابعة",
        variant: "destructive",
      });
    }
  };

  const resetWheelchairForm = () => {
    setWheelchairForm({
      type: 'STANDARD',
      condition: 'EXCELLENT',
      source: 'DONATION',
    });
  };

  const resetBeneficiaryForm = () => {
    setBeneficiaryForm({});
  };

  const openWheelchairDialog = (wheelchair?: Wheelchair) => {
    if (wheelchair) {
      setEditingWheelchair(wheelchair);
      setWheelchairForm({
        serialNumber: wheelchair.serialNumber,
        brand: wheelchair.brand,
        model: wheelchair.model,
        type: wheelchair.type,
        condition: wheelchair.condition,
        source: wheelchair.source,
        donorName: wheelchair.donorName,
        donorContact: wheelchair.donorContact,
        purchaseDate: wheelchair.purchaseDate?.split('T')[0],
        receivedDate: wheelchair.receivedDate?.split('T')[0],
        cost: wheelchair.cost,
        maintenanceNotes: wheelchair.maintenanceNotes,
        notes: wheelchair.notes,
      });
    } else {
      setEditingWheelchair(null);
      resetWheelchairForm();
    }
    setIsWheelchairDialogOpen(true);
  };

  const openBeneficiaryDialog = (beneficiary?: Beneficiary) => {
    if (beneficiary) {
      setEditingBeneficiary(beneficiary);
      setBeneficiaryForm({
        firstName: beneficiary.firstName,
        lastName: beneficiary.lastName,
        dateOfBirth: beneficiary.dateOfBirth?.split('T')[0],
        gender: beneficiary.gender,
        phone: beneficiary.phone,
        email: beneficiary.email,
        address: beneficiary.address,
        city: beneficiary.city,
        postalCode: beneficiary.postalCode,
        disabilityType: beneficiary.disabilityType,
        disabilityLevel: beneficiary.disabilityLevel,
        medicalNotes: beneficiary.medicalNotes,
        needsAssessment: beneficiary.needsAssessment,
      });
    } else {
      setEditingBeneficiary(null);
      resetBeneficiaryForm();
    }
    setIsBeneficiaryDialogOpen(true);
  };

  const getWheelchairStatusInfo = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return { color: 'bg-green-100 text-green-800', label: 'متاح' };
      case 'ASSIGNED':
        return { color: 'bg-blue-100 text-blue-800', label: 'مُسند' };
      case 'MAINTENANCE':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'صيانة' };
      case 'RETIRED':
        return { color: 'bg-gray-100 text-gray-800', label: 'متقاعد' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'غير معروف' };
    }
  };

  const getBeneficiaryStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'في الانتظار' };
      case 'APPROVED':
        return { color: 'bg-blue-100 text-blue-800', label: 'موافق عليه' };
      case 'DELIVERED':
        return { color: 'bg-green-100 text-green-800', label: 'تم التسليم' };
      case 'FOLLOW_UP':
        return { color: 'bg-purple-100 text-purple-800', label: 'متابعة' };
      case 'REJECTED':
        return { color: 'bg-red-100 text-red-800', label: 'مرفوض' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'غير معروف' };
    }
  };

  const filteredWheelchairs = wheelchairs.filter(w => {
    const matchesSearch = !searchTerm || 
      w.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesSearch = !searchTerm || 
      b.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone?.includes(searchTerm) ||
      b.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableWheelchairs = wheelchairs.filter(w => w.status === 'AVAILABLE');

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
              <Button onClick={() => openWheelchairDialog()}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة كرسي متحرك
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>قائمة الكراسي المتحركة</CardTitle>
              </CardHeader>
              <CardContent>
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
                      filteredWheelchairs.map((wheelchair) => {
                        const statusInfo = getWheelchairStatusInfo(wheelchair.status);
                        return (
                          <TableRow key={wheelchair.id}>
                            <TableCell>{wheelchair.serialNumber || 'غير محدد'}</TableCell>
                            <TableCell>{wheelchair.type}</TableCell>
                            <TableCell>{wheelchair.source}</TableCell>
                            <TableCell>
                              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(wheelchair.receivedDate).toLocaleDateString('ar-MA')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openWheelchairDialog(wheelchair)}
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
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          لا توجد كراسي متحركة
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
              <Button onClick={() => openBeneficiaryDialog()}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة مستفيد
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>قائمة المستفيدين</CardTitle>
              </CardHeader>
              <CardContent>
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
                      filteredBeneficiaries.map((beneficiary) => {
                        const statusInfo = getBeneficiaryStatusInfo(beneficiary.status);
                        return (
                          <TableRow key={beneficiary.id}>
                            <TableCell>{beneficiary.firstName} {beneficiary.lastName}</TableCell>
                            <TableCell>{beneficiary.phone || 'غير محدد'}</TableCell>
                            <TableCell>{beneficiary.disabilityType || 'غير محدد'}</TableCell>
                            <TableCell>
                              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(beneficiary.applicationDate).toLocaleDateString('ar-MA')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openBeneficiaryDialog(beneficiary)}
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
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          لا يوجد مستفيدون
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
                    {beneficiaries.filter(b => b.status === 'APPROVED' || b.status === 'PENDING').map((beneficiary) => (
                      <TableRow key={beneficiary.id}>
                        <TableCell>{beneficiary.firstName} {beneficiary.lastName}</TableCell>
                        <TableCell>
                          <Badge className={getBeneficiaryStatusInfo(beneficiary.status).color}>
                            {getBeneficiaryStatusInfo(beneficiary.status).label}
                          </Badge>
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
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Wheelchair Dialog */}
        <Dialog open={isWheelchairDialogOpen} onOpenChange={setIsWheelchairDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingWheelchair ? 'تعديل كرسي متحرك' : 'إضافة كرسي متحرك جديد'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الرقم التسلسلي</Label>
                  <Input
                    value={wheelchairForm.serialNumber || ''}
                    onChange={(e) => setWheelchairForm({ ...wheelchairForm, serialNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label>العلامة التجارية</Label>
                  <Input
                    value={wheelchairForm.brand || ''}
                    onChange={(e) => setWheelchairForm({ ...wheelchairForm, brand: e.target.value })}
                  />
                </div>
                <div>
                  <Label>النوع</Label>
                  <Select
                    value={wheelchairForm.type}
                    onValueChange={(value) => setWheelchairForm({ ...wheelchairForm, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANUAL">يدوي</SelectItem>
                      <SelectItem value="ELECTRIC">كهربائي</SelectItem>
                      <SelectItem value="SPORTS">رياضي</SelectItem>
                      <SelectItem value="STANDARD">قياسي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الحالة</Label>
                  <Select
                    value={wheelchairForm.condition}
                    onValueChange={(value) => setWheelchairForm({ ...wheelchairForm, condition: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXCELLENT">ممتاز</SelectItem>
                      <SelectItem value="GOOD">جيد</SelectItem>
                      <SelectItem value="FAIR">متوسط</SelectItem>
                      <SelectItem value="NEEDS_REPAIR">يحتاج إصلاح</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>المصدر</Label>
                  <Select
                    value={wheelchairForm.source}
                    onValueChange={(value) => setWheelchairForm({ ...wheelchairForm, source: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PURCHASE">شراء</SelectItem>
                      <SelectItem value="DONATION">تبرع</SelectItem>
                      <SelectItem value="PARTNER">شريك</SelectItem>
                      <SelectItem value="GOVERNMENT">حكومي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>اسم المتبرع</Label>
                  <Input
                    value={wheelchairForm.donorName || ''}
                    onChange={(e) => setWheelchairForm({ ...wheelchairForm, donorName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>جهة اتصال المتبرع</Label>
                  <Input
                    value={wheelchairForm.donorContact || ''}
                    onChange={(e) => setWheelchairForm({ ...wheelchairForm, donorContact: e.target.value })}
                  />
                </div>
                <div>
                  <Label>تاريخ الاستلام</Label>
                  <Input
                    type="date"
                    value={wheelchairForm.receivedDate?.split('T')[0] || ''}
                    onChange={(e) => setWheelchairForm({ ...wheelchairForm, receivedDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>التكلفة (درهم)</Label>
                  <Input
                    type="number"
                    value={wheelchairForm.cost || ''}
                    onChange={(e) => setWheelchairForm({ ...wheelchairForm, cost: parseFloat(e.target.value) || undefined })}
                  />
                </div>
              </div>
              <div>
                <Label>ملاحظات</Label>
                <Textarea
                  value={wheelchairForm.notes || ''}
                  onChange={(e) => setWheelchairForm({ ...wheelchairForm, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsWheelchairDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={editingWheelchair ? handleUpdateWheelchair : handleCreateWheelchair}>
                  {editingWheelchair ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Beneficiary Dialog */}
        <Dialog open={isBeneficiaryDialogOpen} onOpenChange={setIsBeneficiaryDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBeneficiary ? 'تعديل مستفيد' : 'إضافة مستفيد جديد'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الاسم</Label>
                  <Input
                    value={beneficiaryForm.firstName || ''}
                    onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>اللقب</Label>
                  <Input
                    value={beneficiaryForm.lastName || ''}
                    onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, lastName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>تاريخ الميلاد</Label>
                  <Input
                    type="date"
                    value={beneficiaryForm.dateOfBirth || ''}
                    onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <Label>الجنس</Label>
                  <Select
                    value={beneficiaryForm.gender}
                    onValueChange={(value) => setBeneficiaryForm({ ...beneficiaryForm, gender: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">ذكر</SelectItem>
                      <SelectItem value="FEMALE">أنثى</SelectItem>
                      <SelectItem value="OTHER">آخر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الهاتف</Label>
                  <Input
                    value={beneficiaryForm.phone || ''}
                    onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    value={beneficiaryForm.email || ''}
                    onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>العنوان</Label>
                  <Input
                    value={beneficiaryForm.address || ''}
                    onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label>المدينة</Label>
                  <Input
                    value={beneficiaryForm.city || ''}
                    onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label>نوع الإعاقة</Label>
                  <Input
                    value={beneficiaryForm.disabilityType || ''}
                    onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, disabilityType: e.target.value })}
                  />
                </div>
                <div>
                  <Label>مستوى الإعاقة</Label>
                  <Input
                    value={beneficiaryForm.disabilityLevel || ''}
                    onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, disabilityLevel: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>ملاحظات طبية</Label>
                <Textarea
                  value={beneficiaryForm.medicalNotes || ''}
                  onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, medicalNotes: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>تقييم الاحتياجات</Label>
                <Textarea
                  value={beneficiaryForm.needsAssessment || ''}
                  onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, needsAssessment: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsBeneficiaryDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={editingBeneficiary ? handleUpdateBeneficiary : handleCreateBeneficiary}>
                  {editingBeneficiary ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign Wheelchair Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إسناد كرسي متحرك</DialogTitle>
              <DialogDescription>
                إسناد كرسي متحرك إلى {selectedBeneficiary?.firstName} {selectedBeneficiary?.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>اختر كرسي متحرك</Label>
                <Select
                  value={assignForm.wheelchairId}
                  onValueChange={(value) => setAssignForm({ wheelchairId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر كرسي متحرك" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWheelchairs.map((wc) => (
                      <SelectItem key={wc.id} value={wc.id}>
                        {wc.serialNumber || wc.brand || 'كرسي متحرك'} - {wc.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAssignWheelchair}>
                  إسناد
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Deliver Wheelchair Dialog */}
        <Dialog open={isDeliverDialogOpen} onOpenChange={setIsDeliverDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تسجيل تسليم الكرسي المتحرك</DialogTitle>
              <DialogDescription>
                تسجيل تسليم الكرسي المتحرك إلى {selectedBeneficiary?.firstName} {selectedBeneficiary?.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>تاريخ التسليم</Label>
                <Input
                  type="date"
                  value={deliverForm.deliveryDate}
                  onChange={(e) => setDeliverForm({ ...deliverForm, deliveryDate: e.target.value })}
                />
              </div>
              <div>
                <Label>مكان التسليم</Label>
                <Input
                  value={deliverForm.deliveryLocation}
                  onChange={(e) => setDeliverForm({ ...deliverForm, deliveryLocation: e.target.value })}
                />
              </div>
              <div>
                <Label>تاريخ الحفل الرمزي (اختياري)</Label>
                <Input
                  type="date"
                  value={deliverForm.ceremonyDate}
                  onChange={(e) => setDeliverForm({ ...deliverForm, ceremonyDate: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeliverDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleDeliverWheelchair}>
                  تسجيل التسليم
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Follow-up Dialog */}
        <Dialog open={isFollowUpDialogOpen} onOpenChange={setIsFollowUpDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة متابعة</DialogTitle>
              <DialogDescription>
                متابعة حالة {selectedBeneficiary?.firstName} {selectedBeneficiary?.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>تاريخ المتابعة</Label>
                <Input
                  type="date"
                  value={followUpForm.followUpDate}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, followUpDate: e.target.value })}
                />
              </div>
              <div>
                <Label>ملاحظات المتابعة</Label>
                <Textarea
                  value={followUpForm.followUpNotes}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, followUpNotes: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>تقييم الرضا (1-5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={followUpForm.satisfactionRating}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, satisfactionRating: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>ملاحظات المستفيد</Label>
                <Textarea
                  value={followUpForm.feedback}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, feedback: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsFollowUpDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddFollowUp}>
                  إضافة متابعة
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Wheelchairs;
