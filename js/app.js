import { supabase } from "./supabase.js";

let currentUser = null;

// 🚀 INIT
export async function initApp(user) {
    currentUser = user;

    caricaPresse();
    subscribeRealtime();
    aggiornaUI();
}

// 🎨 UI BASE SU RUOLO
function aggiornaUI() {
    if (currentUser.ruolo === "operatore") {
        document.getElementById("input-area").style.display = "none";
    }

    // 👨‍💼 capo vede tutto
    if (currentUser.ruolo === "capo") {
        document.getElementById("titolo-area").textContent = "TUTTE LE AREE";
    } else {
        document.getElementById("titolo-area").textContent = currentUser.area;
    }
}

// 📥 CARICA PRESSE
async function caricaPresse() {
    let query = supabase.from("presse").select("*");

    if (currentUser.ruolo !== "capo") {
        query = query.eq("area", currentUser.area);
    }

    const { data } = await query.order("ora", { ascending: true });

    renderTable(data);
}

// 🔄 REALTIME (MIGLIORATO)
function subscribeRealtime() {
    supabase
        .channel("presse-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "presse" }, payload => {
            caricaPresse();

            // 🔔 NOTIFICA BASE
            mostraNotifica("Aggiornamento ricevuto");
        })
        .subscribe();
}

// 🔔 NOTIFICA
function mostraNotifica(msg) {
    const div = document.createElement("div");
    div.textContent = msg;
    div.style.position = "fixed";
    div.style.bottom = "20px";
    div.style.right = "20px";
    div.style.background = "#070738";
    div.style.padding = "10px";
    div.style.borderRadius = "5px";

    document.body.appendChild(div);

    setTimeout(() => div.remove(), 3000);
}

// 🎨 RENDER
function renderTable(presse) {
    const tbody = document.querySelector("#tabella-lavori tbody");
    tbody.innerHTML = "";

    presse.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${p.area}</td>
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

// ➕ INSERIMENTO
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

// 🔄 STATO
window.updateStato = async function (id, stato) {
    await supabase.from("presse").update({ stato }).eq("id", id);
};

// 👥 OPERATORI ON/OFF
window.toggleOperatore = async function (nome) {
    await supabase
        .from("users")
        .update({ area: currentUser.area })
        .eq("nome", nome);
};