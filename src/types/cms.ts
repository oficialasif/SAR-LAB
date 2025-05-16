// Base Project interface
export interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: { name: string; color?: string; }[];
  featured?: boolean;
}

export type Status = 'completed' | 'submitted' | 'pending' | 'reviewing';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  email: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ResearchProject extends Project {
  status: Status;
  teamMembers: string[]; // Array of TeamMember IDs
  startDate: Date;
  endDate?: Date;
  publications?: {
    title: string;
    url: string;
    date: Date;
  }[];
  funding?: {
    source: string;
    amount: number;
    currency: string;
    startDate: Date;
    endDate: Date;
  };
  collaborators?: {
    name: string;
    institution: string;
    role: string;
  }[];
}

// Extending the existing Project interface from projects.ts
export interface CMSProject extends Project {
  status: Status;
  category: string;
  teamMembers: string[]; // Array of TeamMember IDs
  startDate: Date;
  endDate?: Date;
  milestones?: {
    title: string;
    description: string;
    dueDate: Date;
    completedDate?: Date;
    status: Status;
  }[];
  documents?: {
    title: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  lastLogin: Date;
  createdAt: Date;
} 