import type { EntityId, UserRole } from "../../../shared/types/domain.types.js";

export interface AuthUser {
    id: EntityId;
    code: string;
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    is_blocked: boolean;
    avatar_url?: string | null;
    password_hash?: string | null;
}

export interface LoginInput {
    code: string;
    password: string;
}

export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    code: string;
    password: string;
}

export interface InsertUserInput {
    firstName: string;
    lastName: string;
    email: string;
    code: string;
    passwordHash: string | null;
}

export interface AuthSession {
    token: string;
    user: {
        id: EntityId;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
    };
}
