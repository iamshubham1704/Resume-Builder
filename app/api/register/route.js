// app/api/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '/Resume-builder/resume_builder/app/lib/mongodb'; 
import User from '/Resume-builder/resume_builder/app/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Convert to plain object & remove password
    const userWithoutPass = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPass },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error.message);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
}
