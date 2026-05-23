CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    avatar_url TEXT DEFAULT 'https://i.postimg.cc/DzKtGYCx/nouserphoto.png',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type TEXT NOT NULL DEFAULT 'classroom' CHECK (type IN ('classroom', 'online'))
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    short_name VARCHAR(10) NOT NULL,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    teacher_id INTEGER NOT NULL REFERENCES users(id),
    classroom_id INTEGER REFERENCES classrooms(id),
    current_week INTEGER NOT NULL DEFAULT 1 CHECK (current_week > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE course_members (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_role TEXT NOT NULL DEFAULT 'student' CHECK (course_role IN ('student', 'delegate')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, user_id)
);

CREATE TABLE class_sessions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    classroom_id INTEGER REFERENCES classrooms(id),
    topic VARCHAR(150) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('academic', 'campus', 'systems', 'general')),
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE TABLE chat_channels (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'group' CHECK (type IN ('group', 'announcement')),
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    body TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    PRIMARY KEY (message_id, user_id)
);

CREATE INDEX idx_course_members_user_id ON course_members(user_id);
CREATE INDEX idx_course_members_course_id ON course_members(course_id);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_class_sessions_course_id ON class_sessions(course_id);
CREATE INDEX idx_calendar_events_course_id ON calendar_events(course_id);
CREATE INDEX idx_calendar_events_is_deleted ON calendar_events(is_deleted);
CREATE INDEX idx_resources_course_id ON resources(course_id);
CREATE INDEX idx_resources_is_deleted ON resources(is_deleted);
CREATE INDEX idx_chat_channels_course_id ON chat_channels(course_id);
CREATE INDEX idx_chat_messages_channel_id ON chat_messages(channel_id);
CREATE INDEX idx_chat_messages_is_deleted ON chat_messages(is_deleted);
CREATE INDEX idx_chat_message_reads_user_id ON chat_message_reads(user_id);
CREATE INDEX idx_chat_message_reactions_message_id ON chat_message_reactions(message_id);

CREATE UNIQUE INDEX unique_default_channel_per_course
ON chat_channels(course_id)
WHERE is_default = TRUE;
