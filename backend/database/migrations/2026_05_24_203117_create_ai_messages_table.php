<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run migrations.
     */
    public function up(): void
    {
        Schema::create(
            'ai_messages',
            function (
                Blueprint $table
            ) {

                $table->id();

                $table->foreignId(
                    'conversation_id'
                )
                ->constrained(
                    'ai_conversations'
                )
                ->onDelete('cascade');

                $table->enum(
                    'sender',
                    ['user', 'assistant']
                );

                $table->longText(
                    'message'
                );

                $table->timestamps();

            }
        );
    }

    /**
     * Reverse migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(
            'ai_messages'
        );
    }
};