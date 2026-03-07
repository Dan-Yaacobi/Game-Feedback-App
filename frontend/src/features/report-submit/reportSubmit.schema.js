const REPORT_TYPES = ['bug', 'suggestion', 'balance_issue'];
const ALLOWED_SCREENSHOT_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateReportSubmit(values, screenshot) {
  const errors = {};

  const title = values.title?.trim() ?? '';
  const description = values.description?.trim() ?? '';
  const reportType = values.report_type?.trim() ?? '';
  const playerName = values.player_name?.trim() ?? '';
  const playerEmail = values.player_email?.trim() ?? '';

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length > 150) {
    errors.title = 'Title must be 150 characters or fewer.';
  }

  if (!description) {
    errors.description = 'Description is required.';
  }

  if (!REPORT_TYPES.includes(reportType)) {
    errors.report_type = 'Please select a valid report type.';
  }

  if (playerName && playerName.length > 100) {
    errors.player_name = 'Player name must be 100 characters or fewer.';
  }

  if (playerEmail && !EMAIL_REGEX.test(playerEmail)) {
    errors.player_email = 'Please enter a valid email address.';
  }

  if (screenshot && !ALLOWED_SCREENSHOT_TYPES.includes(screenshot.type)) {
    errors.screenshot = 'Screenshot must be a PNG, JPEG, or WEBP image.';
  }

  return errors;
}

export { REPORT_TYPES, ALLOWED_SCREENSHOT_TYPES };
