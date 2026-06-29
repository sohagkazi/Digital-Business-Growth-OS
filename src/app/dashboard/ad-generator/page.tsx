"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, Copy, Save, Loader2, Globe, X, Package, MessageSquare, Zap } from "lucide-react";
import { AILoadingState } from "@/components/AILoadingState";

type AdType = { title: string; hook: string; body: string; cta: string };

type ResultsType = {
  ads: AdType[];
};

export default function AdGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ResultsType | null>(null);
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const [formData, setFormData] = useState({
    productName: "",
    targetAudience: "",
    keyBenefits: "",
    tone: "persuasive",
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

      const response = await fetch(`/api/generate-ads?t=${Date.now()}`, {
        method: 'POST',
        headers,
        cache: 'no-store',
        body: JSON.stringify({ ...formData, language }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const data = await response.json();
      setResults(data);
      
      toast.success(language === "en" ? "Ads Generated! 🚀" : "অ্যাডস জেনারেট হয়েছে! 🚀", {
        description: language === "en" ? "Your high-converting copies are ready." : "আপনার হাই-কনভার্টিং কপি তৈরি।"
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
             <Zap className="h-6 w-6 text-blue-600" />
          </div>
          Ad Copy Generator
        </h1>
        <p className="text-slate-600 mt-2 font-medium">Synthesize high-converting Facebook and Instagram ad copy.</p>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 pb-6">
          <CardTitle className="text-slate-900">Product Details</CardTitle>
          <CardDescription className="text-slate-500">Provide product context for the AI.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="productName" className="text-slate-700 font-medium flex items-center gap-2"><Package className="w-4 h-4 text-blue-500"/> Product/Service Name</Label>
                <Input id="productName" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} placeholder="e.g. Premium Leather Wallet" required className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500/50" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="targetAudience" className="text-slate-700 font-medium flex items-center gap-2"><Globe className="w-4 h-4 text-purple-500"/> Target Audience</Label>
                <Input id="targetAudience" value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} placeholder="e.g. Corporate Professionals" required className="bg-slate-50 border-slate-200 focus-visible:ring-purple-500/50" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium flex items-center gap-2"><MessageSquare className="w-4 h-4 text-emerald-500"/> Tone of Voice</Label>
                <Select value={formData.tone} onValueChange={(val) => setFormData({...formData, tone: val})}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-emerald-500/50">
                    <SelectValue placeholder="Select Tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="persuasive">Persuasive (Sales-focused)</SelectItem>
                    <SelectItem value="urgent">Urgent (FOMO, Limited Time)</SelectItem>
                    <SelectItem value="casual">Casual (Friendly, Relatable)</SelectItem>
                    <SelectItem value="professional">Professional (B2B, Trust)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
              <Label htmlFor="keyBenefits" className="text-slate-700 font-medium">Key Benefits / Unique Selling Points</Label>
              <Textarea 
                id="keyBenefits" 
                rows={4}
                value={formData.keyBenefits}
                onChange={e => setFormData({...formData, keyBenefits: e.target.value})}
                placeholder="List the main benefits of your product..." 
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
                Upload product images for the AI to analyze and extract features.
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
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Ads...</>
                ) : (
                  <><Zap className="mr-2 h-5 w-5" /> Generate Ad Copies</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isGenerating ? (
        <AILoadingState type="ad" />
      ) : results && results.ads.length > 0 ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Generated Ad Copies</h2>
          </div>
          <div className="space-y-6">
            {results.ads.map((ad, i) => (
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
