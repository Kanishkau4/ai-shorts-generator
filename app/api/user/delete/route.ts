import { auth, createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

    // Delete the user from Clerk
    await clerkClient.users.deleteUser(userId);

    return new NextResponse("User deleted permanently", { status: 200 });
  } catch (error) {
    console.error("Error deleting user from Clerk:", error);
    return new NextResponse("Error deleting user", { status: 500 });
  }
}
