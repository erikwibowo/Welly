<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string("app_name");
            $table->string("app_short_name");
            $table->string("app_version");
            $table->string("app_tagline")->nullable();
            $table->text("app_description");
            $table->boolean("seo_enabled")->default(0);
            $table->string("meta_title");
            $table->text("meta_description");
            $table->string("meta_banner")->nullable();
            $table->text("meta_keywords");
            $table->text("meta_author");
            $table->string("app_logo")->nullable();
            $table->string("app_logo_dark")->nullable();
            $table->string("app_favicon")->nullable();
            $table->string("app_email")->nullable();
            $table->string("app_phone")->nullable();
            $table->string("app_whatsapp")->nullable();
            $table->string("app_facebook")->nullable();
            $table->string("app_instagram")->nullable();
            $table->string("app_twitter")->nullable();
            $table->string("app_tiktok")->nullable();
            $table->string("app_address")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
