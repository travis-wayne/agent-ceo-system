"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Link } from "lucide-react";
import { 
  createSocialPost, 
  getSocialAccounts, 
  connectSocialAccount 
} from "@/app/actions/social-media";

export default function TestSocialPage() {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [content, setContent] = useState("This is a test post created from the debug page.");
  const [result, setResult] = useState<any>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const result = await getSocialAccounts();
      console.log("Accounts result:", result);
      setAccounts(result.data || []);
      
      if (result.success) {
        toast.success(`Found ${result.data?.length || 0} accounts`);
      } else {
        toast.error(`Failed to get accounts: ${result.error}`);
      }
    } catch (error) {
      console.error("Error getting accounts:", error);
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestAccount = async () => {
    try {
      setLoading(true);
      
      const result = await connectSocialAccount({
        platform: "TWITTER",
        accountType: "BUSINESS", 
        platformAccountId: `test_${Date.now()}`,
        username: `test_user_${Date.now()}`,
        displayName: "Test Account",
        profileImageUrl: "https://via.placeholder.com/150",
        accessToken: "test_token",
        scopes: ["read", "write"]
      });
      
      console.log("Create account result:", result);
      
      if (result.success) {
        toast.success("Test account created successfully!");
        await fetchAccounts(); // Refresh accounts
      } else {
        toast.error(result.error || "Failed to create test account");
      }
    } catch (error) {
      console.error("Error creating test account:", error);
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestPost = async () => {
    try {
      setLoading(true);
      
      if (accounts.length === 0) {
        toast.error("No accounts available. Create a test account first.");
        return;
      }
      
      const postResult = await createSocialPost({
        title: "Test Post",
        content: content,
        hashtags: ["test", "debug"],
        mentions: [],
        contentType: "TEXT",
        priority: "MEDIUM",
        publishingType: "IMMEDIATE",
        targetAccounts: [accounts[0].id],
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
      console.error("Error creating post:", error);
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={fetchAccounts} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Accounts"}
            </Button>
            <Button onClick={createTestAccount} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link className="h-4 w-4" />}
              Create Test Account
            </Button>
          </div>
          
          {accounts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Connected Accounts ({accounts.length}):</h3>
              <ul className="space-y-1 text-sm">
                {accounts.map((account) => (
                  <li key={account.id} className="p-2 bg-gray-50 rounded">
                    <strong>{account.platform}</strong> - @{account.username} ({account.connectionStatus})
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="font-medium">Test Post Content:</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Enter test post content..."
            />
          </div>
          
          <Button 
            onClick={createTestPost} 
            disabled={loading || accounts.length === 0}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Create Test Post
          </Button>
          
          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 