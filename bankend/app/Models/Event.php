<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', 'max_tickets', 'db_sales_count', 'token_address'
    ];

    public $timestamps = true;
}
