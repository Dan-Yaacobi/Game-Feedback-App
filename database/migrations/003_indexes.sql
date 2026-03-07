CREATE INDEX idx_reports_status ON reports (status);
CREATE INDEX idx_reports_type ON reports (report_type);
CREATE INDEX idx_reports_created_at ON reports (created_at DESC);
CREATE INDEX idx_reports_tags_gin ON reports USING GIN (tags);
