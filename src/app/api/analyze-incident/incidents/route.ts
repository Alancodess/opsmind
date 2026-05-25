import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const body = await req.json();

    const { title, severity, description } = body;

    const { data, error } = await supabase
        .from("incidents")
        .insert([
            {
                title,
                severity,
                description,
                status: "open",
                ai_analysis: "Pending AI analysis...",
            },
        ])
        .select();

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}