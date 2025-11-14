'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  Calendar,
  MapPin,
  MessageSquare,
  Trophy,
  Clock,
  Star,
  ExternalLink,
  ArrowLeft,
  UserPlus,
  Settings,
  Mail,
  Phone
} from 'lucide-react';
import { 
  Chapter,
  Meeting,
  User,
  getChapterById,
  getMeetingsByChapterId,
  getMembershipsByChapterId,
  getUserById,
  getCollegeById
} from '@/lib/data';

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [college, setCollege] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const chapterId = params.id as string;
    
    // Load chapter data
    const chapterData = getChapterById(chapterId);
    if (chapterData) {
      setChapter(chapterData);
      
      // Load related data
      const collegeData = getCollegeById(chapterData.collegeId);
      setCollege(collegeData);
      
      const chapterMeetings = getMeetingsByChapterId(chapterId);
      setMeetings(chapterMeetings);
      
      const chapterMemberships = getMembershipsByChapterId(chapterId);
      const membersData = chapterMemberships
        .filter(m => m.status === 'approved' && m.isActive)
        .map(membership => {
          const user = getUserById(membership.userId);
          return { ...membership, user };
        });
      setMembers(membersData);
      
      // Check if current user is admin (simplified for demo)
      const currentUser = localStorage.getItem('tsf_user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        setIsAdmin(user.role === 'admin' || user.role === 'super_admin');
      }
    }
  }, [params.id]);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Chapter Not Found</h2>
            <p className="text-slate-600 mb-4">
              The chapter you're looking for doesn't exist or has been deactivated.
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming');
  const completedMeetings = meetings.filter(m => m.status === 'completed');
  const adminMembers = members.filter(m => m.role === 'admin');
  const regularMembers = members.filter(m => m.role === 'member');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/logo.svg" alt="TSF Communication Club" className="h-8 w-8 rounded-full ring-2 ring-blue-200 shadow-sm" />
                <span className="text-xl font-bold text-slate-900">TSF Communication Club</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chapter Banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-600">
        <img
          src={chapter.banner_url}
          alt={chapter.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{chapter.name}</h1>
            <p className="text-xl opacity-90">{chapter.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Chapter Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About the Chapter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600">{chapter.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{college?.city}, {college?.district}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{chapter.meetingDay}s at {chapter.meetingTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{chapter.meetingFrequency} meetings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{chapter.totalMembers} members</span>
                    </div>
                  </div>
                  
                  {chapter.foundedDate && (
                    <div className="text-sm text-slate-500">
                      Founded: {new Date(chapter.foundedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Chapter Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <Badge 
                      variant={chapter.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {chapter.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>College</span>
                    <span className="text-sm font-medium">{college?.shortName}</span>
                  </div>
                  
                  {chapter.socialLinks.instagram && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Instagram:</span>
                      <a 
                        href={chapter.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                  
                  {chapter.socialLinks.linkedin && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">LinkedIn:</span>
                      <a 
                        href={chapter.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Page
                      </a>
                    </div>
                  )}
                  
                  <Button className="w-full mt-4">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Request to Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="meetings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="officers">Officers</TabsTrigger>
          </TabsList>

          {/* Meetings */}
          <TabsContent value="meetings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Meetings</CardTitle>
                  <CardDescription>
                    Join our upcoming communication practice sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingMeetings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No Upcoming Meetings</h3>
                      <p className="text-slate-600">Check back soon for new meeting schedules.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingMeetings.map((meeting) => (
                        <Card key={meeting.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{meeting.title}</h4>
                                <p className="text-sm text-slate-600 mb-2">{meeting.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(meeting.dateTime).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {new Date(meeting.dateTime).toLocaleTimeString()}
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {meeting.currentParticipants}/{meeting.maxParticipants}
                                  </span>
                                </div>
                              </div>
                              <Button size="sm" asChild>
                                <a href={meeting.googleMeetUrl} target="_blank" rel="noopener noreferrer">
                                  Join Meeting
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Past Meetings</CardTitle>
                  <CardDescription>
                    Recent completed meetings and sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedMeetings.slice(0, 5).map((meeting) => (
                      <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{meeting.title}</h4>
                          <p className="text-sm text-slate-600">
                            {new Date(meeting.dateTime).toLocaleDateString()} • {meeting.duration} minutes
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Chapter Members ({regularMembers.length})</CardTitle>
                <CardDescription>
                  Active members of the TSF Communication Club
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={member.user?.avatar_url || '/placeholder-avatar.jpg'}
                            alt={member.user?.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{member.user?.name}</p>
                            <p className="text-sm text-slate-600">{member.user?.department}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Trophy className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-slate-500">{member.points} points</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Officers */}
          <TabsContent value="officers">
            <Card>
              <CardHeader>
                <CardTitle>Chapter Officers ({adminMembers.length})</CardTitle>
                <CardDescription>
                  Leadership team managing the chapter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminMembers.map((admin) => (
                    <Card key={admin.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={admin.user?.avatar_url || '/placeholder-avatar.jpg'}
                            alt={admin.user?.name}
                            className="w-16 h-16 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium">{admin.user?.name}</p>
                              <Badge variant="default">Admin</Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{admin.user?.bio}</p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {admin.user?.email}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {admin.user?.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}