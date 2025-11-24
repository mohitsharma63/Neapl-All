import React from 'react';

type FilterField =
  | { type: 'search'; name: string; placeholder?: string }
  | { type: 'select'; name: string; label?: string; options: { value: string; label: string }[] }
  | { type: 'toggle'; name: string; label?: string }
  | { type: 'range'; name: string; label?: string; min?: number; max?: number };

interface DynamicFilterProps {
  fields: FilterField[];
  filters: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
  onReset?: () => void;
  className?: string;
  /** Optional key identifying the current form/view (used with `formFieldMap`) */
  formKey?: string;
  /** Map of formKey -> array of field `name`s to show for that form. When provided, only those fields render. */
  formFieldMap?: Record<string, string[]>;
  /**
   * If true (default) calls `onChange` whenever a control changes.
   * If false, changes are applied only when the user clicks Apply.
   */
  applyOnChange?: boolean;
}

export default function DynamicFilter({ fields, filters, onChange, onReset, className, formKey, formFieldMap, applyOnChange = true }: DynamicFilterProps) {
  const [pending, setPending] = React.useState<Record<string, any>>(filters || {});
  const [searchValue, setSearchValue] = React.useState<string>(String(filters?.search ?? ''));
  const [isOpen, setIsOpen] = React.useState(false);

  const visibleFields = React.useMemo(() => {
    if (formKey && formFieldMap && Array.isArray(formFieldMap[formKey])) {
      const allowed = new Set(formFieldMap[formKey]);
      return fields.filter((f) => allowed.has(f.name));
    }
    return fields;
  }, [fields, formKey, formFieldMap]);

  React.useEffect(() => {
    setPending(filters || {});
    setSearchValue(String(filters?.search ?? ''));
  }, [filters]);

  // Debounce helper for search when applyOnChange is true
  React.useEffect(() => {
    if (!applyOnChange) return;
    const t = setTimeout(() => {
      onChange({ ...filters, ...pending, search: searchValue });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const updatePending = (name: string, value: any) => {
    const next = { ...pending, [name]: value };
    setPending(next);
    if (applyOnChange) {
      onChange(next);
    }
  };

  const handleReset = () => {
    setPending({});
    setSearchValue('');
    if (onReset) onReset();
    if (applyOnChange) onChange({});
  };

  const handleApply = () => {
    onChange({ ...pending, search: searchValue });
  };

  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm ${className || ''}`}>
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        {/* Filter icon button to open left drawer */}
        <button
          type="button"
          aria-label="Open filters"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L2.707 6.707A1 1 0 013 6V4z" />
          </svg>
          <span className="hidden md:inline">Filters</span>
        </button>
        {visibleFields.map((f) => {
          if (f.type === 'search') {
            return (
              <div key={f.name} className="flex-1">
                <label className="sr-only">{f.placeholder || 'Search'}</label>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={f.placeholder || 'Search...'}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            );
          }

          if (f.type === 'select') {
            return (
              <div key={f.name} className="w-48">
                <label className="block text-sm text-muted-foreground mb-1">{f.label || ''}</label>
                <select
                  value={pending[f.name] ?? ''}
                  onChange={(e) => updatePending(f.name, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All</option>
                  {Array.isArray(f.options) && f.options.length > 0 ? (
                    f.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))
                  ) : (
                    <option disabled value="">No options</option>
                  )}
                </select>
              </div>
            );
          }

          if (f.type === 'toggle') {
            return (
              <div key={f.name} className="flex items-center gap-2">
                <input
                  id={f.name}
                  type="checkbox"
                  checked={!!pending[f.name]}
                  onChange={(e) => updatePending(f.name, e.target.checked)}
                  className="h-4 w-4 text-primary rounded"
                />
                <label htmlFor={f.name} className="text-sm">{f.label}</label>
              </div>
            );
          }

          if (f.type === 'range') {
            return (
              <div key={f.name} className="w-48">
                <label className="block text-sm text-muted-foreground mb-1">{f.label || ''}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={pending[`${f.name}Min`] ?? ''}
                    onChange={(e) => updatePending(`${f.name}Min`, e.target.value)}
                    placeholder={String(f.min ?? '')}
                    className="w-1/2 px-2 py-1 border rounded-md"
                  />
                  <input
                    type="number"
                    value={pending[`${f.name}Max`] ?? ''}
                    onChange={(e) => updatePending(`${f.name}Max`, e.target.value)}
                    placeholder={String(f.max ?? '')}
                    className="w-1/2 px-2 py-1 border rounded-md"
                  />
                </div>
              </div>
            );
          }

          return null;
        })}

        <div className="flex gap-2 ml-auto mt-2 md:mt-0">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50"
            type="button"
            title="Reset filters"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-3 py-2 bg-primary text-white rounded-md hover:opacity-95"
            type="button"
            title="Apply filters"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Drawer: left side slide-over for dynamic filters */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {visibleFields.map((f) => {
                if (f.type === 'search') {
                  return (
                    <div key={f.name}>
                      <label className="sr-only">{f.placeholder || 'Search'}</label>
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={f.placeholder || 'Search...'}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  );
                }

                if (f.type === 'select') {
                  return (
                    <div key={f.name}>
                      <label className="block text-sm text-muted-foreground mb-1">{f.label || ''}</label>
                      <select
                        value={pending[f.name] ?? ''}
                        onChange={(e) => updatePending(f.name, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">All</option>
                        {Array.isArray(f.options) && f.options.length > 0 ? (
                          f.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))
                        ) : (
                          <option disabled value="">No options</option>
                        )}
                      </select>
                    </div>
                  );
                }

                if (f.type === 'toggle') {
                  return (
                    <div key={f.name} className="flex items-center gap-2">
                      <input
                        id={`drawer-${f.name}`}
                        type="checkbox"
                        checked={!!pending[f.name]}
                        onChange={(e) => updatePending(f.name, e.target.checked)}
                        className="h-4 w-4 text-primary rounded"
                      />
                      <label htmlFor={`drawer-${f.name}`} className="text-sm">{f.label}</label>
                    </div>
                  );
                }

                if (f.type === 'range') {
                  return (
                    <div key={f.name}>
                      <label className="block text-sm text-muted-foreground mb-1">{f.label || ''}</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={pending[`${f.name}Min`] ?? ''}
                          onChange={(e) => updatePending(`${f.name}Min`, e.target.value)}
                          placeholder={String(f.min ?? '')}
                          className="w-1/2 px-2 py-1 border rounded-md"
                        />
                        <input
                          type="number"
                          value={pending[`${f.name}Max`] ?? ''}
                          onChange={(e) => updatePending(`${f.name}Max`, e.target.value)}
                          placeholder={String(f.max ?? '')}
                          className="w-1/2 px-2 py-1 border rounded-md"
                        />
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  handleReset();
                  setIsOpen(false);
                }}
                className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50"
                type="button"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  handleApply();
                  setIsOpen(false);
                }}
                className="px-3 py-2 bg-primary text-white rounded-md hover:opacity-95"
                type="button"
              >
                Apply
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
