import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, X } from 'lucide-react';

type ShareDialogProps = {
  /** Controls dialog visibility. */
  open: boolean;
  /** Called when the dialog requests to close (backdrop click, X, or Escape). */
  onClose: () => void;
  /** The canonical URL being shared. Used in the copy field and all social-share intents. */
  url: string;
  /** Title text shown in the dialog header. Defaults to "Share". */
  title?: string;
  /** Optional sub-header content (string or JSX). */
  subtitle?: ReactNode;
  /** Message text used in tweet / Telegram / Farcaster intent URLs. */
  shareMessage?: string;
};

/**
 * A reusable share dialog with a copy-link field and X / Telegram / LinkedIn /
 * Farcaster social-share intents. Self-contained: handles its own copy state,
 * Escape-to-close, backdrop click, and clipboard fallback for browsers without
 * `navigator.clipboard`.
 */
export default function ShareDialog({
  open,
  onClose,
  url,
  title = 'Share',
  subtitle,
  shareMessage = '',
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore — user can still copy from the input field manually.
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(shareMessage);

  const socialLinks = [
    {
      name: 'X / Twitter',
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`,
    },
    {
      name: 'Telegram',
      color: '#26A5E4',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
    },
    {
      name: 'LinkedIn',
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Farcaster',
      color: '#8465CB',
      url: `https://warpcast.com/~/compose?text=${encodeURIComponent(`${shareMessage} ${url}`.trim())}`,
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="relative w-[420px] max-w-[90vw] bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl"
            style={{ backgroundImage: 'linear-gradient(160deg, rgba(44, 94, 134, 0.8) 0%, rgba(31, 67, 95, 0.95) 100%)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="text-[20px] text-white mb-1 font-inter-tight">{title}</h4>
            {subtitle && (
              <p className="text-[14px] text-white/50 mb-5 font-inter-tight">{subtitle}</p>
            )}

            <div className="flex items-center gap-2 mb-5 bg-white/5 border border-white/10 rounded-xl p-3">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-transparent text-white/80 text-[13px] outline-none truncate font-inter-tight"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dao-green/20 text-dao-green text-[13px] hover:bg-dao-green/30 transition-all duration-200 cursor-pointer font-inter-tight"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-[14px] hover:bg-white/10 hover:border-white/20 transition-all duration-200 font-inter-tight"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: social.color }}
                  />
                  {social.name}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
