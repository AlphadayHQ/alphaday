import {
    BarChart2,
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
} from "react-feather";

const menus = [
    {
        id: 1,
        label: "Dashboard",
        url: "/",
        Icon: PieChart,
        submenu: [
            {
                id: 11,
                label: "Sales Monitoring",
                url: "/",
                Icon: BarChart2,
            },
            {
                id: 12,
                label: "Website Analytics",
                url: "/dashboard-two",
                Icon: BarChart2,
            },
            {
                id: 13,
                label: "Cryptocurrency",
                url: "/dashboard-three",
                Icon: BarChart2,
            },
            {
                id: 14,
                label: "Helpdesk Management",
                url: "/dashboard-four",
                Icon: BarChart2,
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
                url: "/apps/calendar",
                Icon: Calendar,
            },
            {
                id: 22,
                label: "Chat",
                url: "/apps/chat",
                Icon: MessageSquare,
            },
            {
                id: 23,
                label: "Contacts",
                url: "/apps/contacts",
                Icon: Users,
            },
            {
                id: 25,
                label: "File Manager",
                url: "/apps/file-manager",
                Icon: FileText,
            },
            {
                id: 26,
                label: "Mail",
                url: "/apps/mail",
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
                        url: "/signin",
                        Icon: LogIn,
                    },
                    {
                        id: 312,
                        label: "Sign Up",
                        url: "/signup",
                        Icon: UserPlus,
                    },
                    {
                        id: 313,
                        label: "Verify Account",
                        url: "/verify-account",
                        Icon: UserCheck,
                    },
                    {
                        id: 314,
                        label: "Forgot Password",
                        url: "/forgot-password",
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
                        url: "/error-404",
                        Icon: File,
                    },
                    {
                        id: 322,
                        label: "500 Internal Server",
                        url: "/error-500",
                        Icon: File,
                    },
                    {
                        id: 323,
                        label: "503 Service Unavailable",
                        url: "/error-503",
                        Icon: File,
                    },
                    {
                        id: 324,
                        label: "505 Forbidden",
                        url: "/error-505",
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
                        url: "/profile-view",
                        Icon: User,
                    },
                    {
                        id: 332,
                        label: "Connections",
                        url: "/connections",
                        Icon: Users,
                    },
                    {
                        id: 333,
                        label: "Groups",
                        url: "/groups",
                        Icon: Users,
                    },
                    {
                        id: 334,
                        label: "Events",
                        url: "/events",
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
                        url: "/timeline",
                        Icon: FileText,
                    },
                    {
                        id: 342,
                        label: "Pricing",
                        url: "/pricing",
                        Icon: FileText,
                    },
                    {
                        id: 343,
                        label: "Help Center",
                        url: "/help-center",
                        Icon: FileText,
                    },
                    {
                        id: 344,
                        label: "Invoice",
                        url: "/invoice",
                        Icon: FileText,
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        label: "Components",
        url:
            "https://doar-react-components.netlify.app/?path=/docs/introduction--page",
        Icon: Box,
    },
    {
        id: 5,
        label: "Collections",
        url: "#!",
        Icon: Archive,
    },
];

export default menus;
