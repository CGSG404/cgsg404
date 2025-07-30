import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ReportCardProps {
  casinoName: string;
  reportDate: string;
  issue: string;
  isLicensed: boolean;
  reportUrl: string;
  className?: string;
}

const ReportCard = ({
  casinoName,
  reportDate,
  issue,
  isLicensed = false,
  reportUrl,
  className = ''
}: ReportCardProps) => {
  const [open, setOpen] = useState(false);
  return (<>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      <Card className="bg-casino-card-bg border-casino-border-subtle p-4 sm:p-6 hover:border-red-500/30 transition-all duration-300 h-full min-h-[200px] sm:min-h-[280px]">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-2 mb-2 sm:mb-3">
              <motion.h3
                className="text-lg sm:text-xl font-bold text-white"
                whileHover={{ x: 2 }}
              >
                🟥 {casinoName}
              </motion.h3>
              <motion.div
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${
                  isLicensed
                    ? 'text-green-400 bg-green-400/10 border-green-400/20'
                    : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                }`}
                initial={{ scale: 0.95, opacity: 0.9 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 500,
                  damping: 15
                }}
              >
                <AlertTriangle className="w-4 h-4" />
                {isLicensed ? 'Licensed' : 'Unlicensed'}
              </motion.div>
            </div>

            <motion.div
              className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">Time Reported: {reportDate}</span>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-1 sm:gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 overflow-hidden">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed break-words line-clamp-2 sm:line-clamp-3">
                  <span className="font-medium text-white">Problem:</span> {issue}
                </p>
                {issue.length > 80 && (
                  <button
                    onClick={() => setOpen(true)}
                    className="text-casino-neon-green text-xs sm:text-sm mt-1 hover:underline"
                  >
                    Read More
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-auto pt-2 border-t border-casino-border-subtle/50 flex justify-end"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.a
              href={reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              Check Domain →
            </motion.a>
          </motion.div>
        </div>
      </Card>
    </motion.div>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-casino-card-bg border border-casino-border-subtle rounded-lg max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">{casinoName} – Full Report</h3>
            <p className="text-gray-300 whitespace-pre-wrap break-words">
              {issue}
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-6 text-casino-neon-green hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportCard;

// ---------- Modal overlay component inside ReportCard file ----------
