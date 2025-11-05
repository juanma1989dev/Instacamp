<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::resources([
    'posts' => PostController::class,
    'likes' => LikeController::class,
    'comments' => CommentController::class,
    'users' => UserController::class,
    'follows' => FollowController::class
]);

Route::get('/',[ IndexController::class, 'index'])->name('home');




Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
