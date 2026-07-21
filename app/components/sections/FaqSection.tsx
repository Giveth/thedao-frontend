import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, ChevronDown, Coins, HelpCircle, MessageCircle, Shield } from 'lucide-react'
import FadeContent from '../text-animations/FadeContent'
import { FAQ_GROUPS } from '~/data/faq'
import type { FaqItem } from '~/data/faq'

const GROUP_ICONS = [HelpCircle, Shield, Coins]

// Deterministic particle field (no randomness — keeps SSR/hydration in sync)
const DOTS = Array.from({ length: 30 }, (_, i) => ({
  left: `${(1 + i * 3.33).toFixed(2)}%`,
  top: `${(5 + i * 7) % 100}%`,
  size: i % 3 === 0 ? 3 : 2,
  green: i % 4 === 0,
  delay: `${(i % 10) * 0.7}s`,
}))

const GLOWS = [
  { left: '5%', top: '10%' },
  { left: '30%', top: '32%' },
  { left: '55%', top: '54%' },
  { left: '80%', top: '1%' },
]

function FaqRow({
  item,
  id,
  number,
  isLast,
}: {
  item: FaqItem
  id: string
  number: string
  isLast: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="group relative">
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-[#00ff88] transition-all duration-300 ${open ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-[0.4]'}`}
      />
      <div className="pl-5">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={id}
          className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 pr-4">
            <span
              className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                open
                  ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30'
                  : 'bg-white/5 text-white/30 border border-white/[0.08]'
              }`}
            >
              {number}
            </span>
            <span className="text-[16px] text-white/80 group-hover:text-white transition-colors duration-300">
              {item.question}
            </span>
          </div>
          <div
            className={`shrink-0 p-1 rounded-lg transition-all duration-300 ${open ? 'text-[#00ff88] rotate-180' : 'text-white/30'}`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>
        <div
          id={id}
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className="mb-2 p-4 rounded-lg bg-white/[0.04] border-l-2 border-[#00ff88] text-[15px] text-white/70 leading-relaxed space-y-3">
              {item.answer}
            </div>
          </div>
        </div>
        {!isLast && <div className="h-px bg-white/[0.06]" />}
      </div>
    </div>
  )
}

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="w-full relative overflow-hidden bg-linear-to-br from-dao-blue-light to-dao-blue-dark"
    >
      {/* Floating particles + glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {DOTS.map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-faq-float"
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              background: dot.green ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 255, 255, 0.15)',
              animationDelay: dot.delay,
            }}
          />
        ))}
        {GLOWS.map((glow, i) => (
          <div
            key={i}
            className="absolute rounded-full w-[300px] h-[300px]"
            style={{
              left: glow.left,
              top: glow.top,
              background: 'radial-gradient(circle, rgba(0, 255, 136, 0.05) 0%, transparent 70%)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[760px] mx-auto px-6 pt-26 pb-42">
        {/* Header */}
        <FadeContent blur duration={400}>
          <div className="text-center mb-14">
            <h2 className="text-dao-green text-4xl md:text-5xl lg:text-[60px] font-light leading-[1.15] mb-4">
              Frequently Asked Questions
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}
                className="inline-block align-top mt-2 md:mt-3 ml-2 text-[9px] font-bold tracking-wider uppercase bg-dao-red text-white px-1.5 py-0.5 rounded-full leading-none shadow-md shadow-red-900/40"
              >
                new
              </motion.span>
            </h2>
            <p className="text-xl text-white/80 mb-6">
              Everything you need to know about TheDAO Security Fund.
            </p>
            <div className="w-full h-px bg-linear-to-r from-transparent via-[#00ff88]/50 to-transparent" />
          </div>
        </FadeContent>

        {/* Groups */}
        <div className="flex flex-col gap-10">
          {FAQ_GROUPS.map((group, groupIndex) => {
            const Icon = GROUP_ICONS[groupIndex % GROUP_ICONS.length]
            return (
              <FadeContent key={group.title} blur duration={400} delay={groupIndex * 150}>
                <div
                  id={`faq-${group.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="scroll-mt-28"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#00ff88]/10 border border-[#00ff88]/25 text-[#00ff88]">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[18px] font-semibold text-white">{group.title}</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-2">
                    {group.items.map((item, itemIndex) => (
                      <FaqRow
                        key={item.question}
                        item={item}
                        id={`faq-${groupIndex}-${itemIndex}`}
                        number={String(itemIndex + 1).padStart(2, '0')}
                        isLast={itemIndex === group.items.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </FadeContent>
            )
          })}
        </div>

        {/* Still have questions? */}
        <FadeContent blur duration={400} delay={450}>
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-dao-red/10 border border-dao-red/30 text-dao-red">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Still have questions?</p>
                <p className="text-white/40 text-xs">Our team is happy to help you out.</p>
              </div>
            </div>
            <a
              href="https://x.com/thedaofund"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-dao-red hover:bg-dao-red-hover text-white text-sm shadow-lg shadow-red-900/40 transition-all duration-300 shrink-0"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </FadeContent>
      </div>
    </section>
  )
}
