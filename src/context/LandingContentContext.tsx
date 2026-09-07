import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_CONTENT, mergeContent, StoreContent } from '../config/store';
import { supabase } from '../lib/supabase';

interface ContentContextValue {
  content: StoreContent;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  save: (next: StoreContent) => Promise<{ error: string | null }>;
}

const LandingContentContext = createContext<ContentContextValue | undefined>(undefined);

interface LandingContentProviderProps {
  initialContent?: StoreContent;
  loadFromSupabase?: boolean;
}

export const LandingContentProvider: React.FC<React.PropsWithChildren<LandingContentProviderProps>> = ({ children, initialContent, loadFromSupabase = true }) => {
  const [content, setContent] = useState<StoreContent>(initialContent || DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: queryError } = await supabase
      .from('landing_pages')
      .select('content')
      .eq('slug', 'default')
      .maybeSingle();
    if (queryError) {
      setError(queryError.message);
    } else if (data?.content) {
      setContent(mergeContent(data.content as Partial<StoreContent>));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loadFromSupabase) void refresh();
  }, [loadFromSupabase]);

  const save = async (next: StoreContent) => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error: saveError } = await supabase.from('landing_pages').upsert({
      slug: 'default',
      content: next,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'slug' });
    if (!saveError) {
      setContent(mergeContent(next));
      setError(null);
    }
    return { error: saveError?.message || null };
  };

  return (
    <LandingContentContext.Provider value={{ content, loading, error, refresh, save }}>
      {children}
    </LandingContentContext.Provider>
  );
};

export const useLandingContent = (): ContentContextValue => {
  const context = useContext(LandingContentContext);
  if (!context) throw new Error('useLandingContent must be used inside LandingContentProvider');
  return context;
};
