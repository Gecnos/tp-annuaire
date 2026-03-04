import { useState, useEffect } from "react";
import { Contact } from "../types";

const STORAGE_KEY = "contact_manager_data";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  // add contact
  const addContact = (newContact: Omit<Contact, "id" | "activities">) => {
    const contact: Contact = {
      ...newContact,
      id: crypto.randomUUID(),
      activities: [
        {
          id: crypto.randomUUID(),
          type: "edit",
          title: "Contact Created",
          date: new Date().toISOString(),
        },
      ],
    };
    setContacts((prev) => [contact, ...prev]);
  };

  // update contact
  const updateContact = (id: string, updatedData: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, ...updatedData } : contact,
      ),
    );
  };

  // delete contact
  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  // get contact
  const getContact = (id: string): Contact | undefined => {
    return contacts.find((contact) => contact.id === id);
  };

  // search contacts
  const searchContacts = (query: string): Contact[] => {
    const q = query.toLowerCase().trim();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q),
    );
  };

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    getContact,
    searchContacts,
  };
}
