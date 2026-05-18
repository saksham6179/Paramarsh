<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 🔐 Register
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),

            'is_doctor' => $request->is_doctor ?? false,

            'specialization' =>
                $request->specialization ?? null,

            'available' =>
                $request->available ?? true,

            'avatar' =>
                $request->avatar ?? null,
        ]);

        return response()->json([
            'message' =>
                'User registered successfully',

            'user' => $user
        ]);
    }

    // 🔑 Login
    public function login(Request $request)
    {
        $user = User::where(
            'email',
            $request->email
        )->first();

        if (
            !$user ||
            !Hash::check(
                $request->password,
                $user->password
            )
        ) {
            return response()->json([
                'message' =>
                    'Invalid credentials'
            ], 401);
        }

        return response()->json([
            'message' =>
                'Login successful',

            'user' => $user
        ]);
    }

    // 👤 Update Profile
    public function updateProfile(Request $request)
    {
        $user = User::find($request->id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $user->name = $request->name;
        $user->email = $request->email;

        $user->is_doctor =
            $request->is_doctor;

        $user->specialization =
            $request->specialization;

        $user->available =
            $request->available;

        $user->avatar =
            $request->avatar;

        $user->save();

        return response()->json([
            'message' =>
                'Profile updated successfully',

            'user' => $user
        ]);
    }
}