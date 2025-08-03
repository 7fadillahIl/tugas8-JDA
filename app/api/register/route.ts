import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    // Parsing request body dengan tipe unknown
    const json: unknown = await req.json();

    // Validasi payload secara manual untuk keamanan tipe
    if (
      typeof json !== "object" ||
      json === null ||
      !("name" in json) ||
      !("email" in json) ||
      !("password" in json)
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Safe cast ke tipe payload yang sudah didefinisikan
    const { name, email, password } = json as RegisterPayload;

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password sebelum simpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan data user baru di database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Berikan response data user (bisa sesuaikan jika perlu sembunyikan password)
    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error("ERROR REGISTER:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
