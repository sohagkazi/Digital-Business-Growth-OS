"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Key, Save, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      toast.success("API Key Saved!", { description: "Your Gemini API Key has been saved locally." });
    } else {
      localStorage.removeItem("gemini_api_key");
      toast.info("API Key Removed", { description: "Your API key has been cleared from local storage." });
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your AI API keys and platform preferences.</p>
      </div>

      <Card className="border-none shadow-sm bg-white max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>Google Gemini API</CardTitle>
          </div>
          <CardDescription>
            Enter your Gemini API key to unlock real AI generation. This key is stored securely in your browser's local storage and is only sent directly to Google's servers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
              id="apiKey" 
              type="password" 
              placeholder="e.g. AIzaSy..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              Leave blank to use the server's default environment key.
            </p>
          </div>

          <Button onClick={handleSave} className="font-medium">
            <Save className="h-4 w-4 mr-2" /> Save Settings
          </Button>

          <div className="bg-green-50 p-4 rounded-lg flex gap-3 text-green-800 border border-green-100">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <div className="text-sm">
              <strong className="block mb-1">Privacy Focused</strong>
              Your API key is never stored on our database. It remains in your browser and is used securely for API requests.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
