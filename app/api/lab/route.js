import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const patients = await prisma.patient.findMany({ orderBy: { fullName: "asc" } });
    const doctors = await prisma.doctor.findMany({ orderBy: { name: "asc" } });
    const tests = await prisma.test.findMany({
        include: { category: true },
        orderBy: { name: "asc" }
    });

    return NextResponse.json({ patients, doctors, tests });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { patientId, doctorId, date, results } = body;

        const record = await prisma.testRecord.create({
            data: {
                patientId,
                doctorId,
                date: new Date(date),
                results: {
                    create: results.map(r => ({
                        testId: r.testId,
                        value: r.value
                    }))
                }
            },
            include: {
                results: true
            }
        });

        return NextResponse.json(record);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
    }
}
