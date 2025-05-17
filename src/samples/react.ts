export const reactSamples = [
  {
    id: 'react-performance',
    title: 'Performance Optimization',
    description: 'Advanced React performance optimization techniques',
    category: 'Performance',
    language: 'typescript',
    code: `import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

// Virtual list implementation
interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(height / itemHeight);
    const end = Math.min(start + visibleCount + 1, items.length);

    return items.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
      offset: (start + index) * itemHeight
    }));
  }, [items, height, itemHeight, scrollTop]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight }}>
        {visibleItems.map(({ item, index, offset }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: offset,
              width: '100%',
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Memoized form inputs
interface FormInputProps {
  value: string;
  onChange: (value: string) => void;
  validate?: (value: string) => string | null;
}

const FormInput = React.memo(({
  value,
  onChange,
  validate
}: FormInputProps) => {
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (validate) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setError(validate(newValue));
      }, 300);
    }
  }, [onChange, validate]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <input
        value={value}
        onChange={handleChange}
        className={\`input \${error ? 'error' : ''}\`}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
});

// Example usage
function App() {
  const [items] = useState(() =>
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      title: \`Item \${i}\`
    }))
  );

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const validateEmail = useCallback((email: string) => {
    if (!email) return 'Email is required';
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return 'Invalid email format';
    }
    return null;
  }, []);

  return (
    <div>
      <h2>Virtual List Example</h2>
      <VirtualList
        items={items}
        height={400}
        itemHeight={40}
        renderItem={(item) => (
          <div className="list-item">
            {item.title}
          </div>
        )}
      />

      <h2>Optimized Form</h2>
      <FormInput
        value={formData.name}
        onChange={(name) => setFormData(d => ({ ...d, name }))}
      />
      <FormInput
        value={formData.email}
        onChange={(email) => setFormData(d => ({ ...d, email }))}
        validate={validateEmail}
      />
    </div>
  );
}`
  }
];