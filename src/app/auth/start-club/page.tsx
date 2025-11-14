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
import { Loader2, ArrowLeft, Search, Plus, Check } from 'lucide-react';
import { getColleges, searchColleges, College } from '@/lib/data';

export default function StartClubPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCollegeForm, setShowNewCollegeForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form data
  const [chapterName, setChapterName] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  // New college form
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeCity, setNewCollegeCity] = useState('');
  const [newCollegeDistrict, setNewCollegeDistrict] = useState('');
  const [newCollegeWebsite, setNewCollegeWebsite] = useState('');
  const [newCollegeProof, setNewCollegeProof] = useState('');
  
  const router = useRouter();
  const colleges = getColleges();
  const searchResults = searchQuery ? searchColleges(searchQuery) : colleges.slice(0, 10);

  const handleCollegeSelect = (college: College) => {
    setSelectedCollege(college);
    setChapterName(`TSF Chapter - ${college.name}`);
    setCurrentStep(2);
  };

  const handleNewCollege = () => {
    setShowNewCollegeForm(true);
    setCurrentStep(2);
  };

  const handleSubmitNewCollege = () => {
    if (!newCollegeName || !newCollegeCity || !newCollegeDistrict) {
      setError('Please fill in all required fields');
      return;
    }
    
    const newCollege: College = {
      id: (colleges.length + 1).toString(),
      name: newCollegeName,
      shortName: newCollegeName.split(' ').map(word => word[0]).join('').toUpperCase(),
      city: newCollegeCity,
      district: newCollegeDistrict,
      website: newCollegeWebsite,
      type: 'Unknown',
      established: new Date().getFullYear(),
      affiliation: 'Unknown'
    };
    
    setSelectedCollege(newCollege);
    setChapterName(`TSF Chapter - ${newCollegeName}`);
    setShowNewCollegeForm(false);
    setCurrentStep(3);
  };

  const handleSubmitChapter = async () => {
    if (!selectedCollege || !chapterName || !contactName || !contactEmail) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate chapter creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store the chapter submission
      const chapterSubmission = {
        college: selectedCollege,
        chapterName,
        chapterDescription,
        contact: {
          name: contactName,
          phone: contactPhone,
          email: contactEmail
        },
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      
      localStorage.setItem('tsf_chapter_submission', JSON.stringify(chapterSubmission));
      setSuccess(true);
      setCurrentStep(4);
    } catch (err) {
      setError('An error occurred while submitting your chapter application');
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
              <p className="text-slate-600 mb-6">
                Your TSF Chapter application has been submitted successfully. We'll review it and get back to you within 3-5 business days.
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
          <Link href="/auth/signup" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign Up
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Start a TSF Chapter</h1>
          <p className="text-slate-600">Bring communication excellence to your college</p>
          
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
        {currentStep === 1 && !showNewCollegeForm && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your College</CardTitle>
              <CardDescription>
                Search for your college or add a new one if it's not listed
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
                      <div className="text-sm text-slate-600">{college.city}, {college.district}</div>
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleNewCollege}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New College
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: New College Form */}
        {showNewCollegeForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New College</CardTitle>
              <CardDescription>
                Please provide details about your college
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="collegeName">College Name *</Label>
                    <Input
                      id="collegeName"
                      value={newCollegeName}
                      onChange={(e) => setNewCollegeName(e.target.value)}
                      placeholder="Enter college name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="collegeCity">City *</Label>
                    <Input
                      id="collegeCity"
                      value={newCollegeCity}
                      onChange={(e) => setNewCollegeCity(e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="collegeDistrict">District *</Label>
                    <Input
                      id="collegeDistrict"
                      value={newCollegeDistrict}
                      onChange={(e) => setNewCollegeDistrict(e.target.value)}
                      placeholder="Enter district"
                    />
                  </div>
                  <div>
                    <Label htmlFor="collegeWebsite">Website</Label>
                    <Input
                      id="collegeWebsite"
                      value={newCollegeWebsite}
                      onChange={(e) => setNewCollegeWebsite(e.target.value)}
                      placeholder="Enter website URL"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="collegeProof">Proof URL</Label>
                  <Input
                    id="collegeProof"
                    value={newCollegeProof}
                    onChange={(e) => setNewCollegeProof(e.target.value)}
                    placeholder="Enter proof of college existence URL"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button onClick={handleSubmitNewCollege} className="flex-1">
                    Continue
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewCollegeForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2/3: Chapter Details */}
        {(currentStep === 2 && !showNewCollegeForm) || (currentStep === 3 && !showNewCollegeForm) && (
          <Card>
            <CardHeader>
              <CardTitle>Chapter Details</CardTitle>
              <CardDescription>
                Tell us about your proposed TSF Chapter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="chapterName">Chapter Name</Label>
                  <Input
                    id="chapterName"
                    value={chapterName}
                    onChange={(e) => setChapterName(e.target.value)}
                    placeholder="Enter chapter name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="chapterDescription">Chapter Description</Label>
                  <Textarea
                    id="chapterDescription"
                    value={chapterDescription}
                    onChange={(e) => setChapterDescription(e.target.value)}
                    placeholder="Describe your vision for the chapter..."
                    rows={4}
                  />
                </div>
                
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Selected College:</h4>
                  <p className="text-slate-700">{selectedCollege?.name}</p>
                  <p className="text-sm text-slate-600">{selectedCollege?.city}, {selectedCollege?.district}</p>
                </div>
                
                <div className="flex space-x-4">
                  <Button onClick={() => setCurrentStep(currentStep + 1)} className="flex-1">
                    Continue
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1">
                    Back
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3/4: Contact Information */}
        {(currentStep === 3 && !showNewCollegeForm) || (currentStep === 4 && !showNewCollegeForm) && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Provide your contact details for follow-up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactEmail">Email Address *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <Button onClick={handleSubmitChapter} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    'Submit Chapter Application'
                  )}
                </Button>
                
                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="w-full">
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}