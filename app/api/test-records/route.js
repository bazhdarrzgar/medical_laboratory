import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const patientName = searchParams.get("patientName") || "";
    const patientMobile = searchParams.get("patientMobile") || "";
    const date = searchParams.get("date") || "";

    try {
        const records = await prisma.testRecord.findMany({
            where: {
                patient: {
                    fullName: { contains: patientName },
                    mobile: { contains: patientMobile },
                },
                // Simple date filter (improvement: handle formatted dates better)
                ...(date && {
                    date: {
                        gte: new Date(date),
                        lt: new Date(new Date(date).getTime() + 86400000),
                    },
                }),
            },
            include: {
                patient: true,
                doctor: true,
                results: {
                    include: {
                        test: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });

        if (searchParams.get("raw") === "true") {
            return NextResponse.json(records);
        }

        // Flatten for the table view
        const flattened = records.flatMap((record) =>
            record.results.map((result) => ({
                id: `${record.id}-${result.id}`,
                fullName: record.patient.fullName,
                gender: record.patient.gender,
                mobile: record.patient.mobile,
                doctor: record.doctor?.name || "-",
                sample: result.test.name,
                result: result.value,
                unit: result.test.unit,
                normalRange: result.test.normalRange,
                category: result.test.category.name,
                testTime: `${record.date.toLocaleDateString()} ${record.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            }))
        );

        return NextResponse.json(flattened);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
    }
}
