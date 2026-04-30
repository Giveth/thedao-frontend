import Footer from '~/components/Footer';
import Header from '~/components/Header';
import { generateMeta } from '~/utils/meta';
import Description from './Description';
import BenefitsGrid, { type Benefit } from './BenefitsGrid';
import InfluenceSection from './InfluenceSection';
import CtaSection from './CtaSection';

export function meta() {
  return generateMeta({
    title: 'ETHSecurity Badge',
    description:
      'The ETHSecurity Badge recognizes leading researchers helping secure the Ethereum ecosystem. Badge holders gain visibility and direct influence over security funding.',
    url: '/ethsecurity-badges',
  });
}

const benefits: Benefit[] = [
  {
    id: 1,
    icon: '/icon-badge-1.svg',
    title: 'Trusted Reputation',
    description: "Badge holder's address will be instantly trusted in incidents",
  },
  {
    id: 2,
    icon: '/icon-badge-2.svg',
    title: 'Telegram Group',
    description: "The badge holders' token-gated chat will be very high signal!",
  },
  {
    id: 3,
    icon: '/icon-badge-3.svg',
    title: 'Funding Influence',
    description: 'TheDAO has $150M and badge holders influence where it goes!',
  },
];

export default function EthSecurityBadge() {
  return (
    <>
      <section
        className="relative min-h-screen overflow-hidden pt-32 pb-[120px]"
        style={{ backgroundImage: 'linear-gradient(142.716deg, rgb(44, 94, 134) 31.459%, rgb(31, 67, 95) 90.396%)' }}
      >
        <div className="relative z-10 max-w-[1100px] mx-auto px-6">
          <Header
            title="ETHSecurity Badge"
            subtitle="For the top Ethereum Security Experts"
            video="/eth-security-badge.mp4"
            cta={{ href: 'https://t.me/ETHSecurityBadges_bot', label: 'Apply' }}
          />

          <Description>
            The ETHSecurity Badge recognizes leading researchers helping secure the Ethereum ecosystem. Badge holders
            gain visibility in the community and direct influence over which security initiatives receive funding.
          </Description>

          <BenefitsGrid benefits={benefits} />

          <InfluenceSection
            title="Help shape Ethereum security"
            description="Badge holders participate in signaling which security initiatives deserve support from the community."
          />

          <CtaSection href="https://paragraph.com/@thedao.fund/thedao-is-becoming-a-dao-again" label="Read More" />
        </div>
      </section>
      <Footer />
    </>
  );
}
