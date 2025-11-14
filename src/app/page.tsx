'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  MapPin, 
  Star,
  ArrowRight,
  Mic,
  Target,
  GraduationCap,
  CheckCircle
} from 'lucide-react';
import { getChapters, getColleges, Chapter, College } from '@/lib/data';

export default function HomePage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    setChapters(getChapters().filter(chapter => chapter.status === 'active'));
    setColleges(getColleges());
  }, []);

  const features = [
    {
      icon: Mic,
      title: 'Public Speaking',
      description: 'Build confidence and master the art of public speaking through regular practice sessions.'
    },
    {
      icon: Users,
      title: 'Peer Learning',
      description: 'Learn from fellow students and develop communication skills in a supportive environment.'
    },
    {
      icon: Target,
      title: 'Placement Success',
      description: 'Improve your interview skills and increase placement opportunities with better communication.'
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Earn recognized certificates and build your portfolio with communication achievements.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed feedback and performance analytics.'
    },
    {
      icon: GraduationCap,
      title: 'Professional Development',
      description: 'Develop essential soft skills required for career growth and professional success.'
    }
  ];

  const testimonials = [
    {
      name: 'Adrian Jacob',
      role: 'Computer Science, NIT Calicut',
      content: 'TSF Communication Club transformed my confidence. I went from being afraid of public speaking to winning debate competitions!',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Adrian+Jacob&background=0D8ABC&color=fff&size=150'
    },
    {
      name: 'Arjun Menon',
      role: 'Mechanical Engineering, NIT Calicut',
      content: 'The regular practice sessions and feedback helped me ace my placement interviews. Highly recommended for all engineering students.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Anjali Pillai',
      role: 'Electronics Engineering, CET',
      content: 'The structured approach to communication skill development is amazing. I\'ve seen significant improvement in just 3 months.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Join or Start a Chapter',
      description: 'Connect with an existing TSF Chapter at your college or start a new one.'
    },
    {
      step: 2,
      title: 'Attend Regular Sessions',
      description: 'Participate in weekly meetings, practice sessions, and workshops.'
    },
    {
      step: 3,
      title: 'Build Your Skills',
      description: 'Develop communication skills through practice, feedback, and certifications.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="TSF Communication Club" className="h-8 w-8 rounded-full ring-2 ring-blue-200 shadow-sm" />
              <span className="text-xl font-bold text-slate-900">TSF Communication Club</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Get Started</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Get Started</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/auth/signup?flow=start">
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle>Start a Club</CardTitle>
                          <CardDescription>Begin a new chapter at your college</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                    <Link href="/auth/join-club">
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle>Join a Club</CardTitle>
                          <CardDescription>Find and join an existing chapter</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              <span>Welcome to the </span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TSF Communication Club</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Improve communication & placement success across Kerala engineering colleges
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup?flow=start">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start a Club
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/join-club">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Join a Club
                  <Users className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-all hover:scale-[1.02]">
              <CardContent className="py-6">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{colleges.length}+</div>
                <div className="text-slate-600">Engineering Colleges</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all hover:scale-[1.02]">
              <CardContent className="py-6">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{chapters.length}</div>
                <div className="text-slate-600">Active Chapters</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all hover:scale-[1.02]">
              <CardContent className="py-6">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-slate-600">Members</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all hover:scale-[1.02]">
              <CardContent className="py-6">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-slate-600">Sessions Conducted</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started with TSF Communication Club in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose TSF Communication Club?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive skill development with proven results
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Chapters */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Active Chapters Across Kerala
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join our growing community of communication enthusiasts
            </p>
          </div>
          
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {chapters.map((chapter) => {
                const college = colleges.find(c => c.id === chapter.collegeId);
                return (
                  <CarouselItem key={chapter.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                          <div className="flex items-center text-sm text-slate-500">
                            <Users className="w-4 h-4 mr-1" />
                            {chapter.totalMembers}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{chapter.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {college?.city}, {college?.district}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 mb-4">
                          {chapter.description}
                        </p>
                        <div className="text-sm text-slate-500">
                          <div>Meetings: {chapter.meetingDay}s at {chapter.meetingTime}</div>
                          <div>Frequency: {chapter.meetingFrequency}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Our Members Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Real stories from students who transformed their communication skills
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Communication Skills?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of engineering students across Kerala who are building confidence and achieving placement success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?flow=start">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Start a Chapter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/join-club">
              <Button size="lg" className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-blue-50">
                Join Existing Chapter
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.svg" alt="TSF Communication Club" className="h-8 w-8 rounded-full ring-2 ring-blue-300 shadow-sm" />
                <span className="text-xl font-bold">TSF Communication Club</span>
              </div>
              <p className="text-slate-400">
                Empowering engineering students across Kerala with essential communication skills.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/auth/signup?flow=start" className="hover:text-white">Start a Club</Link></li>
                <li><Link href="/auth/join-club" className="hover:text-white">Join a Club</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Email: pradeep@igniquest.com</li>
                <li>Phone: +91 9731568056</li>
                <li>Location: Kerala, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 TSF Communication Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}