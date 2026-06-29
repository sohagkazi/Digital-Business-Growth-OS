"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, Copy, Save, Loader2, Globe, X, Video, Hash } from "lucide-react";
import { AILoadingState } from "@/components/AILoadingState";

type ReelType = { title: string; hook: string; scene: string; dialogue: string };

type ResultsType = {
  reels: ReelType[];
};

export default function VideoScriptsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ResultsType | null>(null);
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const [formData, setFormData] = useState({
    topic: "",
    platform: "tiktok",
    duration: "30",
    keyPoints: "",
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

      const response = await fetch(`/api/generate-videos?t=${Date.now()}`, {
        method: 'POST',
        headers,
        cache: 'no-store',
        body: JSON.stringify({ ...formData, language }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const data = await response.json();
      setResults(data);
      
      toast.success(language === "en" ? "Scripts Generated! 🚀" : "স্ক্রিপ্ট জেনারেট হয়েছে! 🚀", {
        description: language === "en" ? "Your viral video scripts are ready." : "আপনার ভাইরাল ভিডিও স্ক্রিপ্ট তৈরি।"
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
          <div className="bg-purple-100 p-1.5 rounded-lg border border-purple-200">
             <Video className="h-6 w-6 text-purple-600" />
          </div>
          Viral Script Engine
        </h1>
        <p className="text-slate-600 mt-2 font-medium">Synthesize highly engaging short-form video content.</p>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 pb-6">
          <CardTitle className="text-slate-900">Input Specifications</CardTitle>
          <CardDescription className="text-slate-500">Provide topic details for the neural network.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="topic" className="text-slate-700 font-medium flex items-center gap-2"><Hash className="w-4 h-4 text-blue-500"/> Core Topic</Label>
                <Input id="topic" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} placeholder="e.g. 3 Tips for Better Skin" required className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500/50" />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium flex items-center gap-2"><Video className="w-4 h-4 text-purple-500"/> Target Platform</Label>
                <Select value={formData.platform} onValueChange={(val) => setFormData({...formData, platform: val})}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-purple-500/50">
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="reels">Instagram Reels</SelectItem>
                    <SelectItem value="shorts">YouTube Shorts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium">Target Duration</Label>
                <Select value={formData.duration} onValueChange={(val) => setFormData({...formData, duration: val})}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-emerald-500/50">
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="15">~15 Seconds (Fast-paced)</SelectItem>
                    <SelectItem value="30">~30 Seconds (Standard)</SelectItem>
                    <SelectItem value="60">~60 Seconds (In-depth)</SelectItem>
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
              <Label htmlFor="keyPoints" className="text-slate-700 font-medium">Key Information / Call to Action</Label>
              <Textarea 
                id="keyPoints" 
                rows={4}
                value={formData.keyPoints}
                onChange={e => setFormData({...formData, keyPoints: e.target.value})}
                placeholder="What must be mentioned in the video?" 
                required 
                className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500/50 resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="image" className="text-slate-700 font-medium">Visual Context (Optional)</Label>
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
                Upload images related to the video for AI analysis.
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
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Rendering Scripts...</>
                ) : (
                  <><Sparkles className="mr-2 h-5 w-5" /> Generate Scripts</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isGenerating ? (
        <AILoadingState type="video" />
      ) : results && results.reels.length > 0 ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
             <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Synthesized Scripts</h2>
          </div>
          <div className="space-y-6">
            {results.reels.map((script, i) => (
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
