import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const tests = await prisma.test.findMany({
        include: { category: true },
        orderBy: { name: "asc" }
    });
    return NextResponse.json(tests);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const test = await prisma.test.create({
            data: {
                name: body.name,
                normalRange: body.normalRange,
                unit: body.unit,
                price: parseFloat(body.price) || 0,
                category: {
                    connect: { id: body.categoryId }
                },
            },
            include: { category: true },
        });
        return NextResponse.json(test);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, categoryId, ...rest } = body;
        const test = await prisma.test.update({
            where: { id },
            data: {
                name: rest.name,
                normalRange: rest.normalRange,
                unit: rest.unit,
                price: parseFloat(rest.price) || 0,
                category: {
                    connect: { id: categoryId }
                },
            },
            include: { category: true },
        });
        return NextResponse.json(test);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
        }
        await prisma.test.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
