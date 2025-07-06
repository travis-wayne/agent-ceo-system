"use client";

import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export default function CreateTestAccountsButton() {
  const createTestAccounts = async () => {
    try {
      // This is a client-side approach - in a real app, you'd have proper OAuth
      const response = await fetch('/api/social-media/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: 'TWITTER',
          accountType: 'BUSINESS',
          platformAccountId: `test_${Date.now()}`,
          username: `test_user_${Date.now()}`,
          displayName: 'Test Twitter Account',
          profileImageUrl: 'https://via.placeholder.com/150',
          accessToken: 'test_token',
          scopes: ['read', 'write']
        })
      });

      if (response.ok) {
        alert('Test account created! Refresh the page to see it.');
        window.location.reload();
      } else {
        alert('Failed to create test account');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating test account');
    }
  };

  return (
    <Button 
      onClick={createTestAccounts}
      variant="outline"
      className="mb-4"
    >
      <Link className="mr-2 h-4 w-4" />
      Create Test Account (Development)
    </Button>
  );
} 