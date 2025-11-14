'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, Search, Users, Check, MapPin } from 'lucide-react';
import { getColleges, getChaptersByCollegeId, searchColleges, College, Chapter } from '@/lib/data';

export default function JoinClubPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form data
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberSemester, setMemberSemester] = useState('');
  const [memberDepartment, setMemberDepartment] = useState('');
  const [memberBio, setMemberBio] = useState('');
  
  const router = useRouter();
  const colleges = getColleges();
  const searchResults = searchQuery ? searchColleges(searchQuery) : colleges.slice(0, 10);

  const handleCollegeSelect = (college: College) => {
    setSelectedCollege(college);
    setCurrentStep(2);
  };

  const handleChapterSelect = (chapter: Chapter) => {
    if (chapter.status === 'active') {
      setSelectedChapter(chapter);
      setCurrentStep(3);
    }
  };

  const handleSubmitMembership = async () => {
    if (!selectedChapter || !memberName || !memberEmail) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate membership request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store the membership request
      const membershipRequest = {
        chapter: selectedChapter,
        member: {
          name: memberName,
          email: memberEmail,
          phone: memberPhone,
          semester: memberSemester,
          department: memberDepartment,
          bio: memberBio
        },
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      
      localStorage.setItem('tsf_membership_request', JSON.stringify(membershipRequest));
      setSuccess(true);
      setCurrentStep(4);
    } catch (err) {
      setError('An error occurred while submitting your membership request');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Membership Request Submitted!</h2>
              <p className="text-slate-600 mb-6">
                Your membership request for {selectedChapter?.name} has been submitted successfully. The chapter admin will review your request and get back to you soon.
              </p>
              <div className="space-y-2">
                <Button onClick={() => router.push('/')} className="w-full">
                  Back to Home
                </Button>
                <Button variant="outline" onClick={() => router.push('/auth/login')} className="w-full">
                  Sign In to Check Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join a TSF Chapter</h1>
          <p className="text-slate-600">Become a member of an existing TSF Communication Club</p>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: College Selection */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your College</CardTitle>
              <CardDescription>
                Find your college to see available TSF Chapters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search for your college..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {searchResults.map((college) => (
                    <div
                      key={college.id}
                      onClick={() => handleCollegeSelect(college)}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="font-medium text-slate-900">{college.name}</div>
                      <div className="text-sm text-slate-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {college.city}, {college.district}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Chapter Selection */}
        {currentStep === 2 && selectedCollege && (
          <Card>
            <CardHeader>
              <CardTitle>Select a Chapter</CardTitle>
              <CardDescription>
                Choose an active TSF Chapter at your college
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Selected College:</h4>
                  <p className="text-slate-700">{selectedCollege.name}</p>
                  <p className="text-sm text-slate-600">{selectedCollege.city}, {selectedCollege.district}</p>
                </div>
                
                <div className="space-y-3">
                  {getChaptersByCollegeId(selectedCollege.id).map((chapter) => (
                    <div
                      key={chapter.id}
                      onClick={() => handleChapterSelect(chapter)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        chapter.status === 'active' 
                          ? 'hover:bg-slate-50 border-green-200 bg-green-50' 
                          : 'opacity-50 cursor-not-allowed bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900">{chapter.name}</div>
                          <div className="text-sm text-slate-600 mt-1">{chapter.description}</div>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm text-slate-500">
                              <Users className="w-3 h-3 inline mr-1" />
                              {chapter.totalMembers} members
                            </span>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              chapter.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {chapter.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        {chapter.status === 'active' && (
                          <Button variant="outline" size="sm">
                            Select
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {getChaptersByCollegeId(selectedCollege.id).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-600 mb-4">No TSF Chapters found at your college.</p>
                    <Button onClick={() => router.push('/auth/start-club')}>
                      Start a Chapter
                    </Button>
                  </div>
                )}
                
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="w-full">
                  Back to College Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Member Information */}
        {currentStep === 3 && selectedChapter && (
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Tell us about yourself to join the chapter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Selected Chapter:</h4>
                  <p className="text-slate-700">{selectedChapter.name}</p>
                  <p className="text-sm text-slate-600">{selectedChapter.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberName">Full Name *</Label>
                    <Input
                      id="memberName"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="memberEmail">Email Address *</Label>
                    <Input
                      id="memberEmail"
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberPhone">Phone Number</Label>
                    <Input
                      id="memberPhone"
                      value={memberPhone}
                      onChange={(e) => setMemberPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="memberSemester">Semester</Label>
                    <Input
                      id="memberSemester"
                      value={memberSemester}
                      onChange={(e) => setMemberSemester(e.target.value)}
                      placeholder="e.g., 6th Semester"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="memberDepartment">Department</Label>
                  <Input
                    id="memberDepartment"
                    value={memberDepartment}
                    onChange={(e) => setMemberDepartment(e.target.value)}
                    placeholder="e.g., Computer Science Engineering"
                  />
                </div>
                
                <div>
                  <Label htmlFor="memberBio">Bio</Label>
                  <Textarea
                    id="memberBio"
                    value={memberBio}
                    onChange={(e) => setMemberBio(e.target.value)}
                    placeholder="Tell us about yourself and why you want to join..."
                    rows={4}
                  />
                </div>
                
                <Button onClick={handleSubmitMembership} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    'Submit Membership Request'
                  )}
                </Button>
                
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="w-full">
                  Back to Chapter Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}