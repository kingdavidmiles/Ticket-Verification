<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

Route::post('/verify-event-supply', [EventController::class, 'verify']);
