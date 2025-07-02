// Arabic date formatting utility

const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const ARABIC_DAYS = [
  'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
];

/**
 * Format a date into Arabic representation
 * @param dateString - ISO date string
 * @returns Formatted date in Arabic
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  
  // Optional: add day name
  const dayName = ARABIC_DAYS[date.getDay()];
  
  return `${dayName} ${day} ${month} ${year}`;
};

/**
 * Get relative time in Arabic (today, yesterday, etc.)
 * @param dateString - ISO date string
 * @returns Relative time in Arabic
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'اليوم';
  } else if (diffInDays === 1) {
    return 'البارحة';
  } else if (diffInDays < 7) {
    return `منذ ${diffInDays} أيام`;
  } else {
    return formatDate(dateString);
  }
};