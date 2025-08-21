import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplets, Plus, Minus, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaterEntry {
  id: string;
  amount: number;
  timestamp: Date;
}

const WaterTracker = () => {
  const [dailyGoal, setDailyGoal] = useState(2000); // ml
  const [todayIntake, setTodayIntake] = useState(0);
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedGoal = localStorage.getItem('waterGoal');
    const savedIntake = localStorage.getItem('todayIntake');
    const savedEntries = localStorage.getItem('waterEntries');
    
    if (savedGoal) setDailyGoal(parseInt(savedGoal));
    if (savedIntake) setTodayIntake(parseInt(savedIntake));
    if (savedEntries) setEntries(JSON.parse(savedEntries));
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('waterGoal', dailyGoal.toString());
    localStorage.setItem('todayIntake', todayIntake.toString());
    localStorage.setItem('waterEntries', JSON.stringify(entries));
  }, [dailyGoal, todayIntake, entries]);

  const addWater = (amount: number) => {
    const newEntry: WaterEntry = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date()
    };
    
    setEntries(prev => [...prev, newEntry]);
    setTodayIntake(prev => prev + amount);
    
    toast({
      description: `Added ${amount}ml to your daily intake!`,
    });
  };

  const removeLastEntry = () => {
    if (entries.length === 0) return;
    
    const lastEntry = entries[entries.length - 1];
    setEntries(prev => prev.slice(0, -1));
    setTodayIntake(prev => Math.max(0, prev - lastEntry.amount));
    
    toast({
      description: `Removed ${lastEntry.amount}ml from your intake`,
    });
  };

  const progressPercentage = Math.min((todayIntake / dailyGoal) * 100, 100);
  const remainingAmount = Math.max(0, dailyGoal - todayIntake);

  return (
    <div className="min-h-screen bg-wave-gradient p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white pt-8 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Droplets className="h-8 w-8 text-primary-glow" />
            <h1 className="text-3xl font-bold">AquaTracker</h1>
          </div>
          <p className="text-blue-100">Stay hydrated, stay healthy</p>
        </div>

        {/* Progress Circle */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-water border-0">
          <div className="text-center space-y-4">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - progressPercentage / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-primary">{todayIntake}</div>
                <div className="text-sm text-muted-foreground">ml</div>
                <div className="text-xs text-muted-foreground mt-1">of {dailyGoal}ml</div>
              </div>
            </div>
            
            {remainingAmount > 0 ? (
              <p className="text-muted-foreground">
                {remainingAmount}ml remaining to reach your goal
              </p>
            ) : (
              <p className="text-primary font-semibold flex items-center justify-center gap-2">
                <Target className="h-4 w-4" />
                Goal achieved! Great job!
              </p>
            )}
          </div>
        </Card>

        {/* Quick Add Buttons */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-water border-0">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Quick Add
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[250, 500, 750, 1000].map((amount) => (
              <Button
                key={amount}
                onClick={() => addWater(amount)}
                variant="outline"
                className="h-16 text-lg font-semibold bg-drop-gradient border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {amount}ml
              </Button>
            ))}
          </div>
          
          {entries.length > 0 && (
            <Button
              onClick={removeLastEntry}
              variant="outline"
              className="w-full mt-4 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Minus className="h-4 w-4 mr-2" />
              Remove Last ({entries[entries.length - 1]?.amount}ml)
            </Button>
          )}
        </Card>

        {/* Today's Stats */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-water border-0">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Today's Progress
          </h3>
          
          <div className="space-y-3">
            <Progress value={progressPercentage} className="h-3" />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{Math.round(progressPercentage)}% complete</span>
              <span>{entries.length} drinks today</span>
            </div>
            
            {entries.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-2">Recent entries:</p>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {entries.slice(-3).reverse().map((entry) => (
                    <div key={entry.id} className="flex justify-between text-sm text-muted-foreground">
                      <span>{entry.amount}ml</span>
                      <span>{new Date(entry.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Goal Setting */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-water border-0">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Daily Goal
          </h3>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setDailyGoal(prev => Math.max(1000, prev - 250))}
              variant="outline"
              size="icon"
              className="border-primary/20"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-primary">{dailyGoal}</div>
              <div className="text-sm text-muted-foreground">ml per day</div>
            </div>
            <Button
              onClick={() => setDailyGoal(prev => Math.min(5000, prev + 250))}
              variant="outline"
              size="icon"
              className="border-primary/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WaterTracker;