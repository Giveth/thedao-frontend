import Footer from '~/components/Footer';
import Header from '~/components/Header';
import { generateMeta } from '~/utils/meta';
import { rounds } from './data';
import RoundCard from './RoundCard';

export function meta() {
  return generateMeta({
    title: 'Funding Rounds',
    description:
      'TheDAO Security Fund Quadratic Funding rounds — supporting people and projects making Ethereum safer. The Ethereum Security round on Giveth has a 500 ETH matching pool, open April 23 – May 14, 2026.',
    url: '/funding-rounds',
  });
}

export default function FundingRounds() {
  return (
    <>
      <section
        className="relative min-h-screen overflow-hidden pt-32 pb-[120px]"
        style={{ backgroundImage: 'linear-gradient(142.716deg, rgb(44, 94, 134) 31.459%, rgb(31, 67, 95) 90.396%)' }}
      >
        <div className="relative z-10 max-w-[1100px] mx-auto px-6">
          <div className="max-h-50 md:max-h-none">
            <Header
              title="Funding Rounds"
              subtitle="Our funding rounds support the people and projects making Ethereum safer."
            />
          </div>

          <div className="flex flex-col gap-8">
            {rounds.map((round, index) => (
              <RoundCard key={round.id} round={round} reversed={false} index={index} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
