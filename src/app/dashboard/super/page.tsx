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
  Building,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3,
  Download,
  MapPin,
  Calendar,
  Award,
  Shield,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Chapter,
  College,
  getChapters,
  getColleges,
  getChapterById,
  getCollegeById
} from '@/lib/data';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [pendingChapters, setPendingChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Load all data
    const allChapters = getChapters();
    const allColleges = getColleges();
    setChapters(allChapters);
    setColleges(allColleges);
    setPendingChapters(allChapters.filter(c => c.status === 'pending'));
  }, [user, router]);

  const handleApproveChapter = (chapterId: string) => {
    // In a real app, this would call an API
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
      chapter.status = 'active';
      chapter.foundedDate = new Date().toISOString();
      setChapters([...chapters]);
      setPendingChapters(pendingChapters.filter(c => c.id !== chapterId));
    }
  };

  const handleRejectChapter = (chapterId: string) => {
    // In a real app, this would call an API
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
      chapter.status = 'deactivated';
      setChapters([...chapters]);
      setPendingChapters(pendingChapters.filter(c => c.id !== chapterId));
    }
  };

  const getCollegeDetails = (collegeId: string) => {
    return getCollegeById(collegeId);
  };

  const getDistrictStats = () => {
    const districtCounts: { [key: string]: { active: number; pending: number; total: number } } = {};
    
    colleges.forEach(college => {
      const district = college.district;
      if (!districtCounts[district]) {
        districtCounts[district] = { active: 0, pending: 0, total: 0 };
      }
      districtCounts[district].total++;
    });

    chapters.forEach(chapter => {
      const college = getCollegeDetails(chapter.collegeId);
      if (college) {
        const district = college.district;
        if (chapter.status === 'active') {
          districtCounts[district].active++;
        } else if (chapter.status === 'pending') {
          districtCounts[district].pending++;
        }
      }
    });

    return Object.entries(districtCounts).map(([district, stats]) => ({
      district,
      ...stats
    }));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const activeChapters = chapters.filter(c => c.status === 'active');
  const deactivatedChapters = chapters.filter(c => c.status === 'deactivated');
  const totalMembers = chapters.reduce((sum, c) => sum + c.totalMembers, 0);
  const districtStats = getDistrictStats();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900">Super Admin Dashboard</span>
                  <p className="text-sm text-slate-600">TSF Communication Club</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user.name}</span>
                <Badge variant="destructive">Super Admin</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push('/auth/login')}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Global Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Global Overview</h1>
          <p className="text-slate-600">
            Manage TSF Communication Club chapters across Kerala
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{colleges.length}</div>
              <p className="text-xs text-muted-foreground">
                Engineering colleges in Kerala
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chapters</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeChapters.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingChapters.length} pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                Across all chapters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((activeChapters.length / colleges.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                College penetration
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="chapters">All Chapters</TabsTrigger>
            <TabsTrigger value="districts">District View</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Pending Approvals */}
          <TabsContent value="pending">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Pending Chapter Approvals ({pendingChapters.length})
                  </CardTitle>
                  <CardDescription>
                    Review and approve or reject new chapter applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingChapters.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">All Caught Up!</h3>
                      <p className="text-slate-600">No pending chapter approvals at the moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingChapters.map((chapter) => {
                        const college = getCollegeDetails(chapter.collegeId);
                        return (
                          <div key={chapter.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium">{chapter.name}</h4>
                                <Badge variant="outline">Pending</Badge>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{chapter.description}</p>
                              <div className="flex items-center text-sm text-slate-500 space-x-4">
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {college?.city}, {college?.district}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Applied {new Date(chapter.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <Building className="w-4 h-4 mr-1" />
                                  {college?.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveChapter(chapter.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectChapter(chapter.id)}
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
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Chapters */}
          <TabsContent value="chapters">
            <Card>
              <CardHeader>
                <CardTitle>All Chapters</CardTitle>
                <CardDescription>
                  Manage all TSF chapters across Kerala
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chapter</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chapters.map((chapter) => {
                      const college = getCollegeDetails(chapter.collegeId);
                      return (
                        <TableRow key={chapter.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{chapter.name}</p>
                              <p className="text-sm text-slate-600">{chapter.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{college?.name}</p>
                              <p className="text-sm text-slate-600">{college?.city}</p>
                            </div>
                          </TableCell>
                          <TableCell>{college?.district}</TableCell>
                          <TableCell>{chapter.totalMembers}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                chapter.status === 'active' ? 'default' : 
                                chapter.status === 'pending' ? 'secondary' : 'destructive'
                              }
                            >
                              {chapter.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              {chapter.status === 'active' && (
                                <Button size="sm" variant="outline">
                                  Deactivate
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
          </TabsContent>

          {/* District View */}
          <TabsContent value="districts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Regional Overview by District
                </CardTitle>
                <CardDescription>
                  Chapter distribution and penetration across Kerala districts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {districtStats.map((stat) => (
                    <Card key={stat.district}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{stat.district}</h4>
                          <Badge variant="outline">{stat.total} colleges</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Active Chapters:</span>
                            <span className="font-medium text-green-600">{stat.active}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Pending:</span>
                            <span className="font-medium text-yellow-600">{stat.pending}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(stat.active / stat.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies */}
          <TabsContent value="policies">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Manage Policies
                  </CardTitle>
                  <CardDescription>
                    Configure system-wide policies and thresholds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Certificate Thresholds</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Bronze Certificate</span>
                              <Badge variant="secondary">100 points</Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                              Awarded for achieving 100+ points
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Silver Certificate</span>
                              <Badge variant="default">200 points</Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                              Awarded for achieving 200+ points
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Gold Certificate</span>
                              <Badge variant="destructive">300 points</Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                              Awarded for achieving 300+ points
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Point System</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-slate-50 rounded">
                          <span>Meeting Attendance</span>
                          <span className="font-medium">10 points</span>
                        </div>
                        <div className="flex justify-between p-3 bg-slate-50 rounded">
                          <span>Speaker Role</span>
                          <span className="font-medium">15 points</span>
                        </div>
                        <div className="flex justify-between p-3 bg-slate-50 rounded">
                          <span>Anchor Role</span>
                          <span className="font-medium">25 points</span>
                        </div>
                        <div className="flex justify-between p-3 bg-slate-50 rounded">
                          <span>Judge Role</span>
                          <span className="font-medium">20 points</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button>Edit Policies</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Reports & Analytics
                </CardTitle>
                <CardDescription>
                  Download comprehensive reports and analyze trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h4 className="font-medium mb-2">Member Activity Report</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        Weekly participation and engagement metrics
                      </p>
                      <Button variant="outline" className="w-full">
                        Download CSV
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h4 className="font-medium mb-2">Chapter Growth Report</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        Monthly membership and activity trends
                      </p>
                      <Button variant="outline" className="w-full">
                        Download CSV
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h4 className="font-medium mb-2">Certificate Report</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        Certificates issued and achievement statistics
                      </p>
                      <Button variant="outline" className="w-full">
                        Download CSV
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                      <h4 className="font-medium mb-2">Performance Analytics</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        Comprehensive system performance metrics
                      </p>
                      <Button variant="outline" className="w-full">
                        Download CSV
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}