*
We are creating department manually in mongodbcompass . because in vs code we add a protected route known as hodonly so that no teacher or student  can create it . 

*
After creating department i get department id so that it means that now we can successfully register or login as a teachers or hod .

*
And add the hod id into the department creation in mongodb.

* 
After rgisteration to a competition noone can leave team and delete team.

*
How attendance marked.

* When a particular student or a team registered for a particular event then qr code is generated .
Student shows qr teacher scans backend verifies . Attendance Marked.

so we need to install one package for this whole process.

npm install qrcode

How certificates generation happens 

Step 1 = Teachers provide results for a particular competition . And we saved it into the database.

Step2 = Teacher provide design template and the system creates certificate for students who participate or students who don't won .

CERTIFICATE SYSTEM — ARCHITECTURE
We will build this in 3 clear layers:

1️⃣ Certificate Template System
2️⃣ Certificate Generator Engine
3️⃣ Certificate Download API

Outstanding — now we build the real engine:
👉 Automatic PDF certificate generation based on attendance + results + templates.

This is the core “wow factor” of your project.

we use pdfkit library for converting certificates into the pdf.
