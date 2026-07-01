CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    avatar_url TEXT DEFAULT 'https://i.postimg.cc/DzKtGYCx/nouserphoto.png',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (code = UPPER(code)),
    CHECK (email = LOWER(email)),
    CHECK (LENGTH(TRIM(first_name)) > 0),
    CHECK (LENGTH(TRIM(last_name)) > 0)
);

CREATE TABLE classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type TEXT NOT NULL DEFAULT 'classroom' CHECK (type IN ('classroom', 'online')),
    CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    short_name VARCHAR(10) NOT NULL,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    teacher_id INTEGER NOT NULL REFERENCES users(id),
    classroom_id INTEGER REFERENCES classrooms(id),
    secondary_classroom_id INTEGER REFERENCES classrooms(id),
    current_week INTEGER NOT NULL DEFAULT 1 CHECK (current_week > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (LENGTH(TRIM(short_name)) > 0),
    CHECK (LENGTH(TRIM(title)) > 0),
    CHECK (slug = LOWER(slug)),
    CHECK (classroom_id IS NULL OR classroom_id <> secondary_classroom_id)
);

CREATE TABLE course_members (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_role TEXT NOT NULL DEFAULT 'student' CHECK (course_role IN ('student', 'delegate')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_delegate')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, user_id),
    CHECK (
        (course_role = 'delegate' AND status IN ('active', 'pending_delegate'))
        OR (course_role = 'student' AND status IN ('active', 'inactive'))
    )
);

CREATE TABLE class_sessions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    classroom_id INTEGER REFERENCES classrooms(id),
    topic VARCHAR(150) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (LENGTH(TRIM(topic)) > 0),
    CHECK (ends_at > starts_at)
);

CREATE TABLE calendar_events (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    event_type TEXT NOT NULL CHECK (event_type IN ('assignment', 'exam', 'reminder', 'announcement', 'other')),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    is_cancelled BOOLEAN DEFAULT false,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (LENGTH(TRIM(title)) > 0),
    CHECK (ends_at IS NULL OR ends_at > starts_at)
);

CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    title VARCHAR(150) NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('pdf', 'video', 'ppt', 'photo', 'sql', 'link', 'doc', 'other')),
    size_bytes INTEGER NOT NULL DEFAULT 0 CHECK (size_bytes >= 0),
    uploaded_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'unavailable')),
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (LENGTH(TRIM(title)) > 0),
    CHECK (LENGTH(TRIM(file_url)) > 0)
);

CREATE TABLE resource_definitions (
    resource_id INTEGER PRIMARY KEY REFERENCES resources(id) ON DELETE CASCADE,
    definition TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (LENGTH(TRIM(definition)) > 0)
);

CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('academic', 'campus', 'systems', 'general')),
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    CHECK (LENGTH(TRIM(title)) > 0),
    CHECK (LENGTH(TRIM(body)) > 0)
);

CREATE TABLE chat_channels (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'group' CHECK (type IN ('group', 'announcement')),
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    body TEXT NOT NULL,
    attachment_type TEXT NOT NULL DEFAULT '' CHECK (attachment_type IN ('', 'photo')),
    attachment_url TEXT NOT NULL DEFAULT '',
    attachment_name TEXT NOT NULL DEFAULT '',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (LENGTH(TRIM(body)) > 0 OR attachment_url <> ''),
    CHECK ((attachment_type = '' AND attachment_url = '') OR (attachment_type <> '' AND attachment_url <> ''))
);

CREATE TABLE chat_message_reads (
    message_id INTEGER NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id)
);

CREATE TABLE chat_message_reactions (
    message_id INTEGER NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (emoji IN ('👍', '😂', '❤️', '🔥', '😮', '😢', '🙏')),
    PRIMARY KEY (message_id, user_id)
);

CREATE TABLE user_preferences (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    language TEXT NOT NULL DEFAULT 'English' CHECK (language IN ('English', 'Spanish', 'Portuguese')),
    chat_wallpaper_name TEXT NOT NULL DEFAULT '',
    chat_wallpaper_url TEXT NOT NULL DEFAULT '',
    color_palette TEXT NOT NULL DEFAULT 'white' CHECK (color_palette IN ('dark', 'white', 'pink', 'dark-orange', 'white-orange')),
    chat_font_size TEXT NOT NULL DEFAULT 'Medium' CHECK (chat_font_size IN ('Small', 'Medium', 'Large')),
    show_read_check BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);