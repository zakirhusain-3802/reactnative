import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hkjhuedmtznwempnlzka.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhramh1ZWRtdHpud2VtcG5semthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1NDE4NTksImV4cCI6MjAxODExNzg1OX0.UvpSAkeg54epY7Wn9a0DMsT1zcm3LY90BVH50jtRn44";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});