function getRecordIdFromZoho() {
  const url = new URL(window.location.href);
  return url.searchParams.get("rec_id");
}

function createRow(record) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input value="${record.Name || ''}" data-field="Name"></td>
    <td><input value="${record.Nom_de_la_t_che || ''}" data-field="Nom_de_la_t_che"></td>
    <td><input type="number" value="${record.Montant || ''}" data-field="Montant"></td>
    <td><input value="${record.Modes_de_paiement || ''}" data-field="Modes_de_paiement"></td>
    <td><input type="date" value="${record.Ech_ance || ''}" data-field="Ech_ance"></td>
    <td><button onclick="saveRecord('${record.id}', this)">保存</button></td>
  `;
  return tr;
}

function saveRecord(id, btn) {
  const tr = btn.closest("tr");
  const inputs = tr.querySelectorAll("input");
  const body = {};
  inputs.forEach(input => body[input.dataset.field] = input.value);
  fetch(`https://www.zohoapis.eu/crm/v2/Paiement_1/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": "Zoho-oauthtoken " + localStorage.getItem("token"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: [body] })
  })
  .then(res => res.json())
  .then(res => alert("保存成功"))
  .catch(err => alert("保存失败"));
}

document.addEventListener("DOMContentLoaded", async () => {
  const contactId = getRecordIdFromZoho();
  if (!contactId) return alert("❌ 未检测到联系人ID (rec_id)");

  const token = localStorage.getItem("token");
  if (!token) return alert("⚠️ 请先在控制台执行 localStorage.setItem('token', '你的Zoho OAuth token')");

  const res = await fetch(`https://www.zohoapis.eu/crm/v2/Paiement_1/search?criteria=(field2:equals:${contactId})`, {
    headers: { "Authorization": "Zoho-oauthtoken " + token }
  });

  const json = await res.json();
  const tbody = document.getElementById("tableBody");
  (json.data || []).forEach(record => {
    tbody.appendChild(createRow(record));
  });
});
