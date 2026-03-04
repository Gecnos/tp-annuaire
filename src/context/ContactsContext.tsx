import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Contact } from "../types";

interface ContactsContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, "id" | "activities">) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
  searchContacts: (query: string) => Contact[];
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

const STORAGE_KEY = "contact_manager_data";

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

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

  const updateContact = (id: string, updatedData: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, ...updatedData } : contact,
      ),
    );
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  const getContact = (id: string): Contact | undefined => {
    return contacts.find((contact) => contact.id === id);
  };

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

  return (
    <ContactsContext.Provider
      value={{ contacts, addContact, updateContact, deleteContact, getContact, searchContacts }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts(): ContactsContextType {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error("useContacts must be used inside <ContactsProvider>");
  }
  return context;
}
