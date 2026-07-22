'use client'

import { PageHeading, SectionHeading, BodyText } from '@/app/components/atoms/text/index'
import ButtonBack from '@/app/components/atoms/ButtonBack'
import LinkText from '@/app/components/atoms/text/LinkText'

export default function TermsOfUse() {
    return (
        <main className="flex flex-1 flex-col items-center py-16 px-8 bg-[var(--color-surface)] min-h-screen">
            <div className="w-full max-w-5xl flex flex-col gap-6">
                <ButtonBack href="/">Home</ButtonBack>

                <PageHeading>Terms of use</PageHeading>

                <BodyText muted>Last updated: 22nd July 2026</BodyText>

                <SectionHeading>1. Who we are</SectionHeading>
                <BodyText>
                    Michael Rust ("we," "us," "our") operates mikejamesrust.com (the "Site") to provide video content.
                </BodyText>

                <SectionHeading>2. Acceptance of these terms</SectionHeading>
                <BodyText>
                    By creating an account, or otherwise using the Site, you agree to these Terms of Use and our{' '}
                    <LinkText href="/policies/cookie-policy">Cookie Policy</LinkText>. If you don't agree, please don't use the Site.
                </BodyText>

                <SectionHeading>3. Cookies and tracking</SectionHeading>
                <BodyText>
                    Using the Site means certain cookies and similar technologies will be set on your device, as described in full in our Cookie Policy. To continue to use the Site you must accept all cookies via the cookie modal, please see the details of our downstream dependencies in the cookie policy as to why the necessary, functional, analytic, marketing/tracking cookies and other storage are all required for this site to function.
                </BodyText>

                <SectionHeading>4. Your account</SectionHeading>
                <BodyText>
                    You must provide accurate information when signing up and keep your login details/activation code confidential.
                </BodyText>
                <BodyText>
                    You're responsible for all activity under your account. Tell us immediately at [email] if you suspect unauthorised access.
                </BodyText>
                <BodyText>
                    We may suspend or terminate accounts that breach these Terms, including sharing access with people who haven't paid for it.
                </BodyText>

                <SectionHeading>5. Content, intellectual property, and copying</SectionHeading>
                <BodyText>
                    All videos, course materials, and other content on the Site ("Content") are owned by us or licensed to us, and are protected by copyright and other intellectual property laws.
                </BodyText>
                <BodyText>
                    Your account gives you a personal, non-transferable, non-exclusive licence to stream Content for your own private viewing. It does not give you any ownership rights.
                </BodyText>
                <SectionHeading as="h3">You must not:</SectionHeading>
                <BodyText>
                    - Download, copy, screen-record, reproduce, or store Content except where the Site explicitly allows it;
                </BodyText>
                <BodyText>
                    - Distribute, share, re-upload, sell, rent, sublicense, or otherwise make Content available to any third party, including on social media, file-sharing services, or other websites;
                </BodyText>
                <BodyText>
                    - Remove or obscure any copyright, trademark, or other proprietary notices from the Content;
                </BodyText>
                <BodyText>
                    - Circumvent or attempt to circumvent any technical protection measures (e.g. signed URLs, DRM) used to deliver Content.
                </BodyText>
                <BodyText>
                    Breach of this section may result in immediate termination of your account without refund, and we reserve the right to pursue further legal remedies.
                </BodyText>

                <SectionHeading>6. Acceptable use</SectionHeading>
                <BodyText>
                    You agree not to use the Site to:
                </BodyText>
                <BodyText>
                    - Act unlawfully, or in a way that facilitates illegal activity;
                </BodyText>
                <BodyText>
                    - Harass, threaten, defame, or abuse other users, instructors, or us;
                </BodyText>
                <BodyText>
                    - Upload or transmit malicious code, or attempt to gain unauthorised access to our systems or other users' accounts;
                </BodyText>
                <BodyText>
                    - Scrape, mine, or systematically extract data from the Site;
                </BodyText>
                <BodyText>
                    - Impersonate any person or misrepresent your affiliation with us;
                </BodyText>
                <BodyText>
                    - Use the Site in any way that is unethical, discriminatory, or brings us or our community into disrepute.
                </BodyText>
                <BodyText>
                    We may suspend or terminate access for any breach of this section at our discretion.
                </BodyText>

                <SectionHeading>7. Availability and changes to the Site</SectionHeading>
                <BodyText>
                    We aim to keep the Site available but don't guarantee uninterrupted access — content may be added, removed, or updated, and we may carry out maintenance without notice.
                </BodyText>
                <BodyText>
                    We may update these Terms from time to time; continued use after changes take effect means you accept the updated Terms. We'll flag material changes where reasonably possible (e.g. by email or a Site notice).
                </BodyText>

                <SectionHeading>8. Liability</SectionHeading>
                <BodyText>
                    Nothing in these Terms limits liability where it would be unlawful to do so (e.g. for death or personal injury caused by negligence, or fraud).
                </BodyText>
                <BodyText>
                    Subject to that, we provide the Site "as is" and aren't liable for indirect or consequential losses, or for issues arising from third-party services we rely on (e.g. payment processing, video hosting, or embedded content).
                </BodyText>
                <BodyText>
                    Our total liability to you for any claim is limited to the amount you've paid us in the 12 months before the claim arose.
                </BodyText>

                <SectionHeading>9. Termination</SectionHeading>
                <BodyText>
                    We may suspend or terminate your access, with or without notice, if you breach these Terms — particularly the content-protection or acceptable-use sections. You may delete your account at any time.
                </BodyText>

                <SectionHeading>10. Governing law</SectionHeading>
                <BodyText>
                    These Terms are governed by the laws of England and Wales, and any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
                </BodyText>

                <SectionHeading>11. Contact</SectionHeading>
                <BodyText>
                    Questions about these Terms, email: mike.james.rust@gmail.com
                </BodyText>

                <BodyText muted>
                    This draft doesn't cover trader-information disclosures (business name/address must also appear elsewhere on the Site per the Ecommerce Regulations), or a full Privacy/Cookie Policy — those should sit alongside this as separate linked pages.
                </BodyText>
            </div>
        </main>
    )
}