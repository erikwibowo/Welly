<?php

namespace App\Console\Commands;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

use function Termwind\{render};

class Generate extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate resource for default resource';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = ucfirst($this->argument('name'));
        $nameLower = strtolower($name);
        $nameSnake = Str::snake($name);
        $nameKebab = Str::kebab($name);
        $this->makeDir(resource_path("/js/pages/{$nameKebab}"));
        $this->makeDir(app_path("/HTTP/Requests/{$name}"));
        $this->makeDir(base_path("/routes/streact"));
        File::append(
            base_path('routes/streact.php'),
            "require __DIR__.'/streact/" . $nameKebab . ".php';
"
        );

        $superadmin = Role::where(['name' => 'superadmin'])->first();
        $superadmin->revokePermissionTo([
            $nameKebab . ' delete',
            $nameKebab . ' update',
            $nameKebab . ' read',
            $nameKebab . ' create',
        ]);
        Permission::whereIn('name', [
            $nameKebab . ' delete',
            $nameKebab . ' update',
            $nameKebab . ' read',
            $nameKebab . ' create',
        ])->delete();
        Permission::create(['name' => $nameKebab . ' delete', 'guard_name' => 'web']);
        Permission::create(['name' => $nameKebab . ' update', 'guard_name' => 'web']);
        Permission::create(['name' => $nameKebab . ' read', 'guard_name' => 'web']);
        Permission::create(['name' => $nameKebab . ' create', 'guard_name' => 'web']);
        $superadmin->givePermissionTo([
            $nameKebab . ' delete',
            $nameKebab . ' update',
            $nameKebab . ' read',
            $nameKebab . ' create',
        ]);

        render(
            view('cli.streact', [
                'model' => $this->model($name),
                'controller' => $this->controller($name),
                'migration' => $this->migration($name),
                'route' => $this->route($name),
                'storeRequest' => $this->storeRequest($name),
                'updateRequest' => $this->updateRequest($name),
                'indexPage' => $this->indexPage($name),
                'createPage' => $this->createPage($name),
                'editPage' => $this->editPage($name),
                'permission' => $nameKebab . " permission",
            ])->render()
        );

        return self::SUCCESS;
    }

    protected function model($name): string
    {
        $params = str_replace(
            ['{{modelName}}'],
            [$name],
            $this->getStub('Model')
        );
        file_put_contents(app_path("/Models/{$name}.php"), $params);
        return "app/Models/{$name}.php";
    }

    protected function controller($name): string
    {
        $params = str_replace(
            [
                '{{modelName}}',
                '{{modelNamePlural}}',
                '{{modelNameKebabCase}}',
                '{{modelNamePluralLowerCase}}',
                '{{modelNameSnakeCase}}',
                '{{modelNamePluralSnakeCase}}',
                '{{modelNameCamelCase}}',
                '{{modelNamePluralCamelCase}}',
            ],
            [
                $name,
                Str::plural($name),
                Str::kebab($name),
                strtolower(Str::plural($name)),
                Str::snake($name),
                Str::snake(Str::plural($name)),
                Str::camel($name),
                Str::camel(Str::plural($name)),
            ],
            $this->getStub('Controller')
        );
        file_put_contents(app_path("/Http/Controllers/{$name}Controller.php"), $params);
        return "app/Http/Controllers/{$name}Controller.php";
    }

    public function migration($name): string
    {
        $modelNamePluralLowerCase = Str::snake(Str::plural($name));
        $params = str_replace(
            [
                '{{modelNamePluralLowerCase}}',
            ],
            [
                $modelNamePluralLowerCase,
            ],
            $this->getStub('Migration')
        );
        $path = "/migrations/" . date('Y_m_d_His_') . "create_{$modelNamePluralLowerCase}_table.php";
        file_put_contents(database_path($path), $params);
        return "database/" . $path;
    }

    public function route($name): string
    {
        $params = str_replace(
            [
                '{{modelName}}',
                '{{modelNameKebabCase}}',
            ],
            [
                $name,
                Str::kebab($name),
            ],
            $this->getStub('Route')
        );
        $path = "/routes/streact/" . Str::kebab($name) . ".php";
        file_put_contents(base_path($path), $params);
        return "app" . $path;
    }

    public function storeRequest($name): string
    {
        $params = str_replace(
            [
                '{{modelName}}',
            ],
            [
                $name,
            ],
            $this->getStub('Requests/Store')
        );
        $path = "/HTTP/Requests/{$name}/{$name}StoreRequest.php";
        file_put_contents(app_path($path), $params);
        return "app" . $path;
    }

    public function updateRequest($name): string
    {
        $params = str_replace(
            [
                '{{modelName}}',
            ],
            [
                $name,
            ],
            $this->getStub('Requests/Update')
        );
        $path = "/HTTP/Requests/{$name}/{$name}UpdateRequest.php";
        file_put_contents(app_path($path), $params);
        return "app" . $path;
    }

    public function indexPage($name): string
    {
        $params = str_replace(
            [
                '{{modelName}}',
                '{{modelNamePlural}}',
                '{{modelNameKebabCase}}',
                '{{modelNamePluralLowerCase}}',
                '{{modelNameSnakeCase}}',
                '{{modelNamePluralSnakeCase}}',
                '{{modelNameCamelCase}}',
                '{{modelNamePluralCamelCase}}',
            ],
            [
                $name,
                Str::plural($name),
                Str::kebab($name),
                strtolower(Str::plural($name)),
                Str::snake($name),
                Str::snake(Str::plural($name)),
                Str::camel($name),
                Str::camel(Str::plural($name)),
            ],
            $this->getStub('Pages/Index')
        );
        $path = "/js/pages/" . Str::kebab($name) . "/index.tsx";
        file_put_contents(resource_path($path), $params);
        return "resources" . $path;
    }

    public function createPage($name): string
    {
        $params = str_replace(
            [
                '{{modelName}}',
                '{{modelNamePlural}}',
                '{{modelNameKebabCase}}',
                '{{modelNamePluralLowerCase}}',
                '{{modelNameSnakeCase}}',
                '{{modelNamePluralSnakeCase}}',
                '{{modelNameCamelCase}}',
                '{{modelNamePluralCamelCase}}',
            ],
            [
                $name,
                Str::plural($name),
                Str::kebab($name),
                strtolower(Str::plural($name)),
                Str::snake($name),
                Str::snake(Str::plural($name)),
                Str::camel($name),
                Str::camel(Str::plural($name)),
            ],
            $this->getStub('Pages/Create')
        );
        $path = "/js/pages/" . Str::kebab($name) . "/create.tsx";
        file_put_contents(resource_path($path), $params);
        return "resources" . $path;
    }

    public function editPage($name): string
    {
        $params = str_replace(
            [
                '{{modelName}}',
                '{{modelNamePlural}}',
                '{{modelNameKebabCase}}',
                '{{modelNamePluralLowerCase}}',
                '{{modelNameSnakeCase}}',
                '{{modelNamePluralSnakeCase}}',
                '{{modelNameCamelCase}}',
                '{{modelNamePluralCamelCase}}',
            ],
            [
                $name,
                Str::plural($name),
                Str::kebab($name),
                strtolower(Str::plural($name)),
                Str::snake($name),
                Str::snake(Str::plural($name)),
                Str::camel($name),
                Str::camel(Str::plural($name)),
            ],
            $this->getStub('Pages/Edit')
        );
        $path = "/js/pages/" . Str::kebab($name) . "/edit.tsx";
        file_put_contents(resource_path($path), $params);
        return "resources" . $path;
    }

    protected function getStub($type)
    {
        return file_get_contents(resource_path("stubs/$type.stub"));
    }

    protected function makeDir($path)
    {
        return is_dir($path) || mkdir($path);
    }
}
