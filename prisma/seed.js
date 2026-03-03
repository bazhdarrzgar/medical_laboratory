const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    console.log("Cleaning up database...");
    await prisma.testResult.deleteMany();
    await prisma.testRecord.deleteMany();
    await prisma.test.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.category.deleteMany();
    await prisma.patient.deleteMany();

    // 1. Categories (بەشەکان)
    console.log("Seeding categories...");
    const categories = [
        { name: "Hematology", description: "شیکارییەکانی خوێن و پێکهاتەکانی" },
        { name: "Biochemistry", description: "شیکارییە کیمیاییەکانی ناو پلازمای خوێن" },
        { name: "Endocrinology", description: "شیکارییەکانی تایبەت بە هۆرمۆنەکانی جەستە" },
        { name: "Immunology", description: "بەشی تایبەت بە سیستەمی بەرگری و ڤایرۆسەکان" },
        { name: "Vitamin Analysis", description: "شیکارییەکانی پێوانەکردنی ڕێژەی ڤیتامینەکان" }
    ];

    const createdCategories = [];
    for (const cat of categories) {
        const created = await prisma.category.create({ data: cat });
        createdCategories.push(created);
    }

    // 2. Tests (پشکنینەکان)
    console.log("Seeding tests...");
    const testsData = [
        // Hematology
        { name: "WBC (White Blood Cells)", categoryName: "Hematology", normalRange: "4.0 - 11.0", unit: "10^9/L" },
        { name: "RBC (Red Blood Cells)", categoryName: "Hematology", normalRange: "4.5 - 5.5", unit: "10^12/L" },
        { name: "HGB (Hemoglobin)", categoryName: "Hematology", normalRange: "13.0 - 17.0", unit: "g/dL" },
        { name: "PLT (Platelets)", categoryName: "Hematology", normalRange: "150 - 450", unit: "10^9/L" },

        // Biochemistry
        { name: "Glucose (Fasting)", categoryName: "Biochemistry", normalRange: "70 - 100", unit: "mg/dL" },
        { name: "Urea", categoryName: "Biochemistry", normalRange: "15 - 45", unit: "mg/dL" },
        { name: "Creatinine", categoryName: "Biochemistry", normalRange: "0.6 - 1.2", unit: "mg/dL" },
        { name: "S. Cholesterol", categoryName: "Biochemistry", normalRange: "< 200", unit: "mg/dL" },

        // Endocrinology
        { name: "TSH", categoryName: "Endocrinology", normalRange: "0.4 - 4.2", unit: "uIU/mL" },
        { name: "T3 (Free)", categoryName: "Endocrinology", normalRange: "2.3 - 4.2", unit: "pg/mL" },
        { name: "T4 (Free)", categoryName: "Endocrinology", normalRange: "0.8 - 1.8", unit: "ng/dL" },

        // Vitamin
        { name: "Vitamin D3", categoryName: "Vitamin Analysis", normalRange: "30 - 100", unit: "ng/mL" },
        { name: "Vitamin B12", categoryName: "Vitamin Analysis", normalRange: "200 - 900", unit: "pg/mL" }
    ];

    const createdTests = [];
    for (const t of testsData) {
        const cat = createdCategories.find(c => c.name === t.categoryName);
        const { categoryName, ...testData } = t;
        const created = await prisma.test.create({
            data: {
                ...testData,
                categoryId: cat.id
            }
        });
        createdTests.push(created);
    }

    // 3. Doctors (دکتۆرەکان)
    console.log("Seeding doctors...");
    const doctors = [
        { name: "دکتۆر زانیار لوقمان عەزیز", description: "پسپۆڕی شیکاری نەخۆشییەکان و خوێن" },
        { name: "دکتۆر شنۆ جەولەت مەحموود", description: "پسپۆڕی نەخۆشییەکانی هەناو و هۆرمۆن" },
        { name: "دکتۆر بارزان یاسین فەتاح", description: "پسپۆڕی وردی نەشتەرگەری گشتی" }
    ];

    const createdDoctors = [];
    for (const doc of doctors) {
        const created = await prisma.doctor.create({ data: doc });
        createdDoctors.push(created);
    }

    // 4. Patients (نەخۆشەکان)
    console.log("Seeding patients...");
    const patients = [
        { fullName: "نەبەز مستەفا عەبدولڕەحمان", gender: "male", mobile: "07501234567", dob: "1985-05-12", address: "میران - گەڕەکی نازناز" },
        { fullName: "چراخان ئەحمەد تاهیر", gender: "female", mobile: "07709876543", dob: "1992-10-25", address: "سلێمانی - بەختیاری" },
        { fullName: "هێڤار هاوڕێ محەممەد", gender: "male", mobile: "07514567890", dob: "2010-02-14", address: "دهۆک - ماسیکێ" },
        { fullName: "ڤینۆس جەمال حەسەن", gender: "female", mobile: "07501112233", dob: "1998-08-30", address: "کەرکووک - شۆراو" },
        { fullName: "سۆران عوسمان قادر", gender: "male", mobile: "07712223344", dob: "1975-12-01", address: "میران - عەنکاوە" }
    ];

    const createdPatients = [];
    for (const pat of patients) {
        const created = await prisma.patient.create({ data: pat });
        createdPatients.push(created);
    }

    // 5. Test Records & Results (تۆمارەکان و ئەنجامی پشکنین)
    console.log("Seeding records and results...");

    // Record 1: Nebaz checked by Dr. Zanyar
    const rec1 = await prisma.testRecord.create({
        data: {
            patientId: createdPatients[0].id,
            doctorId: createdDoctors[0].id,
            date: new Date()
        }
    });

    const wbcTest = createdTests.find(t => t.name.startsWith("WBC"));
    const hgbTest = createdTests.find(t => t.name.startsWith("HGB"));

    await prisma.testResult.createMany({
        data: [
            { testRecordId: rec1.id, testId: wbcTest.id, value: "7.2" },
            { testRecordId: rec1.id, testId: hgbTest.id, value: "14.5" }
        ]
    });

    // Record 2: Chrakhan checked by Dr. Shno
    const rec2 = await prisma.testRecord.create({
        data: {
            patientId: createdPatients[1].id,
            doctorId: createdDoctors[1].id,
            date: new Date(Date.now() - 86400000) // Yesterday
        }
    });

    const tshTest = createdTests.find(t => t.name === "TSH");
    const d3Test = createdTests.find(t => t.name === "Vitamin D3");

    await prisma.testResult.createMany({
        data: [
            { testRecordId: rec2.id, testId: tshTest.id, value: "3.2" },
            { testRecordId: rec2.id, testId: d3Test.id, value: "12.0" } // Low
        ]
    });

    console.log("-----------------------------------------");
    console.log("✅ Seed data created successfully!");
    console.log(`- Created ${createdCategories.length} Categories`);
    console.log(`- Created ${createdTests.length} Tests`);
    console.log(`- Created ${createdDoctors.length} Doctors`);
    console.log(`- Created ${createdPatients.length} Patients`);
    console.log("-----------------------------------------");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
