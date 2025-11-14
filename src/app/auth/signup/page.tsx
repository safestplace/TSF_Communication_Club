'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { getColleges, searchColleges, College } from '@/lib/data';
import { Loader2, Mail, Lock, User, ArrowLeft, Users, Plus, Search } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPathSelection, setShowPathSelection] = useState(false);
  const [showStartDetails, setShowStartDetails] = useState(false);
  const [collegeQuery, setCollegeQuery] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [purpose, setPurpose] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const flowParam = searchParams.get('flow');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      if (flowParam === 'start') {
        setShowStartDetails(true);
      } else {
        setShowPathSelection(true);
      }
    } catch (err) {
      setError('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePathSelection = (path: 'start' | 'join') => {
    // Store signup data and redirect to appropriate flow
    localStorage.setItem('tsf_signup_data', JSON.stringify({
      name,
      email,
      password
    }));
    
    if (path === 'start') {
      setShowStartDetails(true);
    } else {
      router.push('/auth/join-club');
    }
  };

  const handleSubmitStartRequest = () => {
    const list = collegeQuery ? searchColleges(collegeQuery) : getColleges();
    const college = list.find(c => c.id === selectedCollegeId) as College | undefined;
    if (!college || !chapterName) return;
    localStorage.setItem('tsf_start_request', JSON.stringify({ name, email, chapterName, collegeId: college.id }));
    setShowStartDetails(false);
    setShowPathSelection(false);
    router.push('/auth/login');
  };

  if (showStartDetails) {
    const results = collegeQuery ? searchColleges(collegeQuery) : getColleges();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">TSF Communication Club</h1>
            <p className="text-slate-600">Start a Club – College Details</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>College Details</CardTitle>
              <CardDescription>Provide your college information to request chapter approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="college">Search College</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="college" value={collegeQuery} onChange={(e)=>setCollegeQuery(e.target.value)} placeholder="Type college name, city or district" className="pl-10" />
                  </div>
                </div>

                <div className="max-h-48 overflow-auto border rounded-md">
                  {results.map((c)=> (
                    <button key={c.id} type="button" className={`w-full text-left px-4 py-2 hover:bg-slate-50 ${selectedCollegeId===c.id? 'bg-blue-50':''}`} onClick={()=>setSelectedCollegeId(c.id)}>
                      {c.name} <span className="text-sm text-slate-600">({c.city}, {c.district})</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chapterName">Proposed Chapter Name</Label>
                  <Input id="chapterName" value={chapterName} onChange={(e)=>setChapterName(e.target.value)} placeholder="e.g., TSF Communication Club – NIT Calicut" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose / Notes</Label>
                  <Textarea id="purpose" value={purpose} onChange={(e)=>setPurpose(e.target.value)} placeholder="Briefly describe why you want to start this chapter" />
                </div>

                <Button className="w-full" disabled={!selectedCollegeId || !chapterName} onClick={handleSubmitStartRequest}>Submit for Approval</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showPathSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose Your Path</h1>
            <p className="text-slate-600">How would you like to get started with TSF Communication Club?</p>
          </div>

          <div className="space-y-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handlePathSelection('start')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Start a Club</h3>
                    <p className="text-sm text-slate-600">Create a new TSF Chapter at your college</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handlePathSelection('join')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Join a Club</h3>
                    <p className="text-sm text-slate-600">Become a member of an existing TSF Chapter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setShowPathSelection(false)}>
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">TSF Communication Club</h1>
          <p className="text-slate-600">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Join the TSF Communication Club community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-slate-900 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}