import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
const QandA = () => {
  return (
    <div>
      <Alert variant="destructive" className="mb-4">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Under Development</AlertTitle>
        <AlertDescription>
          The page is currently under development. We appreciate your patience.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default QandA;
