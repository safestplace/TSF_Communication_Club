import collegesData from '@/data/colleges.json';
import usersData from '@/data/users.json';
import chaptersData from '@/data/chapters.json';
import meetingsData from '@/data/meetings.json';
import membershipsData from '@/data/memberships.json';
import pointsData from '@/data/points.json';
import certificatesData from '@/data/certificates.json';

export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  district: string;
  website: string;
  type: string;
  established: number;
  affiliation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'member' | 'admin' | 'super_admin';
  collegeId: string;
  bio: string;
  avatar_url: string;
  phone: string;
  semester: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  name: string;
  collegeId: string;
  description: string;
  status: 'active' | 'pending' | 'deactivated';
  adminId: string | null;
  banner_url: string;
  foundedDate: string | null;
  meetingFrequency: string;
  meetingDay: string;
  meetingTime: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  totalMembers: number;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  chapterId: string;
  title: string;
  agenda: string;
  description: string;
  dateTime: string;
  duration: number;
  googleMeetUrl: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  maxParticipants: number;
  currentParticipants: number;
  roles: {
    anchor: string;
    topicProvider: string;
    judges: string[];
    speakers: string[];
    listeners: string[];
  };
  feedback: Array<{
    userId: string;
    rating: number;
    comment: string;
    submittedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  chapterId: string;
  status: 'pending' | 'approved' | 'rejected';
  role: 'member' | 'admin';
  joinedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  isActive: boolean;
  points: number;
  attendanceRate: number;
  lastMeetingAttended: string | null;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Point {
  id: string;
  userId: string;
  chapterId: string;
  points: number;
  type: 'meeting_attendance' | 'speaker_role' | 'anchor_role' | 'topic_provider' | 'judge_role' | 'admin_bonus' | 'feedback_bonus' | 'certificate_milestone';
  description: string;
  meetingId: string | null;
  awardedBy: string;
  awardedAt: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  chapterId: string;
  type: 'bronze' | 'silver' | 'gold';
  title: string;
  description: string;
  pointsThreshold: number;
  pointsEarned: number;
  pdfUrl: string;
  certificateNumber: string;
  issuedDate: string;
  issuedBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Data access functions
export const getColleges = (): College[] => collegesData;
export const getUsers = (): User[] => usersData;
export const getChapters = (): Chapter[] => chaptersData;
export const getMeetings = (): Meeting[] => meetingsData;
export const getMemberships = (): Membership[] => membershipsData;
export const getPoints = (): Point[] => pointsData;
export const getCertificates = (): Certificate[] => certificatesData;

// Helper functions
export const getCollegeById = (id: string): College | undefined => 
  collegesData.find(college => college.id === id);

export const getUserByEmail = (email: string): User | undefined => 
  usersData.find(user => user.email === email);

export const getUserById = (id: string): User | undefined => 
  usersData.find(user => user.id === id);

export const getChapterById = (id: string): Chapter | undefined => 
  chaptersData.find(chapter => chapter.id === id);

export const getChaptersByCollegeId = (collegeId: string): Chapter[] => 
  chaptersData.filter(chapter => chapter.collegeId === collegeId);

export const getMeetingById = (id: string): Meeting | undefined => 
  meetingsData.find(meeting => meeting.id === id);

export const getMeetingsByChapterId = (chapterId: string): Meeting[] => 
  meetingsData.filter(meeting => meeting.chapterId === chapterId);

export const getUpcomingMeetings = (): Meeting[] => 
  meetingsData.filter(meeting => meeting.status === 'upcoming');

export const getCompletedMeetings = (): Meeting[] => 
  meetingsData.filter(meeting => meeting.status === 'completed');

export const getMembershipsByUserId = (userId: string): Membership[] => 
  membershipsData.filter(membership => membership.userId === userId);

export const getMembershipsByChapterId = (chapterId: string): Membership[] => 
  membershipsData.filter(membership => membership.chapterId === chapterId);

export const getPendingMemberships = (): Membership[] => 
  membershipsData.filter(membership => membership.status === 'pending');

export const getPointsByUserId = (userId: string): Point[] => 
  pointsData.filter(point => point.userId === userId);

export const getTotalPointsByUserId = (userId: string): number => 
  getPointsByUserId(userId).reduce((total, point) => total + point.points, 0);

export const getCertificatesByUserId = (userId: string): Certificate[] => 
  certificatesData.filter(certificate => certificate.userId === userId);

export const getActiveCertificatesByUserId = (userId: string): Certificate[] => 
  certificatesData.filter(certificate => certificate.userId === userId && certificate.isActive);

// Search functions
export const searchColleges = (query: string): College[] => {
  const lowercaseQuery = query.toLowerCase();
  return collegesData.filter(college => 
    college.name.toLowerCase().includes(lowercaseQuery) ||
    college.shortName.toLowerCase().includes(lowercaseQuery) ||
    college.city.toLowerCase().includes(lowercaseQuery) ||
    college.district.toLowerCase().includes(lowercaseQuery)
  );
};

// Auth simulation
export const authenticateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

// In-memory storage for dynamic data (simulating database updates)
const dynamicData = {
  users: [...usersData],
  chapters: [...chaptersData],
  meetings: [...meetingsData],
  memberships: [...membershipsData],
  points: [...pointsData],
  certificates: [...certificatesData]
};

// Update functions (simulating database operations)
export const updateMembershipStatus = (membershipId: string, status: 'approved' | 'rejected', approvedBy: string, rejectionReason?: string): boolean => {
  const membership = dynamicData.memberships.find(m => m.id === membershipId);
  if (membership) {
    membership.status = status;
    membership.approvedBy = approvedBy;
    membership.approvedAt = new Date().toISOString();
    if (status === 'approved') {
      membership.joinedAt = new Date().toISOString();
      membership.isActive = true;
    }
    if (rejectionReason) {
      membership.rejectionReason = rejectionReason;
    }
    membership.updatedAt = new Date().toISOString();
    return true;
  }
  return false;
};

export const createChapter = (chapterData: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>): Chapter => {
  const newChapter: Chapter = {
    ...chapterData,
    id: (dynamicData.chapters.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dynamicData.chapters.push(newChapter);
  return newChapter;
};

export const createMembership = (membershipData: Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>): Membership => {
  const newMembership: Membership = {
    ...membershipData,
    id: (dynamicData.memberships.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dynamicData.memberships.push(newMembership);
  return newMembership;
};

export const createMeeting = (meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Meeting => {
  const newMeeting: Meeting = {
    ...meetingData,
    id: (dynamicData.meetings.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dynamicData.meetings.push(newMeeting);
  return newMeeting;
};

export const awardPoints = (pointData: Omit<Point, 'id' | 'createdAt'>): Point => {
  const newPoint: Point = {
    ...pointData,
    id: (dynamicData.points.length + 1).toString(),
    createdAt: new Date().toISOString()
  };
  dynamicData.points.push(newPoint);
  return newPoint;
};

export const createCertificate = (certificateData: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>): Certificate => {
  const newCertificate: Certificate = {
    ...certificateData,
    id: (dynamicData.certificates.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dynamicData.certificates.push(newCertificate);
  return newCertificate;
};

// Get current dynamic data (for UI updates)
export const getCurrentData = () => dynamicData;