<?php

use Illuminate\Support\Facades\Route;

use App\Models\User;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AIController;

// TEST
Route::get('/test', function () {

    return response()->json([
        'message' => 'Backend is working 🚀'
    ]);

});

// =========================
// DOCTORS
// =========================
Route::get('/doctors', function () {

    return User::where(
        'is_doctor',
        true
    )->get();

});

// =========================
// AUTH
// =========================
Route::post(
    '/register',
    [AuthController::class, 'register']
);

Route::post(
    '/login',
    [AuthController::class, 'login']
);

// =========================
// PROFILE
// =========================
Route::put(
    '/update-profile',
    [AuthController::class, 'updateProfile']
);

// =========================
// CHAT
// =========================

// GET CONVERSATIONS
Route::get(
    '/conversations/{userId}',
    [ChatController::class,
    'getConversations']
);

// GET MESSAGES
Route::get(
    '/messages/{conversationId}',
    [ChatController::class,
    'getMessages']
);

// START CONVERSATION
Route::post(
    '/start-conversation',
    [ChatController::class,
    'startConversation']
);

// SEND MESSAGE
Route::post(
    '/send-message',
    [ChatController::class,
    'sendMessage']
);

// =========================
// AI ASSISTANT
// =========================

// GET AI CONVERSATIONS
Route::get(
    '/ai/conversations/{userId}',
    [AIController::class,
    'getConversations']
);

// GET AI MESSAGES
Route::get(
    '/ai/messages/{conversationId}',
    [AIController::class,
    'getMessages']
);

// CREATE AI CONVERSATION
Route::post(
    '/ai/create-conversation',
    [AIController::class,
    'createConversation']
);

// SEND AI MESSAGE
Route::post(
    '/ai/send-message',
    [AIController::class,
    'sendMessage']
);

// DELETE AI CONVERSATION
Route::delete(
    '/ai/conversation/{id}',
    [AIController::class,
    'deleteConversation']
);

// RENAME AI CONVERSATION
Route::put(
    '/ai/conversation/{id}',
    [AIController::class,
    'renameConversation']
);