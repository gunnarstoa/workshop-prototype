export type Slide = {
  path: string;
  title: string;
  subtitle: string;
};

export const slides: Slide[] = [
  {
    path: '/intro',
    title: 'Connected Enablement',
    subtitle: 'Three pillars that drive partner success'
  },
  {
    path: '/build',
    title: 'The Framework',
    subtitle: 'Click to reveal each layer — assets, journeys, outcomes'
  },
  {
    path: '/scrubber',
    title: 'Three Layers Over Time',
    subtitle: 'Drag the marker — assets, journeys, and outcomes appear as months pass'
  },
  {
    path: '/wizard',
    title: 'Your Enablement Journey',
    subtitle: 'Pick your role — every step is opt-in'
  },
  {
    path: '/products',
    title: 'Our Products',
    subtitle: 'Read live from src/lib/data/products.json'
  },
  {
    path: '/role-paths',
    title: 'Individual Role Paths — Admin View',
    subtitle: 'Enablement paths at the individual-resource level, one per role'
  },
  {
    path: '/raci',
    title: 'RACI Matrix',
    subtitle: 'Who does what across the connected enablement lifecycle'
  },
  {
    path: '/risk',
    title: 'Content Coverage Gap',
    subtitle: 'Where current Academy content falls short of what 102 journeys actually need'
  },
  {
    path: '/workshop-example',
    title: 'Hands-On Technical Workshops',
    subtitle: 'Real workspaces, real data, real configuration — what great enablement looks like'
  },
  {
    path: '/dashboard',
    title: 'Facilitator Dashboard',
    subtitle: 'Real-time participant progress across all workshop labs'
  }
];
