CREATE INDEX idx_course_members_user_id ON course_members(user_id);

CREATE INDEX idx_users_code ON users(code);

CREATE UNIQUE INDEX idx_users_email_lower_unique ON users(LOWER(email));

CREATE INDEX idx_users_is_blocked ON users(is_blocked);

CREATE INDEX idx_course_members_course_id ON course_members(course_id);

CREATE INDEX idx_course_members_active_user
ON course_members(user_id, status)
WHERE status = 'active';

CREATE INDEX idx_course_members_pending_delegates
ON course_members(course_id, status)
WHERE course_role = 'delegate' AND status = 'pending_delegate';

CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);

CREATE INDEX idx_courses_slug ON courses(slug);

CREATE INDEX idx_class_sessions_course_id ON class_sessions(course_id);

CREATE INDEX idx_class_sessions_starts_at ON class_sessions(starts_at);

CREATE INDEX idx_calendar_events_course_id ON calendar_events(course_id);

CREATE INDEX idx_calendar_events_starts_at ON calendar_events(starts_at);

CREATE INDEX idx_calendar_events_is_deleted ON calendar_events(is_deleted);

CREATE INDEX idx_resources_course_id ON resources(course_id);

CREATE INDEX idx_resources_course_week ON resources(course_id, week_number);

CREATE INDEX idx_resources_is_deleted ON resources(is_deleted);

CREATE INDEX idx_resource_definitions_updated_at ON resource_definitions(updated_at);

CREATE INDEX idx_announcements_status ON announcements(status);

CREATE INDEX idx_announcements_is_deleted ON announcements(is_deleted);

CREATE INDEX idx_chat_channels_course_id ON chat_channels(course_id);

CREATE INDEX idx_chat_messages_channel_id ON chat_messages(channel_id);

CREATE INDEX idx_chat_messages_channel_created_at ON chat_messages(channel_id, created_at);

CREATE INDEX idx_chat_messages_is_deleted ON chat_messages(is_deleted);

CREATE INDEX idx_chat_message_reads_user_id ON chat_message_reads(user_id);

CREATE INDEX idx_chat_message_reactions_message_id ON chat_message_reactions(message_id);

CREATE UNIQUE INDEX unique_default_channel_per_course
ON chat_channels(course_id)
WHERE is_default = TRUE;