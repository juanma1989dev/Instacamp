<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $followingIds = $user->following()->pluck('followed_id');
        $userIds = $followingIds->push($user->id);

        $posts = Post::whereIn('user_id', $userIds)
                    ->with([
                        'user:id,name',
                        'likes' => function($query) use ($user){
                            $query->where('user_id', $user->id);
                        }
                    ])
                    ->withCount(['likes', 'comments'])
                    // ->select(['id', 'caption', 'image_url', 'created_at'])
                    ->latest()
                    ->get(); /// paginate(15) //getCollection
        
                    
        $posts->transform(function($post){
            $post->is_liked = $post->likes->isNotEmpty();
            unset($post->likes);
            return $post;
        });
        
        return inertia('Index', [
            'posts' => $posts
        ]);
    }
}