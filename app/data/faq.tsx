import type { ReactNode } from 'react';
import { Link } from 'react-router';

export interface FaqItem {
  question: string;
  /** Rich answer rendered in the FAQ accordion */
  answer: ReactNode;
  /** Plain-text version of the answer, used for FAQPage structured data */
  plainAnswer: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-dao-green underline underline-offset-4 hover:opacity-80 transition-opacity"
    >
      {children}
    </a>
  );
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'General',
    items: [
      {
        question: 'Wait... TheDAO? The one from 2016?',
        answer: (
          <>
            <p>
              Yes, that one. In 2016 TheDAO raised about 14% of all ETH in existence, and then got
              famously hacked. The White Hat Group and an Ethereum hard fork recovered the funds,
              and a Curator Multisig was set up to handle the edge cases, with a promise that
              unclaimed ether would be sent to a not-for-profit entity to support Ethereum security.
            </p>
            <p>
              TheDAO Security Fund is the fulfilment of that promise, with a slight modification.
              Claims are kept open and the bulk of the unclaimed collateral is being staked, and
              only the rewards are being used to fund Ethereum Security.
            </p>
          </>
        ),
        plainAnswer:
          'Yes, that one. In 2016 TheDAO raised about 14% of all ETH in existence, and then got famously hacked. The White Hat Group and an Ethereum hard fork recovered the funds, and a Curator Multisig was set up to handle the edge cases, with a promise that unclaimed ether would be sent to a not-for-profit entity to support Ethereum security. TheDAO Security Fund is the fulfilment of that promise, with a slight modification. Claims are kept open and the bulk of the unclaimed collateral is being staked, and only the rewards are being used to fund Ethereum Security.',
      },
      {
        question: 'What is TheDAO Security Fund?',
        answer: (
          <>
            <p>
              We are a fund dedicated to improving Ethereum security. In January 2026 we activated
              over 75,000 ETH of unclaimed TheDAO funds as an endowment. The ETH is staked, and the
              staking rewards fund security work for the whole ecosystem.
            </p>
            <p>
              The fund is stewarded by 7 Curators: 2 OG Curators from 2016, Vitalik Buterin and
              Griff Green, plus Taylor Monahan, Jordi Baylina, pcaversaccio, Alex Van de Sande and
              Pol Lanski. All legends in their own right.
            </p>
            <p>
              Our goal: make Ethereum so safe, your life savings are better off stored on Ethereum
              than in a bank.
            </p>
          </>
        ),
        plainAnswer:
          'We are a fund dedicated to improving Ethereum security. In January 2026 we activated over 75,000 ETH of unclaimed TheDAO funds as an endowment. The ETH is staked, and the staking rewards fund security work for the whole ecosystem. The fund is stewarded by 7 Curators: 2 OG Curators from 2016, Vitalik Buterin and Griff Green, plus Taylor Monahan, Jordi Baylina, pcaversaccio, Alex Van de Sande and Pol Lanski. Our goal: make Ethereum so safe, your life savings are better off stored on Ethereum than in a bank.',
      },
      {
        question: "Where does the fund's capital come from?",
        answer: (
          <>
            <p>Two smart contracts that sat mostly untouched since 2016:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                The ExtraBalance withdrawal contract (~70,500 ETH): funds that remained claimable
                after the hard fork, most of which were never claimed.
              </li>
              <li>
                TheDAO Curator Multisig (~4,600 ETH in ETH and DAO tokens): mostly old proposal
                deposits and funds people accidentally sent to TheDAO's contracts, with no clear
                claimants.
              </li>
            </ul>
            <p>
              We operate as an endowment. Roughly 69,000 ETH is staked on decentralized
              infrastructure run by Dappnode, with validators spread across clients and 4
              continents. The rewards from staking are used to fund Ethereum Security.
            </p>
            <p>
              Note: the main DAO withdraw contract created by the hard fork is NOT part of the
              fund. DAO tokens continue to be redeemable for ETH, same as they have been since
              2016.
            </p>
          </>
        ),
        plainAnswer:
          'Two smart contracts that sat mostly untouched since 2016: the ExtraBalance withdrawal contract (~70,500 ETH), funds that remained claimable after the hard fork, most of which were never claimed; and TheDAO Curator Multisig (~4,600 ETH in ETH and DAO tokens), mostly old proposal deposits and funds people accidentally sent to TheDAO’s contracts, with no clear claimants. We operate as an endowment. Roughly 69,000 ETH is staked on decentralized infrastructure run by Dappnode, with validators spread across clients and 4 continents. The rewards from staking are used to fund Ethereum Security. Note: the main DAO withdraw contract created by the hard fork is NOT part of the fund. DAO tokens continue to be redeemable for ETH, same as they have been since 2016.',
      },
      {
        question: 'Can I still claim funds from TheDAO?',
        answer: (
          <>
            <p>Yes. Keeping claims open is a core commitment of this fund.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                DAO tokens are still redeemable for ETH through the withdraw contract created by
                the hard fork. That contract is untouched by the fund. 100 DAO tokens will always
                be redeemable for 1 ETH, this fund has no power to change that.
              </li>
              <li>
                ExtraBalance claims work permissionlessly through the ExtraBalance withdrawal
                contract, which we keep funded. Since launch we have returned 738 ETH to claimants,
                more than was claimed in the four years before.
              </li>
              <li>
                Other edge cases: reach out to griff [at] giveth [dot] io directly. Claimants will
                need to prove ownership by signing a message from the address that sent the funds
                and then we will process your claim.
              </li>
            </ul>
          </>
        ),
        plainAnswer:
          'Yes. Keeping claims open is a core commitment of this fund. DAO tokens are still redeemable for ETH through the withdraw contract created by the hard fork; 100 DAO tokens will always be redeemable for 1 ETH. ExtraBalance claims work permissionlessly through the ExtraBalance withdrawal contract, which we keep funded. Since launch we have returned 738 ETH to claimants, more than was claimed in the four years before. For other edge cases, reach out to griff [at] giveth [dot] io directly and prove ownership by signing a message from the address that sent the funds.',
      },
      {
        question: 'What security work is TheDAO Security Fund designed to support?',
        answer: (
          <>
            <p>
              We want to fund security initiatives that are creating clear public value to
              Ethereum. Every project locks its own doors: audits, bug bounties, monitoring for
              their own four walls. Almost nobody funds the shared building: the compilers, the
              wallets, the signing flows, the incident responders who pick up the phone at 3am.
            </p>
            <p>That is our focus. Work we have supported includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Incident response, starting with SEAL 911 and SEAL.</li>
              <li>Formal verification.</li>
              <li>Wallet UX and smart contract security.</li>
              <li>Core protocol and L2 security.</li>
              <li>And much more!</li>
            </ul>
            <p>
              We have supported 134 projects with over 1000 ETH so far across these categories,
              check out who we have supported on our{' '}
              <Link
                to="/transparency"
                className="text-dao-green underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Transparency page
              </Link>
              .
            </p>
          </>
        ),
        plainAnswer:
          'We want to fund security initiatives that are creating clear public value to Ethereum. Almost nobody funds the shared building: the compilers, the wallets, the signing flows, the incident responders who pick up the phone at 3am. That is our focus. Work we have supported includes incident response (starting with SEAL 911 and SEAL), formal verification, wallet UX and smart contract security, core protocol and L2 security, and much more. We have supported 134 projects with over 1000 ETH so far across these categories. Check out who we have supported at https://thedao.fund/transparency/.',
      },
      {
        question: 'How are funding decisions made?',
        answer: (
          <>
            <p>From the bottom up, with real experts in the loop.</p>
            <p>
              The 7 Curators act like a board: they set each round's budget, approve the
              distribution mechanism, and sign the multisig transactions (4-of-7) for funding
              execution. The actual funding direction comes from the ETHSecurity Badge holders, the
              top security experts in Ethereum, who apply their expertise to decide where the money
              goes, and the broader Ethereum community itself.
            </p>
            <p>
              Every round runs on an open mechanism, and ends with a public retrospective so the
              next round is better than the last. Open books, on-chain distributions, & published
              learnings.
            </p>
          </>
        ),
        plainAnswer:
          "From the bottom up, with real experts in the loop. The 7 Curators act like a board: they set each round's budget, approve the distribution mechanism, and sign the multisig transactions (4-of-7) for funding execution. The actual funding direction comes from the ETHSecurity Badge holders, the top security experts in Ethereum, who apply their expertise to decide where the money goes, and the broader Ethereum community itself. Every round runs on an open mechanism, and ends with a public retrospective so the next round is better than the last. Open books, on-chain distributions, and published learnings.",
      },
    ],
  },
  {
    title: 'ETHSecurity Badge holders',
    items: [
      {
        question: 'What are ETHSecurity Badges?',
        answer: (
          <>
            <p>
              ETHSecurity Badges are NFTs on Ethereum mainnet held by the top security experts in
              Ethereum: the auditors, whitehats, researchers, and protocol engineers who have spent
              years finding bugs, preventing hacks, and cleaning up when things go wrong. They are
              TheDAO's DAO.
            </p>
            <p>
              The Badge is not a job. We don't require Badge holders to do work for the fund. We
              ask them to apply their expertise to our funding decisions, so the money follows the
              judgment of the people who actually understand Ethereum security, and we give them
              special opportunities to become more engaged.
            </p>
            <p>
              Each badge holder gets two NFTs: a public credential Badge and a separate private
              voting Badge, so they can vote honestly without social pressure. Selection was
              rigorous: every application was researched and scored against a rubric (with help
              from the <ExternalLink href="https://bonfires.ai/">Bonfires AI team</ExternalLink>),
              and Badges went out in three batches through 2026.
            </p>
          </>
        ),
        plainAnswer:
          "ETHSecurity Badges are NFTs on Ethereum mainnet held by the top security experts in Ethereum: the auditors, whitehats, researchers, and protocol engineers who have spent years finding bugs, preventing hacks, and cleaning up when things go wrong. They are TheDAO's DAO. The Badge is not a job. We ask holders to apply their expertise to our funding decisions. Each badge holder gets two NFTs: a public credential Badge and a separate private voting Badge, so they can vote honestly without social pressure. Selection was rigorous: every application was researched and scored against a rubric, and Badges went out in three batches through 2026.",
      },
      {
        question: 'How can I become an ETHSecurity Badge holder?',
        answer: (
          <p>
            Applications are open, and we will consider bringing on new members as needed for
            future rounds. There are no concrete plans to do so now. Follow{' '}
            <ExternalLink href="https://x.com/thedaofund">@thedaofund</ExternalLink> on X for
            updates.
          </p>
        ),
        plainAnswer:
          'Applications are open, and we will consider bringing on new members as needed for future rounds. There are no concrete plans to do so now. Follow @thedaofund on X for updates.',
      },
      {
        question: 'What role do ETHSecurity Badge holders play in funding rounds?',
        answer: (
          <>
            <p>They are the expert signal at the center of every funding distribution.</p>
            <p>
              In our first quadratic funding round, each $1 a Badge holder donated counted as $4 in
              the matching calculation, roughly doubling their influence over the matching pool.
              They also received FINN & TIK, donation tokens backed by the fund, which they
              allocated across projects.
            </p>
            <p>
              In future rounds, Badge holders may rank ecosystem initiatives to allocate a budget
              set forth from TheDAO Security Fund.
            </p>
            <p>
              Badge holders participation in these rounds is generally private but is always
              reviewed to ensure integrity in the process.
            </p>
          </>
        ),
        plainAnswer:
          'They are the expert signal at the center of every funding distribution. In our first quadratic funding round, each $1 a Badge holder donated counted as $4 in the matching calculation, roughly doubling their influence over the matching pool. They also received FINN & TIK, donation tokens backed by the fund, which they allocated across projects. In future rounds, Badge holders may rank ecosystem initiatives to allocate a budget set forth from TheDAO Security Fund. Badge holders participation in these rounds is generally private but is always reviewed to ensure integrity in the process.',
      },
    ],
  },
  {
    title: 'Funding Rounds',
    items: [
      {
        question: 'What funding mechanisms will TheDAO use to distribute funds?',
        answer: (
          <>
            <p>
              We experiment deliberately: one mechanism per round, a public retrospective after
              each one.
            </p>
            <p>
              We started with quadratic funding. Our May 2026 round put a 500 ETH matching pool
              behind community donations, with Badge holder votes amplified and cluster matching to
              resist collusion. The ecosystem showed up with over $600k on top of our matching
              pool, from sponsors like{' '}
              <ExternalLink href="https://www.wintermute.com/">Wintermute</ExternalLink> and{' '}
              <ExternalLink href="https://quantstamp.com/">Quantstamp</ExternalLink>, alongside
              hundreds of individual donors, funding 134 projects.
            </p>
            <p>
              Our next round, targeting late 2026, will be built around funding larger ecosystem
              initiatives through RFPs (Requests for Proposals). We are working with experts to
              write RFPs for specific security work with a budget attached. More on this to come
              soon...
            </p>
            <p>Future rounds will keep evolving as we learn what works and moves the needle.</p>
          </>
        ),
        plainAnswer:
          'We experiment deliberately: one mechanism per round, a public retrospective after each one. We started with quadratic funding. Our May 2026 round put a 500 ETH matching pool behind community donations, with Badge holder votes amplified and cluster matching to resist collusion. The ecosystem showed up with over $600k on top of our matching pool, from sponsors like Wintermute and Quantstamp, alongside hundreds of individual donors, funding 134 projects. Our next round, targeting late 2026, will be built around funding larger ecosystem initiatives through RFPs (Requests for Proposals). Future rounds will keep evolving as we learn what works and moves the needle.',
      },
      {
        question: 'Which projects are eligible for funding?',
        answer: (
          <>
            <p>It depends on the round. Every funding round publishes its own eligibility criteria.</p>
            <p>
              Our quadratic funding round required projects to be security-focused with a track
              record of public benefit. RFP rounds will be different: for-profit companies can
              compete to win them, and some RFPs may even call for closed-source work where that is
              what the job requires.
            </p>
            <p>
              Two things never change: we believe in competitive mechanisms, and we do not pick
              winners. Funding flows through our funding rounds, never through one-off grants.
            </p>
            <p>In short, we will not pay for your audits.</p>
          </>
        ),
        plainAnswer:
          'It depends on the round. Every funding round publishes its own eligibility criteria. Our quadratic funding round required projects to be security-focused with a track record of public benefit. RFP rounds will be different: for-profit companies can compete to win them, and some RFPs may even call for closed-source work where that is what the job requires. Two things never change: we believe in competitive mechanisms, and we do not pick winners. Funding flows through our funding rounds, never through one-off grants. In short, we will not pay for your audits.',
      },
      {
        question: 'How can I apply?',
        answer: (
          <p>
            Depends on the round. Soon, we will be collecting ideas for ecosystem initiatives that
            can be formed into competitive RFPs. Reach out on{' '}
            <ExternalLink href="https://x.com/thedaofund">X</ExternalLink> or through{' '}
            <ExternalLink href="https://thedao.fund/">our website</ExternalLink>.
          </p>
        ),
        plainAnswer:
          'Depends on the round. Soon, we will be collecting ideas for ecosystem initiatives that can be formed into competitive RFPs. Reach out on X (https://x.com/thedaofund) or through our website (https://thedao.fund/).',
      },
    ],
  },
];
