import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: App.Models.User;
    permissions: { [key: string]: boolean };
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    permission?: string | null;
}

export interface PermissionData {
    id: string;
    name: string;
}

export interface PermissionGroup {
    group: string;
    data: PermissionData[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
    message: Message;
    app: {
        perPages: Select[];
        settings: App.Models.Setting;
        languages: {
            headers: [];
            original: {
                [key: string]: { [key: string]: string };
            };
            exception: undefined | string;
        };
        locale: string;
    };
}

export interface Message {
    type: 'destructive' | 'success' | 'info' | 'warning';
    default;
    default;
    message: string;
}

export interface Filter {
    page: number;
    perpage: number;
    q: string;
    field: string;
    order: string;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    date?: Date | undefined;
}

export interface Select {
    label: string;
    value: string | number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
