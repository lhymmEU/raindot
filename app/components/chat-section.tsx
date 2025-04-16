export default function ChatSection() {
  return (
    <section className="border-t">
      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-start">
        <h2 className="text-[80px] font-[700] mb-6 md:mb-0">CHAT</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-lg">Gray Paper Chat</li>
          <li className="text-lg">JAM Chat</li>
        </ul>
      </div>
    </section>
  );
}
