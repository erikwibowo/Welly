<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create([
            "app_name" => "Welly",
            "app_short_name" => "Welly",
            "app_version" => "1.0",
            "app_description" => "Welly adalah sebuah pengelola keuangan pribadi yang dirancang untuk membantu Anda mengelola keuangan dengan lebih baik. Dengan fitur-fitur canggih dan antarmuka yang ramah pengguna, Welly memudahkan Anda untuk melacak pengeluaran, membuat anggaran, dan merencanakan masa depan keuangan Anda.",
            "app_tagline" => "Kendali Penuh atas Keuangan Anda",
            "meta_title" => "Welly - Kendali Penuh atas Keuangan Anda",
            "meta_description" => "Welly adalah sebuah pengelola keuangan pribadi yang dirancang untuk membantu Anda mengelola keuangan dengan lebih baik. Dengan fitur-fitur canggih dan antarmuka yang ramah pengguna, Welly memudahkan Anda untuk melacak pengeluaran, membuat anggaran, dan merencanakan masa depan keuangan Anda.",
            "meta_keywords" => "pengelola keuangan, aplikasi keuangan, manajemen keuangan, anggaran, pengeluaran, investasi, perencanaan keuangan",
            "meta_author" => "Erik Wibowo",
        ]);
    }
}
