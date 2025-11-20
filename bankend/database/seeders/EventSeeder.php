<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventSeeder extends Seeder {
    public function run(): void {
        DB::table('events')->insert([
            'id' => 101,
            'max_tickets' => 1000,
            'db_sales_count' => 500,
            'token_address' => '0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9', // USDC on Mantle
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
