import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export const NotFoundState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Deal not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
};
