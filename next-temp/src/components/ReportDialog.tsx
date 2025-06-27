
"use client";

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailConfig';
import { toast } from 'sonner';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Kirim email menggunakan EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          casino_name: formData.casinoName,
          issue: formData.issue,
          date: formData.date || 'Not specified',
          email: formData.email || 'Not provided',
          timestamp: new Date().toLocaleString(),
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      // Tampilkan notifikasi sukses
      toast.success('Report submitted successfully!', {
        description: 'Thank you for your feedback. We will review it shortly.'
      });
      
      // Reset form dan tampilkan pesan sukses
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to send report:', err);
      setError('Failed to submit report. Please try again later.');
      toast.error('Failed to submit report', {
        description: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-casino-card-bg border-casino-border-subtle max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-casino-neon-green flex-shrink-0" />
              <DialogTitle className="text-lg sm:text-xl text-white leading-tight">
                Report an Issue with This Casino
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-gray-300 text-sm sm:text-base px-1">
            Help us keep our community safe. If you've experienced problems with this casino, please share the details below so we can investigate and take action if needed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 px-1">
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

          <div className="bg-casino-dark/50 border border-casino-border-subtle rounded-lg p-3 mt-4 text-sm sm:text-base">
            <p className="text-sm text-gray-400">
              <strong>Additional Notes:</strong> All reports are confidential. We do not share your contact details with the casino. Submitting a report helps us protect other players and ensure transparency in our reviews.
            </p>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-md p-3">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 border-casino-border-subtle text-gray-300 hover:bg-casino-dark hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold"
              disabled={!formData.issue.trim() || isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
