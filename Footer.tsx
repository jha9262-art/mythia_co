export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Mythia &amp; Co. All rights reserved.</p>
      </div>
    </footer>
  );
}
