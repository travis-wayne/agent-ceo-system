import { useState } from "react";
import { UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImportEmailWizard } from "./import-email-wizard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { checkEmailImportAvailability } from "@/app/actions/customer";

interface EmptyStateProps {
  onImport?: () => void;
  onConvert?: () => void;
}

export function EmptyState({ onImport, onConvert }: EmptyStateProps) {
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    available: boolean;
    emailCount?: number;
    needsEmailSetup?: boolean;
    needsEmailSync?: boolean;
  } | null>(null);

  // Function to handle import button click
  const handleImportClick = async () => {
    // If custom import handler is provided, use it
    if (onImport) {
      onImport();
      return;
    }

    // Otherwise, show our email import wizard
    try {
      const status = await checkEmailImportAvailability();
      setImportStatus(status);
      setShowImportWizard(true);
    } catch (error) {
      console.error("Failed to check import availability:", error);
      // Show dialog anyway, the wizard will handle the error
      setImportStatus({
        available: false,
        needsEmailSetup: true,
      });
      setShowImportWizard(true);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <UsersRound className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-2xl font-semibold">No customers yet</h3>
        <p className="mt-2 text-muted-foreground max-w-md">
          You have no customers in the system. You can import customers from an external
          source or convert leads to customers.
        </p>
        <div className="mt-6 flex gap-4">
          <Button onClick={handleImportClick} variant="default">
            Import customers
          </Button>
          {onConvert && (
            <Button onClick={onConvert} variant="outline">
              Convert lead to customer
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={showImportWizard}
        onOpenChange={(open) => !open && setShowImportWizard(false)}
      >
        <DialogContent className="max-w-2xl p-0">
          <ImportEmailWizard
            emailCount={importStatus?.emailCount}
            needsEmailSetup={importStatus?.needsEmailSetup}
            needsEmailSync={importStatus?.needsEmailSync}
            onClose={() => setShowImportWizard(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
