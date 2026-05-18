<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;

class ChatController extends Controller
{
    // GET USER CONVERSATIONS
    public function getConversations($userId)
    {
        $conversations =
            Conversation::with([
                'userOne',
                'userTwo',
                'messages'
            ])
            ->where('user_one_id', $userId)
            ->orWhere('user_two_id', $userId)
            ->latest()
            ->get();

        return response()->json(
            $conversations
        );
    }

    // GET SINGLE CHAT
    public function getMessages($conversationId)
    {
        $messages =
            Message::with('sender')
            ->where(
                'conversation_id',
                $conversationId
            )
            ->orderBy('created_at')
            ->get();

        return response()->json(
            $messages
        );
    }

    // SEND MESSAGE
    public function sendMessage(
        Request $request
    ) {

        $request->validate([
            'sender_id' => 'required',
            'receiver_id' => 'required',
            'message' => 'required',
        ]);

        // CHECK EXISTING CONVERSATION
        $conversation =
            Conversation::where(function ($q)
            use ($request) {

                $q->where(
                    'user_one_id',
                    $request->sender_id
                )
                ->where(
                    'user_two_id',
                    $request->receiver_id
                );

            })
            ->orWhere(function ($q)
            use ($request) {

                $q->where(
                    'user_one_id',
                    $request->receiver_id
                )
                ->where(
                    'user_two_id',
                    $request->sender_id
                );

            })
            ->first();

        // CREATE IF NOT EXISTS
        if (!$conversation) {

            $conversation =
                Conversation::create([
                    'user_one_id' =>
                        $request->sender_id,

                    'user_two_id' =>
                        $request->receiver_id,
                ]);
        }

        // CREATE MESSAGE
        $message =
            Message::create([
                'conversation_id' =>
                    $conversation->id,

                'sender_id' =>
                    $request->sender_id,

                'message' =>
                    $request->message,
            ]);

        return response()->json([
            'conversation' =>
                $conversation,

            'message' =>
                $message
        ]);
    }
}