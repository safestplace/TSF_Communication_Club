'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  MessageSquare,
  Trophy,
  Star,
  ArrowLeft,
  ExternalLink,
  Mic,
  BookOpen,
  Gavel,
  UserCheck,
  ThumbsUp,
  Send
} from 'lucide-react';
import { 
  Meeting,
  User,
  Chapter,
  getMeetingById,
  getChapterById,
  getUserById,
  getCollegeById
} from '@/lib/data';

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [college, setCollege] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

  useEffect(() => {
    const meetingId = params.id as string;
    
    // Load meeting data
    const meetingData = getMeetingById(meetingId);
    if (meetingData) {
      setMeeting(meetingData);
      
      // Load related data
      const chapterData = getChapterById(meetingData.chapterId);
      setChapter(chapterData);
      
      if (chapterData) {
        const collegeData = getCollegeById(chapterData.collegeId);
        setCollege(collegeData);
      }
      
      // Get current user and their role
      const userData = localStorage.getItem('tsf_user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        
        // Determine user's role in this meeting
        if (meetingData.roles.anchor === user.id) {
          setUserRole('Anchor');
        } else if (meetingData.roles.topicProvider === user.id) {
          setUserRole('Topic Provider');
        } else if (meetingData.roles.judges.includes(user.id)) {
          setUserRole('Judge');
        } else if (meetingData.roles.speakers.includes(user.id)) {
          setUserRole('Speaker');
        } else if (meetingData.roles.listeners.includes(user.id)) {
          setUserRole('Listener');
        } else {
          setUserRole('Participant');
        }
        
        // Check if user has already submitted feedback
        const userFeedback = meetingData.feedback.find(f => f.userId === user.id);
        if (userFeedback) {
          setHasSubmittedFeedback(true);
          setFeedback(userFeedback.comment);
          setRating(userFeedback.rating);
        }
      }
    }
  }, [params.id]);

  const handleSubmitFeedback = () => {
    if (!meeting || !currentUser || rating === 0) return;
    
    // In a real app, this would call an API
    const newFeedback = {
      userId: currentUser.id,
      rating,
      comment: feedback,
      submittedAt: new Date().toISOString()
    };
    
    meeting.feedback.push(newFeedback);
    setHasSubmittedFeedback(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Anchor': return <Mic className="w-4 h-4" />;
      case 'Topic Provider': return <BookOpen className="w-4 h-4" />;
      case 'Judge': return <Gavel className="w-4 h-4" />;
      case 'Speaker': return <MessageSquare className="w-4 h-4" />;
      case 'Listener': return <UserCheck className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleInstructions = (role: string) => {
    switch (role) {
      case 'Anchor':
        return {
          title: 'Meeting Anchor Responsibilities',
          instructions: [
            'Start the meeting on time with a warm welcome',
            'Introduce the topic and set the agenda',
            'Manage time and keep discussions on track',
            'Ensure all participants get a chance to speak',
            'Facilitate smooth transitions between segments',
            'Conclude the meeting with key takeaways',
            'Thank everyone for their participation'
          ]
        };
      case 'Topic Provider':
        return {
          title: 'Topic Provider Responsibilities',
          instructions: [
            'Research and prepare 2-3 engaging topics',
            'Provide background information on each topic',
            'Explain why the topics are relevant to the audience',
            'Be prepared to answer questions about the topics',
            'Keep presentations concise and engaging',
            'Provide additional resources for further learning'
          ]
        };
      case 'Judge':
        return {
          title: 'Judge Responsibilities',
          instructions: [
            'Evaluate speakers objectively and fairly',
            'Assess content quality, clarity, and delivery',
            'Provide constructive and specific feedback',
            'Use the scoring rubric consistently',
            'Maintain professionalism and encourage speakers',
            'Submit detailed evaluation forms'
          ]
        };
      case 'Speaker':
        return {
          title: 'Speaker Responsibilities',
          instructions: [
            'Prepare thoroughly on your assigned topic',
            'Practice your speech multiple times',
            'Keep within the allotted time limit',
            'Engage with the audience through eye contact',
            'Be prepared for questions and feedback',
            'Show confidence and enthusiasm'
          ]
        };
      case 'Listener':
        return {
          title: 'Listener Responsibilities',
          instructions: [
            'Pay close attention to all speakers',
            'Take notes on key points and questions',
            'Prepare thoughtful questions for the Q&A session',
            'Provide constructive feedback when requested',
            'Respect different opinions and perspectives',
            'Stay engaged throughout the meeting'
          ]
        };
      default:
        return {
          title: 'Participant Responsibilities',
          instructions: [
            'Attend the meeting on time',
            'Actively participate in discussions',
            'Respect the meeting agenda and time limits',
            'Be supportive of other participants',
            'Follow the meeting guidelines',
            'Provide honest and helpful feedback'
          ]
        };
    }
  };

  if (!meeting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Meeting Not Found</h2>
            <p className="text-slate-600 mb-4">
              The meeting you're looking for doesn't exist or has been cancelled.
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const roleInstructions = getRoleInstructions(userRole);
  const averageRating = meeting.feedback.length > 0 
    ? (meeting.feedback.reduce((sum, f) => sum + f.rating, 0) / meeting.feedback.length).toFixed(1)
    : 'No ratings yet';

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

      <div className="container mx-auto px-4 py-8">
        {/* Meeting Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{meeting.title}</h1>
              <div className="flex items-center space-x-4 text-slate-600">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {chapter?.name}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(meeting.dateTime).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(meeting.dateTime).toLocaleTimeString()} • {meeting.duration} minutes
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={meeting.status === 'completed' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {meeting.status}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                {getRoleIcon(userRole)}
                <span className="ml-1">{userRole}</span>
              </Badge>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-medium mb-2">Meeting Agenda</h3>
            <p className="text-slate-600 mb-4">{meeting.agenda}</p>
            <p className="text-slate-600">{meeting.description}</p>
            
            {meeting.status === 'upcoming' && (
              <div className="mt-4 pt-4 border-t">
                <Button asChild>
                  <a href={meeting.googleMeetUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Join Google Meet
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="role" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="role">My Role</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="details">Meeting Details</TabsTrigger>
          </TabsList>

          {/* My Role */}
          <TabsContent value="role">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getRoleIcon(userRole)}
                  <span className="ml-2">{roleInstructions.title}</span>
                </CardTitle>
                <CardDescription>
                  Your responsibilities and instructions for this meeting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Your Role: {userRole}</h4>
                    <ul className="space-y-2">
                      {roleInstructions.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-sm text-blue-800">{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {meeting.status === 'completed' && (
                    <div className="flex space-x-2">
                      <Button>Mark as Attended</Button>
                      <Button variant="outline">Upload Evidence</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Participants */}
          <TabsContent value="participants">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Anchor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Mic className="w-5 h-5 mr-2" />
                    Anchor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const anchor = getUserById(meeting.roles.anchor);
                    return anchor ? (
                      <div className="flex items-center space-x-3">
                        <img
                          src={anchor.avatar_url}
                          alt={anchor.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{anchor.name}</p>
                          <p className="text-sm text-slate-600">{anchor.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500">Not assigned</p>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Topic Provider */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Topic Provider
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const topicProvider = getUserById(meeting.roles.topicProvider);
                    return topicProvider ? (
                      <div className="flex items-center space-x-3">
                        <img
                          src={topicProvider.avatar_url}
                          alt={topicProvider.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{topicProvider.name}</p>
                          <p className="text-sm text-slate-600">{topicProvider.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500">Not assigned</p>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Judges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Gavel className="w-5 h-5 mr-2" />
                    Judges ({meeting.roles.judges.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meeting.roles.judges.map((judgeId) => {
                      const judge = getUserById(judgeId);
                      return judge ? (
                        <div key={judgeId} className="flex items-center space-x-3">
                          <img
                            src={judge.avatar_url}
                            alt={judge.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-sm">{judge.name}</p>
                            <p className="text-xs text-slate-600">{judge.email}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Speakers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Speakers ({meeting.roles.speakers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meeting.roles.speakers.map((speakerId) => {
                      const speaker = getUserById(speakerId);
                      return speaker ? (
                        <div key={speakerId} className="flex items-center space-x-3">
                          <img
                            src={speaker.avatar_url}
                            alt={speaker.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-sm">{speaker.name}</p>
                            <p className="text-xs text-slate-600">{speaker.email}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Listeners */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Listeners ({meeting.roles.listeners.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meeting.roles.listeners.map((listenerId) => {
                      const listener = getUserById(listenerId);
                      return listener ? (
                        <div key={listenerId} className="flex items-center space-x-3">
                          <img
                            src={listener.avatar_url}
                            alt={listener.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-sm">{listener.name}</p>
                            <p className="text-xs text-slate-600">{listener.email}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Meeting Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Users className="w-5 h-5 mr-2" />
                    Meeting Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Participants:</span>
                      <span className="font-medium">{meeting.currentParticipants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Max Capacity:</span>
                      <span className="font-medium">{meeting.maxParticipants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Duration:</span>
                      <span className="font-medium">{meeting.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Feedback Received:</span>
                      <span className="font-medium">{meeting.feedback.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feedback */}
          <TabsContent value="feedback">
            <div className="space-y-6">
              {/* Submit Feedback */}
              {meeting.status === 'completed' && !hasSubmittedFeedback && (
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Feedback</CardTitle>
                    <CardDescription>
                      Share your thoughts about this meeting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Comments</label>
                        <Textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Share your experience and suggestions..."
                          rows={4}
                        />
                      </div>
                      
                      <Button onClick={handleSubmitFeedback} disabled={rating === 0}>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Feedback Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ThumbsUp className="w-5 h-5 mr-2" />
                    Meeting Feedback
                  </CardTitle>
                  <CardDescription>
                    Average Rating: {averageRating} ⭐ ({meeting.feedback.length} reviews)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {meeting.feedback.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No Feedback Yet</h3>
                      <p className="text-slate-600">Be the first to share your thoughts about this meeting.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {meeting.feedback.map((feedback, index) => {
                        const user = getUserById(feedback.userId);
                        return (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={user?.avatar_url}
                                  alt={user?.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <p className="font-medium">{user?.name}</p>
                                  <p className="text-xs text-slate-500">
                                    {new Date(feedback.submittedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < feedback.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-600">{feedback.comment}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Meeting Details */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Information</CardTitle>
                <CardDescription>
                  Detailed information about this meeting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Basic Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Meeting ID:</span>
                        <span className="font-medium">{meeting.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <Badge variant="outline" className="capitalize">
                          {meeting.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Duration:</span>
                        <span className="font-medium">{meeting.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Max Participants:</span>
                        <span className="font-medium">{meeting.maxParticipants}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Schedule</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date:</span>
                        <span className="font-medium">
                          {new Date(meeting.dateTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Time:</span>
                        <span className="font-medium">
                          {new Date(meeting.dateTime).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Created:</span>
                        <span className="font-medium">
                          {new Date(meeting.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {meeting.status === 'completed' && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Updated:</span>
                          <span className="font-medium">
                            {new Date(meeting.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Google Meet Link</h4>
                  <a
                    href={meeting.googleMeetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {meeting.googleMeetUrl}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}