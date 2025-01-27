# Mock Data Structures

## Dashboard Components

### Source: `/components/dashboard/category-details.jsx`

```javascript
// Category Expenses Mock Data
const categoryExpenses = {
  "Software & SaaS": [
    {
      name: "Adobe Creative Cloud",
      date: "2024-02-15",
      statement: "Annual Subscription Renewal",
      email: "billing@adobe.com",
      amount: 599.88,
    },
    {
      name: "GitHub Team",
      date: "2024-02-10",
      statement: "Monthly Team License",
      email: "billing@github.com",
      amount: 44.0,
    },
  ],
  "Media & Content": [
    {
      name: "Netflix Premium",
      date: "2024-02-01",
      statement: "Monthly Streaming Subscription",
      email: "info@netflix.com",
      amount: 19.99,
    },
    {
      name: "Spotify Family",
      date: "2024-02-05",
      statement: "Monthly Family Plan",
      email: "billing@spotify.com",
      amount: 14.99,
    },
  ],
  // ... other categories
};
```

### Source: `/components/ui/Sidebar/app-sidebar.jsx`

```javascript
// Sidebar Data Structure
const sidebarData = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  emailAccounts: [
    {
      name: "Personal Gmail",
      logo: Mail,
      type: "Gmail",
    },
    {
      name: "Work Outlook",
      logo: Mail,
      type: "Outlook",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
          isActive: true,
        },
        {
          title: "Subscriptions",
          url: "/dashboard/subscriptions",
        },
      ],
    },
    // ... other navigation items
  ],
  quickAccess: [
    {
      name: "Upgrade to Pro",
      url: "/prices",
      icon: Crown,
      internal: true,
    },
    // ... other quick access items
  ],
};
```

### Source: `/components/ui/Chart/chart-pie-donut.jsx`

```javascript
// Subscription Chart Data
const subscriptionData = [
  {
    name: "Software & SaaS",
    value: 400,
    color: "hsl(var(--chart-1))", // Coral red
  },
  {
    name: "Media & Content",
    value: 300,
    color: "hsl(var(--chart-2))", // Teal
  },
  {
    name: "E-Commerce",
    value: 300,
    color: "hsl(var(--chart-3))", // Dark blue
  },
  {
    name: "IT Infrastructure",
    value: 200,
    color: "hsl(var(--chart-4))", // Gold
  },
];
```

## Navigation and Layout

### Source: `/components/ui/Sidebar/UIs/nav-user.jsx`

```javascript
// User Navigation Data
const userData = {
  name: "User",
  email: "user@example.com",
  avatar: "/avatars/user.jpg",
};
```

### Source: `/components/ui/Sidebar/UIs/team-switcher.jsx`

```javascript
// Email Account Switcher Data
```

## Notes

1. Most mock data is currently hardcoded within components
2. Consider moving these to a centralized mock data file or service
3. Data structures reflect the UI requirements of each component
4. Some components share similar data structures (e.g., user data)

## Recommendations

1. Create a centralized mock data service
2. Use TypeScript interfaces to define data structures
3. Implement proper data fetching from API endpoints
4. Add proper error handling for missing or malformed data
