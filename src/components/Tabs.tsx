export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div className="tab-group" role="tablist">
      {items.map(item => (
        <button
          key={item.id}
          role="tab"
          aria-selected={item.id === activeId}
          className={`tab-item${item.id === activeId ? ' active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
