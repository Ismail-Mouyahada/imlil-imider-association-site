// Mock database pour le développement côté client
// En production, ceci sera remplacé par des appels API vers le backend

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  response?: string;
  respondedAt?: string;
  respondedBy?: string;
}

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  paymentMethod: 'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'ONLINE' | 'OTHER';
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  bankReference?: string;
  notes?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  processedBy?: string;
  receiptSent: boolean;
  receiptSentAt?: string;
}

export interface DonationGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  iban?: string;
  swift?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wheelchair {
  id: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  type: 'MANUAL' | 'ELECTRIC' | 'SPORTS' | 'STANDARD';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_REPAIR';
  source: 'PURCHASE' | 'DONATION' | 'PARTNER' | 'GOVERNMENT';
  donorName?: string;
  donorContact?: string;
  purchaseDate?: string;
  receivedDate: string;
  cost?: number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'RETIRED';
  assignedTo?: string;
  assignedAt?: string;
  assignedBy?: string;
  maintenanceNotes?: string;
  lastMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Beneficiary {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  disabilityType?: string;
  disabilityLevel?: string;
  medicalNotes?: string;
  needsAssessment?: string;
  applicationDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELIVERED' | 'FOLLOW_UP';
  approvedAt?: string;
  approvedBy?: string;
  wheelchairId?: string;
  deliveryDate?: string;
  deliveryLocation?: string;
  ceremonyDate?: string;
  followUpDate?: string;
  followUpNotes?: string;
  satisfactionRating?: number;
  feedback?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class MockDatabase {
  private contacts: Contact[] = [];
  private donations: Donation[] = [];
  private donationGoals: DonationGoal[] = [];
  private bankAccounts: BankAccount[] = [];
  private wheelchairs: Wheelchair[] = [];
  private beneficiaries: Beneficiary[] = [];

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultData();
  }

  private loadFromStorage() {
    try {
      const contacts = localStorage.getItem('mock_contacts');
      if (contacts) this.contacts = JSON.parse(contacts);

      const donations = localStorage.getItem('mock_donations');
      if (donations) this.donations = JSON.parse(donations);

      const goals = localStorage.getItem('mock_donation_goals');
      if (goals) this.donationGoals = JSON.parse(goals);

      const accounts = localStorage.getItem('mock_bank_accounts');
      if (accounts) this.bankAccounts = JSON.parse(accounts);

      const wheelchairs = localStorage.getItem('mock_wheelchairs');
      if (wheelchairs) this.wheelchairs = JSON.parse(wheelchairs);

      const beneficiaries = localStorage.getItem('mock_beneficiaries');
      if (beneficiaries) this.beneficiaries = JSON.parse(beneficiaries);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('mock_contacts', JSON.stringify(this.contacts));
      localStorage.setItem('mock_donations', JSON.stringify(this.donations));
      localStorage.setItem('mock_donation_goals', JSON.stringify(this.donationGoals));
      localStorage.setItem('mock_bank_accounts', JSON.stringify(this.bankAccounts));
      localStorage.setItem('mock_wheelchairs', JSON.stringify(this.wheelchairs));
      localStorage.setItem('mock_beneficiaries', JSON.stringify(this.beneficiaries));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private initializeDefaultData() {
    if (this.bankAccounts.length === 0) {
      this.bankAccounts = [
        {
          id: 'bank_1',
          bankName: 'Banque Populaire',
          accountNumber: '12345678901234567890',
          accountHolder: 'جمعية إمليل للتنمية والتعاون',
          iban: 'MA64 123 12345678901234567890',
          swift: 'BPMAMAMC',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      this.saveToStorage();
    }

    if (this.donationGoals.length === 0) {
      this.donationGoals = [
        {
          id: 'goal_1',
          title: 'مشروع الماء الصالح للشرب',
          description: 'توفير الماء الصالح للشرب لجميع سكان الدوار',
          targetAmount: 200000,
          currentAmount: 125000,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      this.saveToStorage();
    }
  }

  // Contacts
  async createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    const contact: Contact = {
      ...data,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.contacts.push(contact);
    this.saveToStorage();
    return contact;
  }

  async getContacts(page = 1, limit = 10): Promise<{ contacts: Contact[]; total: number }> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const contacts = this.contacts.slice(start, end);
    return { contacts, total: this.contacts.length };
  }

  async updateContactStatus(id: string, status: Contact['status'], response?: string): Promise<Contact | null> {
    const contact = this.contacts.find(c => c.id === id);
    if (contact) {
      contact.status = status;
      contact.response = response;
      contact.respondedAt = new Date().toISOString();
      contact.updatedAt = new Date().toISOString();
      this.saveToStorage();
      return contact;
    }
    return null;
  }

  async deleteContact(id: string): Promise<boolean> {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contacts.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Donations
  async createDonation(data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Donation> {
    const donation: Donation = {
      ...data,
      id: `DON-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.donations.push(donation);
    this.saveToStorage();
    return donation;
  }

  async getDonations(page = 1, limit = 10): Promise<{ donations: Donation[]; total: number }> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const donations = this.donations.slice(start, end);
    return { donations, total: this.donations.length };
  }

  async getDonationById(id: string): Promise<Donation | null> {
    return this.donations.find(d => d.id === id) || null;
  }

  async updateDonationStatus(id: string, status: Donation['status'], transactionId?: string): Promise<Donation | null> {
    const donation = this.donations.find(d => d.id === id);
    if (donation) {
      donation.status = status;
      donation.transactionId = transactionId;
      donation.processedAt = new Date().toISOString();
      donation.updatedAt = new Date().toISOString();
      this.saveToStorage();
      return donation;
    }
    return null;
  }

  async deleteDonation(id: string): Promise<boolean> {
    const index = this.donations.findIndex(d => d.id === id);
    if (index !== -1) {
      this.donations.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  async getDonationStats(): Promise<{
    totalDonations: number;
    totalAmount: number;
    confirmedDonations: number;
    pendingDonations: number;
    averageDonation: number;
  }> {
    const totalDonations = this.donations.length;
    const totalAmount = this.donations.reduce((sum, d) => sum + d.amount, 0);
    const confirmedDonations = this.donations.filter(d => d.status === 'CONFIRMED').length;
    const pendingDonations = this.donations.filter(d => d.status === 'PENDING').length;
    const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

    return {
      totalDonations,
      totalAmount,
      confirmedDonations,
      pendingDonations,
      averageDonation,
    };
  }

  // Donation Goals
  async getDonationGoals(): Promise<DonationGoal[]> {
    return this.donationGoals;
  }

  // Bank Accounts
  async getBankAccounts(): Promise<BankAccount[]> {
    return this.bankAccounts;
  }

  // Wheelchairs
  async createWheelchair(data: Omit<Wheelchair, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wheelchair> {
    const wheelchair: Wheelchair = {
      ...data,
      id: `WC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.wheelchairs.push(wheelchair);
    this.saveToStorage();
    return wheelchair;
  }

  async getWheelchairs(page = 1, limit = 10, status?: Wheelchair['status']): Promise<{ wheelchairs: Wheelchair[]; total: number }> {
    let filtered = this.wheelchairs;
    if (status) {
      filtered = this.wheelchairs.filter(w => w.status === status);
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    const wheelchairs = filtered.slice(start, end);
    return { wheelchairs, total: filtered.length };
  }

  async getWheelchairById(id: string): Promise<Wheelchair | null> {
    return this.wheelchairs.find(w => w.id === id) || null;
  }

  async updateWheelchair(id: string, data: Partial<Wheelchair>): Promise<Wheelchair | null> {
    const wheelchair = this.wheelchairs.find(w => w.id === id);
    if (wheelchair) {
      Object.assign(wheelchair, { ...data, updatedAt: new Date().toISOString() });
      this.saveToStorage();
      return wheelchair;
    }
    return null;
  }

  async deleteWheelchair(id: string): Promise<boolean> {
    const index = this.wheelchairs.findIndex(w => w.id === id);
    if (index !== -1) {
      this.wheelchairs.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  async getWheelchairStats(): Promise<{
    total: number;
    available: number;
    assigned: number;
    maintenance: number;
    retired: number;
  }> {
    return {
      total: this.wheelchairs.length,
      available: this.wheelchairs.filter(w => w.status === 'AVAILABLE').length,
      assigned: this.wheelchairs.filter(w => w.status === 'ASSIGNED').length,
      maintenance: this.wheelchairs.filter(w => w.status === 'MAINTENANCE').length,
      retired: this.wheelchairs.filter(w => w.status === 'RETIRED').length,
    };
  }

  // Beneficiaries
  async createBeneficiary(data: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Beneficiary> {
    const beneficiary: Beneficiary = {
      ...data,
      id: `BEN-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.beneficiaries.push(beneficiary);
    this.saveToStorage();
    return beneficiary;
  }

  async getBeneficiaries(page = 1, limit = 10, status?: Beneficiary['status']): Promise<{ beneficiaries: Beneficiary[]; total: number }> {
    let filtered = this.beneficiaries;
    if (status) {
      filtered = this.beneficiaries.filter(b => b.status === status);
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    const beneficiaries = filtered.slice(start, end);
    return { beneficiaries, total: filtered.length };
  }

  async getBeneficiaryById(id: string): Promise<Beneficiary | null> {
    return this.beneficiaries.find(b => b.id === id) || null;
  }

  async updateBeneficiary(id: string, data: Partial<Beneficiary>): Promise<Beneficiary | null> {
    const beneficiary = this.beneficiaries.find(b => b.id === id);
    if (beneficiary) {
      Object.assign(beneficiary, { ...data, updatedAt: new Date().toISOString() });
      this.saveToStorage();
      return beneficiary;
    }
    return null;
  }

  async deleteBeneficiary(id: string): Promise<boolean> {
    const index = this.beneficiaries.findIndex(b => b.id === id);
    if (index !== -1) {
      this.beneficiaries.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  async assignWheelchair(beneficiaryId: string, wheelchairId: string, assignedBy?: string): Promise<{ beneficiary: Beneficiary | null; wheelchair: Wheelchair | null }> {
    const beneficiary = this.beneficiaries.find(b => b.id === beneficiaryId);
    const wheelchair = this.wheelchairs.find(w => w.id === wheelchairId);
    
    if (beneficiary && wheelchair && wheelchair.status === 'AVAILABLE') {
      beneficiary.wheelchairId = wheelchairId;
      beneficiary.status = 'APPROVED';
      beneficiary.approvedAt = new Date().toISOString();
      beneficiary.approvedBy = assignedBy;
      
      wheelchair.assignedTo = beneficiaryId;
      wheelchair.status = 'ASSIGNED';
      wheelchair.assignedAt = new Date().toISOString();
      wheelchair.assignedBy = assignedBy;
      
      this.saveToStorage();
      return { beneficiary, wheelchair };
    }
    
    return { beneficiary: null, wheelchair: null };
  }

  async getBeneficiaryStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    delivered: number;
    followUp: number;
  }> {
    return {
      total: this.beneficiaries.length,
      pending: this.beneficiaries.filter(b => b.status === 'PENDING').length,
      approved: this.beneficiaries.filter(b => b.status === 'APPROVED').length,
      delivered: this.beneficiaries.filter(b => b.status === 'DELIVERED').length,
      followUp: this.beneficiaries.filter(b => b.status === 'FOLLOW_UP').length,
    };
  }
}

export const mockDatabase = new MockDatabase();
