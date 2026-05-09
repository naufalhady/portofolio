<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Skill;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@portfolio.com',
            'password' => bcrypt('password'),
        ]);

        $profile = Profile::create([
            'name' => 'My Portfolio',
            'tagline' => 'Fullstack Developer',
            'bio' => 'Fullstack developer passionate about building modern web applications.',
            'location' => 'Indonesia',
            'email' => 'hello@portfolio.com',
            'github' => 'github.com/username',
            'linkedin' => 'linkedin.com/in/username',
        ]);

        $skills = ['Laravel', 'Next.js', 'Tailwind CSS', 'React', 'PHP'];
        foreach ($skills as $i => $skill) {
            Skill::create([
                'profile_id' => $profile->id,
                'name' => $skill,
                'sort_order' => $i,
            ]);
        }

        $projects = [
            ['title' => 'Project A', 'description' => 'Web application built with Laravel & Next.js', 'tags' => ['Next.js', 'Laravel']],
            ['title' => 'Project B', 'description' => 'Mobile-first dashboard with Tailwind', 'tags' => ['Tailwind', 'React']],
        ];
        foreach ($projects as $i => $p) {
            Project::create([
                'profile_id' => $profile->id,
                'title' => $p['title'],
                'description' => $p['description'],
                'tags' => $p['tags'],
                'sort_order' => $i,
            ]);
        }
    }
}
