const topIcons = [
  { emoji: '🧬', className: 'left-[12%] top-[8%]' },
  { emoji: '📓', className: 'left-1/2 top-[10%] -translate-x-1/2' },
  { emoji: '⚗️', className: 'right-[12%] top-[8%]' },
  { emoji: '💡', className: 'left-[8%] top-[28%]' },
  { emoji: '⚛️', className: 'right-[8%] top-[26%]' },
];

const features = [
  { icon: '⏳', title: 'Time Bound Study' },
  { icon: '📚', title: 'All Subjects' },
  { icon: '🎧', title: 'Study Music' },
  { icon: '👨‍🏫', title: 'Lectures' },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-r from-[#ff5b56] via-[#d9569d] to-[#7f52ff] px-6 py-8 text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <h1 className="text-4xl font-black lowercase leading-none drop-shadow">eduverse</h1>
      </header>

      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {topIcons.map(({ emoji, className }) => (
          <div key={emoji + className} className={`absolute text-8xl drop-shadow-xl ${className}`}>
            {emoji}
          </div>
        ))}
      </div>

      <section className="mx-auto mt-20 flex max-w-4xl flex-col items-center gap-10 text-center md:mt-56">
        <h2 className="text-6xl font-semibold leading-[0.95] drop-shadow md:text-8xl">Study<br/>Daily</h2>

        <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          <button className="w-full max-w-xs rounded-full bg-gradient-to-r from-[#a73bff] to-[#dec9ff] px-10 py-4 text-3xl font-bold text-white shadow-soft">
            Sign up
          </button>
          <button className="w-full max-w-xs rounded-2xl border border-white/30 bg-gradient-to-r from-[#6c00db] to-[#c59dff] px-10 py-4 text-3xl font-bold text-white shadow-soft">
            Login
          </button>
        </div>

        <button className="w-full max-w-md border-2 border-[#3c2f56] bg-[#ff6a00] px-10 py-5 text-3xl font-bold text-white shadow-soft transition hover:scale-[1.01]">
          Start Studying
        </button>
      </section>

      <section className="mx-auto mt-16 grid w-full max-w-6xl grid-cols-2 gap-10 pb-8 md:mt-24 md:grid-cols-4">
        {features.map((feature) => (
          <article key={feature.title} className="icon-card">
            <div className="text-8xl md:text-9xl">{feature.icon}</div>
            <p className="label-neon leading-none">{feature.title}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
