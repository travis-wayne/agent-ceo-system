"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Link } from "lucide-react";
import { connectSocialAccount } from "@/app/actions/social-media";

interface CreateTestAccountProps {
  onAccountCreated: () => void;
}

export default function CreateTestAccount({ onAccountCreated }: CreateTestAccountProps) {
  const [loading, setLoading] = useState(false);

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
      
      if (result.success) {
        toast.success("Test account created successfully!");
        onAccountCreated();
      } else {
        toast.error(result.error || "Failed to create test account");
      }
    } catch (error) {
      console.error("Error creating test account:", error);
      toast.error("Failed to create test account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline"
      onClick={createTestAccount}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Link className="mr-2 h-4 w-4" />
      )}
      Add Test Account
    </Button>
  );
} 