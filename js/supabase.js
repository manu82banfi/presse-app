// 🔗 Connessione a Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ⚠️ INSERISCI I TUOI DATI
const SUPABASE_URL = "https://dmoblxmzydqihzkoephm.supabase.co";
const SUPABASE_KEY = "sb_publishable_UwlUP_LxMs92sGSMIeFyKA_BclAnCTR";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);