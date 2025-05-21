@props([
    'controller',
    'model',
    'migration',
    'storeRequest',
    'updateRequest',
    'indexPage',
    'createPage',
    'editPage',
    'permission',
    'route'
])
<div class="mx-2 my-1">
    <div class="my-1">
        <span class="font-bold text-green">Jarvis Resource Generated</span>

        <div class="flex space-x-1">
            <span class="font-bold">{{ $controller }}</span>
            <span class="flex-1 content-repeat-[.] text-gray"></span>
            <span class="font-bold text-green uppercase">created</span>
        </div>
        <div class="flex space-x-1">
            <span class="font-bold">{{ $model }}</span>
            <span class="flex-1 content-repeat-[.] text-gray"></span>
            <span class="font-bold text-green uppercase">created</span>
        </div>
        <div class="flex space-x-1">
            <span class="font-bold">{{ $migration }}</span>
            <span class="flex-1 content-repeat-[.] text-gray"></span>
            <span class="font-bold text-green uppercase">created</span>
        </div>
        <div class="flex space-x-1">
            <span class="font-bold">{{ $storeRequest }}</span>
            <span class="flex-1 content-repeat-[.] text-gray"></span>
            <span class="font-bold text-green uppercase">created</span>
        </div>
        <div class="flex space-x-1">
            <span class="font-bold">{{ $updateRequest }}</span>
            <span class="flex-1 content-repeat-[.] text-gray"></span>
            <span class="font-bold text-green uppercase">created</span>
        </div>
        <div class="flex space-x-1">
            <span class="font-bold">{{ $indexPage }}</span>
            <span class="flex-1 content-repeat-[.] text-gray"></span>
            <span class="font-bold text-green uppercase">created</span>
        </div>
        <div class="flex space-x-1">
            <span class="font-bold">{{ $createPage }}</span>
            <span class="flex-1 content-repeat-[.] text-gray"></span>
            <span class="font-bold text-green uppercase">created</span>
        </div>
        <div class="flex space-x-1">
            <span class="font-bold">{{ $editPage }}</span>
            <span class="flex-1 content-repeat-[.] text-gray"></span>
            <span class="font-bold text-green uppercase">created</span>
        </div>
        <div class="flex space-x-1">
            <span class="font-bold">{{ $permission }}</span>
            <span class="flex-1 content-repeat-[.] text-gray"></span>
            <span class="font-bold text-green uppercase">created</span>
        </div>
        <div class="flex space-x-1">
            <span class="font-bold">{{ $route }}</span>
            <span class="flex-1 content-repeat-[.] text-gray"></span>
            <span class="font-bold text-green uppercase">created</span>
        </div>
        <span class="text-blue mt-1">Please run 'php artisan migrate'</span>
        <span class="text-blue mt-1">And run 'php artisan typescriptable:eloquent'</span>
    </div>
</div>