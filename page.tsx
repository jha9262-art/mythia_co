export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">About Us</h1>
      <div className="mt-6 space-y-4 text-slate-600">
        <p>
          Mythia &amp; Co is a small, focused team combining data analytics and
          software development expertise. We take on projects from clients
          across industries and deliver end-to-end — from understanding the
          problem to shipping a working solution.
        </p>
        <p>
          Our team includes a data analyst who digs into the numbers and a
          software developer who builds the tools, so every project benefits
          from both perspectives.
        </p>
        <h2 className="pt-4 text-xl font-semibold text-slate-900">Our Team</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Data Analyst</strong> — research, analysis, dashboards, and
            reporting.
          </li>
          <li>
            <strong>Software Developer</strong> — web applications, automation,
            and integrations.
          </li>
        </ul>
      </div>
    </div>
  );
}
