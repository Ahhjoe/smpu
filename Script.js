// LOGIN
function login() {
  let id = document.getElementById("studentId").value;
  let pass = document.getElementById("password").value;
  if(id && pass){
    localStorage.setItem("studentName", id);
    location.href="dashboard.html";
  } else {
    document.getElementById("error").innerText="Enter ID & Password";
  }
}

// LOGOUT
function logout() { localStorage.clear(); location.href="index.html"; }

// DISPLAY STUDENT NAME
if(document.getElementById("studentName")){
  document.getElementById("studentName").innerText = localStorage.getItem("studentName");
}

// ADMIN PANEL
if(localStorage.getItem("studentName")==="ADMIN"){
  let panel=document.getElementById("adminPanel");
  if(panel) panel.style.display="block";
}
function showGradeEditor(){ location.href="grades.html"; }

// GRADES + GPA
function addRow(){
  let table=document.getElementById("gradeTable");
  let row=table.insertRow();
  row.innerHTML=`
    <td><input></td>
    <td><input type="number" value="3"></td>
    <td>
      <select>
        <option>A</option>
        <option>B+</option>
        <option>B</option>
        <option>C+</option>
        <option>C</option>
        <option>D</option>
        <option>F</option>
      </select>
    </td>
  `;
}

function calculateGPA(){
  let rows=document.querySelectorAll("#gradeTable tr");
  let totalPoints=0, totalCredits=0;
  let gradePoints={"A":4,"B+":3.5,"B":3,"C+":2.5,"C":2,"D":1,"F":0};
  for(let i=1;i<rows.length;i++){
    let credits=parseFloat(rows[i].cells[1].children[0].value);
    let grade=rows[i].cells[2].children[0].value;
    totalCredits+=credits;
    totalPoints+=credits*gradePoints[grade];
  }
  let gpa=totalPoints/totalCredits;
  if(document.getElementById("gpa")) document.getElementById("gpa").innerText=gpa.toFixed(2);

  // CGPA
  let prevCGPA=parseFloat(localStorage.getItem("cgpa")||0);
  let prevCredits=parseFloat(localStorage.getItem("totalCredits")||0);
  let newCGPA=(prevCGPA*prevCredits+totalPoints)/(prevCredits+totalCredits);
  localStorage.setItem("cgpa", newCGPA);
  localStorage.setItem("totalCredits", prevCredits+totalCredits);
  if(document.getElementById("cgpa")) document.getElementById("cgpa").innerText=newCGPA.toFixed(2);
}

// SAVE COURSES
function saveCourses(){
  let courses=document.getElementById("courses").value;
  localStorage.setItem("courses", courses);
  alert("Courses saved");
}

// PDF DOWNLOAD
function downloadGrades(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("SMPU Student Grade Slip",20,20);
  doc.setFontSize(12);
  doc.text("Student: "+localStorage.getItem("studentName"),20,30);
  let rows=document.querySelectorAll("#gradeTable tr");
  let y=40;
  for(let i=1;i<rows.length;i++){
    let course=rows[i].cells[0].children[0].value;
    let credits=rows[i].cells[1].children[0].value;
    let grade=rows[i].cells[2].children[0].value;
    doc.text(`${course} - Credits:${credits} - Grade:${grade}`,20,y);
    y+=10;
  }
  let semesterGPA=document.getElementById("gpa")?.innerText||"0.00";
  let cgpa=document.getElementById("cgpa")?.innerText||"0.00";
  doc.text(`Semester GPA: ${semesterGPA}`,20,y+10);
  doc.text(`Cumulative GPA: ${cgpa}`,20,y+20);
  doc.save("GradeSlip.pdf");
}