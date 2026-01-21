import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  Mail, 
  Shield, 
  Phone, 
  AlertCircle,
  Home,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(null);

  useEffect(() => {
    const storedResult = localStorage.getItem('assessment_result');
    if (!storedResult) {
      toast.error('No assessment found. Please complete the questionnaire first.');
      navigate('/questionnaire');
      return;
    }
    setResult(JSON.parse(storedResult));
  }, [navigate]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-teal-700">Loading your personalized plan...</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(type);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const getStressColor = (level) => {
    if (level === 'high') return 'text-red-600 bg-red-50 border-red-200';
    if (level === 'medium') return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStressPosition = (score) => {
    return `${Math.min(Math.max(score, 0), 100)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-teal-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-teal-800">SheHuMaan</span>
          </div>
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="border-teal-300 text-teal-700"
            data-testid="home-btn"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Warnings */}
        {result.warnings && result.warnings.length > 0 && (
          <Card className="p-4 mb-6 bg-amber-50 border-amber-200" data-testid="warnings-card">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                {result.warnings.map((warning, index) => (
                  <p key={index} className="text-amber-900 text-sm">{warning}</p>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Quick Summary */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm shadow-lg fade-in" data-testid="summary-card">
          <h2 className="text-2xl font-bold text-teal-900 mb-4">Your Assessment Results</h2>
          <p className="text-teal-700 leading-relaxed">{result.quick_summary}</p>
        </Card>

        {/* Stress & Burnout Meters */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg slide-in" data-testid="stress-meter-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-teal-900">Stress Level</h3>
            </div>
            <Badge className={`mb-4 ${getStressColor(result.stress_level)}`}>
              {result.stress_level.toUpperCase()} - {result.stress_score}/100
            </Badge>
            <div className="stress-meter">
              <div 
                className="stress-indicator" 
                style={{ left: getStressPosition(result.stress_score) }}
              />
            </div>
            <div className="flex justify-between text-xs text-teal-600 mt-2">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg slide-in" style={{ animationDelay: '0.1s' }} data-testid="burnout-meter-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-teal-900">Burnout Risk</h3>
            </div>
            <Badge className={`mb-4 ${getStressColor(result.burnout_risk)}`}>
              {result.burnout_risk.toUpperCase()} - {result.burnout_score}/100
            </Badge>
            <div className="stress-meter">
              <div 
                className="stress-indicator" 
                style={{ left: getStressPosition(result.burnout_score) }}
              />
            </div>
            <div className="flex justify-between text-xs text-teal-600 mt-2">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </Card>
        </div>

        {/* Key Stressors */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm shadow-lg fade-in" data-testid="stressors-card">
          <h3 className="text-xl font-semibold text-teal-900 mb-4">Key Stressors Identified</h3>
          <div className="flex flex-wrap gap-2">
            {result.key_stressors.map((stressor, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-teal-50 text-teal-700 border-teal-200 px-3 py-1"
                data-testid={`stressor-${index}`}
              >
                {stressor}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Explanation */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm shadow-lg fade-in" data-testid="explanation-card">
          <h3 className="text-xl font-semibold text-teal-900 mb-4">Understanding Your Results</h3>
          <p className="text-teal-700 leading-relaxed whitespace-pre-line">{result.explanation}</p>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="plan" className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-white/90 backdrop-blur-sm" data-testid="tabs-list">
            <TabsTrigger value="plan" data-testid="tab-plan">
              <Calendar className="w-4 h-4 mr-2" />
              7-Day Plan
            </TabsTrigger>
            <TabsTrigger value="workplace" data-testid="tab-workplace">
              <Mail className="w-4 h-4 mr-2" />
              Workplace
            </TabsTrigger>
            <TabsTrigger value="safety" data-testid="tab-safety">
              <Shield className="w-4 h-4 mr-2" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">
              <Phone className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* 7-Day Plan */}
          <TabsContent value="plan" className="mt-6" data-testid="plan-content">
            <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg">
              <h3 className="text-xl font-semibold text-teal-900 mb-4">Your Personalized 7-Day Plan</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {result.daily_plan.map((day) => (
                  <AccordionItem key={day.day} value={`day-${day.day}`} className="border border-teal-100 rounded-lg px-4" data-testid={`day-${day.day}-accordion`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center font-semibold">
                          {day.day}
                        </div>
                        <span className="font-semibold text-teal-900">Day {day.day}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-teal-800 mb-1">Sleep Goal</p>
                        <p className="text-sm text-teal-700">{day.sleep_goal}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-teal-800 mb-1">Breaks</p>
                        <p className="text-sm text-teal-700">{day.breaks}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-teal-800 mb-1">Micro Habit</p>
                        <p className="text-sm text-teal-700">{day.habit}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-teal-800 mb-1">Work Boundary</p>
                        <p className="text-sm text-teal-700">{day.boundary}</p>
                      </div>
                      <div className="pt-2 border-t border-teal-100">
                        <p className="text-sm italic text-teal-600">💚 {day.message}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </TabsContent>

          {/* Workplace Tab */}
          <TabsContent value="workplace" className="mt-6" data-testid="workplace-content">
            <div className="space-y-6">
              <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg">
                <h3 className="text-xl font-semibold text-teal-900 mb-4">Flexibility Suggestions</h3>
                <ul className="space-y-2">
                  {result.flex_suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2" data-testid={`flex-suggestion-${index}`}>
                      <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-teal-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg email-box" data-testid="email-manager-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-teal-900">Email to Manager</h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(result.email_to_manager, 'manager')}
                    data-testid="copy-manager-email-btn"
                  >
                    {copiedEmail === 'manager' ? (
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedEmail === 'manager' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <pre className="text-sm text-teal-700 whitespace-pre-wrap font-sans">{result.email_to_manager}</pre>
              </Card>

              <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg email-box" data-testid="email-hr-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-teal-900">Email to HR</h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(result.email_to_hr, 'hr')}
                    data-testid="copy-hr-email-btn"
                  >
                    {copiedEmail === 'hr' ? (
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedEmail === 'hr' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <pre className="text-sm text-teal-700 whitespace-pre-wrap font-sans">{result.email_to_hr}</pre>
              </Card>
            </div>
          </TabsContent>

          {/* Safety Tab */}
          <TabsContent value="safety" className="mt-6" data-testid="safety-content">
            <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-semibold text-teal-900">Women Safety Guidelines</h3>
              </div>
              <Badge className={`mb-4 ${getStressColor(result.safety_risk)}`}>
                Safety Risk: {result.safety_risk.toUpperCase()}
              </Badge>
              <ul className="space-y-3">
                {result.safety_tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg" data-testid={`safety-tip-${index}`}>
                    <Shield className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-teal-800">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6" data-testid="resources-content">
            <div className="space-y-4">
              {result.resources.map((resource, index) => (
                <Card key={index} className="p-5 bg-white/90 backdrop-blur-sm shadow-lg resource-card" data-testid={`resource-${index}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-teal-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-teal-900 mb-1">{resource.title}</h4>
                      <p className="text-sm text-teal-600 mb-2">{resource.type}</p>
                      <p className="text-sm font-medium text-teal-800 mb-2">{resource.contact}</p>
                      <p className="text-sm text-teal-700">{resource.why}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card className="p-6 bg-gradient-to-br from-teal-600 to-teal-500 text-white shadow-xl text-center">
          <h3 className="text-2xl font-bold mb-3">Need More Support?</h3>
          <p className="mb-6 text-teal-50">Take the assessment again anytime or reach out to professional resources.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              onClick={() => navigate('/questionnaire')}
              className="bg-white text-teal-700 hover:bg-teal-50"
              data-testid="retake-assessment-btn"
            >
              Retake Assessment
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              data-testid="back-home-bottom-btn"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-teal-100 bg-white/60 backdrop-blur-sm py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-teal-700">
          <p className="mb-2">SheHuMaan - Empowering Women in IT</p>
          <p className="text-xs text-teal-600">Emergency: Women Helpline 181 | NCW 7827-170-170 | Cyber Crime 1930</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
