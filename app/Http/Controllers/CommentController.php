<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'comment' => 'required|max:255',
            'post_id' => 'required'
        ]);


        $post = Post::findOrFail($data['post_id']);

        $post->comments()->create([
            'user_id' => $request->user()->id,
            'comment' => $data['comment']
        ]);

        return back()->with('success', 'Comment created successfully!');
    }

    public function destroy(string $id)
    {
        $comment = Comment::with('post')->findOrFail($id);

        if (
            $comment->user_id !== request()->user()->id &&
            $comment->post->user_id !== request()->user()->id
        ) {
            abort(403, 'Unauthorized action.');
        }

        $comment->delete();

        return back()->with('success', 'Comment deleted successfully!');
    }
}
