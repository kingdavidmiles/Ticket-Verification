<?php
namespace App\Services;

use App\Models\Event;
use Illuminate\Support\Facades\Http;

class EventService
{
   public function verifySupply(int $eventId)
{
    $event = Event::find($eventId);

    if (!$event) {
        return ['error' => 'Event not found'];
    }

    try {
        $response = Http::post(env('WEB3_SERVICE_URL'), [
            'token_address' => $event->token_address
        ]);

        $responseData = $response->json();

        if (!isset($responseData['blockchain_count'])) {
            return [
                'verification_status' => 'WEB3_CONNECTION_ERROR',
                'error' => $responseData['error'] ?? 'Invalid response from Web3 service'
            ];
        }

        $blockchain_count = $responseData['blockchain_count'];
        $diff = abs($event->db_sales_count - $blockchain_count);

        $status = ($diff <= 5) ? 'SYNC_SUCCESS' : (($diff > 10) ? 'WEB3_SYNC_LAG' : 'SYNC_WARNING');

        return [
            'max_tickets' => $event->max_tickets,
            'db_sales_count' => $event->db_sales_count,
            'blockchain_count' => $blockchain_count,
            'verification_status' => $status,
            'timestamp' => now()->timestamp * 1000
        ];

    } catch (\Exception $e) {
        return ['verification_status' => 'WEB3_CONNECTION_ERROR', 'error' => $e->getMessage()];
    }
}

}
