<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $posts  = Post::with(['user', 'likes','comments'])
            ->withCount([
                'likes as liked_by_user' => function($query) use($userId ){
                    $query->where('user_id', $userId );
                }
            ])
            ->where('user_id', $userId)
            ->latest()
            ->get()
            ->map(function($post){
                $post->liked_by_user = $post->liked_by_user > 0;
                return $post;
            });

        return inertia('post/Index', [
            'posts' => $posts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('post/FormPost');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'caption' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = $request->file('image')->store('uploads', 'public');


        Post::create([
            'user_id' => $request->user()->id,
            'caption' => $data['caption'],
            'image_path' => $imagePath
        ]);

        return redirect()->route('posts.index')->with('success', 'Post created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::with(['user', 'likes','comments.user'])->findOrFail($id);

        return inertia('post/ShowPost', [
            'post' => $post
        ]); 
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    { 
        $post = Post::findOrFail($id);

        return inertia('post/FormPost', [
            'post' => $post
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);

        $data = $request->validate([
            'caption' => 'required',
        ]);

        $post->update($data);

        return redirect()->back()->with('success', 'Post updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::findOrFail($id);

        Storage::disk('public')->delete($post->image_path);

        $post->delete();

        return redirect()->route('posts.index')->with('success', 'Post deleted successfully!'); // posts.index
    }
}
