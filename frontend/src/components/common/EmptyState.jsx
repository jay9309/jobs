export default function EmptyState({ title = "Nothing here yet", text = "Try another search or come back later." }) {
  return <div className="soft-card p-10 text-center"><div className="mx-auto mb-3 h-10 w-10 rounded-full bg-[#eef2ff]" /><h3 className="font-bold text-[#102044]">{title}</h3><p className="mt-1 text-sm text-[#7c8aa5]">{text}</p></div>;
}
