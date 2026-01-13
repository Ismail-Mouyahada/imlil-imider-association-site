import { Contact } from '@/lib/mockDatabase';
import { notificationService } from '@/lib/notificationService';

export interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const createContact = async (data: ContactData) => {
  try {
    const contact: Contact = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Sauvegarder dans localStorage
    const existingContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    existingContacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(existingContacts));
    
    // Créer une notification pour le nouveau contact
    notificationService.onContactMessage(contact);
    
    return { success: true, data: contact };
  } catch (error) {
    console.error('Error creating contact:', error);
    return { success: false, error: 'Failed to create contact' };
  }
};

export const getContacts = async (page = 1, limit = 10) => {
  try {
    const allContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const contacts = allContacts.slice(startIndex, endIndex);
    const total = allContacts.length;

    return {
      success: true,
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return { success: false, error: 'Failed to fetch contacts' };
  }
};

export const updateContactStatus = async (id: string, status: string, response?: string) => {
  try {
    const allContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const contactIndex = allContacts.findIndex((c: Contact) => c.id === id);
    
    if (contactIndex === -1) {
      return { success: false, error: 'Contact not found' };
    }
    
    allContacts[contactIndex] = {
      ...allContacts[contactIndex],
      status: status as any,
      response,
      respondedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('contacts', JSON.stringify(allContacts));
    
    return { success: true, data: allContacts[contactIndex] };
  } catch (error) {
    console.error('Error updating contact:', error);
    return { success: false, error: 'Failed to update contact' };
  }
};

export const deleteContact = async (id: string) => {
  try {
    const allContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const filteredContacts = allContacts.filter((c: Contact) => c.id !== id);
    localStorage.setItem('contacts', JSON.stringify(filteredContacts));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting contact:', error);
    return { success: false, error: 'Failed to delete contact' };
  }
};
