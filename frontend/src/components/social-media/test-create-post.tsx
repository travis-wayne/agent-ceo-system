"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createSocialPost, getSocialAccounts } from "@/app/actions/social-media";

export default function TestCreatePost() {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);

  const testCreatePost = async () => {
    try {
      setLoading(true);
      
      // First, get accounts
      const accountsResult = await getSocialAccounts();
      console.log("Accounts result:", accountsResult);
      setAccounts(accountsResult.data || []);
      
      // If no accounts, create a mock one for testing
      if (!accountsResult.data || accountsResult.data.length === 0) {
        toast.error("No social media accounts found. Please connect an account first.");
        return;
      }
      
      // Create a test post
      const postResult = await createSocialPost({
        title: "Test Post",
        content: "This is a test post created for debugging purposes.",
        hashtags: ["test", "debug"],
        mentions: [],
        contentType: "TEXT",
        priority: "MEDIUM",
        publishingType: "IMMEDIATE",
        targetAccounts: [accountsResult.data[0].id],
        status: "PUBLISHED"
      });
      
      console.log("Post creation result:", postResult);
      setResult(postResult);
      
      if (postResult.success) {
        toast.success("Test post created successfully!");
      } else {
        toast.error(`Failed to create test post: ${postResult.error}`);
      }
      
    } catch (error) {
      console.error("Error in test:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetAccounts = async () => {
    try {
      setLoading(true);
      const result = await getSocialAccounts();
      console.log("Get accounts result:", result);
      setAccounts(result.data || []);
      
      if (result.success) {
        toast.success(`Found ${result.data?.length || 0} accounts`);
      } else {
        toast.error(`Failed to get accounts: ${result.error}`);
      }
    } catch (error) {
      console.error("Error getting accounts:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Debug Create Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testGetAccounts} disabled={loading}>
            Test Get Accounts
          </Button>
          <Button onClick={testCreatePost} disabled={loading}>
            Test Create Post
          </Button>
        </div>
        
        {accounts.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Connected Accounts:</h3>
            <ul className="space-y-1">
              {accounts.map((account) => (
                <li key={account.id} className="text-sm">
                  {account.platform} - @{account.username} ({account.connectionStatus})
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {result && (
          <div>
            <h3 className="font-semibold mb-2">Last Result:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 