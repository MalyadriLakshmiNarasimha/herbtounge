import { NextRequest, NextResponse } from "next/server";

// Mock demo users for authentication
const demoUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@herbalauth.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    id: "2",
    name: "Analyst User",
    email: "analyst@herbalauth.com",
    password: "Analyst@123",
    role: "analyst",
  },
  {
    id: "3",
    name: "Viewer User",
    email: "viewer@herbalauth.com",
    password: "Viewer@123",
    role: "viewer",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { detail: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { detail: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password (plain text comparison for demo, replace with hash check in prod)
    if (password !== user.password) {
      return NextResponse.json(
        { detail: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Return user info without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({ user: userResponse }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { detail: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
