export function getProfileHeaderText(lastSegment?: string): string {
    switch (lastSegment) {
        case undefined:
        case "profile":
        case "":
            return "Profile";
        case "aboutapp":
            return "About App";
        case "dailyremind":
            return "Daily Remind";
        case "helpsupp":
            return "Help & Support";
        case "privacy":
            return "Cash Flow Intelligence";
        case "securityset":
            return "Security Settings";
        default:
            return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    }
}