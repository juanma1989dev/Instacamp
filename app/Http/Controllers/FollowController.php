<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required'
        ]);

        $user = $request->user();

        $user->following()->attach($data['user_id']);

        return back()->with('success', 'User followed successfully!');
    }
   
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();

        $user->following()->detach($id);

        return back()->with('success', 'User unfollowed successfully!');
    }
}
