import {
    Calendar,
    MessageSquare,
    Users,
    FileText,
    Mail,
    LogIn,
    UserPlus,
    UserCheck,
    ShieldOff,
    User,
    File,
    PieChart,
    Package,
    Layers,
    Box,
    Archive,
    AlertCircle,
    ShoppingBag,
    Globe,
    LifeBuoy,
} from "react-feather";

const asideMenus = [
    {
        id: 1,
        label: "Dashboard",
        url: "/",
        Icon: PieChart,
        submenu: [
            {
                id: 11,
                label: "Sales Monitoring",
                url: "/classic-plus/dashboard-one",
                Icon: ShoppingBag,
            },
            {
                id: 12,
                label: "Website Analytics",
                url: "/classic-plus/dashboard-two",
                Icon: Globe,
            },
            {
                id: 13,
                label: "Cryptocurrency",
                url: "/classic-plus/dashboard-three",
                Icon: PieChart,
            },
            {
                id: 14,
                label: "Helpdesk Management",
                url: "/classic-plus/dashboard-four",
                Icon: LifeBuoy,
            },
        ],
    },
    {
        id: 2,
        label: "Apps",
        url: "/",
        Icon: Package,
        submenu: [
            {
                id: 21,
                label: "Calendar",
                url: "/classic-plus/apps/calendar",
                Icon: Calendar,
            },
            {
                id: 22,
                label: "Chat",
                url: "/classic-plus/apps/chat",
                Icon: MessageSquare,
            },
            {
                id: 23,
                label: "Contacts",
                url: "/classic-plus/apps/contacts",
                Icon: Users,
            },
            {
                id: 25,
                label: "File Manager",
                url: "/classic-plus/apps/file-manager",
                Icon: FileText,
            },
            {
                id: 26,
                label: "Mail",
                url: "/classic-plus/apps/mail",
                Icon: Mail,
            },
        ],
    },
    {
        id: 3,
        label: "Pages",
        url: "/",
        Icon: Layers,
        megamenu: [
            {
                id: 31,
                title: "Authentication",
                Icon: Layers,
                submenu: [
                    {
                        id: 311,
                        label: "Sign In",
                        url: "/classic-plus/signin",
                        Icon: LogIn,
                    },
                    {
                        id: 312,
                        label: "Sign Up",
                        url: "/classic-plus/signup",
                        Icon: UserPlus,
                    },
                    {
                        id: 313,
                        label: "Verify Account",
                        url: "/classic-plus/verify-account",
                        Icon: UserCheck,
                    },
                    {
                        id: 314,
                        label: "Forgot Password",
                        url: "/classic-plus/forgot-password",
                        Icon: ShieldOff,
                    },
                ],
            },
            {
                id: 32,
                title: "Error Pages",
                Icon: AlertCircle,
                submenu: [
                    {
                        id: 321,
                        label: "404 Page Not Found",
                        url: "/classic-plus/error-404",
                        Icon: File,
                    },
                    {
                        id: 322,
                        label: "500 Internal Server",
                        url: "/classic-plus/error-500",
                        Icon: File,
                    },
                    {
                        id: 323,
                        label: "503 Service Unavailable",
                        url: "/classic-plus/error-503",
                        Icon: File,
                    },
                    {
                        id: 324,
                        label: "505 Forbidden",
                        url: "/classic-plus/error-505",
                        Icon: File,
                    },
                ],
            },
            {
                id: 33,
                title: "User Pages",
                Icon: User,
                submenu: [
                    {
                        id: 331,
                        label: "View Profile",
                        url: "/classic-plus/profile-view",
                        Icon: User,
                    },
                    {
                        id: 332,
                        label: "Connections",
                        url: "/classic-plus/connections",
                        Icon: Users,
                    },
                    {
                        id: 333,
                        label: "Groups",
                        url: "/classic-plus/groups",
                        Icon: Users,
                    },
                    {
                        id: 334,
                        label: "Events",
                        url: "/classic-plus/events",
                        Icon: Calendar,
                    },
                ],
            },
            {
                id: 34,
                title: "Other Pages",
                Icon: File,
                submenu: [
                    {
                        id: 341,
                        label: "Timeline",
                        url: "/classic-plus/timeline",
                        Icon: FileText,
                    },
                    {
                        id: 342,
                        label: "Pricing",
                        url: "/classic-plus/pricing",
                        Icon: FileText,
                    },
                    {
                        id: 343,
                        label: "Help Center",
                        url: "/classic-plus/help-center",
                        Icon: FileText,
                    },
                    {
                        id: 344,
                        label: "Invoice",
                        url: "/classic-plus/invoice",
                        Icon: FileText,
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        label: "User Interface",
        url: "/",
        Icon: Package,
        submenu: [
            {
                id: 41,
                label: "Components",
                url:
                    "https://doar-react-components.netlify.app/?path=/docs/introduction--page",
                Icon: Box,
            },
            {
                id: 42,
                label: "Collections",
                url: "#!",
                Icon: Archive,
            },
        ],
    },
];

export default asideMenus;
