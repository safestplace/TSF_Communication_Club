'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Trophy,
  Users,
  Clock,
  Award,
  TrendingUp,
  Bell,
  Mic,
  UserCheck,
  BookOpen,
  Download,
  Star,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Meeting, 
  Membership, 
  Point, 
  Certificate, 
  Chapter,
  getMeetingsByChapterId,
  getMembershipsByUserId,
  getPointsByUserId,
  getTotalPointsByUserId,
  getCertificatesByUserId,
  getActiveCertificatesByUserId,
  getChapterById,
  getUserById
} from '@/lib/data';

export default function MemberDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [userChapters, setUserChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Load member data
    const userMemberships = getMembershipsByUserId(user.id);
    const approvedMemberships = userMemberships.filter(m => m.status === 'approved' && m.isActive);
    setMemberships(approvedMemberships);

    // Get upcoming meetings for user's chapters
    const allUpcomingMeetings: Meeting[] = [];
    approvedMemberships.forEach(membership => {
      const chapterMeetings = getMeetingsByChapterId(membership.chapterId);
      const upcoming = chapterMeetings.filter(meeting => meeting.status === 'upcoming');
      allUpcomingMeetings.push(...upcoming);
    });
    setUpcomingMeetings(allUpcomingMeetings);

    // Get user's points and certificates
    setTotalPoints(getTotalPointsByUserId(user.id));
    setCertificates(getActiveCertificatesByUserId(user.id));

    // Get user's chapters
    const chapters = approvedMemberships.map(membership => {
      const chapter = getChapterById(membership.chapterId);
      return chapter;
    }).filter(Boolean) as Chapter[];
    setUserChapters(chapters);
  }, [user, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const nextMeeting = upcomingMeetings[0];
  const pointsProgress = Math.min((totalPoints / 100) * 100, 100);
  const nextCertificateLevel = totalPoints < 100 ? 'Bronze' : totalPoints < 200 ? 'Silver' : 'Gold';
  const pointsToNextCertificate = totalPoints < 100 ? 100 - totalPoints : totalPoints < 200 ? 200 - totalPoints : 0;

  const getRoleForMeeting = (meeting: Meeting): string => {
    if (meeting.roles.anchor === user.id) return 'Anchor';
    if (meeting.roles.topicProvider === user.id) return 'Topic Provider';
    if (meeting.roles.judges.includes(user.id)) return 'Judge';
    if (meeting.roles.speakers.includes(user.id)) return 'Speaker';
    if (meeting.roles.listeners.includes(user.id)) return 'Listener';
    return 'Participant';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Anchor': return <Mic className="w-4 h-4" />;
      case 'Topic Provider': return <BookOpen className="w-4 h-4" />;
      case 'Judge': return <Trophy className="w-4 h-4" />;
      case 'Speaker': return <MessageSquare className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-600">
            Here's your communication journey progress and upcoming activities.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">
                {pointsToNextCertificate > 0 ? `${pointsToNextCertificate} points to ${nextCertificateLevel}` : 'Max level achieved!'}
              </p>
              <Progress value={pointsProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Meeting</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nextMeeting ? new Date(nextMeeting.dateTime).toLocaleDateString() : 'No upcoming'}
              </div>
              <p className="text-xs text-muted-foreground">
                {nextMeeting ? nextMeeting.title : 'Check back soon'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Chapters</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userChapters.length}</div>
              <p className="text-xs text-muted-foreground">
                Active memberships
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificates.length}</div>
              <p className="text-xs text-muted-foreground">
                Earned certificates
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="chapters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="chapters">My Chapters</TabsTrigger>
            <TabsTrigger value="meetings">Upcoming Meetings</TabsTrigger>
            <TabsTrigger value="roles">My Roles</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* My Chapters */}
          <TabsContent value="chapters">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userChapters.map((chapter) => (
                <Card key={chapter.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{chapter.name}</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <CardDescription>
                      {chapter.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {chapter.totalMembers} members
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {chapter.meetingDay}s at {chapter.meetingTime}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {chapter.meetingFrequency} meetings
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        View Chapter
                      </Button>
                      <Link href={`/chapters/${chapter.id}`}>
                        <Button size="sm" className="w-full">
                          Go to Chapter
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upcoming Meetings */}
          <TabsContent value="meetings">
            <div className="space-y-4">
              {upcomingMeetings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No upcoming meetings</h3>
                    <p className="text-slate-600">Check back soon for new meeting schedules.</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingMeetings.map((meeting) => {
                  const role = getRoleForMeeting(meeting);
                  const chapter = userChapters.find(c => c.id === meeting.chapterId);
                  
                  return (
                    <Card key={meeting.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{meeting.title}</CardTitle>
                            <CardDescription>
                              {chapter?.name} • {new Date(meeting.dateTime).toLocaleDateString()} at {new Date(meeting.dateTime).toLocaleTimeString()}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="flex items-center">
                              {getRoleIcon(role)}
                              <span className="ml-1">{role}</span>
                            </Badge>
                            <Button size="sm" asChild>
                              <a href={meeting.googleMeetUrl} target="_blank" rel="noopener noreferrer">
                                Join Meeting
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 mb-4">{meeting.description}</p>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {meeting.duration} minutes
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {meeting.currentParticipants}/{meeting.maxParticipants} participants
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* My Roles */}
          <TabsContent value="roles">
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => {
                const role = getRoleForMeeting(meeting);
                const chapter = userChapters.find(c => c.id === meeting.chapterId);
                
                return (
                  <Card key={meeting.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{meeting.title}</CardTitle>
                          <CardDescription>
                            {chapter?.name} • {new Date(meeting.dateTime).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="flex items-center">
                          {getRoleIcon(role)}
                          <span className="ml-1">{role}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Role Instructions:</h4>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            {role === 'Anchor' && (
                              <p className="text-sm text-slate-600">
                                As the Anchor, you'll facilitate the meeting, introduce speakers, manage time, and ensure smooth flow. 
                                Prepare opening remarks and closing thoughts.
                              </p>
                            )}
                            {role === 'Topic Provider' && (
                              <p className="text-sm text-slate-600">
                                As the Topic Provider, you'll suggest interesting topics for discussion and provide background information. 
                                Research and prepare 2-3 engaging topics.
                              </p>
                            )}
                            {role === 'Judge' && (
                              <p className="text-sm text-slate-600">
                                As a Judge, you'll evaluate speakers based on clarity, content, delivery, and overall impact. 
                                Provide constructive feedback and fair scoring.
                              </p>
                            )}
                            {role === 'Speaker' && (
                              <p className="text-sm text-slate-600">
                                As a Speaker, you'll present on assigned topics or participate in discussions. 
                                Practice your speech and prepare for questions.
                              </p>
                            )}
                            {role === 'Listener' && (
                              <p className="text-sm text-slate-600">
                                As a Listener, you'll actively participate in discussions, ask questions, and provide feedback. 
                                Take notes and engage with speakers.
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm">
                            Mark as Attended
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Certificates */}
          <TabsContent value="certificates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center">
                    <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No certificates yet</h3>
                    <p className="text-slate-600 mb-4">Keep participating in meetings to earn your first certificate!</p>
                    <div className="text-sm text-slate-500">
                      <p>Bronze Certificate: 100 points</p>
                      <p>Silver Certificate: 200 points</p>
                      <p>Gold Certificate: 300 points</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                certificates.map((certificate) => (
                  <Card key={certificate.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{certificate.title}</CardTitle>
                        <Badge 
                          variant={certificate.type === 'bronze' ? 'secondary' : certificate.type === 'silver' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {certificate.type}
                        </Badge>
                      </div>
                      <CardDescription>
                        Issued on {new Date(certificate.issuedDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600">
                          {certificate.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Points Earned: {certificate.pointsEarned}</span>
                          <span className="text-slate-500">Certificate #: {certificate.certificateNumber}</span>
                        </div>
                        <Button size="sm" className="w-full" asChild>
                          <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download Certificate
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Activity */}
          <TabsContent value="activity">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your participation history and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getPointsByUserId(user.id).slice(0, 10).map((point) => (
                      <div key={point.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Trophy className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{point.description}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(point.awardedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+{point.points}</p>
                          <p className="text-xs text-slate-500 capitalize">{point.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}