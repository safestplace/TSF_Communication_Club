'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users,
  Calendar,
  Trophy,
  Clock,
  TrendingUp,
  Bell,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Award,
  Settings,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Meeting, 
  Membership, 
  Chapter,
  getMeetingsByChapterId,
  getMembershipsByChapterId,
  getMembershipsByUserId,
  getChapterById,
  getUserById,
  getPendingMemberships,
  getUpcomingMeetings,
  getCompletedMeetings
} from '@/lib/data';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [adminChapter, setAdminChapter] = useState<Chapter | null>(null);
  const [members, setMembers] = useState<Membership[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Membership[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [completedMeetings, setCompletedMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Find the chapter where this user is admin
    const userMemberships = getMembershipsByUserId(user.id);
    const adminMembership = userMemberships.find(m => m.role === 'admin' && m.status === 'approved');
    
    if (adminMembership) {
      const chapter = getChapterById(adminMembership.chapterId);
      setAdminChapter(chapter || null);
      
      // Load chapter data
      const chapterMembers = getMembershipsByChapterId(adminMembership.chapterId);
      setMembers(chapterMembers);
      
      const pending = chapterMembers.filter(m => m.status === 'pending');
      setPendingRequests(pending);
      
      const chapterMeetings = getMeetingsByChapterId(adminMembership.chapterId);
      setUpcomingMeetings(chapterMeetings.filter(m => m.status === 'upcoming'));
      setCompletedMeetings(chapterMeetings.filter(m => m.status === 'completed'));
    }
  }, [user, router]);

  const handleApproveRequest = (membershipId: string) => {
    // In a real app, this would call an API
    const membership = members.find(m => m.id === membershipId);
    if (membership) {
      membership.status = 'approved';
      membership.approvedAt = new Date().toISOString();
      membership.approvedBy = user?.id || '';
      membership.isActive = true;
      membership.joinedAt = new Date().toISOString();
      
      // Update state
      setMembers([...members]);
      setPendingRequests(pendingRequests.filter(m => m.id !== membershipId));
    }
  };

  const handleRejectRequest = (membershipId: string) => {
    // In a real app, this would call an API
    const membership = members.find(m => m.id === membershipId);
    if (membership) {
      membership.status = 'rejected';
      membership.approvedAt = new Date().toISOString();
      membership.approvedBy = user?.id || '';
      membership.rejectionReason = 'Chapter capacity reached';
      
      // Update state
      setMembers([...members]);
      setPendingRequests(pendingRequests.filter(m => m.id !== membershipId));
    }
  };

  const getUserDetails = (userId: string) => {
    return getUserById(userId);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!adminChapter) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No Chapter Found</h2>
            <p className="text-slate-600 mb-4">
              You don't have admin access to any chapter yet.
            </p>
            <Link href="/dashboard/member">
              <Button>Go to Member Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalMembers = members.filter(m => m.status === 'approved' && m.isActive).length;
  const totalPoints = members.reduce((sum, m) => sum + m.points, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900">Admin Dashboard</span>
                  <p className="text-sm text-slate-600">{adminChapter.name}</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push('/auth/login')}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                {pendingRequests.length} pending requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingMeetings.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedMeetings.length} completed this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">
                Avg: {totalMembers > 0 ? Math.round(totalPoints / totalMembers) : 0} per member
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                Active members this month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="members">Member Management</TabsTrigger>
            <TabsTrigger value="meetings">Schedule Meeting</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="points">Points & Certificates</TabsTrigger>
            <TabsTrigger value="settings">Chapter Settings</TabsTrigger>
          </TabsList>

          {/* Member Management */}
          <TabsContent value="members">
            <div className="space-y-6">
              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Pending Membership Requests ({pendingRequests.length})
                    </CardTitle>
                    <CardDescription>
                      Review and approve or reject new membership requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingRequests.map((membership) => {
                        const userDetails = getUserDetails(membership.userId);
                        return (
                          <div key={membership.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <img
                                src={userDetails?.avatar_url || '/placeholder-avatar.jpg'}
                                alt={userDetails?.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="font-medium">{userDetails?.name}</p>
                                <p className="text-sm text-slate-600">{userDetails?.email}</p>
                                <p className="text-xs text-slate-500">
                                  Applied {new Date(membership.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveRequest(membership.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRequest(membership.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Members */}
              <Card>
                <CardHeader>
                  <CardTitle>All Members</CardTitle>
                  <CardDescription>
                    Manage existing chapter members and their roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.filter(m => m.status === 'approved').map((membership) => {
                        const userDetails = getUserDetails(membership.userId);
                        return (
                          <TableRow key={membership.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={userDetails?.avatar_url || '/placeholder-avatar.jpg'}
                                  alt={userDetails?.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <p className="font-medium">{userDetails?.name}</p>
                                  <p className="text-sm text-slate-600">{userDetails?.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={membership.role === 'admin' ? 'default' : 'secondary'}>
                                {membership.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{membership.points}</TableCell>
                            <TableCell>{membership.attendanceRate}%</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                {membership.role !== 'admin' && (
                                  <Button size="sm" variant="outline">
                                    Promote
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule Meeting */}
          <TabsContent value="meetings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Schedule New Meeting
                </CardTitle>
                <CardDescription>
                  Create and schedule upcoming chapter meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Meeting Scheduler</h3>
                  <p className="text-slate-600 mb-4">
                    Schedule meetings with role assignments and Google Meet integration
                  </p>
                  <Button>Schedule New Meeting</Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>
                  Manage and edit scheduled meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{meeting.title}</h4>
                        <p className="text-sm text-slate-600">
                          {new Date(meeting.dateTime).toLocaleDateString()} at {new Date(meeting.dateTime).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-slate-500">{meeting.duration} minutes</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Attendance & Feedback
                </CardTitle>
                <CardDescription>
                  Track meeting attendance and collect feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Attendance Tracking</h3>
                  <p className="text-slate-600 mb-4">
                    Mark attendance and review feedback from completed meetings
                  </p>
                  <Button>View Attendance Reports</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Points & Certificates */}
          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Points & Certificates
                </CardTitle>
                <CardDescription>
                  Award points and manage certificate generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Points Management</h3>
                  <p className="text-slate-600 mb-4">
                    Award points for participation and trigger certificate generation
                  </p>
                  <div className="space-y-2">
                    <Button>Award Points</Button>
                    <Button variant="outline">Generate Certificates</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chapter Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Chapter Settings
                </CardTitle>
                <CardDescription>
                  Manage chapter details and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Chapter Information</h4>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-medium">{adminChapter.name}</p>
                      <p className="text-sm text-slate-600">{adminChapter.description}</p>
                      <p className="text-sm text-slate-500 mt-2">
                        Meetings: {adminChapter.meetingDay}s at {adminChapter.meetingTime}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Social Links</h4>
                    <div className="space-y-2">
                      {adminChapter.socialLinks.instagram && (
                        <p className="text-sm text-slate-600">
                          Instagram: {adminChapter.socialLinks.instagram}
                        </p>
                      )}
                      {adminChapter.socialLinks.linkedin && (
                        <p className="text-sm text-slate-600">
                          LinkedIn: {adminChapter.socialLinks.linkedin}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button>Edit Chapter Details</Button>
                    <Button variant="outline">Upload Banner</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}