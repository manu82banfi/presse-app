import { supabase } from "./supabase.js";

let currentUser = null;

// 🚀 INIT
export async function initApp(user) {
    currentUser = user;

    caricaPresse();
    subscribeRealtime();
}

// 📥 CARICA PRESSE
async function caricaPresse() {
    let query = supabase.from("presse").select("*");

    // 👇 filtro per ruolo
    if (currentUser.ruolo === "responsabile" || currentUser.ruolo === "operatore") {
        query = query.eq("area", currentUser.area);
    }

    const { data } = await query;

    renderTable(data);
}

// 🔄 REALTIME
function subscribeRealtime() {
    supabase
        .channel("presse")
        .on("postgres_changes", { event: "*", schema: "public", table: "presse" }, () => {
            caricaPresse();
        })
        .subscribe();
}

// 🎨 RENDER TABELLA
function renderTable(presse) {
    const tbody = document.querySelector("#tabella-lavori tbody");
    tbody.innerHTML = "";

    presse.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${p.pressa}</td>
            <td>${p.ora}</td>
            <td>${p.intervento}</td>
            <td>${p.note || ""}</td>
            <td>
                <select onchange="updateStato('${p.id}', this.value)">
                    <option ${p.stato==="da fare"?"selected":""}>da fare</option>
                    <option ${p.stato==="in corso"?"selected":""}>in corso</option>
                    <option ${p.stato==="fatto"?"selected":""}>fatto</option>
                    <option ${p.stato==="bloccato"?"selected":""}>bloccato</option>
                </select>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// ➕ AGGIUNGI PRESSA
window.aggiungiPressa = async function () {
    const pressa = document.getElementById("pressa").value;
    const ora = document.getElementById("orario").value;
    const intervento = document.getElementById("atz").value;
    const note = document.getElementById("note").value;

    await supabase.from("presse").insert([
        {
            pressa,
            ora,
            intervento,
            note,
            stato: "da fare",
            area: currentUser.area
        }
    ]);
};

// 🔄 CAMBIA STATO
window.updateStato = async function (id, stato) {
    await supabase
        .from("presse")
        .update({ stato })
        .eq("id", id);
};