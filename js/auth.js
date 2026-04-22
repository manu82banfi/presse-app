import { supabase } from "./supabase.js";

// 🔐 LOGIN
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert("Errore login");
        return null;
    }

    return data.user;
}

// 📌 Recupera utente da tabella users
export async function getUserData(userId) {
    const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    return data;
}