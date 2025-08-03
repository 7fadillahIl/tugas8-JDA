import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const json: unknown = await req.json();

    if (
      typeof json !== "object" ||
      json === null ||
      !("name" in json) ||
      !("email" in json) ||
      !("password" in json)
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { name, email, password } = json as RegisterPayload;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error("ERROR REGISTER:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
