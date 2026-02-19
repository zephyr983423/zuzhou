import { NextRequest, NextResponse } from "next/server";
import { addCurse, getRecentCurses, getCursesForTarget } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target");

  try {
    if (target) {
      const curses = await getCursesForTarget(target);
      return NextResponse.json({ curses });
    }
    const curses = await getRecentCurses();
    return NextResponse.json({ curses });
  } catch (error) {
    console.error("Failed to fetch curses:", error);
    return NextResponse.json(
      { error: "Erreur du serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetName, curseText } = body;

    if (!targetName || typeof targetName !== "string" || targetName.trim().length === 0) {
      return NextResponse.json(
        { error: "Le nom est obligatoire" },
        { status: 400 }
      );
    }

    if (!curseText || typeof curseText !== "string" || curseText.trim().length === 0) {
      return NextResponse.json(
        { error: "La malédiction est obligatoire" },
        { status: 400 }
      );
    }

    if (targetName.trim().length > 100) {
      return NextResponse.json(
        { error: "Le nom est trop long (max 100 caractères)" },
        { status: 400 }
      );
    }

    if (curseText.trim().length > 500) {
      return NextResponse.json(
        { error: "La malédiction est trop longue (max 500 caractères)" },
        { status: 400 }
      );
    }

    const curse = await addCurse(targetName, curseText);
    return NextResponse.json({ curse }, { status: 201 });
  } catch (error) {
    console.error("Failed to add curse:", error);
    return NextResponse.json(
      { error: "Erreur du serveur" },
      { status: 500 }
    );
  }
}
