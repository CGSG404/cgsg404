
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface PollData {
  website: string;
  upVotes: number;
  downVotes: number;
  totalVotes: number;
  satisfactionRate: number;
  disappointmentRate: number;
  userVote?: 'up' | 'down' | null;
}

const LiveReport = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState<PollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingWebsite, setVotingWebsite] = useState<string | null>(null);

  const websites = ['ExampleCasino.com', 'SpinMax88', 'LuckyWin Casino', 'MegaSpin Palace'];

  useEffect(() => {
    fetchPolls();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('polls-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'polls'
        },
        () => {
          fetchPolls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPolls = async () => {
    try {
      const { data: pollsData, error } = await supabase
        .from('polls')
        .select('website, vote_type, user_id');

      if (error) throw error;

      // Get user votes if authenticated
      let userVotes: Record<string, string> = {};
      if (user) {
        const userVotesData = pollsData?.filter(poll => poll.user_id === user.id) || [];
        userVotesData.forEach(vote => {
          userVotes[vote.website] = vote.vote_type;
        });
      }

      // Aggregate poll data
      const aggregatedPolls: Record<string, PollData> = {};
      
      websites.forEach(website => {
        const websiteVotes = pollsData?.filter(poll => poll.website === website) || [];
        const upVotes = websiteVotes.filter(vote => vote.vote_type === 'up').length;
        const downVotes = websiteVotes.filter(vote => vote.vote_type === 'down').length;
        const totalVotes = upVotes + downVotes;
        
        aggregatedPolls[website] = {
          website,
          upVotes,
          downVotes,
          totalVotes,
          satisfactionRate: totalVotes > 0 ? Math.round((upVotes / totalVotes) * 100) : 0,
          disappointmentRate: totalVotes > 0 ? Math.round((downVotes / totalVotes) * 100) : 0,
          userVote: userVotes[website] as 'up' | 'down' | undefined
        };
      });

      setPolls(Object.values(aggregatedPolls));
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast.error('Error loading poll data');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (website: string, voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    setVotingWebsite(website);

    try {
      // Check if user has already voted for this website
      const { data: existingVote } = await supabase
        .from('polls')
        .select('id, vote_type')
        .eq('website', website)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Same vote, do nothing
          toast.info('You have already voted for this option');
          return;
        } else {
          // Update existing vote
          const { error } = await supabase
            .from('polls')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);

          if (error) throw error;
          toast.success('Vote updated successfully!');
        }
      } else {
        // Insert new vote
        const { error } = await supabase
          .from('polls')
          .insert({
            website,
            user_id: user.id,
            vote_type: voteType
          });

        if (error) throw error;
        toast.success('Vote recorded successfully!');
      }

      fetchPolls();
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Error recording vote');
    } finally {
      setVotingWebsite(null);
    }
  };

  const getRowColor = (satisfactionRate: number, disappointmentRate: number) => {
    if (satisfactionRate > 70) return 'bg-green-500/10 border-green-500/20';
    if (disappointmentRate > 70) return 'bg-red-500/10 border-red-500/20';
    return 'bg-yellow-500/10 border-yellow-500/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-casino-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Live Report <span className="gradient-text">Voting System</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Pantau reaksi real-time dari pengguna berdasarkan suara mereka terhadap layanan.
          </p>
        </div>

        <Card className="bg-casino-card-bg border-casino-border-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-casino-border-subtle">
                  <th className="text-left p-4 font-semibold text-white">Website / Layanan</th>
                  <th className="text-center p-4 font-semibold text-white">Vote</th>
                  <th className="text-center p-4 font-semibold text-white">Total Votes</th>
                  <th className="text-center p-4 font-semibold text-white">Satisfaction</th>
                  <th className="text-center p-4 font-semibold text-white">Disappointment</th>
                  <th className="text-center p-4 font-semibold text-white">Progress</th>
                </tr>
              </thead>
              <tbody>
                {polls.map((poll) => (
                  <tr 
                    key={poll.website} 
                    className={`border-b border-casino-border-subtle transition-all duration-300 ${getRowColor(poll.satisfactionRate, poll.disappointmentRate)}`}
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white">{poll.website}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant={poll.userVote === 'up' ? 'default' : 'outline'}
                          onClick={() => handleVote(poll.website, 'up')}
                          disabled={votingWebsite === poll.website}
                          className="transition-all duration-200 hover:scale-105"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {poll.upVotes}
                        </Button>
                        <Button
                          size="sm"
                          variant={poll.userVote === 'down' ? 'destructive' : 'outline'}
                          onClick={() => handleVote(poll.website, 'down')}
                          disabled={votingWebsite === poll.website}
                          className="transition-all duration-200 hover:scale-105"
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          {poll.downVotes}
                        </Button>
                      </div>
                    </td>
                    <td className="p-4 text-center text-gray-300">
                      {poll.totalVotes}
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-green-400 font-bold">
                        {poll.satisfactionRate}%
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-red-400 font-bold">
                        {poll.disappointmentRate}%
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-400 w-12">Puas</span>
                          <Progress 
                            value={poll.satisfactionRate} 
                            className="flex-1 h-2"
                          />
                          <span className="text-xs text-green-400 w-8">{poll.satisfactionRate}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-400 w-12">Kecewa</span>
                          <Progress 
                            value={poll.disappointmentRate} 
                            className="flex-1 h-2 [&>div]:bg-red-500"
                          />
                          <span className="text-xs text-red-400 w-8">{poll.disappointmentRate}%</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {!user && (
          <div className="mt-8 text-center">
            <Card className="bg-casino-card-bg border-casino-border-subtle p-6">
              <p className="text-gray-400 mb-4">
                Sign in to participate in the voting system
              </p>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90"
              >
                Sign In to Vote
              </Button>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LiveReport;
