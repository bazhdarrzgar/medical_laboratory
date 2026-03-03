import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [patientCount, testCount, doctorCount, recordCount] = await Promise.all([
            prisma.patient.count(),
            prisma.test.count(),
            prisma.doctor.count(),
            prisma.testRecord.count(),
        ]);

        return NextResponse.json({
            patients: patientCount,
            samples: testCount,
            doctors: doctorCount,
            testRecords: recordCount,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
