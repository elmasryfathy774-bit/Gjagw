(() => {
  "use strict";
  const state = { workbook: null, sheets: {}, selected: null, day: "1", attendance: {}, dirty: false };
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]);
  const arabicNumber = (n) => new Intl.NumberFormat("ar-EG").format(n);
  const key = (id) => `${id}-${state.day}`;

  function parseSheet(sheet, sheetName) {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    const students = [];
    rows.slice(5).forEach((row) => [[1,2,3,4,5,6],[7,8,9,10,11,12]].forEach(([number,name,religion,enrollment,language,nationality]) => {
      const studentName = String(row[name] || "").trim();
      if (studentName && studentName !== "الاســـــــــم") students.push({ id: `${sheetName}-${row[number] || students.length + 1}-${studentName}`, number: row[number] || students.length + 1, name: studentName, religion: row[religion], enrollment: row[enrollment], language: row[language], nationality: row[nationality] });
    }));
    return students.sort((a,b) => a.name.localeCompare(b.name, "ar"));
  }
  async function loadWorkbook() {
    const response = await fetch("data/document-ab995a.xlsx");
    if (!response.ok) throw new Error("تعذر تحميل ملف الطالبات");
    state.workbook = XLSX.read(await response.arrayBuffer(), { type: "array" });
    state.workbook.SheetNames.filter((name) => name !== "Sheet1").forEach((name) => {
      const normalized = name.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه");
      state.sheets[name] = { year: normalized.startsWith("اولى") || normalized.startsWith("1") ? "الأولى" : "الثانية", className: name.trim(), students: parseSheet(state.workbook.Sheets[name], name) };
    });
    const years = [...new Set(Object.values(state.sheets).map((s) => s.year))];
    $("yearSelect").innerHTML = '<option value="">السنة</option>' + years.map((y) => `<option value="${esc(y)}">${esc(y)} ثانوي</option>`).join("");
  }
  function fillClasses() {
    const classes = Object.entries(state.sheets).filter(([,s]) => s.year === $("yearSelect").value);
    $("classSelect").disabled = !$("yearSelect").value;
    $("classSelect").innerHTML = '<option value="">الفصل</option>' + classes.map(([k,s]) => `<option value="${esc(k)}">${esc(s.className)}</option>`).join("");
    $("showClass").disabled = true; $("overview").hidden = true; $("roster").hidden = true;
  }
  function status(student) { return state.attendance[key(student.id)] || "excused"; }
  function renderClass() {
    const sheet = state.sheets[$("classSelect").value]; if (!sheet) return; state.selected = sheet;
    const present = sheet.students.filter(s => status(s) === "present").length, absent = sheet.students.filter(s => status(s) === "absent").length;
    $("overview").hidden = false; $("overview").innerHTML = `<div class="stat"><span>الفصل</span><strong>${esc(sheet.className)}</strong><small>${esc(sheet.year)} ثانوي</small></div><div class="stat"><span>الطالبات</span><strong>${arabicNumber(sheet.students.length)}</strong><small>مرتبة أبجديًا</small></div><div class="stat green"><span>حضور</span><strong>${arabicNumber(present)}</strong><small>اليوم</small></div><div class="stat red"><span>غياب</span><strong>${arabicNumber(absent)}</strong><small>اليوم</small></div>`;
    $("roster").hidden = false; $("roster").innerHTML = `<div class="roster-head"><div><p class="eyebrow">${esc(sheet.className)} · ${esc(sheet.year)} ثانوي</p><h3>سجل الحضور والغياب</h3></div><div class="toolbar"><button class="month active" type="button">فبراير 2026</button><button class="tool" id="saveXlsx" type="button">حفظ Excel</button><button class="tool" id="refreshNames" type="button">تحديث الأسماء</button><button class="tool" id="addStudent" type="button">+ إضافة طالبة</button></div></div><div class="days"><button class="day active" type="button" data-day="1">1<br><small>اليوم</small></button>${[2,3,4,5,6,7].map(d => `<button class="day" type="button" data-day="${d}">${d}<br><small>فبراير</small></button>`).join("")}<span class="legend">مربع فارغ = مرضي · ✓ حضور · ✗ غياب</span></div><div class="table-wrap"><table><thead><tr><th>#</th><th>اسم الطالبة</th><th>الديانة</th><th>اللغة</th><th><button class="mark-all" id="markAll" type="button">اليوم<br>✓ الكل</button></th><th>إدارة</th></tr></thead><tbody>${sheet.students.map(rowTemplate).join("")}</tbody></table></div>`;
    bindRoster();
  }
  function rowTemplate(student) { const s = status(student); return `<tr><td class="number">${esc(student.number)}</td><td class="student-name">${esc(student.name)}</td><td>${esc(student.religion || "—")}</td><td>${esc(student.language || "—")}</td><td><button class="attendance-box ${s}" data-id="${esc(student.id)}" type="button" aria-label="تغيير حالة ${esc(student.name)}">${s === "present" ? "✓" : s === "absent" ? "✗" : ""}</button></td><td><button class="delete-student" data-id="${esc(student.id)}" type="button">حذف</button></td></tr>`; }
  function bindRoster() {
    $("roster").querySelectorAll(".attendance-box").forEach((b) => b.addEventListener("click", () => { const id=b.dataset.id, old=state.attendance[key(id)] || "excused"; state.attendance[key(id)] = old === "excused" ? "present" : old === "present" ? "absent" : "excused"; state.dirty=true; renderClass(); }));
    $("roster").querySelectorAll(".day").forEach((b) => b.addEventListener("click", () => { state.day=b.dataset.day; renderClass(); }));
    $("markAll").addEventListener("click", () => { state.selected.students.forEach(s => state.attendance[key(s.id)]="present"); state.dirty=true; renderClass(); });
    $("saveXlsx").addEventListener("click", saveExcel); $("refreshNames").addEventListener("click", () => { state.selected.students=parseSheet(state.workbook.Sheets[$("classSelect").value], state.selected.className); renderClass(); });
    $("addStudent").addEventListener("click", () => { const name=prompt("اكتبي اسم الطالبة"); if(name?.trim()){ state.selected.students.push({id:`new-${Date.now()}`,number:state.selected.students.length+1,name:name.trim()}); state.selected.students.sort((a,b)=>a.name.localeCompare(b.name,"ar")); renderClass(); }});
    $("roster").querySelectorAll(".delete-student").forEach(b=>b.addEventListener("click",()=>{state.selected.students=state.selected.students.filter(s=>s.id!==b.dataset.id);renderClass();}));
  }
  function saveExcel() { const rows = state.selected.students.map(s=>({"رقم":s.number,"اسم الطالبة":s.name,"الحالة":status(s)==="present"?"حاضر":status(s)==="absent"?"غائب":"مرضي"})); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),"الغياب"); XLSX.writeFile(wb,`حضور-${state.selected.className}.xlsx`); state.dirty=false; }
  $("loginForm").addEventListener("submit",async(e)=>{e.preventDefault();if($("password").value.trim()!=="admin"){ $("loginError").textContent="كلمة المرور غير صحيحة";return;}$("loginScreen").hidden=true;$("dashboard").hidden=false;$("todayLabel").textContent="فبراير 2026";try{await loadWorkbook();}catch(err){$("roster").hidden=false;$("roster").innerHTML=`<p class="error">${esc(err.message)}</p>`;}});
  $("yearSelect").addEventListener("change",fillClasses); $("classSelect").addEventListener("change",()=>$("showClass").disabled=!$("classSelect").value); $("showClass").addEventListener("click",renderClass); $("logoutButton").addEventListener("click",()=>{location.reload();});
})();
