<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\EventService;

class EventController extends Controller
{
    protected $service;

    public function __construct(EventService $service)
    {
        $this->service = $service;
    }

    public function verify(Request $request)
    {
        $eventId = $request->input('eventId');
        $result = $this->service->verifySupply($eventId);
        return response()->json($result);
    }
}

