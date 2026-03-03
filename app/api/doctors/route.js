import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const doctors = await prisma.doctor.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(doctors);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const doctor = await prisma.doctor.create({
            data: {
                name: body.name,
                description: body.description,
            },
        });
        return NextResponse.json(doctor);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        const doctor = await prisma.doctor.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
            },
        });
        return NextResponse.json(doctor);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        await prisma.doctor.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
