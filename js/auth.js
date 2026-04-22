import { supabase } from "./supabase.js";

// 🔐 LOGIN
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return null;
    }

    return data.user;
}

// 📌 DATI UTENTE
export async function getUserData(userId) {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        alert("Utente non trovato nel database");
        return null;
    }

    return data;
}