<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Skill;
use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        Profile::create([
            'name' => 'My Portfolio',
            'tagline' => 'Fullstack Developer',
            'bio' => 'Fullstack developer passionate about building modern web applications.',
            'location' => 'Indonesia',
            'email' => 'hello@example.com',
            'github' => 'github.com/username',
            'linkedin' => 'linkedin.com/in/username',
        ]);

        $skills = ['Laravel', 'Next.js', 'Tailwind CSS', 'React', 'PHP'];
        foreach ($skills as $i => $skill) {
            Skill::create(['name' => $skill, 'sort_order' => $i]);
        }

        Project::create([
            'title' => 'Project A',
            'description' => 'Web application built with Laravel & Next.js',
            'tags' => ['Laravel', 'Next.js'],
            'sort_order' => 0,
        ]);

        Project::create([
            'title' => 'Project B',
            'description' => 'Mobile-first dashboard with Tailwind',
            'tags' => ['React', 'Tailwind CSS'],
            'sort_order' => 1,
        ]);
    }
}
