export default function Section({ id, index, title }) {
  return (
    <section
      id={id}
      className="relative flex h-screen w-full snap-start items-end border-t border-rule bg-void p-8 md:p-14"
    >
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-pulse">{index}</p>
        <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
      </div>
    </section>
  )
}
