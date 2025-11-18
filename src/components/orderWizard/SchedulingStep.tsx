import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, Zap } from 'lucide-react';
import { addDays, format, isWeekend, isBefore, startOfDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useOrderWizard, ScheduleData } from '../../stores/orderWizardStore';

interface SchedulingStepProps {
  className?: string;
}

const PICKUP_TIMES = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];

export const SchedulingStep: React.FC<SchedulingStepProps> = ({ className }) => {
  const { data, setWizardData } = useOrderWizard();
  const schedule = data.schedule;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    schedule?.pickupDate ? new Date(schedule.pickupDate) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>(schedule?.pickupTime);

  // Calculate minimum pickup date (2 days from now + 4 hour buffer)
  const now = new Date();
  const minimumDate = addDays(startOfDay(now), 2);
  const isRushOrder = selectedDate && isBefore(selectedDate, addDays(startOfDay(now), 3));

  // Update wizard data when schedule changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const scheduleData: ScheduleData = {
        pickupDate: selectedDate,
        pickupTime: selectedTime,
        isRush: isRushOrder || false,
      };
      setWizardData({ schedule: scheduleData });
    }
  }, [selectedDate, selectedTime, isRushOrder, setWizardData]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Disable dates that don't meet business rules
  const disabledDays = (date: Date) => {
    // Can't pick up before minimum date
    if (isBefore(startOfDay(date), minimumDate)) {
      return true;
    }
    
    // Emily Bakes Cakes is closed on Sundays
    if (date.getDay() === 0) {
      return true;
    }
    
    return false;
  };

  const daysSinceToday = selectedDate 
    ? Math.ceil((selectedDate.getTime() - startOfDay(now).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className={className}>
      {/* Business Rules Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Pickup Requirements:</strong> Orders must be placed at least <strong>2 days in advance</strong> with 
          a 4-hour buffer. We're closed Sundays. Rush orders may incur additional fees.
        </AlertDescription>
      </Alert>

      {/* Calendar Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Select Pickup Date
          </CardTitle>
          <CardDescription>
            Choose when you'd like to pick up your order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              initialFocus
              className="rounded-md border"
            />
          </div>

          {selectedDate && (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div>
                  <p className="font-medium text-primary">Selected Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
                {isRushOrder && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Rush Order
                  </Badge>
                )}
              </div>

              {isRushOrder && (
                <Alert variant="destructive">
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Rush Order Fee:</strong> Orders with less than 3 days notice require a 75% deposit 
                    instead of 50%. Additional rush fee of $25 applies.
                  </AlertDescription>
                </Alert>
              )}

              {isWeekend(selectedDate) && selectedDate.getDay() === 6 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Saturday Pickup:</strong> Our bakery is busiest on Saturdays. Please arrive during your 
                    selected time slot to avoid waiting.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Selection */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Select Pickup Time
            </CardTitle>
            <CardDescription>
              Choose your preferred pickup time slot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickup-time">Pickup Time *</Label>
              <Select value={selectedTime} onValueChange={handleTimeSelect}>
                <SelectTrigger id="pickup-time">
                  <SelectValue placeholder="Select a time..." />
                </SelectTrigger>
                <SelectContent>
                  {PICKUP_TIMES.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTime && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900">Pickup Confirmed For:</h4>
                    <p className="text-sm text-green-700 mt-1">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Please arrive within 15 minutes of your scheduled time. Your cake will be ready and waiting!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preparation Timeline */}
      {selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle>Preparation Timeline</CardTitle>
            <CardDescription>
              How we'll prepare your custom cake
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div className="w-0.5 h-full bg-primary/20 flex-1" />
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-semibold">Order Confirmation</h4>
                  <p className="text-sm text-muted-foreground">Today - Deposit payment processed</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div className="w-0.5 h-full bg-primary/20 flex-1" />
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-semibold">Baking Day</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(addDays(selectedDate, -1), 'EEEE, MMM d')} - Fresh cake baked
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div className="w-0.5 h-full bg-primary/20 flex-1" />
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-semibold">Decoration Day</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, 'EEEE, MMM d')} - Morning - Final decorating
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-700">Ready for Pickup!</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, 'EEEE, MMM d')} at {selectedTime}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pickup Instructions */}
      {selectedDate && selectedTime && (
        <Card className="border-primary/50">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-primary">Important Pickup Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>Bring your order confirmation number: <strong>Will be provided after checkout</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>Payment of remaining balance is due at pickup</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>Bring a flat, stable surface in your vehicle to transport the cake</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>If you can't make your pickup time, call us at least 4 hours in advance</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>Cakes not picked up within 24 hours may be donated or disposed of</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
