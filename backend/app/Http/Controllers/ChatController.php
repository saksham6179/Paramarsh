<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;

class ChatController extends Controller
{
    // =========================
    // GET USER CONVERSATIONS
    // =========================
    public function getConversations($userId)
    {
        $conversations = Conversation::with([
            'userOne',
            'userTwo',
            'messages' => function ($query) {
                $query->latest()->limit(1);
            }
        ])
        ->where('user_one_id', $userId)
        ->orWhere('user_two_id', $userId)
        ->latest('updated_at')
        ->get();

        // ADD UNREAD COUNT
        $conversations->map(
            function ($conversation)
            use ($userId) {

                $conversation->unread_count =
                    Message::where(
                        'conversation_id',
                        $conversation->id
                    )
                    ->where(
                        'sender_id',
                        '!=',
                        $userId
                    )
                    ->where(
                        'is_seen',
                        false
                    )
                    ->count();

                return $conversation;
            }
        );

        return response()->json(
            $conversations
        );
    }

    // =========================
    // GET MESSAGES
    // =========================
    public function getMessages(
        $conversationId,
        Request $request
    ) {

        // MARK AS SEEN
        Message::where(
            'conversation_id',
            $conversationId
        )
        ->where(
            'sender_id',
            '!=',
            $request->user_id
        )
        ->update([
            'is_seen' => true
        ]);

        $messages = Message::with(
            'sender'
        )
        ->where(
            'conversation_id',
            $conversationId
        )
        ->orderBy(
            'created_at',
            'asc'
        )
        ->get();

        return response()->json(
            $messages
        );
    }

    // =========================
    // START CONVERSATION
    // =========================
    public function startConversation(
        Request $request
    ) {

        $request->validate([
            'user_one_id' =>
                'required',

            'user_two_id' =>
                'required',
        ]);

        $conversation =
            Conversation::where(function ($q)
            use ($request) {

                $q->where(
                    'user_one_id',
                    $request->user_one_id
                )
                ->where(
                    'user_two_id',
                    $request->user_two_id
                );

            })
            ->orWhere(function ($q)
            use ($request) {

                $q->where(
                    'user_one_id',
                    $request->user_two_id
                )
                ->where(
                    'user_two_id',
                    $request->user_one_id
                );

            })
            ->first();

        if (!$conversation) {

            $conversation =
                Conversation::create([
                    'user_one_id' =>
                        $request->user_one_id,

                    'user_two_id' =>
                        $request->user_two_id,
                ]);
        }

        return response()->json(
            $conversation
        );
    }

    // =========================
    // SEND MESSAGE
    // =========================
    public function sendMessage(
        Request $request
    ) {

        $request->validate([
            'conversation_id' =>
                'required',

            'sender_id' =>
                'required',

            'message' =>
                'required|string',
        ]);

        $message =
            Message::create([
                'conversation_id' =>
                    $request->conversation_id,

                'sender_id' =>
                    $request->sender_id,

                'message' =>
                    trim(
                        $request->message
                    ),

                'is_seen' => false,
            ]);

        // UPDATE CONVERSATION
        Conversation::where(
            'id',
            $request->conversation_id
        )->touch();

        return response()->json(
            $message
        );
    }
}