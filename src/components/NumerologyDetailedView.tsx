import React, { useEffect, useState } from 'react';
import { useNumerology } from '@/contexts/NumerologyContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface NumerologyJsonResult {
  introduction: string;
  lifePathAnalysis: {
    number: number;
    masterInfo: string | null;
    meaning: string;
    strengths: string[];
    challenges: string[];
  };
  destinyAnalysis: {
    number: number;
    masterInfo: string | null;
    meaning: string;
    strengths: string[];
    challenges: string[];
  };
  soulAnalysis: {
    number: number;
    masterInfo: string | null;
    meaning: string;
    strengths: string[];
    challenges: string[];
  };
  personalityAnalysis: {
    number: number;
    masterInfo: string | null;
    meaning: string;
    strengths: string[];
    challenges: string[];
  };
  birthDayAnalysis: {
    number: number;
    masterInfo: string | null;
    meaning: string;
    strengths: string[];
    challenges: string[];
  };
  interactions: string;
  advice: string[];
  calculation_details?: {
    name: string;
    birthDate: string;
    lifePath: string;
    destiny: string;
    soul: string;
    personality: string;
    birthDay: string;
  };
}

const NumerologyDetailedView: React.FC = () => {
  const { state, resetForm } = useNumerology();
  const { reading } = state;
  const [parsedData, setParsedData] = useState<NumerologyJsonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reading) {
      try {
        const data = JSON.parse(reading) as NumerologyJsonResult;
        setParsedData(data);
        setError(null);
      } catch (e) {
        console.error('Không thể parse dữ liệu JSON từ kết quả thần số học:', e);
        setError('Không thể hiển thị phân tích chi tiết. Vui lòng thử lại sau.');
        setParsedData(null);
      }
    }
  }, [reading]);

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button 
          onClick={resetForm} 
          variant="outline" 
          className="border-accent text-accent hover:bg-accent/10"
        >
          Quay lại nhập thông tin
        </Button>
      </div>
    );
  }

  if (!parsedData) {
    return <div className="text-center p-4">Đang tải kết quả...</div>;
  }

  const { 
    introduction, 
    lifePathAnalysis, 
    destinyAnalysis,
    soulAnalysis,
    personalityAnalysis,
    birthDayAnalysis,
    interactions,
    advice,
    calculation_details
  } = parsedData;

  // Function to render master number info
  const renderMasterNumber = (masterInfo: string | null) => {
    if (!masterInfo) return null;
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 ml-2">
        {masterInfo}
      </Badge>
    );
  };

  // Function to render a list with circles
  const renderList = (items: string[], className?: string) => (
    <ul className={`space-y-2 ${className || ''}`}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="h-4 w-4 rounded-full bg-accent/20 flex-shrink-0 mt-1 mr-2"></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  // Function to render calculation details if available
  const renderCalculationDetails = () => {
    if (!calculation_details) return null;
    
    return (
      <Accordion type="single" collapsible className="w-full mt-8">
        <AccordionItem value="calc-details">
          <AccordionTrigger className="text-accent font-medium">
            Chi tiết tính toán thần số học
          </AccordionTrigger>
          <AccordionContent className="bg-accent/5 p-4 rounded-md">
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Tên: {calculation_details.name}</h4>
                <h4 className="font-medium mb-2">Ngày sinh: {calculation_details.birthDate}</h4>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tính toán số Đường Đời:</h4>
                <p className="whitespace-pre-line">{calculation_details.lifePath}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tính toán số Sứ Mệnh:</h4>
                <p className="whitespace-pre-line">{calculation_details.destiny}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tính toán số Linh Hồn:</h4>
                <p className="whitespace-pre-line">{calculation_details.soul}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tính toán số Nhân Cách:</h4>
                <p className="whitespace-pre-line">{calculation_details.personality}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tính toán số Ngày Sinh:</h4>
                <p className="whitespace-pre-line">{calculation_details.birthDay}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Giới thiệu */}
      <div className="text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-serif text-accent mb-4">Phân Tích Thần Số Học</h3>
        <p className="text-lg">{introduction}</p>
      </div>

      {/* Số Đường Đời - Hiển thị nổi bật */}
      <div className="bg-gradient-to-br from-accent/5 to-accent/20 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center shadow-inner">
              <div className="text-center">
                <span className="text-6xl font-serif text-accent">{lifePathAnalysis.number}</span>
                {renderMasterNumber(lifePathAnalysis.masterInfo)}
              </div>
            </div>
          </div>
          
          <div className="flex-grow">
            <h3 className="text-2xl font-serif text-accent mb-2">Số Đường Đời</h3>
            <p className="mb-4">{lifePathAnalysis.meaning}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-accent mb-2">Điểm mạnh</h4>
                {renderList(lifePathAnalysis.strengths)}
              </div>
              <div>
                <h4 className="font-medium text-accent mb-2">Thách thức</h4>
                {renderList(lifePathAnalysis.challenges)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Các con số khác */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Số Sứ Mệnh */}
        <Card className="border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-accent">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                <span className="text-xl font-serif">{destinyAnalysis.number}</span>
              </div>
              Số Sứ Mệnh
              {renderMasterNumber(destinyAnalysis.masterInfo)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">{destinyAnalysis.meaning}</p>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-accent mb-1">Điểm mạnh</h5>
                {renderList(destinyAnalysis.strengths, 'text-xs')}
              </div>
              <div>
                <h5 className="text-sm font-medium text-accent mb-1">Thách thức</h5>
                {renderList(destinyAnalysis.challenges, 'text-xs')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Số Linh Hồn */}
        <Card className="border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-accent">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                <span className="text-xl font-serif">{soulAnalysis.number}</span>
              </div>
              Số Linh Hồn
              {renderMasterNumber(soulAnalysis.masterInfo)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">{soulAnalysis.meaning}</p>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-accent mb-1">Điểm mạnh</h5>
                {renderList(soulAnalysis.strengths, 'text-xs')}
              </div>
              <div>
                <h5 className="text-sm font-medium text-accent mb-1">Thách thức</h5>
                {renderList(soulAnalysis.challenges, 'text-xs')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Số Nhân Cách */}
        <Card className="border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-accent">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                <span className="text-xl font-serif">{personalityAnalysis.number}</span>
              </div>
              Số Nhân Cách
              {renderMasterNumber(personalityAnalysis.masterInfo)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">{personalityAnalysis.meaning}</p>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-accent mb-1">Điểm mạnh</h5>
                {renderList(personalityAnalysis.strengths, 'text-xs')}
              </div>
              <div>
                <h5 className="text-sm font-medium text-accent mb-1">Thách thức</h5>
                {renderList(personalityAnalysis.challenges, 'text-xs')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Số Ngày Sinh */}
        <Card className="border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-accent">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                <span className="text-xl font-serif">{birthDayAnalysis.number}</span>
              </div>
              Số Ngày Sinh
              {renderMasterNumber(birthDayAnalysis.masterInfo)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">{birthDayAnalysis.meaning}</p>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-accent mb-1">Điểm mạnh</h5>
                {renderList(birthDayAnalysis.strengths, 'text-xs')}
              </div>
              <div>
                <h5 className="text-sm font-medium text-accent mb-1">Thách thức</h5>
                {renderList(birthDayAnalysis.challenges, 'text-xs')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tương tác giữa các con số */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent">Sự Tương Tác Giữa Các Con Số</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{interactions}</p>
        </CardContent>
      </Card>

      {/* Lời khuyên */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-accent">Lời Khuyên & Hướng Phát Triển</CardTitle>
        </CardHeader>
        <CardContent>
          {renderList(advice)}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={resetForm} 
            variant="outline" 
            className="border-accent text-accent hover:bg-accent/10"
          >
            Quay lại nhập thông tin
          </Button>
        </CardFooter>
      </Card>

      {/* Chi tiết tính toán */}
      {renderCalculationDetails()}

      {/* Thêm CSS animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `
      }} />
    </div>
  );
};

export default NumerologyDetailedView; 