<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'post_id' => 'required',
        ]);

        $post = Post::findOrFail($data['post_id']);

        $post->likes()->create([
            'user_id' => $request->user()->id
        ]);

        back()->with('success', 'Post liked successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
       $post = Post::findOrFail($id);

       $post->likes()->where('user_id', $request->user()->id)->delete();

       return back()->with('success', 'Post unliked successfully!');
    }
}
