
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ForumCTA = () => {
  return (
    <div className="text-center">
      <Card className="bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-green/5 border-casino-neon-green/30 max-w-2xl mx-auto">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Join the Community?
          </h3>
          <p className="text-gray-300 mb-6">
            Create an account to start participating in discussions, ask questions, and share your casino experiences.
          </p>
          <Button className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold px-8 py-3">
            Sign Up Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumCTA;
