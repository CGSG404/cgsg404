
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  casinoName: string;
}

const ReportDialog = ({ open, onOpenChange, casinoName }: ReportDialogProps) => {
  const [formData, setFormData] = useState({
    casinoName: casinoName,
    issue: '',
    date: '',
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Report submitted:', formData);
    setIsSubmitted(true);
    // Here you would typically send the data to your backend
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      casinoName: casinoName,
      issue: '',
      date: '',
      email: '',
    });
    setIsSubmitted(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-casino-card-bg border-casino-border-subtle">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-xl text-white">Thank you for your report</DialogTitle>
            <DialogDescription className="text-gray-300 text-base mt-4">
              Our team will review the issue and take action if necessary. We appreciate your help in keeping our platform trustworthy.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleClose}
              className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-casino-card-bg border-casino-border-subtle">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-casino-neon-green" />
            <DialogTitle className="text-xl text-white">Report an Issue with This Casino</DialogTitle>
          </div>
          <DialogDescription className="text-gray-300">
            Help us keep our community safe. If you've experienced problems with this casino, please share the details below so we can investigate and take action if needed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="casinoName" className="text-gray-300">Casino Name</Label>
            <Input
              id="casinoName"
              value={formData.casinoName}
              onChange={(e) => handleInputChange('casinoName', e.target.value)}
              className="bg-casino-dark border-casino-border-subtle text-white"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue" className="text-gray-300">Describe the issue *</Label>
            <Textarea
              id="issue"
              placeholder="I requested a withdrawal over a week ago and still haven't received it. Support is not responding."
              value={formData.issue}
              onChange={(e) => handleInputChange('issue', e.target.value)}
              className="bg-casino-dark border-casino-border-subtle text-white min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-300">Date of Incident</Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="bg-casino-dark border-casino-border-subtle text-white"
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Your Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-casino-dark border-casino-border-subtle text-white"
            />
          </div>

          <div className="bg-casino-dark/50 border border-casino-border-subtle rounded-lg p-3 mt-4">
            <p className="text-sm text-gray-400">
              <strong>Additional Notes:</strong> All reports are confidential. We do not share your contact details with the casino. Submitting a report helps us protect other players and ensure transparency in our reviews.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-casino-border-subtle text-gray-300 hover:bg-casino-dark hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold"
              disabled={!formData.issue.trim()}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
