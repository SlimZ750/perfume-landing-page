import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useStorageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File): Promise<{ url?: string; error?: string }> => {
    if (!file.type.startsWith('image/')) return { error: 'اختر ملف صورة صالحاً.' };
    if (file.size > 5 * 1024 * 1024) return { error: 'حجم الصورة يجب ألا يتجاوز 5MB.' };
    if (!supabase) return { error: 'Supabase غير مهيأ. أضف متغيرات البيئة أولاً.' };
    setUploading(true);
    const path = `landing/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const { error } = await supabase.storage.from('landing-images').upload(path, file, { upsert: false });
    if (error) {
      setUploading(false);
      return { error: error.message };
    }
    const { data } = supabase.storage.from('landing-images').getPublicUrl(path);
    setUploading(false);
    return { url: data.publicUrl };
  };
  return { upload, uploading };
};
