export interface IPEventGroup {
  events: IPEvent[];
  nextEvents: IPNextEvent[];
  oldEvents: IPOldEvent[];
}

export interface IPEvent {
  id: number;
  name: string;
  days: number[];
  startTime: string;
  duration: string;
  link: string;
  description: string;
  benefits: string[];
}

export interface IPNextEvent {
  id: number;
  name: string;
  date: string;
  day: string;
  dayNumber: number;
  preTime?: string;
  startTime: string;
  prices: Price[];
  address: string;
  img: string;
  imgCard: string;
  link: string;
  center: [number, number];
}

export interface Price {
  name: string;
  amount: number;
}

export interface IPOldEvent {
  id: number;
  name: string;
  description: string;
  overview: Overview[];
  videoUri: string;
  img: string;
  date: string;
}

export interface Overview {
  key: string;
  content: string;
}

export interface PIUpgrades {
  upgradeCurrent: PIUpgrade;
  upgrades: PIUpgrade[];
}

export interface PIUpgrade {
  id: number;
  title: string;
  date: string;
  description: string;
  img: string;
  videoUri: string;
}
