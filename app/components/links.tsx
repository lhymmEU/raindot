interface LinksProps {
  header: string;
  links: {
    name: string;
    url: string;
  }[];
}

export default function Links({ header, links }: LinksProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="border-t border-black py-[40px] px-[68px]">
        <h1 className="text-[80px] font-[700]">{header}</h1>
      </div>
      <ul className="flex flex-col gap-2 py-[40px] px-[90px] border-t border-black list-disc [&_a]:underline">
        {links.map((link) => (
          <li key={link.url}>
            <a href={link.url}>{link.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
