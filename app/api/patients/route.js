import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const patients = await prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json(patients);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.fullName || !body.mobile) {
            return NextResponse.json({ error: "Full name and mobile are required." }, { status: 400 });
        }

        const patient = await prisma.patient.create({
            data: {
                fullName: body.fullName,
                gender: body.gender || "male",
                mobile: body.mobile,
                dob: body.dob || null,
                address: body.address || null,
            },
        });
        return NextResponse.json(patient);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: "Patient ID is required." }, { status: 400 });
        }

        const patient = await prisma.patient.update({
            where: { id },
            data: {
                fullName: data.fullName,
                gender: data.gender,
                mobile: data.mobile,
                dob: data.dob || null,
                address: data.address || null,
            },
        });
        return NextResponse.json(patient);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing patient ID." }, { status: 400 });
        }

        // Check if patient has linked test records before deleting
        const recordCount = await prisma.testRecord.count({ where: { patientId: id } });
        if (recordCount > 0) {
            return NextResponse.json(
                {
                    error: `Cannot delete patient: they have ${recordCount} test record(s) linked. Remove their test records first.`,
                    code: "HAS_LINKED_RECORDS",
                },
                { status: 409 }
            );
        }

        await prisma.patient.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
