import { NextResponse } from "next/server";
import { insertUser, getUsers, initDb } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    const users = await getUsers();
    return NextResponse.json({
      users: users.map((r) => ({
        id: r.id,
        full_name: r.full_name,
        created_at: r.created_at,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const fullName = body?.full_name ?? body?.fullName ?? "";
    await initDb();
    const user = await insertUser(fullName);
    return NextResponse.json({
      id: user.id,
      full_name: user.full_name,
      created_at: user.created_at,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Failed to save user" },
      { status: 400 }
    );
  }
}
