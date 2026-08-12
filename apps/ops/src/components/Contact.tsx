import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa6";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";

const endpoints = [
  {
    icon: FaEnvelope,
    label: "Email",
    value: "edberto@edtosoy.com",
    href: "mailto:edberto@edtosoy.com",
    external: false,
  },
  {
    icon: FaGithub,
    label: "GitHub",
    value: "github.com/edtosoy",
    href: "https://github.com/edtosoy",
    external: true,
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/edtosoy",
    href: "https://linkedin.com/in/edtosoy",
    external: true,
  },
  {
    icon: HiOutlineDocumentArrowDown,
    label: "Resume",
    value: "Download Resume",
    href: "/resume.pdf",
    external: true,
  },
];

export default function Contact() {
  return (
    <section id="contact" className=" py-24 md:py-28">
      <div className="max-w-3xl">
        <p className="eyebrow text-xs font-bold uppercase">Contact</p>

        <h2 className="mt-3 text-3xl font-bold text-fg md:text-4xl">
          Let&apos;s build something meaningful.
        </h2>

        <p className="mt-6 text-lg leading-8 text-fg-muted">
          Whether it&apos;s a new opportunity, an interesting project, or just a
          conversation about software, I&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {endpoints.map((endpoint) => (
          <Link
            key={endpoint.label}
            href={endpoint.href}
            target={endpoint.external ? "_blank" : undefined}
            className="panel panel-hover flex items-center gap-4 p-6"
          >
            <span className="panel grid h-11 w-11 shrink-0 place-content-center rounded-full text-amber">
              <endpoint.icon size={18} />
            </span>

            <div>
              <p className="mono text-xs uppercase tracking-wide text-fg-dim">
                {endpoint.label}
              </p>
              <p className="mt-1 font-medium text-fg">{endpoint.value}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
