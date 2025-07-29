let contactId = "";
let editingRecordId = "";

ZOHO.embeddedApp.on("PageLoad", function(data) {
  contactId = data.EntityId;
  ZOHO.CRM.API.getAllRecords({Entity:"Paiement_1", sort_order:"desc", per_page:200})
    .then(function(response){
      const rows = response.data || [];
      const filtered = rows.filter(r => r.field2 === contactId);
      const tbody = document.querySelector("#paiementTable tbody");
      tbody.innerHTML = "";
      filtered.forEach(row => {
      const tbody = document.querySelector("#paiementTable tbody");
      tbody.innerHTML = "";
      rows.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.Name || ""}</td>
          <td>${row.Nom_de_la_t_che || ""}</td>
          <td>${row.Montant || ""}</td>
          <td>${row.Modes_de_paiement || ""}</td>
          <td>${row.E_ch_ance ? row.E_ch_ance.split("T")[0] : ""}</td>
          <td><button onclick="editRecord('${row.id}', '${row.Name || ""}', '${row.Nom_de_la_t_che || ""}', '${row.Montant || ""}', '${row.Modes_de_paiement || ""}', '${row.E_ch_ance || ""}')">编辑</button></td>
        `;
        tbody.appendChild(tr);
      });
    });
});

function editRecord(id, name, task, amount, mode, due) {
  editingRecordId = id;
  document.getElementById("editName").value = name;
  document.getElementById("editTask").value = task;
  document.getElementById("editAmount").value = amount;
  document.getElementById("editMode").value = mode;
  document.getElementById("editDue").value = due ? due.split("T")[0] : "";
  document.getElementById("editForm").style.display = "block";
}

function savePaiement() {
  const dataMap = {
    Name: document.getElementById("editName").value,
    Nom_de_la_t_che: document.getElementById("editTask").value,
    Montant: parseFloat(document.getElementById("editAmount").value),
    Modes_de_paiement: document.getElementById("editMode").value,
    E_ch_ance: document.getElementById("editDue").value
  };
  ZOHO.CRM.API.updateRecord({Entity:"Paiement",RecordID:editingRecordId,APIData:dataMap})
    .then(function(){
      alert("保存成功");
      location.reload();
    });
}

function closeForm() {
  document.getElementById("editForm").style.display = "none";
}