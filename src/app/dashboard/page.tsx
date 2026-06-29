"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, Copy, Save, Loader2, Globe, X, Target, Briefcase, DollarSign, MapPin, Zap, Crown, ArrowRight } from "lucide-react";
import { AILoadingState } from "@/components/AILoadingState";
import Link from "next/link";

type AdType = { title: string; hook: string; body: string; cta: string };
type ReelType = { title: string; hook: string; scene: string; dialogue: string };
type TaskType = { day: string; task: string };
type PlannerType = { budgetDesc: string; tasks: TaskType[] };
type AudienceType = { 
  targeting: {
    age: string;
    location: string;
    demographics: string[];
    interests: string[];
    behaviors: string[];
  }; 
  offers: string[]; 
};

type ResultsType = {
  ads: AdType[];
  reels: ReelType[];
  planner: PlannerType;
  audience: AudienceType;
};

export default function DashboardPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ResultsType | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const [formData, setFormData] = useState({
    businessName: "",
    niche: "",
    budget: "",
    country: "",
    prompt: "",
    images: [] as { base64: string; mimeType: string; dataUrl: string }[],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages: { base64: string; mimeType: string; dataUrl: string }[] = [];
    
    Promise.all(files.map(file => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const [meta, base64] = result.split(',');
          const mimeType = meta.split(':')[1].split(';')[0];
          newImages.push({ base64, mimeType, dataUrl: result });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    })).then(() => {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const savedKey = localStorage.getItem("gemini_api_key");
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (savedKey) {
        headers['X-Gemini-Key'] = savedKey;
      }

      const response = await fetch(`/api/generate?t=${Date.now()}`, {
        method: 'POST',
        headers,
        cache: 'no-store',
        body: JSON.stringify({ ...formData, language }),
      });

      if (response.status === 403) {
        const errorData = await response.json();
        if (errorData.limitReached) {
          setShowUpgradeModal(true);
          return;
        }
      }

      if (!response.ok) throw new Error("Failed to generate");

      const data = await response.json();
      setResults(data);
      
      toast.success(language === "en" ? "Marketing Plan Generated! 🚀" : "মার্কেটিং প্ল্যান জেনারেট হয়েছে! 🚀", {
        description: language === "en" ? "Your personalized strategy is ready to launch." : "আপনার পার্সোনালাইজড স্ট্র্যাটেজি তৈরি।"
      });
    } catch (error) {
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast.success(language === "en" ? "Copied to clipboard!" : "কপি করা হয়েছে!", { description: title });
  };

  const handleSave = (title: string) => {
    toast.info(language === "en" ? "Saved successfully!" : "সফলভাবে সেভ হয়েছে!", { description: language === "en" ? `${title} saved to your workspace.` : `${title} আপনার ওয়ার্কস্পেসে সেভ করা হয়েছে।` });
  };

  return (
    <div className="space-y-10 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="bg-blue-100 p-1.5 rounded-lg border border-blue-200">
             <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          Marketing Plan
        </h1>
        <p className="text-slate-600 mt-2 font-medium">Initialize system parameters below to synthesize your multi-channel marketing campaign.</p>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 pb-6">
          <CardTitle className="text-slate-900">Campaign Details</CardTitle>
          <CardDescription className="text-slate-500">Provide the context for your next marketing move.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="businessName" className="text-slate-700 font-medium flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-500"/> Business Name</Label>
                <Input id="businessName" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} placeholder="e.g. Piecorn Shop" required className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500/50" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="niche" className="text-slate-700 font-medium flex items-center gap-2"><Target className="w-4 h-4 text-purple-500"/> Niche / Industry</Label>
                <Input id="niche" value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} placeholder="e.g. Real Estate, Restaurant..." required className="bg-slate-50 border-slate-200 focus-visible:ring-purple-500/50" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="budget" className="text-slate-700 font-medium flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500"/> Budget (BDT)</Label>
                <Input id="budget" type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="e.g. 5000" required className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500/50" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="country" className="text-slate-700 font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-500"/> Target Country</Label>
                <Input id="country" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} placeholder="e.g. Bangladesh" required className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/50" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium">Output Language</Label>
                <Select value={language} onValueChange={(val: "en" | "bn") => setLanguage(val)}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-blue-500/50">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="en"><div className="flex items-center"><Globe className="w-4 h-4 mr-2 text-blue-500"/> English</div></SelectItem>
                    <SelectItem value="bn"><div className="flex items-center"><Globe className="w-4 h-4 mr-2 text-purple-500"/> Bengali (বাংলা)</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="prompt" className="text-slate-700 font-medium">Specific Directives / Details</Label>
              <Textarea 
                id="prompt" 
                rows={4}
                value={formData.prompt}
                onChange={e => setFormData({...formData, prompt: e.target.value})}
                placeholder="Describe your upcoming campaign or offers..." 
                required 
                className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500/50 resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="image" className="text-slate-700 font-medium">Visual Assets (Optional)</Label>
              <div className="relative">
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="cursor-pointer file:text-blue-600 file:bg-blue-50 file:border file:border-blue-100 file:rounded-md file:px-4 file:py-1 hover:file:bg-blue-100 bg-slate-50 border-slate-200 text-slate-600 h-12 pt-2.5"
                />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Upload image assets for AI to analyze context.
              </p>
              
              {formData.images && formData.images.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group border border-slate-200 rounded-lg p-1 bg-white shadow-sm hover:border-blue-500/50 transition-colors">
                      <img src={img.dataUrl} alt="preview" className="h-20 w-20 object-cover rounded-md opacity-90 group-hover:opacity-100 transition-opacity" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-slate-900 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-md"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button type="submit" disabled={isGenerating} size="lg" className="w-full md:w-auto font-bold px-10 h-14 bg-slate-900 hover:bg-slate-800 text-white shadow-md rounded-xl transition-all">
                {isGenerating ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Plan...</>
                ) : (
                  <><Sparkles className="mr-2 h-5 w-5" /> Generate Marketing Plan</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isGenerating ? (
        <AILoadingState type="plan" />
      ) : results ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Generated Output</h2>
          </div>
          
          <Tabs defaultValue="ads" className="w-full">
            <TabsList className="flex w-full overflow-x-auto whitespace-nowrap mb-8 bg-slate-100 border border-slate-200 p-1.5 rounded-xl justify-start md:grid md:grid-cols-5">
              <TabsTrigger value="ads" className="font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg">Ad Copies</TabsTrigger>
              <TabsTrigger value="reels" className="font-medium data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-lg">Video Scripts</TabsTrigger>
              <TabsTrigger value="planner" className="font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm rounded-lg">7-Day Plan</TabsTrigger>
              <TabsTrigger value="audience" className="font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg">Targeting</TabsTrigger>
              <TabsTrigger value="keywords" className="font-medium data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm rounded-lg">Keywords</TabsTrigger>
            </TabsList>

            {/* Ads Tab */}
            <TabsContent value="ads" className="space-y-6 mt-0">
              {results.ads?.map((ad, i) => (
                <Card key={i} className="bg-white border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-100">
                    <CardTitle className="text-lg text-slate-900 flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500"/> {ad.title}</CardTitle>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(`${ad.hook}\n\n${ad.body}\n\n${ad.cta}`, ad.title)} className="border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50"><Copy className="h-4 w-4 mr-2" /> Copy</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl text-slate-700 whitespace-pre-wrap font-medium leading-relaxed shadow-inner">
                      <p className="font-bold text-slate-900">{ad.hook}</p>
                      <p className="mt-4">{ad.body}</p>
                      <p className="mt-5 font-bold text-blue-600">{ad.cta}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Reels Tab */}
            <TabsContent value="reels" className="space-y-6 mt-0">
               {results.reels?.map((script, i) => (
                <Card key={i} className="bg-white border-slate-200 shadow-sm hover:border-purple-300 transition-colors">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-100">
                    <CardTitle className="text-lg text-slate-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-500"/> {script.title}</CardTitle>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(`Hook: ${script.hook}\nScene: ${script.scene}\nDialogue: ${script.dialogue}`, script.title)} className="border-slate-200 bg-white text-slate-700 hover:text-purple-600 hover:bg-purple-50"><Copy className="h-4 w-4 mr-2" /> Copy</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl text-slate-700 font-medium space-y-4 shadow-inner">
                      <p><strong className="text-slate-900 font-bold bg-purple-100 px-2 py-0.5 rounded text-sm mr-2">Hook:</strong> {script.hook}</p>
                      <p><strong className="text-slate-900 font-bold bg-blue-100 px-2 py-0.5 rounded text-sm mr-2">Scene:</strong> {script.scene}</p>
                      <p><strong className="text-slate-900 font-bold bg-emerald-100 px-2 py-0.5 rounded text-sm mr-2">Dialogue:</strong> {script.dialogue}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Planner Tab */}
            <TabsContent value="planner" className="mt-0">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
                  <div>
                    <CardTitle className="text-lg text-slate-900 flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500"/> 7-Day Action Plan</CardTitle>
                    <CardDescription className="text-slate-500 mt-1 font-medium">{results.planner.budgetDesc}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy("Day 1-7 Plan details...", "7-Day Planner")} className="border-slate-200 bg-white text-slate-700 hover:text-emerald-600 hover:bg-emerald-50"><Copy className="h-4 w-4 mr-2" /> Copy</Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {results.planner?.tasks?.map((plan, i) => (
                      <div key={i} className="flex gap-5 p-4 bg-slate-50 rounded-xl items-center border border-slate-100 hover:border-emerald-200 transition-colors shadow-sm">
                        <span className="font-bold text-emerald-700 w-16 bg-emerald-100 py-1.5 rounded-md text-center text-sm">{plan.day}</span>
                        <span className="text-slate-700 font-medium">{plan.task}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audience Tab */}
            <TabsContent value="audience" className="mt-0">
               <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
                  <CardTitle className="text-lg text-slate-900 flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-500"/> Targeting Details</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleCopy("Audience Targeting...", "Audience Ideas")} className="border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"><Copy className="h-4 w-4 mr-2" /> Copy</Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                      <h3 className="font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3 flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-indigo-500"/> Demographics
                      </h3>
                      <div className="space-y-5">
                        <div className="flex items-center">
                          <span className="font-semibold text-slate-600 text-sm w-24">Age Range:</span>
                          <span className="text-slate-900 font-bold text-sm bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm">{results.audience.targeting.age}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-slate-600 text-sm w-24">Location:</span>
                          <span className="text-slate-900 font-bold text-sm bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm">{results.audience.targeting.location}</span>
                        </div>
                        
                        <div>
                          <span className="font-semibold text-slate-600 text-sm mb-2 block">Demographics:</span>
                          <div className="flex flex-wrap gap-2">
                            {results.audience?.targeting?.demographics?.map((item, i) => (
                              <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-md text-xs font-bold">{item}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-600 text-sm mb-2 block">Interests:</span>
                          <div className="flex flex-wrap gap-2">
                            {results.audience?.targeting?.interests?.map((item, i) => (
                              <span key={i} className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-md text-xs font-bold">{item}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-600 text-sm mb-2 block">Behaviors:</span>
                          <div className="flex flex-wrap gap-2">
                            {results.audience?.targeting?.behaviors?.map((item, i) => (
                              <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-md text-xs font-bold">{item}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                      <h3 className="font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3 flex items-center gap-2">
                         <Target className="w-4 h-4 text-blue-500"/> Core Offers
                      </h3>
                      <ul className="space-y-4 text-slate-700 font-medium">
                        {results.audience?.offers?.map((o, i) => (
                          <li key={i} className="flex gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                             <div className="h-6 w-6 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">{i+1}</div>
                             <span className="mt-0.5">{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
               </Card>
            </TabsContent>

            {/* Keywords Tab */}
            <TabsContent value="keywords" className="space-y-6 mt-0">
              <Card className="bg-white border-slate-200 shadow-sm hover:border-rose-300 transition-colors">
                <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-100">
                  <CardTitle className="text-lg text-slate-900 flex items-center gap-2"><Target className="w-4 h-4 text-rose-500"/> SEO Keywords</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(results.keywords?.join(", "), "SEO Keywords")} className="border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    <Copy className="h-4 w-4 mr-2" /> Copy All
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-3">
                    {results.keywords?.map((keyword: string, idx: number) => (
                      <div key={idx} className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-full text-rose-700 text-sm font-medium">
                        {keyword}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-300">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-full" onClick={() => setShowUpgradeModal(false)}>
              <X className="h-5 w-5" />
            </Button>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner border border-blue-200">
               <Crown className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-3">Upgrade to Pro</h3>
            <p className="text-slate-600 text-center mb-8 font-medium">
              You've reached your monthly limit of 7 free AI generations. Upgrade to the Pro plan for unlimited access and advanced features!
            </p>
            <Link href="/#pricing" onClick={() => setShowUpgradeModal(false)}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-14 rounded-xl text-lg shadow-lg shadow-blue-500/25 transition-all">
                View Pro Plans <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <div className="mt-4 text-center">
              <span className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer underline-offset-4 hover:underline" onClick={() => setShowUpgradeModal(false)}>Maybe later</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
