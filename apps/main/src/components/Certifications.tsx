import Image from 'next/image';
import { awsAiPractitioner as certification } from '@/data/certifications';

export default function Certifications() {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="scroll-mt-24 border-b border-line py-16 md:py-20"
    >
      <p className="eyebrow text-xs font-bold uppercase">Credentials</p>
      <h2
        id="certifications-heading"
        className="mt-3 text-3xl font-bold text-fg md:text-4xl"
      >
        Certifications
      </h2>

      <article className="panel mt-8 flex flex-col gap-6 p-6 sm:flex-row sm:items-start md:p-8">
        <Image
          src={certification.badgeImage}
          alt="Official AWS Certified AI Practitioner badge"
          width={600}
          height={600}
          loading="lazy"
          unoptimized
          className="h-24 w-24 shrink-0 rounded-lg sm:h-28 sm:w-28"
        />
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-fg">
            {certification.name}
          </h3>
          <dl className="mt-4 space-y-2 text-sm leading-6 text-fg-muted">
            <div>
              <dt className="inline font-medium text-fg">Issuer: </dt>
              <dd className="inline">{certification.issuer}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-fg">Earned: </dt>
              <dd className="inline">
                <time dateTime={certification.issuedOn}>
                  {certification.earnedLabel}
                </time>
              </dd>
            </div>
            <div>
              <dt className="inline font-medium text-fg">Expires: </dt>
              <dd className="inline">
                <time dateTime={certification.expiresOn}>
                  {certification.expiresLabel}
                </time>
              </dd>
            </div>
            <div>
              <dt className="inline font-medium text-fg">
                Credential verification:{' '}
              </dt>
              <dd className="inline">{certification.verificationProvider}</dd>
            </div>
          </dl>

          <a
            href={certification.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-amber underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
          >
            Verify Credential
            <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </article>
    </section>
  );
}
