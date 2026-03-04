export type GroupType = 'Work' | 'Family' | 'Friends' | string;

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'edit';
  title: string;
  date: string;
  description?: string;
}

export interface Contact {
  id: string;
  name: string;
  role?: string;
  email: string;
  phone: string;
  groups: GroupType[];
  notes?: string;
  avatarUrl?: string | null;
  activities: Activity[];
}