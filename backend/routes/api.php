<?php

use Illuminate\Support\Facades\Route;

use App\Models\User;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;

// TEST
Route::get('/test', function () {

    return response()->json([
        'message' => 'Backend is working 🚀'
    ]);

});

// GET DOCTORS
Route::get('/doctors', function () {

    return User::where(
        'is_doctor',
        true
    )->get();

});

// AUTH
Route::post(
    '/register',
    [AuthController::class, 'register']
);

Route::post(
    '/login',
    [AuthController::class, 'login']
);

// PROFILE
Route::put(
    '/update-profile',
    [AuthController::class, 'updateProfile']
);

// =====================
// CHAT ROUTES
// =====================

// GET ALL CONVERSATIONS
Route::get(
    '/conversations/{userId}',
    [ChatController::class,
    'getConversations']
);

// GET SINGLE CHAT MESSAGES
Route::get(
    '/messages/{conversationId}',
    [ChatController::class,
    'getMessages']
);

// SEND MESSAGE
Route::post(
    '/send-message',
    [ChatController::class,
    'sendMessage']
);