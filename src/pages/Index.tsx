
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Calendar, Users, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex flex-col items-start p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] group">
    <div className="p-3 mb-4 bg-primary/10 rounded-lg text-primary">
      {icon}
    </div>
    <h3 className="font-medium text-lg mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const HeroImage = () => (
  <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-tr from-primary/20 to-primary/5 rounded-2xl overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[70%] aspect-video bg-white/90 backdrop-blur rounded-lg shadow-2xl border border-white/50 overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
        alt="Project Management Dashboard" 
        className="w-full h-full object-cover opacity-90"
      />
    </div>
  </div>
);

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  const features = [
    {
      icon: <Clock size={24} />,
      title: "Interactive Timeline",
      description: "Visualize project progress with our intuitive timeline view. Track milestones and deadlines with ease."
    },
    {
      icon: <Calendar size={24} />,
      title: "Calendar Integration",
      description: "Seamlessly plan and schedule with our calendar view. Never miss an important deadline again."
    },
    {
      icon: <Users size={24} />,
      title: "Team Management",
      description: "Collaborate effectively with your team. Assign tasks and track progress in real-time."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Comprehensive Reports",
      description: "Generate detailed reports to gain insights into project performance and team productivity."
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <span className="animate-pulse mr-2">•</span> Project Management Simplified
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Manage projects <span className="text-primary">efficiently</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                All-in-one project management platform that helps teams collaborate, plan, and deliver their best work.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/dashboard">
                      Go to Dashboard <ArrowRight size={16} />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="gap-2">
                      <Link to="/login">
                        Get Started <ArrowRight size={16} />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/login">
                        Log In
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <HeroImage />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to manage projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides powerful tools to help you plan, track, and deliver your projects successfully.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" 
                alt="Project Dashboard" 
                className="rounded-lg shadow-lg border border-gray-100 w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Why choose our platform?</h2>
              <div className="space-y-4">
                {[
                  "Intuitive and easy-to-use interface",
                  "Real-time collaboration and updates",
                  "Customizable workflows and dashboards",
                  "Comprehensive analytics and reporting",
                  "Seamless integration with your existing tools"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="mt-4">
                <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                  {isAuthenticated ? "Go to Dashboard" : "Try it Now"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-primary/5 rounded-3xl mx-4 sm:mx-6 md:mx-8 lg:mx-12 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your projects?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of teams already using our platform to deliver their projects on time.
          </p>
          <Button asChild size="lg" className="px-8">
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              {isAuthenticated ? "View Your Projects" : "Get Started for Free"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 md:px-8 lg:px-12 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2023 ProjectFlow. All rights reserved.</p>
            <p className="mt-2">Demo product - Not for commercial use</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
