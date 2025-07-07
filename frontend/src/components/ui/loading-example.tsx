"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoading } from "@/components/loading-bar";
import { LoadingBarStandalone } from "@/components/loading-bar";

export function LoadingExample() {
  const [localLoading, setLocalLoading] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const handleGlobalLoading = async () => {
    startLoading();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    stopLoading();
  };

  const handleLocalLoading = async () => {
    setLocalLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLocalLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loading Bar Examples</CardTitle>
          <CardDescription>
            Examples of how to use the loading bar functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Global Loading Bar (Top of page)</h3>
            <Button onClick={handleGlobalLoading} variant="outline">
              Trigger Global Loading
            </Button>
            <p className="text-xs text-muted-foreground">
              This will show the loading bar at the top of the page
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Local Loading Bar</h3>
            <LoadingBarStandalone isLoading={localLoading} className="mb-2" />
            <Button onClick={handleLocalLoading} variant="outline">
              Trigger Local Loading
            </Button>
            <p className="text-xs text-muted-foreground">
              This shows a loading bar within this component
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Usage in Forms</h3>
            <p className="text-xs text-muted-foreground">
              You can use the loading context in forms like this:
            </p>
            <pre className="text-xs bg-muted p-2 rounded">
{`const { startLoading, stopLoading } = useLoading();

const handleSubmit = async (data) => {
  startLoading();
  try {
    await submitForm(data);
  } finally {
    stopLoading();
  }
};`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 