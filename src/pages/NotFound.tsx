import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-casino-dark to-casino-darker p-4">
      <div className="text-center max-w-md bg-white dark:bg-casino-card p-8 rounded-lg shadow-lg">
        <h1 className="text-8xl font-bold text-casino-neon-green mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you are looking for does not exist.
        </p>
        <Button
          onClick={handleGoHome}
          className="bg-casino-neon-green hover:bg-casino-neon-green/90 text-casino-dark font-semibold py-6 px-8 rounded-full flex items-center mx-auto"
        >
          <Home className="mr-2 h-5 w-5" />
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
