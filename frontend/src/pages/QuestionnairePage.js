import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    work_hours_per_day: 9,
    sleep_hours: 7,
    work_from_home: false,
    commute_time_minutes: 30,
    night_shifts: false,
    flexible_hours: false,
    workload_level: 5,
    deadline_pressure: 5,
    manager_support: 5,
    team_support: 5,
    career_growth: 5,
    work_life_balance: 5,
    stress_level: 5,
    anxiety_frequency: 'sometimes',
    burnout_feeling: 'mild',
    physical_symptoms: [],
    family_responsibilities: 'medium',
    social_support: 'fair',
    hobbies_time: 'occasional',
    exercise_frequency: '1-2/week',
    workplace_bias_experienced: false,
    posh_awareness: false,
    safety_concerns: 'minor',
    age_group: '25-30',
    years_in_it: 3,
    current_role: '',
    city: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSymptom = (symptom) => {
    setFormData(prev => ({
      ...prev,
      physical_symptoms: prev.physical_symptoms.includes(symptom)
        ? prev.physical_symptoms.filter(s => s !== symptom)
        : [...prev.physical_symptoms, symptom]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.current_role || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/assessment/analyze`, formData);
      localStorage.setItem('assessment_result', JSON.stringify(response.data));
      toast.success('Assessment complete! Generating your personalized plan...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Assessment error:', error);
      toast.error('Failed to complete assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-teal-900 mb-4">Work Context</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Work Hours Per Day</Label>
          <Input 
            type="number" 
            value={formData.work_hours_per_day}
            onChange={(e) => updateField('work_hours_per_day', parseInt(e.target.value))}
            min="1" max="16"
            data-testid="work-hours-input"
          />
        </div>
        <div>
          <Label>Sleep Hours Per Night</Label>
          <Input 
            type="number" 
            step="0.5"
            value={formData.sleep_hours}
            onChange={(e) => updateField('sleep_hours', parseFloat(e.target.value))}
            min="3" max="12"
            data-testid="sleep-hours-input"
          />
        </div>
        <div>
          <Label>Commute Time (minutes)</Label>
          <Input 
            type="number" 
            value={formData.commute_time_minutes}
            onChange={(e) => updateField('commute_time_minutes', parseInt(e.target.value))}
            min="0" max="240"
            data-testid="commute-time-input"
          />
        </div>
        <div>
          <Label>Years in IT</Label>
          <Input 
            type="number" 
            value={formData.years_in_it}
            onChange={(e) => updateField('years_in_it', parseInt(e.target.value))}
            min="0" max="50"
            data-testid="years-in-it-input"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="wfh" 
            checked={formData.work_from_home}
            onCheckedChange={(checked) => updateField('work_from_home', checked)}
            data-testid="wfh-checkbox"
          />
          <Label htmlFor="wfh" className="cursor-pointer">Work from home available</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="flexible" 
            checked={formData.flexible_hours}
            onCheckedChange={(checked) => updateField('flexible_hours', checked)}
            data-testid="flexible-checkbox"
          />
          <Label htmlFor="flexible" className="cursor-pointer">Flexible work hours</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="night" 
            checked={formData.night_shifts}
            onCheckedChange={(checked) => updateField('night_shifts', checked)}
            data-testid="night-shifts-checkbox"
          />
          <Label htmlFor="night" className="cursor-pointer">Work night shifts</Label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-teal-900 mb-4">Work Pressure & Support</h3>
      
      {[
        { field: 'workload_level', label: 'Workload Level' },
        { field: 'deadline_pressure', label: 'Deadline Pressure' },
        { field: 'manager_support', label: 'Manager Support' },
        { field: 'team_support', label: 'Team Support' },
        { field: 'career_growth', label: 'Career Growth Opportunities' },
        { field: 'work_life_balance', label: 'Work-Life Balance' }
      ].map(item => (
        <div key={item.field}>
          <Label>{item.label} (1-10)</Label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={formData[item.field]}
              onChange={(e) => updateField(item.field, parseInt(e.target.value))}
              className="flex-1"
              data-testid={`${item.field}-slider`}
            />
            <span className="w-8 text-center font-semibold text-teal-700">{formData[item.field]}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-teal-900 mb-4">Mental Health & Wellbeing</h3>
      
      <div>
        <Label>Stress Level (1-10)</Label>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={formData.stress_level}
            onChange={(e) => updateField('stress_level', parseInt(e.target.value))}
            className="flex-1"
            data-testid="stress-level-slider"
          />
          <span className="w-8 text-center font-semibold text-teal-700">{formData.stress_level}</span>
        </div>
      </div>

      <div>
        <Label>Anxiety Frequency</Label>
        <Select value={formData.anxiety_frequency} onValueChange={(val) => updateField('anxiety_frequency', val)}>
          <SelectTrigger data-testid="anxiety-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rarely">Rarely</SelectItem>
            <SelectItem value="sometimes">Sometimes</SelectItem>
            <SelectItem value="often">Often</SelectItem>
            <SelectItem value="always">Always</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Burnout Feeling</Label>
        <Select value={formData.burnout_feeling} onValueChange={(val) => updateField('burnout_feeling', val)}>
          <SelectTrigger data-testid="burnout-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="mild">Mild</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="severe">Severe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Physical Symptoms (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['headache', 'fatigue', 'insomnia', 'back_pain', 'anxiety', 'digestive_issues'].map(symptom => (
            <div key={symptom} className="flex items-center space-x-2">
              <Checkbox 
                id={symptom}
                checked={formData.physical_symptoms.includes(symptom)}
                onCheckedChange={() => toggleSymptom(symptom)}
                data-testid={`symptom-${symptom}`}
              />
              <Label htmlFor={symptom} className="cursor-pointer text-sm">{symptom.replace('_', ' ')}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Exercise Frequency</Label>
          <Select value={formData.exercise_frequency} onValueChange={(val) => updateField('exercise_frequency', val)}>
            <SelectTrigger data-testid="exercise-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="1-2/week">1-2 times/week</SelectItem>
              <SelectItem value="3-4/week">3-4 times/week</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Time for Hobbies</Label>
          <Select value={formData.hobbies_time} onValueChange={(val) => updateField('hobbies_time', val)}>
            <SelectTrigger data-testid="hobbies-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="occasional">Occasional</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-teal-900 mb-4">Workplace & Safety</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Family Responsibilities</Label>
          <Select value={formData.family_responsibilities} onValueChange={(val) => updateField('family_responsibilities', val)}>
            <SelectTrigger data-testid="family-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Social Support</Label>
          <Select value={formData.social_support} onValueChange={(val) => updateField('social_support', val)}>
            <SelectTrigger data-testid="social-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="poor">Poor</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Safety Concerns</Label>
        <Select value={formData.safety_concerns} onValueChange={(val) => updateField('safety_concerns', val)}>
          <SelectTrigger data-testid="safety-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="major">Major</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="bias" 
            checked={formData.workplace_bias_experienced}
            onCheckedChange={(checked) => updateField('workplace_bias_experienced', checked)}
            data-testid="bias-checkbox"
          />
          <Label htmlFor="bias" className="cursor-pointer">I have experienced workplace bias/discrimination</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="posh" 
            checked={formData.posh_awareness}
            onCheckedChange={(checked) => updateField('posh_awareness', checked)}
            data-testid="posh-checkbox"
          />
          <Label htmlFor="posh" className="cursor-pointer">I am aware of POSH Act rights</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Age Group</Label>
          <Select value={formData.age_group} onValueChange={(val) => updateField('age_group', val)}>
            <SelectTrigger data-testid="age-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20-25">20-25</SelectItem>
              <SelectItem value="25-30">25-30</SelectItem>
              <SelectItem value="30-35">30-35</SelectItem>
              <SelectItem value="35-40">35-40</SelectItem>
              <SelectItem value="40+">40+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Current Role *</Label>
          <Input 
            value={formData.current_role}
            onChange={(e) => updateField('current_role', e.target.value)}
            placeholder="e.g., Software Engineer"
            data-testid="role-input"
          />
        </div>
      </div>

      <div>
        <Label>City *</Label>
        <Input 
          value={formData.city}
          onChange={(e) => updateField('city', e.target.value)}
          placeholder="e.g., Bangalore"
          data-testid="city-input"
        />
      </div>
    </div>
  );

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-teal-700">Step {step} of {totalSteps}</span>
            <span className="text-sm font-medium text-teal-700">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-teal-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl" data-testid="questionnaire-form">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-teal-100">
            {step > 1 ? (
              <Button 
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="border-teal-300 text-teal-700 hover:bg-teal-50"
                data-testid="prev-step-btn"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="border-teal-300 text-teal-700 hover:bg-teal-50"
                data-testid="back-home-btn"
              >
                Back to Home
              </Button>
            )}

            {step < totalSteps ? (
              <Button 
                onClick={() => setStep(step + 1)}
                className="bg-teal-600 hover:bg-teal-700 text-white"
                data-testid="next-step-btn"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white"
                data-testid="submit-assessment-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Complete Assessment'
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuestionnairePage;