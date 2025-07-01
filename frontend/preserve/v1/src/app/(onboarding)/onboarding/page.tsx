'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  TrendingUp, 
  Users, 
  Cog, 
  BarChart3, 
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Rocket
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    companyInfo: {
      industry: "",
      size: "",
      goals: []
    },
    agentPreferences: {
      primaryAgent: "",
      features: []
    },
    integrations: {
      email: false,
      crm: false,
      social: false
    }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const industries = [
    "Technology", "Healthcare", "Finance", "Retail", "Manufacturing", 
    "Education", "Real Estate", "Marketing", "Consulting", "Other"
  ];

  const companySizes = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-1000", label: "201-1000 employees" },
    { value: "1000+", label: "1000+ employees" }
  ];

  const businessGoals = [
    "Increase sales revenue",
    "Improve customer satisfaction",
    "Automate processes",
    "Better data insights",
    "Expand market reach",
    "Reduce operational costs"
  ];

  const agentTypes = [
    {
      id: "ceo",
      name: "CEO Agent",
      description: "Strategic planning and executive decision-making",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      id: "sales",
      name: "Sales Agent",
      description: "Lead generation and sales automation",
      icon: <Users className="h-6 w-6" />,
      color: "bg-green-500"
    },
    {
      id: "marketing",
      name: "Marketing Agent",
      description: "Content creation and campaign management",
      icon: <Zap className="h-6 w-6" />,
      color: "bg-purple-500"
    },
    {
      id: "operations",
      name: "Operations Agent",
      description: "Process automation and optimization",
      icon: <Cog className="h-6 w-6" />,
      color: "bg-orange-500"
    },
    {
      id: "analytics",
      name: "Analytics Agent",
      description: "Data analysis and business intelligence",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-red-500"
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Simulate setup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark onboarding as completed
      localStorage.setItem('onboarding_completed', 'true');
      localStorage.setItem('onboarding_data', JSON.stringify(onboardingData));
      
      // Redirect to CEO dashboard
      router.push('/dashboard/ceo');
    } catch (error) {
      console.error('Onboarding completion failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Tell us about your company</h2>
              <p className="text-gray-600">Help us customize your AI agents for your specific needs</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="industry">What industry are you in?</Label>
                <RadioGroup 
                  value={onboardingData.companyInfo.industry}
                  onValueChange={(value) => setOnboardingData(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, industry: value }
                  }))}
                  className="grid grid-cols-2 gap-2 mt-2"
                >
                  {industries.map((industry) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <RadioGroupItem value={industry} id={industry} />
                      <Label htmlFor={industry} className="text-sm">{industry}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>What's your company size?</Label>
                <RadioGroup 
                  value={onboardingData.companyInfo.size}
                  onValueChange={(value) => setOnboardingData(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, size: value }
                  }))}
                  className="mt-2"
                >
                  {companySizes.map((size) => (
                    <div key={size.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={size.value} id={size.value} />
                      <Label htmlFor={size.value}>{size.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What are your main goals?</h2>
              <p className="text-gray-600">Select the goals you want to achieve with AI automation</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {businessGoals.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={onboardingData.companyInfo.goals.includes(goal)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setOnboardingData(prev => ({
                          ...prev,
                          companyInfo: {
                            ...prev.companyInfo,
                            goals: [...prev.companyInfo.goals, goal]
                          }
                        }));
                      } else {
                        setOnboardingData(prev => ({
                          ...prev,
                          companyInfo: {
                            ...prev.companyInfo,
                            goals: prev.companyInfo.goals.filter(g => g !== goal)
                          }
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={goal} className="text-sm font-medium">{goal}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose your first AI agent</h2>
              <p className="text-gray-600">We'll set up this agent first, you can add more later</p>
            </div>
            
            <div className="grid gap-4">
              {agentTypes.map((agent) => (
                <Card 
                  key={agent.id}
                  className={`cursor-pointer border-2 transition-colors ${
                    onboardingData.agentPreferences.primaryAgent === agent.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setOnboardingData(prev => ({
                    ...prev,
                    agentPreferences: { ...prev.agentPreferences, primaryAgent: agent.id }
                  }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${agent.color} flex items-center justify-center text-white`}>
                        {agent.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
              <p className="text-gray-600">Your AI Agent CEO platform is ready to transform your business</p>
            </div>
            
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Setup Complete!</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Your {agentTypes.find(a => a.id === onboardingData.agentPreferences.primaryAgent)?.name} is ready to start working for you.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">What happens next:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Your AI agent will be deployed and configured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>You'll get access to your CEO dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Start managing your business with AI</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Agent CEO</span>
          </div>
          <Badge className="mb-4">
            Step {currentStep} of {totalSteps}
          </Badge>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
        </div>

        {/* Content */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
          
          {/* Navigation */}
          <div className="flex justify-between p-8 pt-0">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {currentStep < totalSteps ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!onboardingData.companyInfo.industry || !onboardingData.companyInfo.size)) ||
                  (currentStep === 2 && onboardingData.companyInfo.goals.length === 0) ||
                  (currentStep === 3 && !onboardingData.agentPreferences.primaryAgent)
                }
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Setting up..." : (
                  <>
                    Launch Dashboard
                    <Rocket className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 