(() => {
  "use strict";
  const state = { workbook: null, sheets: {}, selected: null, attendance: {} };
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]);
  const arabicNumber = (number) => new Intl.NumberFormat("ar-EG").format(number);

  function parseSheet(sheet, sheetName) {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    const students = [];
    rows.slice(5).forEach((row) => {
      [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]].forEach(([number, name, religion, enrollment, language, nationality]) => {
        const studentName = String(row[name] || "").trim();
        if (studentName && studentName !== "الاســـــــــم") students.push({ id: `${sheetName}-${row[number] || students.length + 1}-${studentName}`, number: row[number] || students.length + 1, name: studentName, religion: row[religion], enrollment: row[enrollment], language: row[language], nationality: row[nationality] });
      });
    });
    return students;
  }

  async function loadWorkbook() {
    if (typeof XLSX === "undefined") throw new Error("لم يتم تحميل قارئ ملف الطلبة");
    const response = await fetch("data/document-ab995a.xlsx");
    if (!response.ok) throw new Error("تعذر تحميل ملف الطالبات");
    const workbook = XLSX.read(await response.arrayBuffer(), { type: "array" });
    state.workbook = workbook;
    workbook.SheetNames.filter((name) => name !== "Sheet1").forEach((name) => {
      const normalized = name.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه");
      const year = normalized.startsWith("اولى") || normalized.startsWith("1") ? "الأولى" : "الثانية";
      const className = name.replace(/^(أولى|اولى|أولي|اولى|ثانية|تانية|2)/, "").trim() || name;
      state.sheets[name] = { year, className: `فصل ${className}`, students: parseSheet(workbook.Sheets[name], name) };
    });
    fillYears();
  }

  function fillYears() {
    const years = [...new Set(Object.values(state.sheets).map((sheet) => sheet.year))];
    $("yearSelect").innerHTML = '<option value="">اختاري السنة</option>' + years.map((year) => `<option value="${esc(year)}">${esc(year)} ثانوي</option>`).join("");
  }

  function fillClasses() {
    const year = $("yearSelect").value;
    const classes = Object.entries(state.sheets).filter(([, sheet]) => sheet.year === year);
    $("classSelect").disabled = !year;
    $("classSelect").innerHTML = '<option value="">اختاري الفصل</option>' + classes.map(([name, sheet]) => `<option value="${esc(name)}">${esc(sheet.className)}</option>`).join("");
    $("showClass").disabled = true;
    $("overview").hidden = true;
    $("roster").hidden = true;
  }

  function renderClass() {
    const key = $("classSelect").value;
    if (!key) return;
    state.selected = state.sheets[key];
    const students = state.selected.students;
    const present = students.filter((student) => state.attendance[student.id] === "present").length;
    const absent = students.filter((student) => state.attendance[student.id] === "absent").length;
    $("overview").hidden = false;
    $("overview").innerHTML = `<div class="stat"><span>الفصل المختار</span><strong>${esc(state.selected.className)}</strong><small>${esc(state.selected.year)} ثانوي</small></div><div class="stat"><span>عدد الطالبات</span><strong>${arabicNumber(students.length)}</strong><small>طالبة مسجلة</small></div><div class="stat green"><span>الحضور اليوم</span><strong>${arabicNumber(present)}</strong><small>طالبة حاضرة</small></div><div class="stat red"><span>الغياب اليوم</span><strong>${arabicNumber(absent)}</strong><small>طالبة غائبة</small></div>`;
    $("roster").hidden = false;
    $("roster").innerHTML = `<div class="roster-head"><div><p class="eyebrow">سجل الفصل</p><h3>${esc(state.selected.className)} · ${esc(state.selected.year)} ثانوي</h3></div><button class="ghost" id="resetAttendance" type="button">مسح تسجيل اليوم</button></div><div class="table-wrap"><table><thead><tr><th>#</th><th>اسم الطالبة</th><th>الديانة</th><th>اللغة الثانية</th><th>الحالة</th></tr></thead><tbody>${students.map((student) => rowTemplate(student)).join("")}</tbody></table></div>`;
    $("roster").querySelectorAll("input[name^=attendance]").forEach((input) => input.addEventListener("change", () => { state.attendance[input.dataset.id] = input.value; renderClass(); }));
    $("resetAttendance").addEventListener("click", () => { students.forEach((student) => delete state.attendance[student.id]); renderClass(); });
  }

  function rowTemplate(student) {
    const status = state.attendance[student.id] || "";
    return `<tr><td class="number">${esc(student.number)}</td><td class="student-name">${esc(student.name)}</td><td>${esc(student.religion || "—")}</td><td>${esc(student.language || "—")}</td><td><div class="attendance"><label class="present"><input type="radio" name="attendance-${esc(student.id)}" data-id="${esc(student.id)}" value="present" ${status === "present" ? "checked" : ""}><span>حاضر</span></label><label class="absent"><input type="radio" name="attendance-${esc(student.id)}" data-id="${esc(student.id)}" value="absent" ${status === "absent" ? "checked" : ""}><span>غائب</span></label></div></td></tr>`;
  }

  $("loginForm").addEventListener("submit", async (event) => { event.preventDefault(); if (String($("password").value).trim() !== "admin") { $("loginError").textContent = "كلمة المرور غير صحيحة"; return; } $("loginError").textContent = ""; $("loginScreen").hidden = true; $("dashboard").hidden = false; $("todayLabel").textContent = new Intl.DateTimeFormat("ar-EG", { dateStyle: "full" }).format(new Date()); try { await loadWorkbook(); } catch (error) { $("roster").hidden = false; $("roster").innerHTML = `<p class="error">${esc(error.message)}. تأكدي أن ملف البيانات موجود داخل مجلد data.</p>`; } });
  $("yearSelect").addEventListener("change", fillClasses);
  $("classSelect").addEventListener("change", () => { $("showClass").disabled = !$("classSelect").value; });
  $("showClass").addEventListener("click", renderClass);
  $("logoutButton").addEventListener("click", () => { $("dashboard").hidden = true; $("loginScreen").hidden = false; $("password").value = ""; });
})();
