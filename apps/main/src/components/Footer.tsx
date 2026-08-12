import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa6";
import { navigation } from "@/constants/navigation";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="grid-container py-12">
        <div className="col-start-2 col-end-3">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-fg">Edberto Tosoy</h3>

              <p className="mt-2 max-w-md text-fg-muted">
                {"~"} Currently studying AWS Solutions Architect – Associate
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <nav className="mono flex flex-wrap gap-6 text-sm text-fg-muted">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <p className="hover:text-amber transition font-bold">
                      {item.name}
                    </p>
                  </Link>
                ))}
              </nav>

              <div className="flex gap-4">
                <Link
                  href="https://github.com/edtosoy"
                  target="_blank"
                  aria-label="GitHub"
                  className="panel panel-hover grid h-10 w-10 place-content-center rounded-full text-fg-muted hover:text-amber"
                >
                  <FaGithub size={16} />
                </Link>

                <Link
                  href="https://linkedin.com/in/edtosoy"
                  target="_blank"
                  aria-label="LinkedIn"
                  className="panel panel-hover grid h-10 w-10 place-content-center rounded-full text-fg-muted hover:text-amber"
                >
                  <FaLinkedin size={16} />
                </Link>

                <Link
                  href="mailto:edberto@edtosoy.com"
                  aria-label="Email"
                  className="panel panel-hover grid h-10 w-10 place-content-center rounded-full text-fg-muted hover:text-amber"
                >
                  <FaEnvelope size={16} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mono mt-10 border-t border-line-soft pt-6">
            <p className="text-xs text-fg-dim">
              <span className="mr-2">© {year}</span>
              Edberto Tosoy — built with Next.js, TypeScript &amp; Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
