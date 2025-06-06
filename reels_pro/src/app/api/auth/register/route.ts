//request: kya data aarha h, response: kya data bhejna h
import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "../../../../../lib/db";
import User from "../../../../../models/Users";

//request ka datatype is NEXTREQUEST
export async function POST(request: NextRequest) {
    // connect to database
    await connectDatabase();

    try {
        // koi bhi info: email pass nikalwane -
        const { email, password } = await request.json();

        // agar n aya email/pass
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 } // bad request
            );
        }

        // check if user already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists/registered" },
                { status: 400 }
            );
        }

        // if user not found, create new
        const newUser = await User.create({
            email,
            password,
        });

        // return success message
        return NextResponse.json(
            { message: "User registered successfully!" },
            { status: 201 } // created
        );
    }

    // else koi bhi error hua to -
    catch (error: any) {
        console.error("Registration error:", error); // error ko console m print karo
        return NextResponse.json(
            { error: error.message || "Failed to register the user" },
            { status: 500 } // internal server error
        );
    }
}
