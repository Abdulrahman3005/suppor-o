import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface CalculationResult {
  regularHourlyRate: number;
  overtimeHourlyRate: number;
  totalOvertimeAmount: number;
}

const OvertimeCalculator: React.FC = () => {
  const { toast } = useToast();
  const [basicSalary, setBasicSalary] = useState<number | ''>('');
  const [totalSalary, setTotalSalary] = useState<number | ''>('');
  const [overtimeHours, setOvertimeHours] = useState<number | ''>('');
  const [workType, setWorkType] = useState<string>('regular');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('calculator');
  
  // New state variables for the additional options
  const [customHourlyRate, setCustomHourlyRate] = useState<number | ''>('');
  const [useCustomRate, setUseCustomRate] = useState<boolean>(false);
  const [salaryCalculationBase, setSalaryCalculationBase] = useState<string>('basic');
  const [percentageOfTotal, setPercentageOfTotal] = useState<number>(100);
  // Add new state for daily work hours policy
  const [dailyWorkHours, setDailyWorkHours] = useState<number | ''>(8);

  // Animation states
  const [showResult, setShowResult] = useState<boolean>(false);
  
  // Validate inputs
  const validateInputs = (): boolean => {
    if (!useCustomRate) {
      if (salaryCalculationBase === 'basic' && (basicSalary === '' || typeof basicSalary !== 'number' || basicSalary <= 0)) {
        toast({
          title: "خطأ في الإدخال",
          description: "يرجى إدخال الراتب الأساسي بشكل صحيح",
          variant: "destructive",
        });
        return false;
      }

      if (salaryCalculationBase === 'total' && (totalSalary === '' || typeof totalSalary !== 'number' || totalSalary <= 0)) {
        toast({
          title: "خطأ في الإدخال",
          description: "يرجى إدخال الراتب الإجمالي بشكل صحيح",
          variant: "destructive",
        });
        return false;
      }

      if (salaryCalculationBase === 'percentage' && (totalSalary === '' || typeof totalSalary !== 'number' || totalSalary <= 0)) {
        toast({
          title: "خطأ في الإدخال",
          description: "يرجى إدخال الراتب الإجمالي بشكل صحيح",
          variant: "destructive",
        });
        return false;
      }
    } else {
      if (customHourlyRate === '' || typeof customHourlyRate !== 'number' || customHourlyRate <= 0) {
        toast({
          title: "خطأ في الإدخال",
          description: "يرجى إدخال سعر الساعة المخصص بشكل صحيح",
          variant: "destructive",
        });
        return false;
      }
    }

    if (overtimeHours === '' || typeof overtimeHours !== 'number' || overtimeHours <= 0) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى إدخال عدد ساعات العمل الإضافية بشكل صحيح",
        variant: "destructive",
      });
      return false;
    }

    if (dailyWorkHours === '' || typeof dailyWorkHours !== 'number' || dailyWorkHours <= 0) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى إدخال عدد ساعات العمل اليومية بشكل صحيح",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };
  
  // Calculate overtime pay
  const calculateOvertime = () => {
    if (!validateInputs()) return;
    
    setIsCalculating(true);
    setShowResult(false);
    
    // Simulate calculation delay for a better UX
    setTimeout(() => {
      let regularHourlyRate: number;
      
      // Calculate regular hourly rate based on the selected method
      if (useCustomRate) {
        regularHourlyRate = Number(customHourlyRate);
      } else {
        let calculationBase: number;
        
        switch (salaryCalculationBase) {
          case 'basic':
            calculationBase = Number(basicSalary);
            break;
          case 'total':
            calculationBase = Number(totalSalary);
            break;
          case 'percentage':
            calculationBase = Number(totalSalary) * (percentageOfTotal / 100);
            break;
          default:
            calculationBase = Number(basicSalary);
        }
        
        // Regular hourly rate = Calculation Base ÷ 30 days ÷ dailyWorkHours hours
        regularHourlyRate = calculationBase / 30 / Number(dailyWorkHours);
      }
      
      // Apply multipliers based on work type
      let multiplier = 1.5; // Default for regular overtime
      
      if (workType === 'holiday') {
        multiplier = 2.0; // 200% on holidays
      } else if (workType === 'nightShift') {
        multiplier = 1.75; // 175% on night shifts
      }
      
      const overtimeHourlyRate = regularHourlyRate * multiplier;
      const totalOvertimeAmount = overtimeHourlyRate * Number(overtimeHours);
      
      setResult({
        regularHourlyRate,
        overtimeHourlyRate,
        totalOvertimeAmount
      });
      
      setIsCalculating(false);
      setShowResult(true);
      
      // Show success toast
      toast({
        title: "تم الحساب بنجاح",
        description: "تم احتساب العمل الإضافي وفقاً لنظام العمل السعودي",
      });
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-12">
      <Tabs 
        defaultValue="calculator" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-2 w-[400px] mb-10">
            <TabsTrigger value="calculator" className="text-lg py-3">حاسبة العمل الإضافي</TabsTrigger>
            <TabsTrigger value="information" className="text-lg py-3">معلومات</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent 
          value="calculator" 
          className="space-y-6 animate-fade-up"
        >
          <Card className="premium-card border-0 neo-morphism">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl text-center">حاسبة العمل الإضافي لأبطال السبورت</CardTitle>
              <CardDescription className="text-center text-lg">
                احتساب العمل الإضافي وفقاً لنظام العمل السعودي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-end space-x-2 space-x-reverse">
                <Label htmlFor="useCustomRate" className="text-lg cursor-pointer">
                  استخدام سعر ساعة مخصص
                </Label>
                <Switch 
                  id="useCustomRate" 
                  checked={useCustomRate} 
                  onCheckedChange={setUseCustomRate}
                />
              </div>

              {useCustomRate ? (
                <div className="space-y-3">
                  <Label htmlFor="customHourlyRate" className="text-right block text-lg">سعر الساعة المخصص (ريال سعودي)</Label>
                  <Input
                    id="customHourlyRate"
                    type="number"
                    placeholder="سعر الساعة"
                    className="premium-input text-right text-lg h-12"
                    value={customHourlyRate}
                    onChange={(e) => setCustomHourlyRate(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label className="text-right block text-lg">طريقة احتساب سعر الساعة</Label>
                    <Select 
                      value={salaryCalculationBase} 
                      onValueChange={setSalaryCalculationBase}
                    >
                      <SelectTrigger className="premium-input text-right h-12">
                        <SelectValue placeholder="اختر طريقة الاحتساب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">حسب الراتب الأساسي فقط</SelectItem>
                        <SelectItem value="total">حسب الراتب الإجمالي</SelectItem>
                        <SelectItem value="percentage">نسبة من الراتب الإجمالي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {salaryCalculationBase === 'basic' && (
                    <div className="space-y-3">
                      <Label htmlFor="basicSalary" className="text-right block text-lg">الراتب الأساسي (ريال سعودي)</Label>
                      <Input
                        id="basicSalary"
                        type="number"
                        placeholder="الراتب الأساسي"
                        className="premium-input text-right text-lg h-12"
                        value={basicSalary}
                        onChange={(e) => setBasicSalary(e.target.value ? Number(e.target.value) : '')}
                      />
                    </div>
                  )}

                  {(salaryCalculationBase === 'total' || salaryCalculationBase === 'percentage') && (
                    <div className="space-y-3">
                      <Label htmlFor="totalSalary" className="text-right block text-lg">الراتب الإجمالي (ريال سعودي)</Label>
                      <Input
                        id="totalSalary"
                        type="number"
                        placeholder="الراتب الإجمالي"
                        className="premium-input text-right text-lg h-12"
                        value={totalSalary}
                        onChange={(e) => setTotalSalary(e.target.value ? Number(e.target.value) : '')}
                      />
                    </div>
                  )}

                  {salaryCalculationBase === 'percentage' && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-base">{percentageOfTotal}%</span>
                        <Label htmlFor="percentageSlider" className="text-right block text-lg">نسبة من الراتب الإجمالي</Label>
                      </div>
                      <Slider
                        id="percentageSlider"
                        min={1}
                        max={100}
                        step={1}
                        value={[percentageOfTotal]}
                        onValueChange={(value) => setPercentageOfTotal(value[0])}
                        className="my-4"
                      />
                    </div>
                  )}
                </>
              )}
              
              <div className="space-y-3">
                <Label htmlFor="overtimeHours" className="text-right block text-lg">عدد ساعات العمل الإضافية</Label>
                <Input
                  id="overtimeHours"
                  type="number"
                  placeholder="عدد الساعات"
                  className="premium-input text-right text-lg h-12"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
              
              {/* Add daily work hours policy field */}
              <div className="space-y-3">
                <Label htmlFor="dailyWorkHours" className="text-right block text-lg">سياسة ساعات العمل اليومية</Label>
                <Input
                  id="dailyWorkHours"
                  type="number"
                  placeholder="عدد ساعات العمل في اليوم (6 أو 8 أو غيرها)"
                  className="premium-input text-right text-lg h-12"
                  value={dailyWorkHours}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    // Only accept numbers
                    if (e.target.value === '' || !isNaN(Number(e.target.value))) {
                      setDailyWorkHours(value);
                    }
                  }}
                />
                <p className="text-sm text-muted-foreground text-right">أدخل عدد ساعات العمل اليومية (عادة 8 ساعات). هذه القيمة ستستخدم في احتساب سعر الساعة</p>
              </div>
              
              <div className="space-y-3">
                <Label className="text-right block text-lg">نوع العمل الإضافي</Label>
                <RadioGroup 
                  value={workType} 
                  onValueChange={setWorkType}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <Label htmlFor="regular" className="text-base cursor-pointer">
                      أيام العمل العادية (150%)
                    </Label>
                    <RadioGroupItem value="regular" id="regular" className="ml-2" />
                  </div>
                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <Label htmlFor="holiday" className="text-base cursor-pointer">
                      أيام العطل والإجازات الرسمية (200%)
                    </Label>
                    <RadioGroupItem value="holiday" id="holiday" className="ml-2" />
                  </div>
                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <Label htmlFor="nightShift" className="text-base cursor-pointer">
                      نوبات العمل الليلية (175%)
                    </Label>
                    <RadioGroupItem value="nightShift" id="nightShift" className="ml-2" />
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={calculateOvertime}
                className="premium-button w-full text-lg h-12"
                disabled={isCalculating}
              >
                {isCalculating ? 'جاري الحساب...' : 'احتساب العمل الإضافي'}
              </Button>
            </CardFooter>
          </Card>

          {showResult && result && (
            <Card className="premium-card border-0 neo-morphism animate-scale-in">
              <CardHeader>
                <CardTitle className="text-2xl text-center">نتيجة الحساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 text-lg">
                  <div className="text-right font-bold">
                    {result.regularHourlyRate.toFixed(2)} ريال
                  </div>
                  <div className="text-right">أجر الساعة العادية:</div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 text-lg">
                  <div className="text-right font-bold">
                    {result.overtimeHourlyRate.toFixed(2)} ريال
                  </div>
                  <div className="text-right">أجر ساعة العمل الإضافي:</div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 text-lg">
                  <div className="text-right font-bold">
                    {overtimeHours} ساعة
                  </div>
                  <div className="text-right">عدد ساعات العمل الإضافي:</div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 text-xl font-bold text-primary bg-primary/5 p-3 rounded-lg">
                  <div className="text-right">
                    {result.totalOvertimeAmount.toFixed(2)} ريال
                  </div>
                  <div className="text-right">إجمالي مستحقات العمل الإضافي:</div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent 
          value="information" 
          className="space-y-6 animate-fade-up"
        >
          <Card className="premium-card border-0 neo-morphism">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl text-center">معلومات عن احتساب العمل الإضافي</CardTitle>
              <CardDescription className="text-center text-lg">
                كيفية احتساب العمل الإضافي وفقاً لنظام العمل السعودي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              <div className="space-y-3">
                <h3 className="text-xl font-bold">أساس الاحتساب</h3>
                <p className="text-base leading-relaxed">
                  وفقاً للمادة 107 من نظام العمل السعودي، يتم احتساب أجر الساعة الإضافية بمعدل 150% من أجر الساعة العادية للأيام العادية.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold">معادلة حساب العمل الإضافي</h3>
                <div className="bg-secondary p-4 rounded-lg text-secondary-foreground">
                  <p className="text-base">1. أجر الساعة العادية = الراتب الأساسي ÷ 30 ÷ عدد ساعات العمل اليومية</p>
                  <p className="text-base">2. أجر الساعة الإضافية = أجر الساعة العادية × معامل الزيادة</p>
                  <p className="text-base">3. إجمالي أجر الساعات الإضافية = أجر الساعة الإضافية × عدد الساعات الإضافية</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold">معاملات الزيادة</h3>
                <ul className="space-y-2 list-disc list-inside pr-4">
                  <li className="text-base">أيام العمل العادية: 150% من أجر الساعة العادية</li>
                  <li className="text-base">أيام العطل والإجازات الرسمية: 200% من أجر الساعة العادية</li>
                  <li className="text-base">نوبات العمل الليلية: 175% من أجر الساعة العادية</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold">مثال توضيحي</h3>
                <div className="bg-secondary p-4 rounded-lg text-secondary-foreground">
                  <p className="text-base font-medium">الراتب الأساسي: 4000 ريال</p>
                  <p className="text-base font-medium">عدد ساعات العمل اليومية: 8 ساعات</p>
                  <p className="text-base font-medium">عدد الساعات الإضافية: 5 ساعات (في يوم عمل عادي)</p>
                  <p className="text-base mt-2">أجر الساعة العادية = 4000 ÷ 30 ÷ 8 = 16.67 ريال</p>
                  <p className="text-base">أجر الساعة الإضافية = 16.67 × 1.5 = 25 ريال</p>
                  <p className="text-base">إجمالي أجر الساعات الإضافية = 25 × 5 = 125 ريال</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OvertimeCalculator;
