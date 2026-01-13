import { Donation } from '@/lib/mockDatabase';
import { notificationService } from '@/lib/notificationService';

export interface DonationData {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency?: string;
  paymentMethod: string;
  notes?: string;
  isAnonymous?: boolean;
}

export const createDonation = async (data: DonationData) => {
  try {
    const donation: Donation = {
      id: Date.now().toString(),
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      donorPhone: data.donorPhone,
      amount: data.amount,
      currency: data.currency || 'MAD',
      paymentMethod: data.paymentMethod as any,
      notes: data.notes,
      isAnonymous: data.isAnonymous || false,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Sauvegarder dans localStorage
    const existingDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    existingDonations.push(donation);
    localStorage.setItem('donations', JSON.stringify(existingDonations));
    
    // Créer une notification pour le nouveau don
    notificationService.onDonationReceived(donation);
    
    return { success: true, data: donation };
  } catch (error) {
    console.error('Error creating donation:', error);
    return { success: false, error: 'Failed to create donation' };
  }
};

export const getDonations = async (page = 1, limit = 10) => {
  try {
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const donations = allDonations.slice(startIndex, endIndex);
    const total = allDonations.length;

    return {
      success: true,
      donations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching donations:', error);
    return { success: false, error: 'Failed to fetch donations' };
  }
};

export const getDonationById = async (id: string) => {
  try {
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const donation = allDonations.find((d: Donation) => d.id === id);

    if (!donation) {
      return { success: false, error: 'Donation not found' };
    }

    return { success: true, data: donation };
  } catch (error) {
    console.error('Error fetching donation:', error);
    return { success: false, error: 'Failed to fetch donation' };
  }
};

export const updateDonationStatus = async (id: string, status: string, transactionId?: string) => {
  try {
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const donationIndex = allDonations.findIndex((d: Donation) => d.id === id);
    
    if (donationIndex === -1) {
      return { success: false, error: 'Donation not found' };
    }
    
    allDonations[donationIndex] = {
      ...allDonations[donationIndex],
      status: status as any,
      transactionId,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('donations', JSON.stringify(allDonations));
    
    return { success: true, data: allDonations[donationIndex] };
  } catch (error) {
    console.error('Error updating donation:', error);
    return { success: false, error: 'Failed to update donation' };
  }
};

export const getDonationStats = async () => {
  try {
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    
    const stats = {
      total: allDonations.length,
      totalAmount: allDonations.reduce((sum: number, d: Donation) => sum + d.amount, 0),
      pending: allDonations.filter((d: Donation) => d.status === 'PENDING').length,
      confirmed: allDonations.filter((d: Donation) => d.status === 'CONFIRMED').length,
      processed: allDonations.filter((d: Donation) => d.status === 'PROCESSED').length,
      failed: allDonations.filter((d: Donation) => d.status === 'FAILED').length,
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    return { success: false, error: 'Failed to fetch donation stats' };
  }
};

export const deleteDonation = async (id: string) => {
  try {
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const filteredDonations = allDonations.filter((d: Donation) => d.id !== id);
    localStorage.setItem('donations', JSON.stringify(filteredDonations));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting donation:', error);
    return { success: false, error: 'Failed to delete donation' };
  }
};
