import { SOCIAL_LINKS } from "~/data/site";

export default function Footer() {
  return (
    <footer className="w-full py-8 md:py-12 border-t border-white/5">
      <div className="max-w-[1618px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white text-base font-normal leading-normal">
          © 2025 TheDAO LLC. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a 
            href={SOCIAL_LINKS.paragraph} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            title="Paragraph"
          >
            <img src="/paragraph-icon.svg" alt="Paragraph" className="w-10 h-10 shadow-sm" />
          </a>
          <a 
            href={SOCIAL_LINKS.twitter} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            title="X (Twitter)"
          >
            <img src="/x-icon.svg" alt="X (Twitter)" className="w-10 h-10 shadow-sm" />
          </a>
          <a 
            href={SOCIAL_LINKS.farcaster} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            title="Farcaster"
          >
            <img src="/farcaster-icon.svg" alt="Farcaster" className="w-10 h-10 shadow-sm" />
          </a>
        </div>
      </div>
    </footer>
  )
}
