import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from("incidents")
        .select("*");

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

    const { title, severity, status } = body;

    const { data, error } = await supabase
        .from("incidents")
        .insert([
            {
                title,
                severity,
                status,
            },
        ])
        .select();

    if (error) {
        console.log(error);

        return NextResponse.json(
            {
                error: error.message,
                details: error,
            },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}