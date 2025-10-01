import { NextRequest, NextResponse } from "next/server";

const demoUsers = [
  { email: "admin@herbalauth.com", password: "Admin@123", role: "admin", name: "Admin User" },
  { email: "analyst@herbalauth.com", password: "Analyst@123", role: "analyst", name: "Analyst User" },
  { email: "viewer@herbalauth.com", password: "Viewer@123", role: "viewer", name: "Viewer User" },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log("Login attempt:", email);

    const user = demoUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      console.log("Login failed for:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("Login successful for:", email);
    // Return user info without password
    const { password: _, ...userInfo } = user;

    return NextResponse.json({ user: userInfo });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
