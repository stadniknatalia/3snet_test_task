# 3sNet Test Application

This is a React application built for the ThreesNet JavaScript test task.

## Features

- Displays data table with manager income and active partners
- Shows 6 months at a time with navigation arrows
- Fetches data from API with fallback to mock data
- Responsive design matching the provided mockup
- Month cycling (December → January, etc.)

## Technical Stack

- React 18+
- TypeScript 5.0+
- Tailwind CSS 4+
- Designed for 1440px × 1080px viewport

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

Opens the app at [http://localhost:3000](http://localhost:3000)

## API

The application fetches data from `https://3snet.co/js_test/api.json` and falls back to mock data if the API is unavailable.

## Navigation

- Use arrow buttons (← →) to shift months left/right
- Shows 6 consecutive months starting from current month by default
- Months cycle continuously (after December comes January)

## Data Structure

The application expects API data in the following format:

```typescript
interface ApiResponse {
  managers: ManagerData[];
  totalIncome: { [month: string]: MonthlyData };
  totalActivePartners: { [month: string]: MonthlyData };
}
```

Where `MonthlyData` contains `plan` and `fact` values for each month. 
