
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AstrologySection from './AstrologySection';
import NumerologySection from './NumerologySection';
import TarotSection from './TarotSection';

const DivinationForm = () => {
  const [activeTab, setActiveTab] = useState("astrology");

  return (
    <section id="divination" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Khám Phá Vận Mệnh</h2>
          <div className="mystical-divider"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chọn phương pháp để khám phá sâu hơn về bản thân và vận mệnh của bạn. 
            Mỗi phương pháp sẽ tiết lộ các khía cạnh khác nhau của con đường định mệnh.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 max-w-2xl mx-auto mb-8">
            <TabsTrigger 
              value="astrology" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              id="astrology"
            >
              Tử Vi
            </TabsTrigger>
            <TabsTrigger 
              value="numerology" 
              className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent"
              id="numerology"
            >
              Thần Số Học
            </TabsTrigger>
            <TabsTrigger 
              value="tarot" 
              className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary"
              id="tarot"
            >
              Tarot
            </TabsTrigger>
          </TabsList>
          
          <div className="mystical-card">
            <TabsContent value="astrology" className="mt-0 animate-fade-in-up">
              <AstrologySection />
            </TabsContent>
            
            <TabsContent value="numerology" className="mt-0 animate-fade-in-up">
              <NumerologySection />
            </TabsContent>
            
            <TabsContent value="tarot" className="mt-0 animate-fade-in-up">
              <TarotSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default DivinationForm;
