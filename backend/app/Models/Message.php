<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'message',
    ];

    // CONVERSATION
    public function conversation()
    {
        return $this->belongsTo(
            Conversation::class
        );
    }

    // SENDER
    public function sender()
    {
        return $this->belongsTo(
            User::class,
            'sender_id'
        );
    }
}