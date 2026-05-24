<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use App\Models\AIConversation;
use App\Models\AIMessage;

class AIController extends Controller
{
    // =========================
    // GET CONVERSATIONS
    // =========================
    public function getConversations($userId)
    {
        $conversations = Conversation::where('user_id', $userId)
            ->latest()
            ->with(['messages' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->get();

        return response()->json($conversations);
    }

    // =========================
    // GET MESSAGES
    // =========================
    public function getMessages($conversationId)
    {
        $messages = Message::where(
            'conversation_id',
            $conversationId
        )->get();

        return response()->json($messages);
    }

    // =========================
    // CREATE CONVERSATION
    // =========================
    public function createConversation(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
        ]);

        $conversation =
            AIConversation::create([
                'user_id' => $request->user_id,
                'title' => 'New Health Chat',
            ]);

        return response()->json($conversation);
    }

    // =========================
    // DELETE CONVERSATION
    // =========================
    public function deleteConversation($id)
    {
        $conversation =
            AIConversation::find($id);

        if (!$conversation) {

            return response()->json([
                'message' =>
                    'Conversation not found'
            ], 404);
        }

        $conversation->delete();

        return response()->json([
            'message' =>
                'Conversation deleted'
        ]);
    }

    // =========================
    // RENAME CONVERSATION
    // =========================
    public function renameConversation(
        Request $request,
        $id
    ) {

        $request->validate([
            'title' =>
                'required|string|max:100',
        ]);

        $conversation =
            AIConversation::find($id);

        if (!$conversation) {

            return response()->json([
                'message' =>
                    'Conversation not found'
            ], 404);
        }

        $conversation->update([
            'title' =>
                trim($request->title),
        ]);

        return response()->json($conversation);
    }

    // =========================
    // SEND MESSAGE
    // =========================
    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' =>
                'required',

            'message' =>
                'required|string',
        ]);

        // SAVE USER MESSAGE
        AIMessage::create([

            'conversation_id' =>
                $request->conversation_id,

            'sender' =>
                'user',

            'message' =>
                trim($request->message),
        ]);

        // GET PREVIOUS CHAT
        $previousMessages =
            AIMessage::where(
                'conversation_id',
                $request->conversation_id
            )
            ->orderBy(
                'created_at',
                'asc'
            )
            ->take(15)
            ->get();

        // BUILD MESSAGE ARRAY
        $messages = [];

        // SYSTEM PROMPT
        $messages[] = [
            "role" => "system",
            "content" =>
                "You are Paramarsh AI, a friendly healthcare assistant.

Rules:
- Speak naturally like ChatGPT.
- Give helpful health guidance.
- Be concise but supportive.
- Never claim to be a real doctor.
- Recommend professional help for serious conditions.
- Use easy English."
        ];

        // ADD HISTORY
        foreach ($previousMessages as $msg) {

            $messages[] = [

                "role" =>
                    $msg->sender === 'user'
                    ? 'user'
                    : 'assistant',

                "content" =>
                    $msg->message
            ];
        }

        // =========================
        // OPENROUTER API CALL
        // =========================
        $response =
            Http::withHeaders([

                'Authorization' =>
                    'Bearer ' .
                    env('OPENROUTER_API_KEY'),

                'HTTP-Referer' =>
                    'http://localhost',

                'X-Title' =>
                    'Paramarsh AI',

            ])->post(
                'https://openrouter.ai/api/v1/chat/completions',
                [

                    'model' =>
                        'openai/gpt-3.5-turbo',

                    'messages' =>
                        $messages,

                    'temperature' =>
                        0.7,

                    'max_tokens' =>
                        500,
                ]
            );

        // =========================
        // API FAILED
        // =========================
        if (!$response->successful()) {

            $assistantMessage =
                AIMessage::create([

                    'conversation_id' =>
                        $request->conversation_id,

                    'sender' =>
                        'assistant',

                    'message' =>
                        "OpenRouter Error:\n\n" .
                        $response->body(),
                ]);

            return response()->json([
                'reply' =>
                    $assistantMessage
            ]);
        }

        // RESPONSE DATA
        $data =
            $response->json();

        $botReply =
            $data['choices'][0]['message']['content']
            ?? "Sorry, AI could not respond right now.";

        // DISCLAIMER
        $botReply .=
            "\n\n⚠️ Medical Disclaimer: This AI assistant provides general guidance only and is not a substitute for professional medical advice.";

        // SAVE AI MESSAGE
        $assistantMessage =
            AIMessage::create([

                'conversation_id' =>
                    $request->conversation_id,

                'sender' =>
                    'assistant',

                'message' =>
                    $botReply,
            ]);

        // UPDATE TITLE
        $conversation =
            AIConversation::find(
                $request->conversation_id
            );

        if (
            $conversation &&
            $conversation->title ===
            'New Health Chat'
        ) {

            $conversation->update([

                'title' =>
                    substr(
                        trim($request->message),
                        0,
                        30
                    ),
            ]);
        }

        return response()->json([
            'reply' =>
                $assistantMessage
        ]);
    }
}