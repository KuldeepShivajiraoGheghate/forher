import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Heart, TrendingUp, Shield, Calendar } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Stress & Burnout Assessment',
      description: 'AI-powered analysis of your work-life balance and mental health patterns'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Personalized Daily Plans',
      description: '7-day actionable plans tailored to your specific situation and needs'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Workplace Support',
      description: 'Professional email templates and negotiation strategies for better work conditions'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Women Safety Resources',
      description: 'India-specific helplines, POSH Act guidance, and safety recommendations'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-teal-100 bg-white/60 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-teal-800">SheHuMaan</span>
          </div>
          <Button 
            onClick={() => navigate('/questionnaire')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6"
            data-testid="header-start-btn"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-teal-900 mb-6 leading-tight">
            Supporting Women in IT
          </h1>
          <p className="text-lg sm:text-xl text-teal-700 mb-8 max-w-2xl mx-auto">
            AI-powered platform to improve your work-life balance, mental health, and workplace safety. 
            Get personalized recommendations and support designed specifically for women in technology.
          </p>
          <Button 
            onClick={() => navigate('/questionnaire')}
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            data-testid="hero-get-started-btn"
          >
            Start Your Assessment
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-teal-900 mb-12">How We Support You</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-white/80 backdrop-blur-sm border-teal-100 hover:shadow-lg transition-all slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`feature-card-${index}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center mb-4 text-teal-700">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-teal-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-teal-700">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-teal-900 mb-12">How It Works</h2>
          <div className="space-y-8">
            {[
              { step: '01', title: 'Complete Questionnaire', desc: 'Share your work context, mental health, and safety concerns (5-10 minutes)' },
              { step: '02', title: 'AI Analysis', desc: 'Our AI analyzes your responses to assess stress, burnout risk, and key stressors' },
              { step: '03', title: 'Get Personalized Plan', desc: 'Receive a comprehensive dashboard with daily plans, workplace strategies, and resources' },
              { step: '04', title: 'Take Action', desc: 'Use email templates, safety tips, and professional resources to improve your situation' }
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start" data-testid={`how-step-${index}`}>
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white text-xl font-bold flex items-center justify-center">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-teal-900 mb-2">{item.title}</h3>
                  <p className="text-teal-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto p-10 bg-gradient-to-br from-teal-600 to-teal-500 text-white border-0 shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Work-Life Balance?</h2>
            <p className="text-lg mb-8 text-teal-50">
              Join women in IT who are taking control of their mental health and workplace well-being.
            </p>
            <Button 
              onClick={() => navigate('/questionnaire')}
              size="lg"
              className="bg-white text-teal-700 hover:bg-teal-50 px-8 py-6 text-lg rounded-full font-semibold"
              data-testid="cta-start-assessment-btn"
            >
              Start Your Assessment Now
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-teal-100 bg-white/60 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-teal-700">
          <p className="mb-2">SheHuMaan - Empowering Women in IT</p>
          <p className="text-xs text-teal-600">Emergency: Women Helpline 181 | NCW 7827-170-170 | Cyber Crime 1930</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;